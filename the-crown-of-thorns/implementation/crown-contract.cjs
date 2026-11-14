'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const root=process.env.NIGHT_STORIES_DIR||(fs.existsSync(path.join(__dirname,'engine.js'))?__dirname:path.resolve(__dirname,'../../../night-play/night-play-deploy-candidate/stories'));
const E=require(path.join(root,'engine.js')),s=require('./crown-of-thorns.json');
assert(E.validateStory(s));
const reached=new Set(),offered=new Set(),counts={},witnessPaths={},seenStates=new Map();
let visits=0,minWords=Infinity,maxWords=0,terminal=0;
function walk(r,words=0){
 visits++;assert(visits<50000,'Unexpected cycle');reached.add(r.node);
 const bs=E.beats(s,r);assert(bs.length);words+=bs.reduce((n,b)=>n+b.text.split(/\s+/).length,0);
 assert(!bs.some(b=>/injured or uninjured|TODO|PLACEHOLDER/.test(b.text)));
 if(!r.state.knowledge.includes('identity'))assert(!bs.some(b=>/Princess Ilyen|daughter of Maud/.test(b.text)),'Early identity leak');
 if(r.node==='anchors')assert(bs.some(b=>b.text.includes(r.state.vars.pip_injured?'Two fingers would not straighten':'spread it with both hands')));
 if(r.node==='pottery')assert(bs.some(b=>b.text.includes(r.state.vars.elian_alive?'He forgets':'He forgot')));
 for(const o of E.options(s,r))if(o.locked)assert.throws(()=>E.choose(s,r,o.id));
 const m=new Map(),storage={getItem:k=>m.get(k)||null,setItem:(k,v)=>m.set(k,v)};
 const b=E.storeRun(s,E.emptyBook(s),r);E.persist(s,b,storage);
 const restored=E.load(s,storage);assert(!restored.recovery);assert.deepEqual(restored.playthroughs[0].state,r.state);assert.equal(restored.playthroughs[0].node,r.node);
 if(r.ending){terminal++;counts[r.ending]=(counts[r.ending]||0)+1;witnessPaths[r.ending]??=r.history.map(h=>h.choice);minWords=Math.min(minWords,words);maxWords=Math.max(maxWords,words);assert.throws(()=>E.choose(s,r,'anything'));return;}
 const cs=E.choices(s,r);assert(cs.length,'Soft lock at '+r.node);
 for(const c of cs){offered.add(c.id);const before=JSON.stringify(r);const next=E.choose(s,r,c.id);assert.equal(JSON.stringify(r),before,'Choosing mutated its source run');walk(next,words)}
}
walk(E.start(s));
assert.equal(reached.size,Object.keys(s.nodes).length);assert.equal(Object.keys(counts).length,4);
const allChoices=Object.values(s.nodes).flatMap(n=>n.choices||[]);assert.equal(offered.size,allChoices.length);
// Same scene, distinct histories: survival, injury, retained memory and witnesses persist.
function route(picks,until){let r=E.start(s);while(!r.ending&&r.node!==until){const cs=E.choices(s,r),c=cs.find(c=>c.id===picks[r.node])||cs[0];r=E.choose(s,r,c.id)}return r}
const safe=route({},'threshold');assert(safe.state.vars.elian_alive);assert(safe.state.vars.bond);assert(safe.state.vars.pip_safe);
const harmed=route({start:'start-follow',kitchen:'kitchen-gift',council:'council-key',supper:'supper-evidence',bridge:'bridge-clause',vault:'vault-force',anchors:'anchors-past'},'threshold');
assert(!harmed.state.vars.elian_alive);assert(harmed.state.vars.pip_injured);assert(!harmed.state.vars.bond);assert(harmed.state.vars.crown_connection);
assert(!E.choices(s,harmed).some(c=>c.to==='divide'));
assert(E.choices(s,harmed).some(c=>c.to==='vessel'));
assert(E.choices(s,safe).some(c=>c.to==='divide'));assert(!E.choices(s,safe).some(c=>c.to==='vessel'));
const fork=E.fork(s,safe,2);assert(!fork.state.knowledge.includes('identity'));assert(!fork.state.inventory.includes('roll'));assert.notEqual(fork.id,safe.id);
const before=JSON.stringify(safe);E.readingWindow(s,safe);assert.equal(JSON.stringify(safe),before);
const entered=E.enter(s,safe,'assembly');assert.equal(entered.state.vars.witnesses,safe.state.vars.witnesses);
// Books use distinct keys. A new run and a chapter fork preserve the completed run.
let book=E.storeRun(s,E.emptyBook(s),safe);book=E.storeRun(s,book,E.start(s));assert.equal(book.playthroughs.length,2);
const last=require(path.join(root,'last-call.json'));assert(E.validateStory(last));const old=E.start(last,'Regression',{firstName:'Test',surname:'Reader'},{observation:4});
assert.equal(old.state.identity.firstName,'Test');assert.equal(old.state.attributes.observation,5);assert.equal(old.state.points,0);
const result={status:'PASS',scenes:reached.size,choices:offered.size,stateVisits:visits,completePaths:terminal,endings:counts,minimumRouteWords:minWords,maximumRouteWords:maxWords,checks:['all reachable states finish','all choices offered on a reachable path','all four endings reachable','all states save/load round trip','early identity withheld','survival and injury variants','memory choice persists','ending gates','fork isolation','read-only navigation','no repeated scene rewards','parallel saves','Last Call custom setup regression'],witnessPaths};
fs.writeFileSync(path.join(__dirname,fs.existsSync(path.join(__dirname,'engine.js'))?'crown-contract-results.json':'contract-results.json'),JSON.stringify(result,null,2)+'\n');console.log(JSON.stringify({...result,witnessPaths:undefined}));
