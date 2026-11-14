const {chromium}=require('playwright');
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const story=require(process.env.NIGHT_STORY||'./the-dragons-guest.json');
const E=require(process.env.NIGHT_ENGINE||path.resolve(__dirname,'../../integration/stories/engine.js'));
const base=process.env.NIGHT_URL||'http://127.0.0.1:8080';
const defaults={market:'wall',guest:'freedom',shelf:'daughter',bell:'brace',captain:'ally',account:'renounce',records:'archive',archive:'clerk',brother:'return',desire:'romance',assembly:'hearing',testimony:'claims',northroad:'people',yard:'save'};
const key='night-story:the-dragons-guest:v3';
(async()=>{
 const browser=await chromium.launch({headless:true,executablePath:process.env.CHROMIUM_PATH||(process.env.CI?undefined:'/usr/bin/chromium'),args:['--no-sandbox']});let result=[];
 for(const width of [320,360,390,412,1280]){
  const context=await browser.newContext({viewport:{width,height:900},reducedMotion:'reduce',isMobile:width<500,hasTouch:width<500});
  const page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.route('https://fonts.googleapis.com/**',r=>r.abort());
  await page.goto(base+'/stories/library.html');await page.getByRole('link',{name:'Begin reading',exact:true}).last().click();
  await page.getByRole('heading',{name:'Before the mountain'}).waitFor();
  assert.equal(await page.locator('input[type=text]:visible').count(),0);
  await page.getByRole('button',{name:'Begin',exact:true}).click();
  await page.locator('#story .step').first().waitFor();
  assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),'no horizontal overflow '+width);
  await page.screenshot({path:'/tmp/dragon-opening-'+width+'.png',fullPage:true});
  if(![390,1280].includes(width)){await context.close();result.push({width,opening:true,noOverflow:true});continue;}
  for(const [ending,overrides] of [['house',{}],['openmountain',{assembly:'refuge',desire:'friendship',northroad:'papers'}],['after',{assembly:'direct',yard:'families',bell:'gong'}]]){
   if(ending!=='house'){
    await page.evaluate(k=>localStorage.removeItem(k),key);await page.reload();
    await page.getByRole('button',{name:'Begin',exact:true}).click();
   }
   const plan={...defaults,...overrides};let guard=0,reloaded=false,backTested=false,lockedTested=false;
   while(guard++<200){
    await page.waitForFunction(k=>{const b=JSON.parse(localStorage.getItem(k)||'null');return b?.playthroughs?.length},key);
    let run=await page.evaluate(k=>{const b=JSON.parse(localStorage.getItem(k));return b.playthroughs.find(r=>r.id===b.active)},key);
    if(run.ending)break;
    if(!reloaded&&run.node.startsWith('hearth')){
     const state=JSON.stringify(run.state);await page.reload();
     await page.waitForFunction(()=>document.querySelector('#story .step'));
     const restored=await page.evaluate(k=>{const b=JSON.parse(localStorage.getItem(k));return b.playthroughs.find(r=>r.id===b.active).state},key);
     assert.equal(JSON.stringify(restored),state,'reload preserves actual state');reloaded=true;
    }
    const cs=E.choices(story,run),scene=run.node.split('~')[0];
    const c=cs.length===1&&cs[0].continue?cs[0]:cs.find(c=>c.id===scene+':'+plan[scene])||cs[0];
    if(!backTested&&await page.locator('#readPrevious').isVisible()){
     const state=JSON.stringify(run.state);await page.locator('#readPrevious').click();await page.locator('#readContinue').click();
     const later=await page.evaluate(k=>{const b=JSON.parse(localStorage.getItem(k));return b.playthroughs.find(r=>r.id===b.active).state},key);
     assert.equal(JSON.stringify(later),state);backTested=true;
    }
    if(scene==='assembly'&&!lockedTested&&overrides.desire==='friendship'){
     if(await page.locator('[data-choice="assembly:hearing"]').count())assert.equal(await page.locator('[data-choice="assembly:hearing"]').isEnabled(),false);
     lockedTested=true;
    }
    if(c.continue)await page.locator('#readContinue').click();
    else await page.locator('[data-choice="'+c.id+'"]').click();
   }
   assert.ok(guard<200);
   await page.getByRole('heading',{name:story.endings[ending],exact:true}).waitFor();
   const final=await page.evaluate(k=>{const b=JSON.parse(localStorage.getItem(k));return b.playthroughs.find(r=>r.id===b.active)},key);
   assert.equal(final.ending,ending);assert.ok(reloaded&&backTested);
   assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));
   await page.screenshot({path:`/tmp/dragon-${ending}-${width}.png`,fullPage:true});
   await page.locator('#openJournal').click();await page.locator('#storyDialog[open]').waitFor();
   assert.ok((await page.locator('#dialogBody').innerText()).includes('Your decisions'));
   await page.locator('.close-dialog').click();
   await page.locator('#openChapters').click();await page.locator('#storyDialog[open]').waitFor();
   await page.getByRole('button',{name:'Replay in a new playthrough',exact:true}).nth(6).click();
   const fork=await page.evaluate(k=>{const b=JSON.parse(localStorage.getItem(k));return b.playthroughs.find(r=>r.id===b.active)},key);
   assert.equal(story.nodes[fork.node].chapter,7);assert.equal(fork.ending,null);assert.equal(fork.state.vars.romance,false);
   result.push({width,ending,playedThroughControls:true,reload:true,readBack:true,journal:true,chapterFork:true,noOverflow:true});
  }
  assert.deepEqual(errors,[]);await context.close();
 }
 // Existing default book retains its editable identity and four-point setup.
 const page=await browser.newPage({reducedMotion:'reduce'});await page.goto(base+'/stories/');
 await page.getByRole('heading',{name:'Before the call'}).waitFor();assert.equal(await page.locator('input[type=text]').count(),2);
 assert.equal(await page.getByRole('button',{name:'Begin',exact:true}).isEnabled(),false);
 for(let i=0;i<4;i++)await page.getByRole('button',{name:'Increase Observation',exact:true}).click();
 await page.getByRole('button',{name:'Begin',exact:true}).click();await page.locator('#story .step').first().waitFor();
 assert.ok((await page.title()).includes('Last Call'));
 await browser.close();
 fs.writeFileSync(path.join(__dirname,'browser-results.json'),JSON.stringify({status:'PASS',checks:result,lastCallRegression:true},null,2)+'\n');
 console.log(JSON.stringify({status:'PASS',viewports:5,completeUIPlaythroughs:6,saveReload:true,journal:true,chapterReplay:true,lastCallRegression:true}));
})().catch(e=>{console.error(e);process.exit(1)});
