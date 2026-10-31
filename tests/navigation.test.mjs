import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {lessons,stages} from '../dist/content.js';
import {blankSession,newTrend} from '../dist/session.js';
import {mainDestinations,learningGroups,readingOrder,groupForLesson,adjacentLessons,routeContext,contextualLinks,hasAnalyticalWork,searchNavigation} from '../dist/navigation.js';

test('The complete lesson collection is discoverable exactly once in the four learning groups',()=>{
 assert.equal(learningGroups.length,4);
 assert.equal(readingOrder.length,12);
 assert.equal(new Set(readingOrder).size,12);
 assert.deepEqual([...readingOrder].sort(),lessons.map(lesson=>lesson.id).sort());
 for(const lesson of lessons)assert.equal(learningGroups.filter(group=>group.lessonIds.includes(lesson.id)).length,1);
 assert.equal(groupForLesson('purpose').id,'before-you-begin');
 assert.deepEqual(learningGroups.find(group=>group.id==='before-you-begin').lessonIds,['purpose']);
 assert.equal(groupForLesson('care').id,'facilitation');
 assert.equal(groupForLesson('network').id,'communicate-and-continue');
});

test('All published navigation and search destinations resolve without invalid ancestor links',()=>{
 const sections=JSON.parse(fs.readFileSync(new URL('../dist/full-guide.json',import.meta.url),'utf8')).sections;
 const destinations=[...mainDestinations,...learningGroups,...contextualLinks('session'),...contextualLinks('facilitate'),...searchNavigation(''),...searchNavigation('lesson',sections),...searchNavigation('worksheet',sections),...searchNavigation('Luma',sections),...sections.map(section=>({href:`#source/${section.id}`})),{href:'#communicate'},{href:'#print'}];
 for(const destination of destinations){
   const context=routeContext(destination.href,sections);
   assert.equal(context.valid,true,destination.href);
   for(const crumb of context.breadcrumbs.filter(crumb=>crumb.href))assert.equal(routeContext(crumb.href,sections).valid,true,crumb.href);
 }
 for(const stage of stages){assert.equal(routeContext(`#tool/${stage.id}`).section,'session');assert.equal(routeContext(`#example/${stage.id}`).section,'method');}
 assert.equal(routeContext('#present').section,'facilitate');
 assert.equal(routeContext('#checklist').section,'session');
 assert.equal(routeContext('#communicate').section,'method');
});

test('Deep links identify the correct learning ancestry and focus target',()=>{
 const purpose=routeContext('#lesson/purpose');
 assert.deepEqual(purpose.breadcrumbs.map(crumb=>crumb.label),['Learn the method','Before you begin','Define the decision and audience']);
 assert.deepEqual(purpose.breadcrumbs.slice(0,-1).map(crumb=>crumb.href),['#method','#method/before-you-begin']);
 assert.deepEqual(routeContext('#lesson/audience'),purpose);
 assert.deepEqual(routeContext('#communicate'),routeContext('#method/communicate-and-continue'));
 assert.equal(routeContext('#communicate').anchor,'learn-communicate-and-continue');
 assert.equal(routeContext('#method/facilitation').anchor,'learn-facilitation');
 assert.equal(routeContext('#session/downloads').anchor,'session-downloads');
 assert.equal(routeContext('#facilitate/agenda').anchor,'workshop-agenda');
 assert.equal(routeContext('#source/3').anchor,'source-3');
 assert.deepEqual(routeContext('#home').breadcrumbs,[]);
 for(const invalid of ['#lesson/missing','#tool/purpose','#tool/audience','#example/audience','#method/missing','#session/missing','#facilitate/missing','#source/99','#lesson/scan/extra','#lesson/audience/extra','#unknown'])assert.equal(routeContext(invalid).valid,false,invalid);
});

test('Reading order joins foundations, the stages, facilitation and communication without dead ends',()=>{
 assert.equal(adjacentLessons('purpose').previous,null);
 assert.equal(adjacentLessons('purpose').next.id,'scan');
 assert.equal(adjacentLessons('scan').previous.id,'purpose');
 assert.equal(adjacentLessons('review').next.id,'collaboration');
 assert.equal(adjacentLessons('care').next.id,'communicate');
 assert.equal(adjacentLessons('follow-through').next,null);
 for(let i=1;i<readingOrder.length;i++)assert.equal(adjacentLessons(readingOrder[i]).previous.id,readingOrder[i-1]);
});

test('Search exposes lessons, working tools and examples with explicit section paths',()=>{
 assert.deepEqual(searchNavigation('').map(item=>item.href),['#method','#session','#facilitate','#checklist','#source']);
 assert.ok(searchNavigation('purpose').some(item=>item.href==='#lesson/purpose'&&item.path.startsWith('Learn the method / Before you begin')));
 for(const query of ['decision','audience']) {
   const results=searchNavigation(query);
   assert.equal(results.filter(item=>item.href==='#lesson/purpose').length,1);
   assert.ok(!results.some(item=>item.href==='#lesson/audience'));
 }
 assert.ok(searchNavigation('worksheet').some(item=>item.href==='#tool/scan'&&item.path.startsWith('Your working session')));
 assert.equal(searchNavigation('Luma').filter(item=>item.href.startsWith('#example/')).length,5);
 assert.ok(searchNavigation('timer').some(item=>item.href==='#present'&&item.path.startsWith('Facilitate a workshop')));
 assert.ok(searchNavigation('restore').some(item=>item.href==='#session/downloads'));
 const communication=searchNavigation('communicat');
 for(const id of ['communicate','network','follow-through'])assert.ok(communication.some(item=>item.href===`#lesson/${id}`));
 assert.ok(!communication.some(item=>item.href==='#communicate'));
 assert.ok(searchNavigation('communication').some(item=>item.href==='#method/communicate-and-continue'));
 assert.deepEqual(searchNavigation('unmatchable-zxqv-12345'),[]);
});

test('A resume action represents analytical work, while reading progress and agenda-only edits do not',()=>{
 const session=blankSession();
 assert.equal(hasAnalyticalWork(session),false);
 session.lessonDone=['purpose'];session.agenda[0].minutes=12;
 assert.equal(hasAnalyticalWork(session),false);
 session.context.question='  ';
 assert.equal(hasAnalyticalWork(session),false);
 session.context.question='What could change?';
 assert.equal(hasAnalyticalWork(session),true);
 session.context.question='';session.trends.push(newTrend('resume-test'));
 assert.equal(hasAnalyticalWork(session),true);
});
