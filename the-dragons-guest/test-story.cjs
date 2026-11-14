const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const base=__dirname,E=require(process.env.NIGHT_ENGINE||path.resolve(base,'../../integration/stories/engine.js'));
const s=require(process.env.NIGHT_STORY||'./the-dragons-guest.json');
assert.equal(E.validateStory(s),true);
const defaultPlan={market:'wall',guest:'freedom',shelf:'daughter',bell:'brace',captain:'ally',account:'renounce',records:'archive',archive:'clerk',brother:'return',desire:'romance',assembly:'hearing',testimony:'claims',northroad:'people',yard:'save'};
function play(plan={}){
 let r=E.start(s),steps=0;
 const selected={...defaultPlan,...plan};
 while(!r.ending&&steps++<300){
  const cs=E.choices(s,r),scene=r.node.split('~')[0];
  assert.ok(cs.length,`deadlocked ${r.node}`);
  const c=cs.length===1&&cs[0].continue?cs[0]:cs.find(c=>c.id===scene+':'+selected[scene])||cs[0];
  r=E.choose(s,r,c.id);
 }
 assert.ok(r.ending,'finite route');return r;
}
const canonical=play(),refuge=play({assembly:'refuge',desire:'friendship'}),tragic=play({assembly:'direct'});
assert.equal(canonical.ending,'house');assert.equal(refuge.ending,'openmountain');assert.equal(tragic.ending,'after');
assert.ok(canonical.pages.flatMap(p=>p.text).join(' ').includes('They named her Teren'));
assert.ok(!refuge.pages.flatMap(p=>p.text).join(' ').includes('They named her Teren'));
assert.equal(tragic.state.vars.voss_alive,true);
const death=play({assembly:'direct',yard:'families',bell:'gong',captain:'refuse',records:'channel',market:'ferry',desire:'friendship'});
assert.equal(death.state.vars.voss_alive,false);assert.equal(death.ending,'after');
const material=play({market:'ferry',shelf:'receipts',bell:'gong',archive:'book',testimony:'self'});
assert.equal(material.state.vars.sealed,true);assert.equal(material.state.vars.witness,false);
assert.ok(material.pages.flatMap(p=>p.text).join(' ').includes('Oswin once after that'));
const channel=play({records:'channel'});assert.equal(channel.ending,'house');
const weak=play({market:'ferry',guest:'rest',shelf:'receipts',bell:'gong',captain:'refuse',account:'charter',records:'channel',brother:'stay',desire:'friendship'});
assert.equal(weak.ending,'openmountain','unmet requirements retain a complete good path');
assert.ok(!weak.pages.flatMap(p=>p.text).join(' ').includes('kiss was awkward'));
const romanticRefuge=play({assembly:'refuge',northroad:'papers'});assert.equal(romanticRefuge.ending,'openmountain');
assert.ok(romanticRefuge.pages.flatMap(p=>p.text).join(' ').includes('shared life without children'));
// Verify every reachable narrative state, including every conditional page and locked option.
const stack=[{node:s.start,state:E.initial(s)}],seen=new Set(),nodes=new Set(),choiceIds=new Set(),endings=new Set();let states=0;
while(stack.length){
 const q=stack.pop(),key=q.node+'|'+JSON.stringify(q.state.vars);
 if(seen.has(key))continue;seen.add(key);states++;nodes.add(q.node);
 const n=s.nodes[q.node];
 const state=E.apply(q.state,n.effects,{story:s,node:q.node});
 if(n.ending){endings.add(n.ending);continue;}
 const cs=E.choices(s,{node:q.node,state});assert.ok(cs.length,'unreachable fallback '+q.node);
 for(const c of cs){choiceIds.add(c.id);stack.push({node:c.to,state:E.apply(state,c.effects,{story:s,node:q.node,choice:c.id})});}
}
assert.equal(nodes.size,Object.keys(s.nodes).length,'all passages reachable');
assert.equal(choiceIds.size,Object.values(s.nodes).flatMap(n=>n.choices||[]).length,'every choice reachable');
assert.deepEqual([...endings].sort(),['after','house','openmountain']);
// Actual engine saves, chapter forks and immutable read-back behavior.
const mem=new Map(),storage={getItem:k=>mem.get(k)||null,setItem:(k,v)=>mem.set(k,v)};
let book=E.emptyBook(s);for(const r of [canonical,refuge,tragic])book=E.storeRun(s,book,r);
E.persist(s,book,storage);const loaded=E.load(s,storage);assert.equal(loaded.recovery,false);assert.equal(loaded.playthroughs.length,3);assert.equal(loaded.endings.length,3);
assert.deepEqual(loaded.playthroughs[0].state,canonical.state);
const fork=E.fork(s,canonical,7,'Attack replay');assert.equal(fork.ending,null);assert.equal(fork.state.vars.great_stolen,false);assert.ok(!fork.state.knowledge.includes('truth'));
const original=JSON.stringify(canonical);E.readingWindow(s,canonical);assert.equal(JSON.stringify(canonical),original);
storage.setItem('night-story:'+s.id+':v3','broken');assert.equal(E.load(s,storage).recovery,true);assert.equal(storage.getItem('night-story:'+s.id+':v3'),'broken');
for(const n of Object.values(s.nodes))for(const b of n.beats){assert.ok(!b.text.includes(':::'));assert.ok(!/If (Edda had|she had|they had)/.test(b.text),'unresolved conditional');}
console.log(JSON.stringify({status:'PASS',passages:nodes.size,choices:choiceIds.size,reachableStates:states,endings:[...endings],narrativeWords:s.wordCount,routeWords:Object.fromEntries([canonical,refuge,tragic].map(r=>[r.ending,r.pages.reduce((n,p)=>n+p.text.join(' ').split(/\s+/).length,0)]))},null,2));
fs.writeFileSync(path.join(base,'test-results.json'),JSON.stringify({status:'PASS',passages:nodes.size,choices:choiceIds.size,reachableStates:states,endings:[...endings],routeWords:Object.fromEntries([canonical,refuge,tragic].map(r=>[r.ending,r.pages.reduce((n,p)=>n+p.text.join(' ').split(/\s+/).length,0)]))},null,2)+'\n');
module.exports={play,defaultPlan};
