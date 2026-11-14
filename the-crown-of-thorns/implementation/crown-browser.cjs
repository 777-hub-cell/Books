'use strict';
const {chromium}=require('playwright'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const base=process.env.CROWN_TEST_URL||'http://127.0.0.1:8787',out=path.join(__dirname,'qa');fs.mkdirSync(out,{recursive:true});
const paths=require(fs.existsSync(path.join(__dirname,'crown-contract-results.json'))?'./crown-contract-results.json':'./contract-results.json').witnessPaths;
const slug='crown-of-thorns',key='night-story:'+slug+':v3';
async function state(page){return page.evaluate(key=>{const b=JSON.parse(localStorage.getItem(key));return b?.playthroughs.find(r=>r.id===b.active)},key)}
async function options(page){await page.locator('#readerOptions summary').click()}
async function close(page){await page.getByRole('button',{name:'Close panel',exact:true}).click()}
async function begin(page){await page.goto(base+'/stories/?story='+slug);await page.getByRole('button',{name:'Begin',exact:true}).click();await page.locator('[data-choice="start-catch"]').waitFor();}
async function act(page,choice){await page.locator('[data-choice="'+choice+'"]').click()}
(async()=>{
 const browser=await chromium.launch({headless:true,executablePath:process.env.CHROMIUM_PATH||(fs.existsSync('/usr/bin/chromium')?'/usr/bin/chromium':undefined),args:['--no-sandbox']});const results=[];
 try{
 for(const width of [320,360,390,412,1280]){
  const context=await browser.newContext({viewport:{width,height:850},reducedMotion:'reduce',isMobile:width<500,hasTouch:width<500});const page=await context.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto(base+'/stories/library.html');await page.getByRole('link',{name:'Begin reading',exact:true}).last().click();await page.getByRole('button',{name:'Begin',exact:true}).waitFor();assert.equal(await page.locator('input[type=text]').count(),0);
  await page.getByRole('button',{name:'Begin',exact:true}).click();await page.locator('[data-choice="start-catch"]').waitFor();
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false,'Overflow at '+width);
  await page.screenshot({path:path.join(out,'opening-'+width+'.png'),fullPage:true});
  await page.locator('#openCharacter').click();assert.equal(await page.locator('#dialogTitle').textContent(),'The traveller');assert(!/Ilyen|Maud/.test(await page.locator('#dialogBody').textContent()));await close(page);
  const before=await state(page);await page.reload();await page.locator('[data-choice="start-catch"]').waitFor();assert.deepEqual((await state(page)).state,before.state);
  assert.deepEqual(errors,[]);results.push({test:'opening, library, concealed identity, reload, layout',width,status:'PASS'});await context.close();
 }
 for(const width of [390,1280])for(const [ending,history] of Object.entries(paths)){
  const context=await browser.newContext({viewport:{width,height:850},reducedMotion:'reduce',isMobile:width<500,hasTouch:width<500});const page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));await begin(page);
  const remaining=[...history];let steps=0,reloaded=false,reviewed=false;
  while(true){
   const r=await state(page);assert(r);if(r.ending){assert.equal(r.ending,ending);break}assert(++steps<80);
   if(r.node==='after-bell'&&!reloaded){const snapshot=JSON.stringify(r.state);await page.reload();await page.locator('#readContinue').waitFor();assert.equal(JSON.stringify((await state(page)).state),snapshot);reloaded=true;}
   if(r.node==='root-room'&&!reviewed){const saved=JSON.stringify(r.state);await page.locator('#readPrevious').click();assert((await page.locator('#story').getAttribute('aria-label')).startsWith('Previously read:'));assert.equal((await state(page)).node,'root-room');assert.equal(JSON.stringify((await state(page)).state),saved);await page.locator('#readContinue').click();reviewed=true;}
   if(await page.locator('#readContinue').isVisible())await page.locator('#readContinue').click();
   else{const choice=remaining.shift();assert(choice,'Missing witness route choice');await act(page,choice)}
  }
  await page.locator('#recap:not([hidden])').waitFor();assert.equal(remaining.length,0);assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
  await page.screenshot({path:path.join(out,ending+'-'+width+'.png'),fullPage:true});
  await options(page);await page.locator('#openChapters').click();await page.getByRole('button',{name:'Replay in a new playthrough',exact:true}).first().click();const fork=await state(page);assert.equal(fork.node,'start');assert(!fork.state.knowledge.includes('identity'));
  await options(page);await page.locator('#openSaves').click();assert.equal(await page.locator('.save-row').count(),2);await close(page);
  assert.deepEqual(errors,[]);results.push({test:'full UI route, mid-route reload, read-only Previous, ending, chapter fork, separate saves',width,ending,steps,status:'PASS'});await context.close();
 }
 // Existing story keeps name entry and its four-point allocation.
 const context=await browser.newContext({viewport:{width:1280,height:850},reducedMotion:'reduce'}),page=await context.newPage();await page.goto(base+'/stories/');await page.locator('#firstName').fill('Test');await page.locator('#surname').fill('Reader');for(let i=0;i<4;i++)await page.getByRole('button',{name:'Increase Observation',exact:true}).click();await page.getByRole('button',{name:'Begin',exact:true}).click();await page.locator('#choices button').first().waitFor();
 const old=await page.evaluate(()=>{const b=JSON.parse(localStorage.getItem('night-story:the-last-call:v3'));return b.playthroughs.find(r=>r.id===b.active)});assert.equal(old.state.identity.firstName,'Test');assert.equal(old.state.attributes.observation,5);await context.close();results.push({test:'Last Call original name and attribute setup',status:'PASS'});
 fs.writeFileSync(path.join(__dirname,'browser-results.json'),JSON.stringify({status:'PASS',results},null,2)+'\n');console.log(JSON.stringify({status:'PASS',cases:results.length,results}));
 }finally{await browser.close()}
})().catch(e=>{console.error(e);process.exit(1)});
