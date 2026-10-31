import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {blankSession,newTrend,emptyBrief,validateSession,loadSession,saveSession,exportMarkdown,STORAGE_KEY} from '../dist/session.js';
import {lessons,stages,examples,checklist} from '../dist/content.js';

test('A complete workshop round-trips through backup without losing its relationships',()=>{
 const s=blankSession();s.context.question='What might change over six months?';s.context.audience='Preparedness team';
 const t=newTrend('test-trend');Object.assign(t,{title:'Variable rainfall',likelihood:'Medium',impact:'High',votes:4,shortlist:true,watch:true});s.trends.push(t);
 s.narrative.story='A conditional account';s.briefing.trends[t.id]={...emptyBrief(),summary:'A draft with uncertainty'};s.review.checks[2]=true;s.lessonDone=['scan','audience'];
 assert.deepEqual(validateSession(JSON.parse(JSON.stringify(s))),s);
 const md=exportMarkdown(s);for(const text of ['Variable rainfall','A draft with uncertainty','Medium','High','4','[x] Time horizon','A conditional account'])assert.ok(md.includes(text));
 assert.ok(!md.includes('Luma'));
});
test('Unshortlisting preserves a previously written draft in the export',()=>{
 const s=blankSession();s.trends.push(newTrend('retained'));s.briefing.trends.retained={...emptyBrief(),summary:'Keep this thinking'};
 const restored=validateSession(s);assert.ok(exportMarkdown(restored).includes('Keep this thinking'));assert.ok(exportMarkdown(restored).includes('not currently shortlisted'));
});
test('Older version-one backups open, and new analytical notes survive backup and export',()=>{
 const older=blankSession();
 for(const key of ['driverAssumption','consequenceAssumption','alternative'])delete older.narrative[key];
 const restored=validateSession(older);
 assert.equal(restored.narrative.driverAssumption,'');
 assert.equal(restored.narrative.consequenceAssumption,'');
 assert.equal(restored.narrative.alternative,'');
 Object.assign(restored.narrative,{driverAssumption:'Rainfall reaches the planting area',consequenceAssumption:'Income losses are not offset',alternative:'Temporary variability could explain the record'});
 const roundTrip=validateSession(JSON.parse(JSON.stringify(restored)));
 assert.deepEqual(roundTrip.narrative,restored.narrative);
 const markdown=exportMarkdown(roundTrip);
 for(const text of Object.values(restored.narrative).filter(Boolean))assert.ok(markdown.includes(text));
 for(const invalid of [null,42,{},'x'.repeat(100001)])assert.throws(()=>validateSession({...restored,narrative:{...restored.narrative,alternative:invalid}}));
});
test('Malformed, future-version, duplicate, orphan and out-of-range backups are rejected',()=>{
 const cases=[null,[],{version:2},{...blankSession(),trends:[newTrend('same'),newTrend('same')]},{...blankSession(),review:{notes:'',checks:[]}},{...blankSession(),trends:[{...newTrend('bad'),votes:-1}]},{...blankSession(),trends:[{...newTrend('bad'),likelihood:'Certain'}]},{...blankSession(),briefing:{intro:'',conclusion:'',trends:{orphan:emptyBrief()}}}];
 for(const c of cases)assert.throws(()=>validateSession(c));
});
test('Imported text is retained as text and extra properties do not enter the model',()=>{
 const s=blankSession();s.context.question='<img src=x onerror=alert(1)>';s.extra='unused';s.context.unexpected=true;
 const result=validateSession(s);assert.equal(result.context.question,s.context.question);assert.equal(result.extra,undefined);assert.equal(result.context.unexpected,undefined);
});
test('Saved sessions persist; blocked and corrupt storage do not crash the toolkit',()=>{
 const memory=new Map();const store={getItem:k=>memory.get(k)||null,setItem:(k,v)=>memory.set(k,v)};
 const s=blankSession();s.context.audience='Operations';assert.equal(saveSession(store,s),true);assert.equal(loadSession(store).session.context.audience,'Operations');
 store.setItem(STORAGE_KEY,'{broken');assert.equal(loadSession(store).available,false);assert.ok(loadSession(store).warning);
 const blocked={getItem(){throw Error('blocked');},setItem(){throw Error('quota');}};assert.equal(loadSession(blocked).available,false);assert.equal(saveSession(blocked,s),false);
});
test('Empty sessions export cleanly, with twelve review items and a 180-minute agenda',()=>{
 const s=blankSession();assert.equal(s.agenda.reduce((a,b)=>a+b.minutes,0),180);assert.equal(s.review.checks.length,12);assert.equal(checklist.length,12);assert.ok(exportMarkdown(s).includes('Not recorded'));assert.deepEqual(validateSession(s),s);
});
test('All eight source sections and all six resource links are included',()=>{
 const source=JSON.parse(fs.readFileSync(new URL('../dist/full-guide.json',import.meta.url),'utf8'));
 assert.equal(source.sections.length,8);assert.deepEqual(source.sections.map(s=>s.id),[1,2,3,4,5,6,7,8]);
 assert.equal(source.sections.reduce((n,s)=>n+(s.html.match(/<a href=/g)||[]).length,0),6);
 assert.ok(source.sections[2].html.includes('<table>'));assert.ok(source.sections[6].text.includes('Follow-through:'));
 for(const section of [1,2,3,4,5,6,8])assert.ok(lessons.some(l=>l.source===section));
 for(const stage of stages){assert.ok(lessons.some(l=>l.id===stage.id));assert.ok(examples[stage.id]);}
 assert.equal(new Set(lessons.map(l=>l.id)).size,lessons.length);
});
