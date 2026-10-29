# Direct server data and branding

## What has actually been verified

- Source review: https://github.com/Yepoleb/python-a2s/blob/master/a2s/info.py (read during this task).
- Published client: `python-a2s==1.4.2`, version checked against PyPI.
- Direct collector parsing/validation tested with synthetic responses. **No real Rust server has been queried in this environment.**
- Official site/logo requests to Rustoria, Rustafied and Rusty Moose failed with proxy `403 Forbidden`. Just-Wiped, BattleMetrics and Valve's wiki also failed. No official logo assets have been retrieved or verified.
- The individual discovery and data pipelines used by Just-Wiped and BattleMetrics have not been audited. Do not present general A2S architecture as a verified description of their private implementations.

## How a direct pipeline works

1. Discover registered server addresses using Steam's game-server discovery services or verified operator listings. The Steam Web API's server-list endpoint may require an API key and has access/rate limits. It is not a free exhaustive list guaranteed to work anonymously.
2. Query the **query port** of each game server with UDP A2S_INFO, including its challenge handshake. The query port and player connection port can differ. Do not assume `28015` for either port.
3. Store server-reported name, current players, slots and a measurement timestamp. Rust may expose `cp` and `mp` keywords for counts larger than the base A2S byte fields; the collector preserves both raw and extended values and identifies their source. Counts are reported by the server, not independently audited human-player counts.
4. Repeat on a reasonable schedule, respect rate limits and retain observations. A current query does **not** produce last month's history.
5. Wipe start, blueprint reset, team restrictions, official logos and future wipe schedules are not universally provided by A2S_INFO. They need separately verified operator data, advertised metadata or an opt-in integration. A map or restart change alone does not prove a blueprint wipe.

Reference documentation (could not be opened from this environment):
- https://developer.valvesoftware.com/wiki/Server_queries
- https://partner.steamgames.com/doc/webapi/IGameServersService

## Collector

On a machine with outbound UDP access:

```sh
python3 -m venv .venv
# Windows: .venv\Scripts\activate
# macOS/Linux: source .venv/bin/activate
python3 -m pip install -r tools/requirements.txt
python3 tools/collect_servers.py data/query-targets.json
```

`data/query-targets.json` is deliberately empty. Populate only from verified operator addresses, with objects containing `id`, public numeric `ip`, integer `queryPort` and optional integer `gamePort`. No guessed addresses, ports or bulk scanning. Failed queries are failures, never zero-player measurements. Successful observations append to ignored `data/observations.jsonl`. The frontend still uses its explicitly marked demo dataset; collector output is not silently substituted for unverified wipe metadata.

Local tests, without network queries:

```sh
python3 -m unittest discover -s tools -p 'test_*.py' -v
```

## Hosting and current blockers

GitHub Pages serves static files. It cannot run a UDP collector or keep API keys secret. A backend/worker with UDP access and persistent storage is needed for direct collection. HTTP allowlist changes alone do **not** grant raw UDP access in this managed environment, whose supported network policy has no general UDP route.

Additional HTTP domains were saved in the existing environment draft, preserving its custom BattleMetrics domains: official domains for Rustoria/Rustafied/Rusty Moose, Just-Wiped, Valve documentation and the Steam API. Saving a draft does not enforce it; the user must review/save the environment settings and publish the environment. Other communities' sites and any image CDN redirects must be identified and checked before requesting their exact domains. Do not guess an official site for ambiguous names such as the unverified Cumhuriyet entry.

## Logos

Use the verified community's own logo for its server variants. A server-specific logo can override that when the operator provides one. Retrieve assets from a verified official source, inspect the result, preserve attribution/source metadata and host permitted copies locally. An initial, a generated badge or a search result image is not a verified official logo. The current initial badges remain placeholders until that verification is possible.
