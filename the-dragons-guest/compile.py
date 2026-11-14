#!/usr/bin/env python3
"""Compile prose and declarative routing into the existing NIGHT Stories format."""
from pathlib import Path
import json, re

ROOT=Path(__file__).resolve().parent

def compile_story():
    text=(ROOT/'MANUSCRIPT.md').read_text()
    routes=json.loads((ROOT/'routes.json').read_text())
    parts=re.split(r'^@@ ([a-z]+) \| (\d+) \| (.+)$',text,flags=re.M)
    scenes={}
    for i in range(1,len(parts),4):
        key,ch,title,body=parts[i:i+4]
        paragraphs=[]; when=None
        for p in re.split(r'\n\s*\n',body.strip()):
            if p.startswith(':::when '):
                assert when is None, key
                when=json.loads(p.removeprefix(':::when '));continue
            if p==':::end':
                assert when is not None,key
                when=None;continue
            assert not p.startswith(':::'),(key,p)
            beat={'text':p.strip()}
            if when:beat['when']=when
            paragraphs.append(beat)
        assert when is None,key
        scenes[key]={'chapter':int(ch),'title':title,'beats':paragraphs}
    assert set(scenes)==set(routes['scenes']),set(scenes)^set(routes['scenes'])
    nodes={}; endings={'house':'A House with Two Doors','openmountain':'The Open Mountain','after':'The Last Crossing'}
    for key,scene in scenes.items():
        pages=[];page=[];words=0
        for beat in scene['beats']:
            count=len(beat['text'].split())
            if words+count>190 and page:
                pages.append(page);page=[];words=0
            page.append(beat);words+=count
        if page:pages.append(page)
        for i,page in enumerate(pages):
            nodekey=key if i==0 else f'{key}~{i}'
            node={**scene,'beats':page}
            if i==0 and routes['scenes'][key].get('effects'):
                node['effects']=routes['scenes'][key]['effects']
            if i<len(pages)-1:
                node['choices']=[{'id':nodekey+':next','label':'Continue','to':f'{key}~{i+1}','continue':True}]
            elif key in endings:node['ending']=key
            else:node['choices']=routes['scenes'][key]['choices']
            nodes[nodekey]=node
    chapters=[{'number':i,'title':next(v['title'] for v in scenes.values() if v['chapter']==i)} for i in range(1,25)]
    route_titles={20:'The Chosen Road',21:'What to Carry',22:'The Cost of Help',23:'An Ending to the Bargain',24:'What Remains'}
    for chapter in chapters:
        if chapter['number'] in route_titles:chapter['title']=route_titles[chapter['number']]
    story={
        'id':'the-dragons-guest','revision':1,'title':"The Dragon’s Guest",'author':'NIGHT','start':'bread',
        'identity':{'firstName':'Edda','surname':'Venn'},'fixedIdentity':True,
        'setupTitle':'Before the mountain',
        'setupNote':'Edda Venn is twenty-seven, a sluice surveyor trying to clear her name. This dark fantasy romance includes bereavement, institutional murder and violence. Your choices shape trust, evidence, survival and three endings. Progress is saved in this browser.',
        'rules':{'attributes':{},'resources':{},'abilities':{},'startingPoints':0},
        'initial':routes['initial'],'chapters':chapters,'nodes':nodes,'endings':endings,
        'mainEndings':list(endings),'atmosphere':'quiet',
        'wordCount':sum(len(b['text'].split()) for s in scenes.values() for b in s['beats']),
        'items':routes['items'],'knowledge':routes['knowledge'],'recap':routes['recap'],
        'characters':{
            'protagonist':{'name':'Edda Venn','text':'A twenty-seven-year-old sluice surveyor, taught practical wound care by her mother. She wants to clear her conviction, protect her independence and build safer waterways.'},
            'ordan':{'name':'Ordan','when':{'lore':'ordan'},'text':'An ancient dragon who can assume human form. He has killed the people delivered under the peace charter. His grief explains his history; it does not cancel his responsibility.'},
            'linnet':{'name':'Linnet','when':{'lore':'linnet'},'text':'Ordan’s adopted daughter. A maker and teacher, stubborn, funny and affectionate. She died at nineteen after a knowingly falsified accusation.'},
            'sef':{'name':'Sef Venn','when':{'var':'departed','eq':True},'text':'Edda’s brother. A timber worker who has begun organising the allowance families.'}
        },
        'sheetSections':[{'title':'Your relationship','text':'You and Ordan have freely chosen to explore a romantic relationship.','when':{'var':'romance','eq':True}},
                         {'title':'The road remains open','text':'You have left the mountain and can choose whether to return. No offer of shelter requires affection in exchange.','when':{'var':'departed','eq':True}}]
    }
    (ROOT/'the-dragons-guest.json').write_text(json.dumps(story,ensure_ascii=False,indent=2)+'\n')
    return story

if __name__=='__main__':
    s=compile_story()
    print(f"Compiled {len(s['nodes'])} passages, {len(s['chapters'])} chapters, {s['wordCount']} narrative words across all routes.")
