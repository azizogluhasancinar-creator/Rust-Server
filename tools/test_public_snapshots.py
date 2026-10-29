import unittest
from refresh_public_snapshots import parse_snapshot

HTML='''<meta name="description" content="Rust Server | Player: 750/625 | Size: 4000 | Alias">
<div class="name-line"><div class="name">Real server name &amp; EU</div></div>
<div class="sinfo i-max-group"><div class="value">3</div></div><div class="server-flag" title="TR"></div>
<table><tr><th>Last Seen</th><td>1 day\nago</td></tr></table>'''
SCRIPT='createDialog("steam://run/252490//+connect%2051.68.55.162:28015");'
class PublicSnapshotTest(unittest.TestCase):
    def test_preserves_source_values_and_staleness_without_executing_script(self):
        result=parse_snapshot(HTML,SCRIPT,'123','2026-10-29T17:00:00Z')
        self.assertEqual(result['players'],750);self.assertEqual(result['capacity'],625)
        self.assertEqual(result['sourceName'],'Real server name & EU')
        self.assertEqual(result['lastSeenText'],'1 day ago');self.assertEqual(result['teamLimit'],3)
        self.assertEqual(result['address'],'51.68.55.162:28015')
        self.assertFalse(result['ownershipVerified']);self.assertNotIn('queryPort',result)
    def test_rejects_changed_schema_and_missing_address(self):
        with self.assertRaises(ValueError):parse_snapshot('<p>challenge page</p>',SCRIPT,'123','now')
        with self.assertRaises(ValueError):parse_snapshot(HTML,'','123','now')
    def test_rejects_invalid_source_and_private_or_invalid_address(self):
        for source,script in [('a/123',SCRIPT),('123',SCRIPT.replace('51.68.55.162','127.0.0.1')),('123',SCRIPT.replace('28015','99999'))]:
            with self.assertRaises(ValueError):parse_snapshot(HTML,script,source,'now')
if __name__=='__main__':unittest.main()
