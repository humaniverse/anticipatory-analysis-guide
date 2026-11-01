import {briefFields, examples, stages} from './content.js';
import {levels} from './session.js';

export const escapeText = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export const fieldId = path => 'f-' + path.replace(/[^a-zA-Z0-9-]/g, '-');
const titleOf = (trend, index) => trend.title.trim() || `Untitled trend ${index + 1}`;
const field = (stage, path, title, value, tone = '') => ({kind:'field', key:path, stage, path, title, value, tone});
const group = (key, title, children, kind = 'group') => ({kind, key, title, children});

// Presentation only: never fill in, normalise or otherwise modify a saved session.
export function previewModel(session, stage, activeId = '') {
  if (!stages.some(item => item.id === stage)) throw new Error('Unknown worksheet stage.');
  const trends = session.trends.map((trend, index) => ({...trend, rawTitle:trend.title, title:titleOf(trend, index)}));
  const active = trends.find(trend => trend.id === activeId) || trends[0] || null;
  const sections = [];
  const trendField = (key, label, tone = '') => field(stage, `trend.${active.id}.${key}`, label, key === 'title' ? active.rawTitle : active[key], tone);
  if (stage === 'scan' && active) {
    sections.push(group('trend-card', 'Your trend card', [
      trendField('title', 'Trend'), trendField('category', 'STEEP category'), trendField('direction', 'Direction'),
      trendField('evidence', 'Evidence and source dates', 'evidence'),
      trendField('uncertainty', 'Uncertainty'), trendField('outlook', 'Outlook', 'interpretation')
    ]));
  }
  if (stage === 'prioritise') {
    sections.push({kind:'matrix', key:'matrix', title:'Prioritisation matrix', trends, activeId:active?.id || '', activeTitle:active?.title || ''});
    const trendList = (key, title, items, target) => ({...group(key, title, items.map(t => field(stage, `trend.${t.id}.${target}`, t.title, target === 'watch' ? 'On the watch list' : 'Choose both likelihood and impact.'))), emptyMessage:key === 'unassessed' && !trends.length ? 'Add a trend in Scan to begin comparing possibilities.' : ''});
    const unassessed = trendList('unassessed', 'Not yet placed', trends.filter(t => !t.likelihood || !t.impact), 'likelihood');
    unassessed.children = unassessed.children.map(item => ({...item, kind:'unplaced-trend', trend:trends.find(t => item.path === `trend.${t.id}.likelihood`), activeId:active?.id || ''}));
    sections.push(unassessed);
    sections.push(trendList('watch-list', 'Watch list', trends.filter(t => t.watch), 'watch'));
    if (active) sections.push(group('assessment', active.title, [
      trendField('proposition', 'Proposition and time horizon'), trendField('likelihood', 'Likelihood'),
      trendField('impact', 'Humanitarian impact'), trendField('rationale', 'Reasoning and affected people'),
      trendField('votes', 'Workshop dot-votes')
    ]));
  }
  if (stage === 'narrative') {
    sections.push(group('shortlist', 'Your shortlist', trends.filter(t => t.shortlist).map(t => field(stage, `trend.${t.id}.shortlist`, t.title, 'Selected for the story'))));
    for (const [key, label] of [['relationships','Relationships and missing perspectives'],['story','The overarching story']]) sections.push(field(stage, `narrative.${key}`, label, session.narrative[key]));
    const nodes = [];
    for (const [key, label, assumption] of [['driver','Underlying driver','driverAssumption'],['trend','Changing trend','consequenceAssumption'],['consequence','Possible humanitarian consequence',null]]) {
      nodes.push(field(stage, `narrative.${key}`, label, session.narrative[key], key === 'consequence' ? 'interpretation' : ''));
      if (assumption) nodes.push(group(assumption, key === 'driver' ? 'Assumption: driver to trend' : 'Assumption: trend to consequence', [field(stage, `narrative.${assumption}`, 'What does this connection depend on?', session.narrative[assumption], 'assumption')], 'disclosure'));
    }
    nodes.push(group('alternative', 'Another interpretation', [field(stage, 'narrative.alternative', 'Alternative explanation', session.narrative.alternative, 'interpretation')], 'disclosure'));
    sections.push(group('pathway', 'Your proposed pathway', nodes, 'pathway'));
  }
  if (stage === 'write' || stage === 'review') {
    const draft = [field('write', 'briefing.intro', 'Introduction', session.briefing.intro)];
    const trendDraft = t => group(`brief-${t.id}`, t.title, briefFields.map(([key, label]) => field('write', `brief.${t.id}.${key}`, label, session.briefing.trends[t.id]?.[key] || '', key === 'evidence' ? 'evidence' : ['summary','consequences'].includes(key) ? 'interpretation' : '')));
    draft.push(...trends.filter(t => t.shortlist).map(trendDraft));
    draft.push(field('write', 'briefing.conclusion', 'Conclusion', session.briefing.conclusion));
    if (stage === 'review') {
      sections.push(field('review', 'review.notes', 'Revision notes and unresolved questions', session.review.notes));
      sections.push({kind:'review-summary', key:'review-checks', title:`${session.review.checks.filter(Boolean).length} of 12 reviewed`});
    }
    sections.push(group('briefing', 'Your current briefing', draft, 'briefing'));
    const retained = trends.filter(t => !t.shortlist && session.briefing.trends[t.id]);
    if (retained.length) sections.push(group('retained', 'Retained drafts · not shortlisted', retained.map(trendDraft), 'disclosure'));
  }
  return {stage, activeId:active?.id || '', trends, sections};
}

export function previewTargets(model) {
  const result = [];
  const visit = section => {
    if (section.path) result.push({stage:section.stage, path:section.path});
    if (section.kind === 'matrix') for (const trend of section.trends) result.push({stage:'prioritise', path:`trend.${trend.id}.proposition`});
    section.children?.forEach(visit);
  };
  model.sections.forEach(visit);
  return result;
}

function editButton(stage, path, label) {
  return `<button type="button" class="preview-edit" data-companion="edit" data-stage="${stage}" data-path="${escapeText(path)}" aria-label="Edit ${escapeText(label)}">Edit</button>`;
}
function trendButton(trend, activeId) {
  return `<button type="button" class="matrix-trend" data-key="${escapeText(trend.id)}" data-companion="choose-trend" data-trend-id="${escapeText(trend.id)}" aria-pressed="${trend.id === activeId}" aria-label="Select trend: ${escapeText(trend.title)}" aria-describedby="matrix-instructions">${escapeText(trend.title)}</button>`;
}
function renderSection(section) {
  const {key, title, kind} = section;
  const safeKey = escapeText(key);
  if (kind === 'unplaced-trend') return `<section class="preview-field preview-unplaced-trend" data-key="${safeKey}"><div class="preview-field-heading">${trendButton(section.trend, section.activeId)}${editButton(section.stage, section.path, title)}</div><p class="preview-note">Choose a cell or drag this trend into the matrix.</p></section>`;
  if (kind === 'review-summary') return `<section class="preview-group" data-key="${safeKey}"><h3>${escapeText(title)}</h3><p class="preview-note">Completion is not a quality score.</p></section>`;
  if (kind === 'field') {
    const empty = section.value === '' || section.value == null || (typeof section.value === 'string' && !section.value.trim());
    return `<section class="preview-field ${section.tone || ''}" data-key="${safeKey}"><div class="preview-field-heading"><h4>${escapeText(section.tone && !title.toLowerCase().startsWith(section.tone) ? `${section.tone[0].toUpperCase()+section.tone.slice(1)}: ${title}` : title)}</h4>${editButton(section.stage, section.path, title)}</div><p class="preview-value${empty ? ' preview-empty' : ''}">${empty ? 'Not recorded yet.' : escapeText(section.value)}</p></section>`;
  }
  if (kind === 'matrix') {
    const active = section.trends.find(t => t.id === section.activeId);
    const cells = [...levels].reverse().flatMap(impact => levels.map(likelihood => {
      const selected = active?.impact === impact && active?.likelihood === likelihood;
      return `<div class="matrix-cell${impact === 'High' && likelihood === 'High' ? ' matrix-high' : ''}${selected ? ' matrix-selected' : ''}" data-key="cell-${impact}-${likelihood}" data-impact="${impact}" data-likelihood="${likelihood}"><button type="button" class="matrix-place" data-companion="place-trend" aria-label="${escapeText(section.activeTitle ? `Place ${section.activeTitle}` : 'Place selected trend')}: ${likelihood.toLowerCase()} likelihood, ${impact.toLowerCase()} impact" aria-describedby="matrix-instructions" ${section.activeId ? '' : 'disabled'}><span class="cell-label">${impact} impact<br>${likelihood.toLowerCase()} likelihood</span></button>${section.trends.filter(t => t.impact === impact && t.likelihood === likelihood).map(t => trendButton(t, section.activeId)).join('')}</div>`;
    })).join('');
    return `<section data-key="matrix" class="preview-matrix"><h3>${escapeText(title)}</h3><p class="preview-note">Qualitative judgements for discussion. Votes are entered manually; neither is a risk score.</p><p class="preview-note" id="matrix-instructions">Select a trend, then click a cell to set its likelihood and impact, or drag the trend into a cell. You can also use Tab and Enter or Space.</p><div class="matrix-wrap"><div class="matrix-y-label">Humanitarian impact ↑</div><div class="matrix-grid">${cells}</div><div class="matrix-x-label">Likelihood →</div></div></section>`;
  }
  const content = section.children.map(renderSection).join('') || `<p class="preview-empty">${section.emptyMessage || (key === 'shortlist' ? 'Select trends in the worksheet to bring them into the story.' : key === 'watch-list' ? 'No trends on the watch list yet.' : 'Every trend has been prioritised.')}</p>`;
  if (kind === 'disclosure') return `<details class="preview-disclosure" data-key="${safeKey}"><summary>${escapeText(title)}</summary>${content}</details>`;
  return `<section class="preview-group preview-${kind}" data-key="${safeKey}"><h3>${escapeText(title)}</h3>${kind === 'pathway' ? '<p class="preview-note">Proposed connections, not proof of causality.</p>' : ''}${content}</section>`;
}

export function renderPreview(model) {
  const selector = ['scan','prioritise'].includes(model.stage) && model.trends.length ? `<div class="preview-selector" data-key="selector"><label for="preview-trend">${model.stage === 'scan' ? 'Previewing trend' : 'Selected assessment'}</label><select id="preview-trend" data-companion="select-trend">${model.trends.map(t => `<option value="${escapeText(t.id)}" ${t.id === model.activeId ? 'selected' : ''}>${escapeText(t.title)}</option>`).join('')}</select></div>` : '';
  const empty = model.stage === 'scan' && !model.trends.length ? '<div class="preview-start" data-key="empty"><h3>A trend starts with an observation.</h3><p>Your card will take shape here as you record what is changing, its evidence and its outlook.</p></div>' : '';
  return selector + empty + model.sections.map(renderSection).join('');
}

// Excerpts remain sourced from the existing fictional case. Notes explain the method.
const notes = {
  scan:['Names a pattern of change rather than a single event.','Acknowledges the limits of a short record.','Keeps observations, dates and their fictional sources visible.','Makes gaps and uneven coverage explicit.','Connects an outlook to mechanisms and conditions.'],
  prioritise:['Names the proposition before assigning qualitative labels.','Explains the judgement rather than treating it as a score.','Keeps other candidate trends available for comparison.','Retains an important outlier for monitoring.','Uses voting to inform a discussion, not settle it automatically.'],
  narrative:['Starts with a driver that could explain the change.','Names the intervening change.','Identifies whose circumstances could be affected.','Names conditions that could interrupt the proposed pathway.','Brings the connections together into a conditional account.'],
  write:['Identifies people who affect or experience the change.','Makes the source basis available for scrutiny.','Keeps a competing explanation in view.','Names observations that could change the assessment.','Connects the analysis to an audience without overreaching.'],
  review:['Tests the scope of the claim against its evidence.','Shows how challenge changes the wording.','Keeps the remaining knowledge gap visible.','Connects review to future observations and responsibility.','Values a more defensible conclusion.']
};
const fieldExamples = {
  scan:{title:0,category:0,direction:1,evidence:2,uncertainty:3,outlook:4},
  prioritise:{proposition:0,likelihood:0,impact:0,rationale:1,watch:3,votes:4},
  narrative:{shortlist:4,relationships:4,story:4,driver:0,trend:1,consequence:2,driverAssumption:3,consequenceAssumption:3,alternative:3},
  write:{intro:'overview',summary:'overview',conclusion:'overview',consequences:'overview',actors:0,evidence:1,uncertainties:2,indicators:3,considerations:4},
  review:{notes:1,checks:0}
};
export function exampleKeyForField(stage, path) {
  const parts = path.split('.');
  const key = parts[0] === 'review' && parts[1] === 'checks' ? 'checks' : parts.at(-1);
  return String(fieldExamples[stage]?.[key] ?? 'overview');
}
export function exampleEntries(stage) {
  const source = examples[stage];
  return [{key:'overview', title:source.title, excerpt:source.body, note:'Follow the reasoning, then apply the structure to your own question.'}, ...source.points.map(([title, excerpt], index) => ({key:String(index), title, excerpt, note:notes[stage][index]}))];
}
export function renderCompanionExample(stage) {
  return `<p class="companion-fiction"><strong>Fictional example</strong>All places, sources and assessments below are invented. They stay separate from your work.</p>${exampleEntries(stage).map(entry => `<section class="companion-example" id="companion-example-${stage}-${entry.key}" tabindex="-1"><h3>${escapeText(entry.title)}</h3><blockquote>${escapeText(entry.excerpt)}</blockquote><p class="example-reason"><span>Why this helps</span>${escapeText(entry.note)}</p></section>`).join('')}<a class="text-link" href="#example/${stage}">Read the complete worked example</a>`;
}
