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
// Candidate names are illustrative; existence, addresses and rankings are not verified.
// All numeric values and wipe schedules remain explicitly generated demo data.
const candidates = [
 ['Rustoria.co','EU Long'],['Rustoria.co','US Main'],['Rustoria.co','US Long'],['Rustoria.co','EU Medium'],['Rustoria.co','US Medium'],
 ['Rustafied.com','EU Main'],['Rustafied.com','US Main'],['Rustafied.com','EU Long'],['Rustafied.com','US Long'],['Rustafied.com','EU Trio'],
 ['Rustafied.com','US Trio'],['Rustafied.com','EU Small'],['Rustafied.com','US Small'],['Rustafied.com','EU Medium'],['Rustafied.com','US Medium'],
 ['Rusty Moose','EU Main'],['Rusty Moose','US Main'],['Rusty Moose','EU Monthly'],['Rusty Moose','US Biweekly'],['Rusty Moose','EU Biweekly'],
 ['Rusticated','US Main'],['Rusticated','EU Main'],['Rusticated','US Trio'],['Rusticated','EU Trio'],['Rusticated','US 2x Quad'],
 ['Rusticated','EU 2x Quad'],['Rusticated','US Solo'],['Rusticated','EU Solo'],['Rust in Peace','EU Duo'],['Rust in Peace','EU Solo'],
 ['Stevious','EU 2x Main'],['Stevious','EU 2x Trio'],['Stevious','US 2x Trio'],['Stevious','US 2x Large'],['Stevious','EU 2x Large'],
 ['Bloo Lagoon','US 1.5x Trio'],['Bloo Lagoon','EU 1.5x Duo'],['Bloo Lagoon','US 1.5x Duo'],['Survivors.gg','EU 2x Solo'],['Survivors.gg','EU 2x Duo'],
 ['Survivors.gg','EU 2x Trio'],['Survivors.gg','US 2x Trio'],['WarBandits','EU 2x Solo'],['WarBandits','EU 2x Duo'],['WarBandits','EU 2x Trio'],
 ['WarBandits','US 2x Quad'],['Renegade','EU 2x Solo'],['Renegade','US 2x Duo'],['HollowServers','US 2x Trio'],['Cumhuriyet','TR · Türkiye']
];
for (const [i,[name,subtitle]] of candidates.entries()) {
 const index=i+12, region=subtitle.startsWith('US')?'NA':'EU';
 const days=subtitle.includes('Monthly')?30:subtitle.includes('Biweekly')?14:subtitle.includes('Long')?30:7;
 const rate=subtitle.match(/(\d+(?:\.\d+)?)x/)?.[1];
 const capacity=[1000,800,600,500,400,300,200,150,100][Math.floor(i/6)];
 specs.push(['candidate-'+i,name,subtitle,region,capacity,Math.round(capacity*(.91-(i%6)*.035)),days,2+i*2.7,rate?rate+'x':'Vanilla','CANDIDATE',index]);
}
export const catalogSnapshotAt = Date.parse('2026-10-29T16:39:26Z');
export function mapSizeLabel(size) {
 if(size<3000)return 'XSmall';if(size<3500)return 'Small';if(size<=4000)return 'Medium';if(size<5000)return 'Large';return 'XLarge';
}
export const servers = specs.map(([id,name,subtitle,region,capacity,players,wipeDays,wipeHours,mode,mark,seed])=>{
 const rate=mode==='Vanilla'?1:Number.parseFloat(mode),modded=mode!=='Vanilla';
 const limit=subtitle.match(/quad|trio|duo|solo/i)?.[0]?.toLowerCase();
 // The original Bloo Lagoon entry explicitly advertises Trio as its largest team.
 const teamLimit=id==='bloolagoon'?3:({solo:1,duo:2,trio:3,quad:4}[limit]??null);
 const mapSize=[2500,3000,3500,4000,4500,5000,6000][seed%7];
 const history=[1,2,3].map(period=>({period,points:Array.from({length:wipeDays*24+1},(_,hour)=>{
  const progress=hour/(wipeDays*24),retention=.9*Math.exp(-progress*(1.1+seed%3*.3))+.08;
  const daily=.77+.17*Math.cos((hour-19)*Math.PI/12),launch=hour<5?.55+hour*.09:1;
  const variation=Math.sin(hour*.19+seed+period)*.025+(2-period)*.025;
  return Math.max(0,Math.min(capacity,Math.round(capacity*(retention*daily*launch+variation))));
 })}));
 return {id,name,subtitle,region,country:name==='Cumhuriyet'?'TR':null,capacity,players,wipeDays,wipeHours,mode,rate,modded,mark,seed,teamLimit,mapSize,mapSeed:731000+seed*7919,
  address:null,verified:false,history,wipeAnchorAt:catalogSnapshotAt-wipeHours*3600000,blueprintEvery:wipeDays===30?1:wipeDays===14?2:4,initialCycle:seed%4};
});
export function wipeState(server,now=Date.now()) {
 const duration=server.wipeDays*86400000,cycle=Math.max(0,Math.floor((now-server.wipeAnchorAt)/duration));
 const currentAt=server.wipeAnchorAt+cycle*duration,nextAt=currentAt+duration,index=server.initialCycle+cycle;
 return {currentAt,nextAt,currentKind:index%server.blueprintEvery===0?'blueprint':'map',nextKind:(index+1)%server.blueprintEvery===0?'blueprint':'map',remaining:Math.max(0,nextAt-now)};
}
export function countdownParts(milliseconds) {const seconds=Math.max(0,Math.floor(milliseconds/1000));return {days:Math.floor(seconds/86400),hours:Math.floor(seconds%86400/3600),minutes:Math.floor(seconds%3600/60),seconds:seconds%60};}
export function filterServers(list,{query='',region='all',capacity=2000,wipe='all',rate='all',type='all',team='all',sort='players',favoritesOnly=false,favorites=[]}={}) {
 return list.filter(s=>`${s.name} ${s.subtitle} ${s.mode} ${s.address||''}`.toLowerCase().includes(query.trim().toLowerCase())&&(region==='all'||(region==='TR'?s.country==='TR':s.region===region))&&s.capacity<=Number(capacity)&&(wipe==='all'||s.wipeDays===Number(wipe))&&(rate==='all'||s.rate===Number(rate))&&(type==='all'||s.modded===(type==='modded'))&&(team==='all'||(team==='unlimited'?s.teamLimit===null:s.teamLimit===Number(team)))&&(!favoritesOnly||favorites.includes(s.id)))
 .sort((a,b)=>sort==='players'?b.players-a.players:sort==='capacity'?a.capacity-b.capacity:wipeState(b).currentAt-wipeState(a).currentAt);
}
export function averageHistory(server){return server.history[0].points.map((_,i)=>Math.round(server.history.reduce((sum,h)=>sum+h.points[i],0)/server.history.length));}
