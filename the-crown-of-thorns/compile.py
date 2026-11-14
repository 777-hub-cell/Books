"""Compile the complete authored scene source to NIGHT's existing data format."""
import json, re
from pathlib import Path

ROOT = Path(__file__).resolve().parent
TARGET = ROOT / 'implementation' / 'crown-of-thorns.json'
raw = (ROOT/'manuscript/scenes.md').read_text()+'\n'+(ROOT/'manuscript/interludes.md').read_text()
parts = re.split(r'^### ([-a-z]+) \| (\d+) \| (.+)\n', raw, flags=re.M)
nodes = {}
for i in range(1, len(parts), 4):
    key, chapter, title, prose = parts[i:i+4]
    nodes[key] = dict(chapter=int(chapter), title=title,
                      beats=[dict(text=p.replace('\n',' ').strip()) for p in prose.strip().split('\n\n')], choices=[])

def flag(key, value=True): return dict(op='set', key=key, value=value)
def add(key,value=1): return dict(op='add',key=key,value=value)
def learn(key): return dict(op='learn',key=key)
def var(key, value=True): return dict(var=key,eq=value)
def choice(node, suffix, label, to, effects=None, require=None, risk=None, pagination=False):
    c=dict(id=node+'-'+suffix,label=label,to=to)
    if effects: c['effects']=effects
    if require: c.update(require=require,requirement=risk)
    if risk: c['risk']=risk
    if pagination: c['continue']=True
    nodes[node]['choices'].append(c)
def onward(a,b): choice(a,'continue','Continue',b,pagination=True)

choice('start','catch','Catch the man before he reaches the stones.','rescue',[flag('elian_alive'),add('witnesses')])
choice('start','follow','Follow Pip; keep your injured leg out of danger.','observe',risk='You may arrive too late to stop the man.')
for n in ['rescue','observe']: onward(n,'kitchen')
choice('kitchen','notes','Take the pocketbook. Begin with the facts.','notebook',[flag('notebook'),dict(op='gain',key='pocketbook')])
choice('kitchen','gift','Take Pip’s bird. Begin with a person.','bird',[flag('bird'),dict(op='gain',key='bird')])
for n in ['notebook','bird']: onward(n,'market')
choice('market','records','Trace the old records with Marta.','archive',[learn('date')])
choice('market','neighbours','Ask Hessa what the council would not answer.','pottery',[learn('water')])
for n in ['archive','pottery']: onward(n,'council')
choice('council','public','Tell the square, and organise public witnesses.','warn',[add('witnesses'),flag('public_warning')])
choice('council','key','Wait until morning in exchange for the cellar key.','bargain',[dict(op='gain',key='hall_key')])
for n in ['warn','bargain']: onward(n,'supper')
choice('supper','person','Rehearse the greeting with Pip. Hold onto him.','keep-pip',[flag('bond'),learn('tithe')],risk='The next tithe can take the emotional context of your discoveries.')
choice('supper','evidence','Rehearse the evidence. Hold onto the investigation.','keep-clue',[flag('bond',False),flag('retained_clues'),learn('tithe')],risk='Your newly formed recognition of Pip is the most exposed memory.')
for n in ['keep-pip','keep-clue']: onward(n,'bridge')
choice('bridge','child','Pull Pip clear. Let the stone fall.','save-boy',[flag('pip_safe'),add('witnesses')])
choice('bridge','clause','Hold the stone for Sera’s rubbing. Tell Pip to jump.','save-stone',[flag('pip_injured'),learn('full_clause')],risk='The boat is slipping against Pip’s hand.')
for n in ['save-boy','save-stone']: onward(n,'aftermath')
onward('aftermath','witness'); onward('witness','hall'); onward('hall','name'); onward('name','vault')
choice('vault','force','Take the roll by force.','seize',[flag('seized'),dict(op='gain',key='roll')])
choice('vault','account','Offer a public hearing, including his own admission.','hearing',[flag('hearing'),add('witnesses'),dict(op='gain',key='roll')])
for n in ['seize','hearing']: onward(n,'assembly')
onward('assembly','anchors')
choice('anchors','doors','Go door to door. Ask for witnesses.','invite',[add('witnesses'),flag('invited')])
choice('anchors','past','Enter the crown’s sealed memory.','crown',[flag('crown_connection'),learn('mother')],risk='This spends the time you could use to invite more households.')
for n in ['invite','crown']: onward(n,'threshold')
choice('threshold','return','Divide the return among consenting households.','divide',require=dict(var='witnesses',gte=3),risk='Needs enough willing households. Reed must carry the unclaimed shares.')
choice('threshold','vessel','Bear the return alone. Give up your own memories.','vessel',require=var('crown_connection'),risk='Needs the recovered connection to the crown. Your personal memories will be consumed.')
choice('threshold','destroy','Destroy the pledged memories and open the road.','break',risk='Everyone loses the relationships tied to the pledge. Written facts and skills survive.')
choice('threshold','renew','Renew the keeping. Give the town more time.','renew',risk='Reed returns to sleep. The tithe doubles until the damaged root repairs.')
for n,end in [('divide','open-ending'),('vessel','vessel-ending'),('break','broken-ending'),('renew','sleep-ending')]: onward(n,end)
# Longer scenes use the same engine and preserve every prior state through joins.
nodes['mill-work']['choices']=nodes['market']['choices']; nodes['market']['choices']=[]; onward('market','mill-work')
for n in ['archive','pottery']: nodes[n]['choices'][0]['to']='perimeter'
onward('perimeter','council')
for n in ['warn','bargain']: nodes[n]['choices'][0]['to']='night-watch'
onward('night-watch','supper')
for n in ['keep-pip','keep-clue']: nodes[n]['choices'][0]['to']='after-bell'
onward('after-bell','bridge')
nodes['aftermath']['choices'][0]['to']='root-room'; onward('root-room','witness')
nodes['hall']['choices'][0]['to']='copies'; onward('copies','name')
for n in ['seize','hearing']: nodes[n]['choices'][0]['to']='boat-rib'
onward('boat-rib','assembly')
nodes['invite']['choices'][0]['to']='closed-door'; onward('closed-door','road-preparation')
nodes['crown']['choices'][0]['to']='garden-after'; onward('garden-after','road-preparation')
onward('road-preparation','threshold')
for n,mid,end in [('divide','return-morning','open-ending'),('vessel','empty-morning','vessel-ending'),('break','strangers-morning','broken-ending')]:
    nodes[n]['choices'][0]['to']=mid; onward(mid,end)
nodes['threshold']['choices'][-1]['to']='winter-book'; nodes['winter-book']['chapter']=11; onward('winter-book','renew')
endings={'return':'Four Steps','vessel':'The Visitor Book','break':'The Names They Chose','renew':'The Maintenance Book'}
for n,e in zip(['open-ending','vessel-ending','broken-ending','sleep-ending'],endings): nodes[n]['ending']=e; nodes[n].pop('choices')

def replace_text(node, old, new):
    for b in nodes[node]['beats']: b['text']=b['text'].replace(old,new)
def branch_text(node, needle, yes, no, condition):
    bs=nodes[node]['beats']; index=next(i for i,b in enumerate(bs) if needle in b['text'])
    bs[index:index+1]=[dict(text=yes,when=condition),dict(text=no,when=dict(not_=condition))]
    bs[index+1]['when']={'not':condition}

# Consequences appear in prose and remain in the saved state after branches rejoin.
branch_text('pottery','He forgets the route',
 '“He forgets the route before he forgets me,” Hessa said. “I used to think that made it better.”',
 '“He forgot the route before he forgot me,” Hessa said. “I thought there would be more time.”',var('elian_alive'))
branch_text('bridge','There was time',
 'There was time to haul him clear, or brace the block for Sera’s rubbing. “The whole clause could save people,” Pip said. He was watching Reed for permission to stay. She had to decide who would bear that risk.',
 'There was time to haul him clear, or brace the block for Sera’s rubbing. Pip kept his eyes on the slipping boat. Since the bell, she had been somebody who read about knowing him. Now she had to act.',var('bond'))
branch_text('anchors','Pip brought his boat drawing. He placed it flat',
 'Pip brought his boat drawing. He placed it flat, hiding his bandaged left hand behind his back. Two fingers would not straighten. He did not want her to count the hand among the costs.',
 'Pip brought his boat drawing. He spread it with both hands, pressing the creases from the paper as though a smooth drawing might help the boat get made.',var('pip_injured'))
nodes['aftermath']['effects']=[learn('pledge')]
nodes['root-room']['beats'].insert(7,dict(text='“Why did I wake without anything of my own?” Reed asked. The figure looked at the crown. “Your first deposit was your history. It holds the account together. Sleep preserved your body. It did not return the deposit.” She thought of the empty space around all the things her hands knew. Her life had been here, close enough to touch, while she was looking for it in the town.'))
nodes['witness']['effects']=[learn('terms')]
nodes['hall']['effects']=[learn('identity')]
nodes['assembly']['effects']=[learn('account')]
replace_text('archive','CHECK THE WATER COPY.','CHECK THE WATER COPY. NORTH BRIDGE.')
replace_text('keep-pip','held Pip\'s bird and repeated their greeting to herself','repeated the words she and Pip had agreed to use for a greeting')
replace_text('keep-pip','She had chosen the most recent, most fragile thing she owned.','She had rehearsed the most recent, most fragile thing she owned. The bell passed over a living memory while it was being spoken. Everything else lay exposed.')
replace_text('council',"We don't get to choose which.","We can't make it take a chosen memory. We can keep one present by speaking it through the bell, but then we leave the rest exposed.")
replace_text('supper','They drew a better one.','They drew a better one. Pip tried a greeting: “Has the bird flown?” Reed answered, “It ate too much.” He asked if they could use it tomorrow. She said yes.')
replace_text('keep-pip','She had chosen to hold the clues.','She had chosen to hold the clues.')
nodes['keep-clue']['beats'].insert(1,dict(text='She kept reading until the bell fell silent. The words stayed present while it rang. The person she had come to know over them did not.'))
nodes['bridge']['beats'].insert(4,dict(text='Around the three figures ran a smaller sentence: OUR WAY, OUR VOICE, OUR BREATH, UNTIL THE KEEPING ENDS. Reed traced the words back to the first figure. The same three things were written on the boundary stones.'))
nodes['root-room']['beats'].insert(-2,dict(text='“And the three steps?” Reed asked. “Who chose that?” The figure touched the three points of the crown. “The Crown pledged way, voice and breath. The first advance confuses the way. The second takes the voice. The third takes the pledged breath. There were to be two warnings before a departure became final.” Reed looked at the old fastening scars on her chest. The promise had been made with her life as well as everyone else’s. “They thought two warnings made it fair?” she asked. The figure gave no answer to that.'))
nodes['aftermath']['beats'].insert(-2,dict(text='“Why has nobody come in from outside?” Reed asked. The figure pointed towards the rooted posts. “The approach roads turn away from a besieged refuge. The inner roads turn back to it.” She thought of the moss-covered sign and its reversed arms. The concealment had stayed in place as faithfully as the killing.'))
replace_text('witness','Divided return required the living household witnesses and the original pledge-roll.','Divided return required the living household witnesses and the original pledge-roll. Three independent groups must call, hold and check the returning shares; more could spread the strain.')
nodes['keep-pip']['beats'].append(dict(text='The pocketbook gave her a place to reconstruct the lost context. She began a second account, marking what she knew from writing and what she still remembered.',when=var('notebook')))
nodes['keep-pip']['beats'].append(dict(text='Pip’s bird lay under her shift. She held it while she read the copied scraps Sera brought her, trying to rebuild the sequence she no longer felt sure of.',when=var('bird')))
nodes['keep-clue']['beats'].append(dict(text='He left the bird on the table. Reed could match the slipped knife mark to the tiny scar on his finger. When he saw her make the connection, he sat down again, though not so close as before.',when=var('bird')))
# Taking practical notes also earns a set of independent public copies.
nodes['assembly']['effects'].append(add('witnesses'))
nodes['assembly']['effects'][-1]['when']=var('notebook')
nodes['assembly']['beats'].insert(1,dict(text='Reed passed round the notes she had kept from her first evening. Marta checked their dates against the mill tally. Another household agreed to hold a share after seeing that the record could be checked.',when=var('notebook')))
nodes['anchors']['effects']=[dict(op='add',key='witnesses',value=1,when={'all':[var('bond'),var('pip_safe')]})]
nodes['anchors']['beats'].append(dict(text='Pip told the room how Reed had caught him when the stone fell. He knew her; she still knew him. A household near the door put their names down after listening. Reed waited until they had read the conditions before she thanked them.',when={'all':[var('bond'),var('pip_safe')]}))
nodes['threshold']['beats'].insert(1,dict(text='There were enough willing groups. Reed counted them again against the roll, leaving every refusal on the record.',when=dict(var='witnesses',gte=3)))
nodes['threshold']['beats'].insert(2,dict(text='There were too few willing groups to keep the returning shares apart. Reed looked at the empty spaces in the register. A command would not fill them.',when=dict(var='witnesses',lte=2)))
nodes['open-ending']['beats'].insert(-3,dict(text='Elian came to the bridge with Hessa. He remembered the morning with the bowl. He thanked Reed once, awkwardly, then asked where she wanted the next load of gravel.',when=var('elian_alive')))
nodes['open-ending']['beats'].insert(-3,dict(text='Hessa put Elian’s blue bowl in the archive. She did not want it displayed. Reed found a cupboard where it could be kept until Hessa decided what she wanted to do with it.',when={'not':var('elian_alive')}))
nodes['vessel-ending']['beats'].insert(-4,dict(text='Pip’s hand had healed crookedly. When Reed asked about it, he told her what had happened at the bridge. She read her own account afterwards and asked whether he wanted to keep visiting. He said he did, but that he might change his mind.',when=var('pip_injured')))
nodes['broken-ending']['beats'].insert(-3,dict(text='Pip learned to shape boat ribs one-handed. Reed offered to help and waited for his answer. He showed her the account of the bridge before he let her touch the tools.',when=var('pip_injured')))

chapters=['The Woman in the Millrace','Things Written on Doors','Fenmere','The Bell Brought Forward','Tomorrow’s Portion','The Water Copy','The Debt Collector','The Girl Under the Sluice','The Original Roll','What Returning Would Cost','The Crown on the Table','Beyond the Keeping']
story=dict(id='crown-of-thorns',revision=1,title='The Crown of Thorns',author='NIGHT',start='start',
 fixedIdentity=True,setupTitle='Before the bell',identity={'firstName':'Unknown','surname':'Traveller'},
 setupText='A dark fairytale in twelve chapters. Your choices and their consequences are saved in this browser. Begin without choosing a name; discover her history with her.',
 identityLabels=[dict(text='Ilyen, called Reed',when=dict(lore='identity')),dict(text='Reed',when=dict(event='named')),dict(text='The traveller')],
 initial={k:False for k in ['elian_alive','notebook','bird','bond','retained_clues','public_warning','pip_safe','pip_injured','seized','hearing','invited','crown_connection']},
 chapters=[dict(number=i+1,title=t) for i,t in enumerate(chapters)],nodes=nodes,endings=endings,
 rules=dict(attributes={},resources={},abilities={},startingPoints=0),atmosphere='quiet',
 items={'pocketbook':'Sera’s pocketbook','bird':'Pip’s willow bird','hall_key':'The hall cellar key','roll':'The original return roll'},
 knowledge={
 'date':dict(title='The mill tally',text='The enclosure began 197 years ago. The signed public copy has been scraped; a note points to the north bridge.'),
 'water':dict(title='The bridge text',text='The Crown and Witness can open the road. The rest of the instruction is below the waterline.'),
 'tithe':dict(title='The memory tithe',text='The bell takes an unheld autobiographical memory, beginning with distant connections. Rehearsing one memory through the bell leaves the rest exposed. Written facts and practical skills survive.'),
 'full_clause':dict(title='The water copy',text='A shared return needs willing household witnesses, anchors, and the original roll. A lone guarantor can pay instead. Destroying the pledge also opens the road, at a permanent relational cost.'),
 'pledge':dict(title='An old keeping',text='An enclosed wartime refuge became an inherited prison. The sleeping guarantor woke when Oren cut its root.'),
 'terms':dict(title='The hidden release terms',text='The roll was locked away; duplicate records were deliberately destroyed. The Keeper requires the Crown, Witness and roll together to account for the pledge.'),
 'identity':dict(title='Ilyen, called Reed',text='She is Princess Ilyen, daughter of Maud, the local Crown of the Fen Basin. Her voluntary wartime sleep lasted 197 years. No outside ancestry is established.'),
 'account':dict(title='The choices available',text='Return the pledged memories, bear them alone, destroy them, or renew. No method revives the dead. Shared return requires living consent.'),
 'mother':dict(title='A morning in the garden',text='Her mother asked a frightened daughter to be guarantor. The memory restored Reed’s conscious connection to the crown, making a lone return possible.')},
 characters={'protagonist':dict(name='The traveller',text='Found in the millrace. Her history is unknown.'),
 'Pip':dict(name='Pip',text='A boy learning boatbuilding; Sera’s nephew.',when=dict(event='met_pip'))},
 sheetSections=[dict(title='Her chosen name',text='Reed. Pip offered it in Sera’s kitchen.',when=dict(event='named')),
 dict(title='Her recovered identity',text='Ilyen, daughter of Maud. She continues to answer to Reed.',when=dict(lore='identity'))],
 recap=[dict(text='Elian survived at the boundary.',when=var('elian_alive')),
 dict(text='Elian died on the third step.',when={'not':var('elian_alive')}),
 dict(text='Pip’s hand was permanently injured while the inscription was copied.',when=var('pip_injured')),
 dict(text='Pip escaped the bridge without injury.',when=var('pip_safe')),
 dict(text='Reed lost her recognition of Pip at the first bell.',when={'not':var('bond')}),
 dict(text='Oren gave a witnessed account of his actions.',when=var('hearing'))])
story['initial']['witnesses']=0
nodes['start']['effects']=[dict(op='event',key='met_pip')]
nodes['kitchen']['effects']=[dict(op='event',key='named')]
story['wordCount']=sum(len(b['text'].split()) for n in nodes.values() for b in n['beats'])
TARGET.parent.mkdir(exist_ok=True)
TARGET.write_text(json.dumps(story,ensure_ascii=False,indent=2)+'\n')
# Export a review manuscript containing every conditional passage and decision.
out=['# The Crown of Thorns','Complete interactive short book; third-person limited. All routes follow. Conditional prose is explicitly labelled.']
sequence='start rescue observe kitchen notebook bird market mill-work archive pottery perimeter council warn bargain night-watch supper keep-pip keep-clue after-bell bridge save-boy save-stone aftermath root-room witness hall copies name vault seize hearing boat-rib assembly anchors invite closed-door crown garden-after road-preparation threshold divide vessel break winter-book renew return-morning open-ending empty-morning vessel-ending strangers-morning broken-ending sleep-ending'.split()
assert set(sequence)==set(nodes)
for key in sequence:
    n=nodes[key]
    out.append(f"\n## {n['chapter']}. {n['title']} [{key}]")
    for b in n['beats']:
        if b.get('when'): out.append('*Condition: '+json.dumps(b['when'],ensure_ascii=False)+'*')
        out.append(b['text'])
    for c in n.get('choices',[]):
        out.append('- '+c['label']+' → '+c['to']+(' [Requires: '+json.dumps(c['require'])+']' if c.get('require') else ''))
    if n.get('ending'): out.append('**Ending: '+endings[n['ending']]+'**')
(ROOT/'MANUSCRIPT.md').write_text('\n\n'.join(out)+'\n')
print(json.dumps(dict(scenes=len(nodes),words=story['wordCount'],endings=len(endings))))
