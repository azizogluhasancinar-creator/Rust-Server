const specs = [
 ['rustoria','Rustoria.co','EU Main','EU',600,482,7,0.4,'Vanilla','MAIN',0],
 ['rustafied','Rustafied.com','EU Odd','EU',350,288,7,1.2,'Vanilla','ODD',1],
 ['moose','Rusty Moose','US Monthly','NA',500,396,30,2.5,'Vanilla','MONTHLY',2],
 ['vital','Vital Rust','EU 2x Mondays','EU',300,267,7,4,'2x','MONDAYS',3],
 ['stevious','Stevious','US 2x Main','NA',450,342,7,6,'2x','MAIN',4],
 ['bloolagoon','Bloo Lagoon','EU Solo / Duo / Trio','EU',200,156,14,8,'1.5x','TRIO',5],
 ['rustsea','Rust SEA','Asia Main','AS',250,179,7,10,'Vanilla','ASIA',6],
 ['sydney','Rust Australia','AU Fortnightly','OC',200,128,14,16,'Vanilla','AU',7],
 ['andes','Andes Rust','BR Monthly','SA',150,96,30,21,'2x','BR',8],
 ['outpost','Outpost Demo','EU 3x Solo','EU',150,112,7,3,'3x','SOLO',9],
 ['nightfall','Nightfall Demo','NA 5x PvP','NA',200,163,14,5,'5x','PVP',10],
 ['havoc','Havoc Demo','EU 10x Battlefield','EU',100,76,7,12,'10x','PVP',11]
];
export const servers = specs.map(([id,name,subtitle,region,capacity,players,wipeDays,wipeHours,mode,mark,seed])=>{
 const rate=mode==='Vanilla'?1:Number.parseFloat(mode);
 const modded=mode!=='Vanilla';
 // Hourly samples cover each complete historical wipe, including its final hour.
 const history = [1,2,3].map(period=>({period,points:Array.from({length:wipeDays*24+1},(_,hour)=>{
  const progress=hour/(wipeDays*24);
  const retention=0.9*Math.exp(-progress*(1.1+seed%3*.3))+.08;
  const daily=.77+.17*Math.cos((hour-19)*Math.PI/12);
  const launch=hour<5?.55+hour*.09:1;
  const variation=Math.sin(hour*.19+seed+period)*.025+(2-period)*.025;
  return Math.max(0,Math.min(capacity,Math.round(capacity*(retention*daily*launch+variation))));
 })}));
 return {id,name,subtitle,region,capacity,players,wipeDays,wipeHours,mode,rate,modded,mark,seed,history};
});
export function filterServers(list, {query='', region='all',capacity=1000,wipe='all',rate='all',type='all',sort='fresh',favoritesOnly=false,favorites=[]}={}) {
 return list.filter(s => `${s.name} ${s.subtitle} ${s.mode}`.toLowerCase().includes(query.trim().toLowerCase()) && (region==='all'||s.region===region) && s.capacity<=Number(capacity) && (wipe==='all'||s.wipeDays===Number(wipe)) && (rate==='all'||s.rate===Number(rate)) && (type==='all'||s.modded===(type==='modded')) && (!favoritesOnly||favorites.includes(s.id))).sort((a,b)=>sort==='players'?b.players-a.players:sort==='capacity'?a.capacity-b.capacity:a.wipeHours-b.wipeHours);
}
export function averageHistory(server) { return server.history[0].points.map((_,i)=>Math.round(server.history.reduce((sum,h)=>sum+h.points[i],0)/server.history.length)); }
