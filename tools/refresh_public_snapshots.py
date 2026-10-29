"""Refresh selected PUBLIC listing snapshots. This is not direct A2S or live data.

Install tools/requirements.txt, run this command, then npm run build:pages.
The public Connect button is requested as JavaScript but never executed.
"""
import datetime
import ipaddress
import json
import re
import time
import urllib.request
from pathlib import Path
from bs4 import BeautifulSoup

ROOT = Path(__file__).resolve().parents[1]


def parse_snapshot(html, connection_script, source_id, retrieved_at):
    if not re.fullmatch(r'\d+', source_id):
        raise ValueError('Invalid source ID')
    soup = BeautifulSoup(html, 'html.parser')
    meta = soup.find('meta', attrs={'name': 'description'})
    desc = meta.get('content', '') if meta else ''
    counts = re.search(r'Player: (\d+)/(\d+)', desc)
    name = soup.select_one('.name-line .name')
    if not counts or not name:
        raise ValueError('Source no longer supplies expected name/count fields')
    row = {
        'source': 'Just-Wiped public listing',
        'sourceUrl': 'https://just-wiped.net/rust_servers/' + source_id,
        'sourceId': source_id, 'sourceName': name.get_text(' ', strip=True),
        'players': int(counts[1]), 'capacity': int(counts[2]),
        'retrievedAt': retrieved_at, 'ownershipVerified': False,
        'provenance': 'Public third-party listing; not queried directly from game server',
        'sourceOfficial': bool(soup.select_one('.tag.official')),
        'sourceInactive': bool(soup.select_one('.tag.inactive'))
    }
    if row['capacity'] <= 0:
        raise ValueError('Source has no usable capacity')
    size = re.search(r'Size: (\d+)', desc)
    if size and int(size[1]) > 0:
        row['mapSize'] = int(size[1])
    group = soup.select_one('.i-max-group .value')
    if group and group.get_text(strip=True).isdigit():
        row['teamLimit'] = int(group.get_text(strip=True))
    country = soup.select_one('.server-flag')
    if country:
        row['country'] = country.get('title')
    for tr in soup.select('tr'):
        th, td = tr.find('th'), tr.find('td')
        if th and td and th.get_text(strip=True) == 'Last Seen':
            row['lastSeenText'] = ' '.join(td.get_text(' ', strip=True).split())
    address = re.search(r'\+connect%20((?:\d{1,3}\.){3}\d{1,3}):(\d+)', connection_script)
    if not address:
        raise ValueError('No public connection address found')
    if not ipaddress.ip_address(address[1]).is_global or not 1 <= int(address[2]) <= 65535:
        raise ValueError('Invalid public connection address')
    row['address'] = address[1] + ':' + address[2]
    return row


def fetch(url, script=False):
    headers = {'User-Agent': 'WipeRadar/0.1 public directory snapshot'}
    if script:
        headers.update({'X-Requested-With': 'XMLHttpRequest', 'Accept': 'text/javascript, application/javascript'})
    with urllib.request.urlopen(urllib.request.Request(url, headers=headers), timeout=25) as response:
        return response.read(2_000_000).decode('utf-8')


def main():
    targets = json.loads((ROOT / 'data/public-source-targets.json').read_text())
    # Keep last successful data on partial failure, including its old retrieval date.
    old = (ROOT / 'directory.js').read_text()
    raw = old.split('export const directoryObservations = ', 1)[1].split(';\nexport const communityLogos', 1)[0]
    observations = json.loads(raw)
    failed = []
    for key, source_id in targets.items():
        if not re.fullmatch(r'\d+', str(source_id)):
            raise ValueError('Invalid configured source ID')
        url = 'https://just-wiped.net/rust_servers/' + source_id
        try:
            observations[key] = parse_snapshot(fetch(url), fetch(url + '/connect', True), source_id,
                                                datetime.datetime.now(datetime.timezone.utc).isoformat())
            print(key + ': refreshed')
        except Exception as exc:
            failed.append(key)
            print(key + ': not refreshed (' + type(exc).__name__ + '), last good snapshot retained')
        time.sleep(.5)
    logos = json.loads((ROOT / 'data/brand-logo-sources.json').read_text())
    output = '// Public source observations. Retrieval time is not the game-server query time.\n'
    output += 'export const directoryObservations = ' + json.dumps(observations, ensure_ascii=False, indent=2) + ';\n'
    output += 'export const communityLogos = ' + json.dumps(logos, indent=2) + ';\n'
    temporary = ROOT / 'directory.js.tmp'
    temporary.write_text(output)
    temporary.replace(ROOT / 'directory.js')
    if failed:
        raise SystemExit(1)


if __name__ == '__main__':
    main()
