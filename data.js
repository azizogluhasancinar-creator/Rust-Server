const specs = [
 ['rustoria','Rustoria.co','EU Main','EU',600,482,7,0.4,'Vanilla','MAIN',0],
 ['rustafied','Rustafied.com','EU Odd','EU',350,288,7,1.2,'Vanilla','ODD',1],
 ['moose','Rusty Moose','US Monthly','NA',500,396,30,2.5,'Vanilla','MONTHLY',2],
 ['vital','Vital Rust','EU 2x Mondays','EU',300,267,7,4,'2x','MONDAYS',3],
 ['stevious','Stevious','US 2x Main','NA',450,342,7,6,'2x','MAIN',4],
 ['bloolagoon','Bloo Lagoon','EU Solo / Duo / Trio','EU',200,156,14,8,'1.5x','TRIO',5],
 ['rustsea','Rust SEA','Asia Main','AS',250,179,7,10,'Vanilla','ASIA',6],
 ['sydney','Rust Australia','AU Fortnightly','OC',200,128,14,16,'Vanilla','AU',7],
 ['andes','Andes Rust','BR Monthly','SA',150,96,30,21,'2x','BR',8]
];
export const servers = specs.map(([id,name,subtitle,region,capacity,players,wipeDays,wipeHours,mode,mark,seed])=>{
 const history = [1,2,3].map((week)=>({label:`${week}. önceki wipe`,points:Array.from({length:25},(_,hour)=>Math.min(capacity,Math.round(capacity*(0.38+0.54*(1-Math.exp(-hour/2.4)))* (0.94-0.009*hour) + Math.sin(hour*0.65+seed+week)*capacity*0.045 + (2-week)*capacity*0.025)))}));
 return {id,name,subtitle,region,capacity,players,wipeDays,wipeHours,mode,mark,seed,history};
});
export function filterServers(list, {query='', region='all',capacity=1000,wipe='all',sort='fresh',favoritesOnly=false,favorites=[]}={}) {
 return list.filter(s => `${s.name} ${s.subtitle} ${s.mode}`.toLowerCase().includes(query.toLowerCase()) && (region==='all'||s.region===region) && s.capacity<=Number(capacity) && (wipe==='all'||s.wipeDays===Number(wipe)) && (!favoritesOnly||favorites.includes(s.id))).sort((a,b)=>sort==='players'?b.players-a.players:sort==='capacity'?a.capacity-b.capacity:a.wipeHours-b.wipeHours);
}
export function averageHistory(server) { return server.history[0].points.map((_,i)=>Math.round(server.history.reduce((sum,h)=>sum+h.points[i],0)/server.history.length)); }
