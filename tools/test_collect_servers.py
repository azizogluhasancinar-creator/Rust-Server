import datetime
import types
import unittest
from collect_servers import collect_one, validate_target

class CollectorTest(unittest.TestCase):
    def target(self):
        return {'id':'test-server','ip':'8.8.8.8','queryPort':28017,'gamePort':28015}

    def info(self, **changes):
        values=dict(folder='rust',server_name='Test Rust',map_name='Procedural Map',player_count=255,max_players=255,bot_count=0,keywords='mp600,cp482,qp0',version='1',port=28016)
        values.update(changes)
        return types.SimpleNamespace(**values)

    def test_extended_rust_counts_and_separate_ports(self):
        calls=[]
        def query(address, timeout):
            calls.append((address,timeout));return self.info()
        result=collect_one(self.target(),query,datetime.datetime(2026,10,29,tzinfo=datetime.timezone.utc))
        self.assertEqual(result['players'],482);self.assertEqual(result['capacity'],600)
        self.assertEqual(result['address'],'8.8.8.8:28015');self.assertEqual(result['queryPort'],28017)
        self.assertEqual(calls,[(('8.8.8.8',28017),4.0)])
        self.assertNotIn('wipe',result)

    def test_no_guessing_game_port_and_no_keyword_substring_match(self):
        target=self.target();del target['gamePort']
        result=collect_one(target,lambda *a,**kw:self.info(port=None,keywords='notcp999,mp300,cp17'))
        self.assertIsNone(result['address']);self.assertEqual(result['players'],17)
        result=collect_one(target,lambda *a,**kw:self.info(port=None,keywords=''))
        self.assertEqual(result['players'],255);self.assertEqual(result['countSource'],'a2s-byte-fields')

    def test_refuses_non_rust_and_invalid_targets(self):
        with self.assertRaises(ValueError):collect_one(self.target(),lambda *a,**kw:self.info(folder='tf'))
        for change in [{'ip':'127.0.0.1'},{'queryPort':None},{'queryPort':70000},{'gamePort':True}]:
            with self.assertRaises(ValueError):validate_target(self.target()|change)

    def test_failure_does_not_become_zero_players(self):
        def timeout(*a,**kw):raise TimeoutError('No response')
        with self.assertRaises(TimeoutError):collect_one(self.target(),timeout)

if __name__=='__main__':unittest.main()
