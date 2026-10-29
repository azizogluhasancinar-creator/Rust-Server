# Direct server data and branding

## Current verified findings (2026-10-29)

- Rustafied's official homepage and server page were retrieved successfully: https://www.rustafied.com/ and https://www.rustafied.com/server . Its declared official site icon is registered in `data/brand-logo-sources.json`. The icon is remotely referenced; this environment cannot yet download or visually inspect the Squarespace CDN asset. Broken images fall back to the placeholder.
- Just-Wiped public listings, normal public Connect button responses and FAQ are accessible. 25 explicitly selected catalog entries now have source-linked address/player/map observations in `directory.js`, including a Cumhuriyet listing. These are **third-party snapshots, not direct queries, proof of ownership, live counts or a verified popularity ranking**. Source retrieval time and the source's relative Last Seen field are preserved separately. Counts are preserved as reported even when players exceed reported slots; the UI flags that discrepancy and bounds the capacity bar.
- https://just-wiped.net/faqs explicitly states that discovery comes from Steam listings, wipe detection uses map seed/size changes or advertised dates, and BP labels use title text such as “full wipe” or “bp wipe”. Thus its BP labels may be inferred rather than operator-verified.
- BattleMetrics API returned JSON `Access denied. A subscription is required to use the API.` This is now a provider restriction, not the original environment-domain denial. No paid access was provisioned or bypassed.
- Steam `IGameServersService/GetServerList` rejected the request for a missing/invalid `key` parameter. No `STEAM_WEB_API_KEY` or equivalent configured variable was present. A requirement was saved for secure entry in environment settings; no key was requested in chat or put in code.
- Rustoria's homepage returned its own “Checking Connection”/403 page. Rusty Moose's attempted hostname remains inaccessible. Valve's documentation redirected to an anti-bot page, so its article contents were not claimed as read.
- Source review: https://github.com/Yepoleb/python-a2s/blob/master/a2s/info.py was actually read. `python-a2s==1.4.2` was checked against PyPI and imported. Direct collector parsing/validation is tested with synthetic responses. **No real Rust server has been queried over UDP in this environment.**

## Refresh the public snapshots

```sh
python3 -m pip install -r tools/requirements.txt
python3 tools/refresh_public_snapshots.py
npm run build:pages
```

Configured source IDs are in `data/public-source-targets.json`. The helper reads normal public listing HTML and the public connection button's JavaScript response; it never executes downloaded JavaScript. On failures it retains the last successful record and original retrieval timestamp, and returns failure status. Changes to source names/ownership require manual review; a long-lived source ID is not proof that a community still operates a server. Snapshot refresh is manual, not an automated live service.

The UI shows the 25 sourced entries by default. “Include unverified demo listings” exposes the remaining 37 illustrative entries. History, seed and future wipe schedules remain explicitly demo data, even when current player/IP/map fields have a source snapshot. Local HTML works offline; remote logos are optional and fall back when unavailable.

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

GitHub Pages serves static files. It cannot run a UDP collector or keep API keys secret. Direct collection needs an authorized worker with UDP access and persistent storage. HTTP domain permissions alone do not grant raw UDP access in this managed environment.

The previous HTTP permissions are now enforced. Additional exact domains were saved to the latest draft for discovering/downloading operator icons: `images.squarespace-cdn.com`, `discord.com`, `cdn.discordapp.com`. This does not apply the permissions or publish the environment. Review/save in environment settings and publish the environment to apply them. A `STEAM_WEB_API_KEY` secret requirement targets only `api.steampowered.com`; its value belongs in secure environment settings, never in the website or chat. More provider domains should only be added after identifying actual official sources.

## Logos

Use the verified community's own logo for its server variants. A server-specific logo can override that when the operator provides one. Retrieve assets from a verified official source, inspect the result, preserve attribution/source metadata and host permitted copies locally. An initial, a generated badge or a search result image is not a verified official logo. Rustafied currently uses its declared official website icon; all other initial badges remain placeholders. No generated brand logos are represented as official.
