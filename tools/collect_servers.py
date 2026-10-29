"""Direct, read-only Rust A2S collector. Run on a host with outbound UDP access.

python3 tools/collect_servers.py data/query-targets.json --output data/observations.jsonl
Only configured, verified numeric IP/query-port pairs are queried; no port scanning.
"""
import argparse
import datetime
import ipaddress
import json
import re
from pathlib import Path


def validate_target(target):
    address = ipaddress.ip_address(target['ip'])
    if not address.is_global:
        raise ValueError('Only public server IPs may be queried')
    for key in ('queryPort', 'gamePort'):
        value = target.get(key)
        if value is not None and (type(value) is not int or not 1 <= value <= 65535):
            raise ValueError(f'Invalid {key}')
    if target.get('queryPort') is None:
        raise ValueError('A verified queryPort is required; do not assume the game port')
    if not isinstance(target.get('id'), str) or not target['id']:
        raise ValueError('A catalog id is required')


def collect_one(target, info_query, now=None):
    validate_target(target)
    info = info_query((target['ip'], target['queryPort']), timeout=4.0)
    if str(info.folder).lower() != 'rust':
        raise ValueError('The responding server is not identified as Rust')
    # Rust may publish full counts in keywords; the base protocol fields are bytes.
    keywords = str(getattr(info, 'keywords', '') or '')
    tags = dict(re.findall(r'(?:^|,)(cp|mp)(\d+)(?=,|$)', keywords))
    players = int(tags.get('cp', info.player_count))
    capacity = int(tags.get('mp', info.max_players))
    advertised_port = getattr(info, 'port', None)
    game_port = target.get('gamePort') or advertised_port
    if game_port is not None and (type(game_port) is not int or not 1 <= game_port <= 65535):
        raise ValueError('Invalid advertised game port')
    host = f"[{target['ip']}]" if ':' in target['ip'] else target['ip']
    return {
        'id': target['id'], 'source': 'server-a2s-info',
        'observedAt': (now or datetime.datetime.now(datetime.timezone.utc)).isoformat(),
        'ip': target['ip'], 'queryPort': target['queryPort'], 'gamePort': game_port,
        'address': f'{host}:{game_port}' if game_port else None,
        'name': str(info.server_name), 'map': str(info.map_name),
        'players': players, 'capacity': capacity, 'bots': info.bot_count,
        'rawProtocolPlayers': info.player_count, 'rawProtocolCapacity': info.max_players,
        'countSource': 'rust-keywords' if 'cp' in tags or 'mp' in tags else 'a2s-byte-fields',
        'keywords': keywords, 'version': str(info.version),
        'note': 'Server-reported counts; not independently audited. No wipe history inferred.'
    }


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('targets', type=Path)
    parser.add_argument('--output', type=Path, default=Path('data/observations.jsonl'))
    args = parser.parse_args()
    targets = json.loads(args.targets.read_text())
    if not isinstance(targets, list) or not targets:
        parser.error('No verified query targets configured. No server requests were made.')
    if len(targets) > 100:
        parser.error('At most 100 configured targets per run')
    for target in targets:
        validate_target(target)
    import a2s
    results = []
    errors = []
    for target in targets:
        try:
            results.append(collect_one(target, a2s.info))
        except Exception as exc:
            errors.append({'id': target['id'], 'error': str(exc)})
    args.output.parent.mkdir(parents=True, exist_ok=True)
    # Append preserves previous observations for real historical collection.
    with args.output.open('a', encoding='utf-8') as out:
        for result in results:
            out.write(json.dumps(result, ensure_ascii=False) + '\n')
    print(json.dumps({'collected': len(results), 'failed': errors}, ensure_ascii=False))
    if errors:
        raise SystemExit(1)


if __name__ == '__main__':
    main()
