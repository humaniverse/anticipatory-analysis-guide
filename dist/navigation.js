import {lessons, stages, examples} from './content.js';

export const mainDestinations = [
  {id:'home',href:'#home',label:'Home'},
  {id:'method',href:'#method',label:'Learn the method'},
  {id:'session',href:'#session',label:'Your working session'},
  {id:'facilitate',href:'#facilitate',label:'Facilitate a workshop'}
];

export const learningGroups = [
  {id:'before-you-begin',label:'Before you begin',description:'Connect the analysis to a purpose, an audience and a useful question.',lessonIds:['purpose']},
  {id:'five-stages',label:'The trend analysis method',description:'Follow the process from emerging change to a final briefing.',lessonIds:stages.map(s=>s.id)},
  {id:'facilitation',label:'Facilitation and collaboration',description:'Bring different perspectives together and make room for people to think.',lessonIds:['collaboration','ai','care']},
  {id:'communicate-and-continue',label:'Communicate and continue',description:'Make the analysis useful, share the learning and prepare for the next cycle.',lessonIds:['communicate','network','follow-through']}
].map(group=>({...group,href:`#method/${group.id}`,anchor:`learn-${group.id}`}));

export const readingOrder = learningGroups.flatMap(group=>group.lessonIds);
export const groupForLesson = id => learningGroups.find(group=>group.lessonIds.includes(id));
export const lessonById = id => lessons.find(lesson=>lesson.id===id);

export function adjacentLessons(id) {
  const index=readingOrder.indexOf(id);
  return {previous:index>0?lessonById(readingOrder[index-1]):null,next:index>=0&&index<readingOrder.length-1?lessonById(readingOrder[index+1]):null};
}

const rootCrumb = section => {
  const item=mainDestinations.find(destination=>destination.id===section);
  return {label:item.label,href:item.href};
};
const groupCrumb = group => ({label:group.label,href:group.href,kind:'group'});

// Route ownership is independent of how a visitor arrived at a page.
export function routeContext(hash='',sourceSections=[]) {
  const [view='home',id,...extra]=(hash.replace(/^#/,'')||'home').split('/');
  const href=`#${view}${id?`/${id}`:''}`;
  const result={view,id,href,section:null,group:null,title:'Page not found',breadcrumbs:[],anchor:null,valid:false};
  if(extra.length)return result;
  const set=(section,title,breadcrumbs=[],anchor=null,group=null)=>({...result,section,title,breadcrumbs,anchor,group,valid:true});
  const current=label=>({label});
  if(view==='home'&&!id)return set('home','Home');
  if(view==='method') {
    const group=learningGroups.find(item=>item.id===id);
    if(id&&!group)return result;
    return group?set('method',group.label,[rootCrumb('method'),current(group.label)],group.anchor,group):set('method','Learn the method',[current('Learn the method')]);
  }
  if(view==='lesson') {
    if(id==='audience')return routeContext('#lesson/purpose',sourceSections);
    const lesson=lessonById(id),group=groupForLesson(id);
    return lesson&&group?set('method',lesson.title,[rootCrumb('method'),groupCrumb(group),current(lesson.title)],null,group):result;
  }
  if(view==='tool'||view==='example') {
    const stage=stages.find(item=>item.id===id);
    if(!stage)return result;
    const group=groupForLesson(id);
    return view==='tool'
      ?set('session',stage.title,[rootCrumb('session'),current(stage.title)])
      :set('method',examples[id].title,[rootCrumb('method'),groupCrumb(group),{label:stage.title,href:`#lesson/${id}`},current('Worked example')],null,group);
  }
  if(view==='session') {
    if(id&&id!=='downloads')return result;
    return id?set('session','Save and download',[rootCrumb('session'),current('Save and download')],'session-downloads'):set('session','Your working session',[current('Your working session')]);
  }
  if(view==='checklist'&&!id)return set('session','Final checklist',[rootCrumb('session'),current('Final checklist')]);
  if(view==='print'&&!id)return set('session','Print preview',[rootCrumb('session'),{label:'Save and download',href:'#session/downloads'},current('Print preview')]);
  if(view==='facilitate') {
    if(id&&id!=='agenda')return result;
    return id?set('facilitate','Workshop agenda',[rootCrumb('facilitate'),current('Workshop agenda')],'workshop-agenda'):set('facilitate','Facilitate a workshop',[current('Facilitate a workshop')]);
  }
  if(view==='present'&&!id)return set('facilitate','Facilitator view',[rootCrumb('facilitate'),current('Facilitator view')]);
  if(view==='communicate'&&!id) {
    return routeContext('#method/communicate-and-continue',sourceSections);
  }
  if(view==='source') {
    if(!id)return set(null,'The source guide',[current('The source guide')]);
    const source=sourceSections.find(item=>String(item.id)===id);
    if(!source&&!/^[1-8]$/.test(id))return result;
    return set(null,source?.title||`Section ${id}`,[{label:'The source guide',href:'#source'},current(source?.title||`Section ${id}`)],`source-${id}`);
  }
  return result;
}

export function contextualLinks(section) {
  if(section==='session')return [
    {href:'#session',label:'Define your analysis'},
    ...stages.map(stage=>({href:`#tool/${stage.id}`,label:stage.title,stage:Number(stage.number)})),
    {href:'#checklist',label:'Final checklist'},
    {href:'#session/downloads',label:'Save and download'}
  ];
  if(section==='facilitate')return [
    {href:'#facilitate',label:'Workshop planning'},
    {href:'#present',label:'Facilitator view'}
  ];
  return [];
}

export function hasAnalyticalWork(session) {
  const hasText=object=>Object.values(object||{}).some(value=>typeof value==='string'&&value.trim());
  return !!(hasText(session.context)||session.trends.length||hasText(session.narrative)||session.briefing.intro.trim()||session.briefing.conclusion.trim()||Object.values(session.briefing.trends).some(hasText)||session.review.notes.trim()||session.review.checks.some(Boolean));
}

const utilityEntries=[
  {href:'#session',title:'Session brief',description:'Set the question, audience, geography and time horizon.',terms:'analysis working session'},
  {href:'#session/downloads',title:'Save and download',description:'Download a backup, restore your notes, export Markdown or print worksheets.',terms:'backup restore export print downloads'},
  {href:'#facilitate',title:'Workshop planning',description:'Prepare your workshop and find supporting facilitation lessons.',terms:'facilitator collaboration participants'},
  {href:'#facilitate/agenda',title:'Workshop agenda',description:'Edit the stages and timings for your workshop.',terms:'agenda minutes duration breaks'},
  {href:'#present',title:'Facilitator view',description:'Present the instructions and run the workshop timer.',terms:'timer presentation fullscreen sprint'},
  {href:'#checklist',title:'Final checklist',description:'Review twelve questions before sharing the briefing.',terms:'publication review quality'},
  {href:'#method/communicate-and-continue',title:'Communicate and continue',description:'Share the analysis, build an analytical network and follow through.',terms:'communication network learning'},
  {href:'#source',title:'The source guide',description:'Read the complete original guide and its references.',terms:'original reference sources'}
];

export function searchNavigation(query,sourceSections=[]) {
  const decorate=entry=>{
    const context=routeContext(entry.href,sourceSections);
    const parents=context.breadcrumbs.slice(0,-1).map(crumb=>crumb.label);
    const path=parents.length?parents.join(' / '):mainDestinations.find(item=>item.id===context.section)?.label||'The source guide';
    return {...entry,path};
  };
  const q=query.trim().toLowerCase();
  if(!q)return [
    {href:'#method',title:'Learn the method',description:`Find all ${lessons.length} lessons, grouped by topic.`},
    ...['#session','#facilitate','#checklist','#source'].map(href=>utilityEntries.find(entry=>entry.href===href))
  ].map(decorate);
  const entries=[
    ...lessons.map(lesson=>({href:`#lesson/${lesson.id}`,title:lesson.title,description:lesson.deck,terms:[lesson.id,groupForLesson(lesson.id).label,'lesson',lesson.why,...lesson.actions,...lesson.deeper.flat(),lesson.tip].join(' ')})),
    ...stages.map(stage=>({href:`#tool/${stage.id}`,title:`${stage.title}: your worksheet`,description:stage.output,terms:['worksheet analysis working session',stage.id,stage.description,...stage.instructions].join(' ')})),
    ...stages.map(stage=>({href:`#example/${stage.id}`,title:`${stage.title}: worked example`,description:examples[stage.id].title,terms:['Luma fictional worked example',stage.id,examples[stage.id].body,...examples[stage.id].points.flat()].join(' ')})),
    ...utilityEntries,
    ...sourceSections.map(section=>({href:`#source/${section.id}`,title:section.title,description:'From the complete source guide.',terms:section.text}))
  ].map(decorate);
  return entries.filter(entry=>[entry.title,entry.description,entry.path,entry.terms].join(' ').toLowerCase().includes(q));
}
