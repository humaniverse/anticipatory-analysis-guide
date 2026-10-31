import {agendaDefaults, briefFields, checklist, categories, directions, lessons} from './content.js';
export const STORAGE_KEY = 'anticipatory-field-guide.session.v1';
export const levels = ['Low','Medium','High'];
export function blankSession() {
  return {version:1, updatedAt:new Date().toISOString(), context:{question:'',audience:'',decisions:'',geography:'',horizon:''},trends:[],narrative:{relationships:'',story:'',driver:'',trend:'',consequence:'',driverAssumption:'',consequenceAssumption:'',alternative:''},briefing:{intro:'',conclusion:'',trends:{}},review:{notes:'',checks:Array(12).fill(false)},agenda:agendaDefaults.map(([title,minutes])=>({title,minutes})),lessonDone:[]};
}
export function newTrend(id = globalThis.crypto.randomUUID()) {
  return {id,title:'',category:'Environmental',direction:'Difficult to assess',evidence:'',uncertainty:'',outlook:'',proposition:'',likelihood:'',impact:'',rationale:'',votes:0,watch:false,shortlist:false};
}
export function emptyBrief() { return Object.fromEntries(briefFields.map(([key])=>[key,''])); }
const stringKeys = {context:['question','audience','decisions','geography','horizon'],narrative:['relationships','story','driver','trend','consequence'],trend:['title','evidence','uncertainty','outlook','proposition','rationale']};
function object(value) {if(!value || typeof value!=='object' || Array.isArray(value))throw new Error('Expected a session object.');return value;}
function str(value) {if(typeof value!=='string' || value.length>100000)throw new Error('A text field is missing or too large.');return value;}
function bool(value) {if(typeof value!=='boolean')throw new Error('Invalid checkbox value.');return value;}
function choice(value,values) {if(!values.includes(value))throw new Error('An option is not recognised.');return value;}
function int(value,min,max) {if(!Number.isInteger(value)||value<min||value>max)throw new Error('A number is outside the supported range.');return value;}
function fields(source,keys) {object(source); return Object.fromEntries(keys.map(key=>[key,str(source[key])]));}
export function validateSession(raw) {
  object(raw); if(raw.version!==1)throw new Error('This backup uses an unsupported version.');
  const result=blankSession();
  result.context=fields(raw.context,stringKeys.context);
  result.narrative=fields(raw.narrative,stringKeys.narrative);
  // These fields were added to version one; older backups remain valid.
  for(const key of ['driverAssumption','consequenceAssumption','alternative'])result.narrative[key]=raw.narrative[key]===undefined?'':str(raw.narrative[key]);
  if(!Array.isArray(raw.trends)||raw.trends.length>200)throw new Error('The backup must contain no more than 200 trends.');
  const ids=new Set();
  result.trends=raw.trends.map(t=>{
    object(t); const id=str(t.id);
    if(!/^[a-zA-Z0-9-]{1,80}$/.test(id)||ids.has(id))throw new Error('Trend identifiers are invalid or duplicated.');
    ids.add(id);
    return {id,...fields(t,stringKeys.trend),category:choice(t.category,categories),direction:choice(t.direction,directions),likelihood:choice(t.likelihood,['',...levels]),impact:choice(t.impact,['',...levels]),votes:int(t.votes,0,999),watch:bool(t.watch),shortlist:bool(t.shortlist)};
  });
  object(raw.briefing); object(raw.briefing.trends);
  result.briefing={intro:str(raw.briefing.intro),conclusion:str(raw.briefing.conclusion),trends:{}};
  for(const [id,brief] of Object.entries(raw.briefing.trends)) {
    if(!ids.has(id))throw new Error('A briefing refers to a missing trend.');
    Object.defineProperty(result.briefing.trends,id,{value:fields(brief,briefFields.map(([key])=>key)),enumerable:true,writable:true,configurable:true});
  }
  object(raw.review);
  if(!Array.isArray(raw.review.checks)||raw.review.checks.length!==12)throw new Error('The twelve-item checklist is incomplete.');
  result.review={notes:str(raw.review.notes),checks:raw.review.checks.map(bool)};
  if(!Array.isArray(raw.agenda)||raw.agenda.length!==7)throw new Error('The agenda must contain seven entries.');
  result.agenda=raw.agenda.map(a=>({title:str(object(a).title),minutes:int(a.minutes,0,1440)}));
  if(!Array.isArray(raw.lessonDone))throw new Error('Reading progress is invalid.');
  result.lessonDone=[...new Set(raw.lessonDone.map(id=>choice(id,lessons.map(l=>l.id))))];
  result.updatedAt=typeof raw.updatedAt==='string'&&!Number.isNaN(Date.parse(raw.updatedAt))?raw.updatedAt:new Date().toISOString();
  return result;
}
export function loadSession(storage) {
  try {const raw=storage.getItem(STORAGE_KEY); return {session:raw?validateSession(JSON.parse(raw)):blankSession(),available:true,warning:''};}
  catch(error) {return {session:blankSession(),available:false,warning:'Saved work could not be read. Use a backup to restore it; download your work before leaving.'};}
}
export function saveSession(storage,session) {
  session.updatedAt=new Date().toISOString();
  try {storage.setItem(STORAGE_KEY,JSON.stringify(session));return true;}catch{return false;}
}
const value=s=>s?.trim()||'Not recorded';
export function worksheetSections(s) {
  const sections=[{title:'Session brief',text:Object.entries(s.context).map(([key,v])=>`${key.charAt(0).toUpperCase()+key.slice(1)}: ${value(v)}`).join('\n\n')}];
  for(const [i,t] of s.trends.entries()) {
    sections.push({title:`Trend ${i+1}: ${value(t.title)}`,text:[`Category: ${t.category}`,`Direction: ${t.direction}`,`Evidence and source dates: ${value(t.evidence)}`,`Uncertainty: ${value(t.uncertainty)}`,`Outlook: ${value(t.outlook)}`,`Proposition assessed: ${value(t.proposition)}`,`Likelihood: ${value(t.likelihood)} | Impact: ${value(t.impact)}`,`Rationale: ${value(t.rationale)}`,`Workshop votes: ${t.votes} (manually entered; not a risk score)`,`Watch list: ${t.watch?'Yes':'No'} | Shortlisted: ${t.shortlist?'Yes':'No'}`].join('\n\n')});
  }
  sections.push({title:'Narrative and causal pathway',text:[`Relationships and overlaps: ${value(s.narrative.relationships)}`,`Overarching story: ${value(s.narrative.story)}`,`Driver: ${value(s.narrative.driver)}\n→ Trend: ${value(s.narrative.trend)}\n→ Possible consequence: ${value(s.narrative.consequence)}`,`Assumption between driver and trend: ${value(s.narrative.driverAssumption)}`,`Assumption between trend and consequence: ${value(s.narrative.consequenceAssumption)}`,`Alternative interpretation: ${value(s.narrative.alternative)}`].join('\n\n')});
  sections.push({title:'Briefing introduction',text:value(s.briefing.intro)});
  for(const t of s.trends) {
    if(t.shortlist||s.briefing.trends[t.id]) {
      const b=s.briefing.trends[t.id]||emptyBrief();
      sections.push({title:`Briefing: ${value(t.title)}${t.shortlist?'':' (not currently shortlisted)'}`,text:briefFields.map(([key,label])=>`${label}\n${value(b[key])}`).join('\n\n')});
    }
  }
  sections.push({title:'Briefing conclusion',text:value(s.briefing.conclusion)});
  sections.push({title:'Review and revision notes',text:value(s.review.notes)});
  sections.push({title:'Final checklist',text:'Checked means reviewed, not a guarantee of analytical quality.\n\n'+checklist.map(([label,q],i)=>`${s.review.checks[i]?'[x]':'[ ]'} ${label}: ${q}`).join('\n\n')});
  sections.push({title:'Workshop agenda',text:'Adaptable timings; not a prescribed schedule from the source guide.\n\n'+s.agenda.map(a=>`${a.title}: ${a.minutes} minutes`).join('\n')+`\nTotal: ${s.agenda.reduce((sum,a)=>sum+a.minutes,0)} minutes`});
  return sections;
}
export function exportMarkdown(s) {
  return '# Anticipatory analysis working session\n\n'+`Exported ${new Date().toISOString().slice(0,10)}\n\n`+worksheetSections(s).map(x=>`## ${x.title}\n\n${x.text}`).join('\n\n')+'\n\n---\nMethod adapted from A practical guide to rapid anticipatory humanitarian analysis. This export contains user-entered work; fictional learning examples are excluded.\n';
}
