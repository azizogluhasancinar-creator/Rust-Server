import {test} from 'node:test';
import assert from 'node:assert/strict';
import {servers,filterServers,averageHistory} from './data.js';
test('region, maximum capacity and wipe interval combine',()=>{const result=filterServers(servers,{region:'EU',capacity:350,wipe:7});assert.deepEqual(result.map(s=>s.id),['rustafied','vital']);});
test('search is case insensitive and supports game modes',()=>{assert.equal(filterServers(servers,{query:'RUSTORIA'}).length,1);assert.equal(filterServers(servers,{query:'2x'}).length,3);});
test('favorites restrict results and survive other filters',()=>{assert.deepEqual(filterServers(servers,{favoritesOnly:true,favorites:['moose','vital'],region:'EU'}).map(s=>s.id),['vital']);assert.equal(filterServers(servers,{favoritesOnly:true}).length,0);});
test('sorting and empty states',()=>{assert.equal(filterServers(servers,{sort:'players'})[0].id,'rustoria');assert.equal(filterServers(servers,{capacity:100}).length,0);});
test('all histories have 25 bounded samples and correct means',()=>{for(const s of servers){assert.equal(s.history.length,3);const avg=averageHistory(s);assert.equal(avg.length,25);for(let i=0;i<25;i++){for(const h of s.history){assert.equal(h.points.length,25);assert.ok(h.points[i]>=0&&h.points[i]<=s.capacity);}assert.equal(avg[i],Math.round(s.history.reduce((a,h)=>a+h.points[i],0)/3));}}});
