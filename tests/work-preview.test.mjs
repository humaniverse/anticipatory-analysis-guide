import test from 'node:test';
import assert from 'node:assert/strict';
import {blankSession, newTrend, emptyBrief, validateSession, exportMarkdown} from '../dist/session.js';
import {stages, briefFields} from '../dist/content.js';
import {previewModel, renderPreview, previewTargets, exampleEntries, exampleKeyForField, renderCompanionExample, fieldId} from '../dist/work-preview.js';

function deepFreeze(value) {
  if (value && typeof value === 'object') { Object.values(value).forEach(deepFreeze); Object.freeze(value); }
  return value;
}
function fixture() {
  const session = blankSession();
  session.trends = [
    {...newTrend('rain'), title:'Changing rainfall', likelihood:'Medium', impact:'High', shortlist:true, evidence:'Station log\n1 October', uncertainty:'Limited coverage', outlook:'Planting could be delayed', votes:3},
    {...newTrend('market'), title:'Market access', likelihood:'Low', watch:true},
    {...newTrend('retained'), title:'Retained idea'}
  ];
  session.briefing.trends.retained = {...emptyBrief(), summary:'Keep this draft'};
  return session;
}

test('All five previews are pure for empty and partial sessions, including missing drafts', () => {
  for (const original of [blankSession(), fixture()]) {
    const session = deepFreeze(original);
    const before = JSON.stringify(session), markdown = exportMarkdown(session);
    for (const stage of stages) {
      const model = previewModel(session, stage.id);
      assert.ok(renderPreview(model).length > 0);
      assert.equal(JSON.stringify(session), before);
      assert.equal(exportMarkdown(session), markdown);
    }
    assert.deepEqual(validateSession(JSON.parse(before)), session);
    assert.equal(session.briefing.trends.rain, undefined);
  }
});

test('Trend selection follows a valid id and falls back after removal without altering raw text', () => {
  const session = fixture();
  assert.equal(previewModel(session,'scan','market').activeId, 'market');
  session.trends[0].title = '  ';
  const model = previewModel(session,'scan','removed');
  assert.equal(model.activeId, 'rain');
  assert.equal(model.sections[0].children[0].value, '  ');
  assert.ok(renderPreview(model).includes('Not recorded yet.'));
  assert.ok(renderPreview(model).includes('Station log\n1 October'));
  session.trends = [];
  assert.equal(previewModel(session,'scan','rain').activeId, '');
});

test('Only fully assessed trends enter the qualitative matrix; watch lists include unplaced trends', () => {
  const empty = renderPreview(previewModel(blankSession(), 'prioritise'));
  assert.ok(empty.includes('Add a trend in Scan'));
  assert.ok(!empty.includes('Every trend has both'));
  const model = previewModel(fixture(), 'prioritise', 'market');
  const html = renderPreview(model);
  assert.equal((html.match(/class="matrix-trend"/g) || []).length, 1);
  assert.ok(html.includes('Edit assessment: Changing rainfall'));
  assert.deepEqual(model.sections.find(s=>s.key==='unassessed').children.map(s=>s.title), ['Market access','Retained idea']);
  assert.deepEqual(model.sections.find(s=>s.key==='watch-list').children.map(s=>s.title), ['Market access']);
  assert.equal(model.sections.find(s=>s.key==='assessment').children.find(s=>s.path.endsWith('.votes')).value, 0);
});

test('Causal previews preserve assumptions, alternatives, shortlist and narrative', () => {
  const session = fixture();
  Object.assign(session.narrative, {story:'Conditional story', driver:'Seasonal variability', driverAssumption:'Planting overlaps the rains', consequenceAssumption:'Income is not replaced', alternative:'Temporary variability'});
  const model = previewModel(session, 'narrative');
  const html = renderPreview(model);
  for (const value of Object.values(session.narrative).filter(Boolean)) assert.ok(html.includes(value));
  assert.deepEqual(model.sections.find(s=>s.key==='shortlist').children.map(s=>s.title), ['Changing rainfall']);
  assert.equal(previewTargets(model).filter(t=>t.path.startsWith('narrative.')).length, 8);
});

test('Briefings preserve retained drafts separately and review links edit the original writing fields', () => {
  const session = fixture();
  session.briefing.intro = 'Opening\n\nSecond paragraph';
  session.briefing.conclusion = 'Closing';
  session.review.notes = 'Narrow the geographic claim';
  session.review.checks[0] = true;
  for (const stage of ['write','review']) {
    const model = previewModel(session, stage);
    assert.ok(model.sections.find(s=>s.key==='retained'));
    const html = renderPreview(model);
    for (const text of ['Opening\n\nSecond paragraph','Closing','Keep this draft','not shortlisted']) assert.ok(html.includes(text));
    const targets = previewTargets(model);
    assert.ok(targets.some(t=>t.stage==='write'&&t.path==='brief.rain.summary'));
    assert.ok(targets.some(t=>t.stage==='write'&&t.path==='brief.retained.summary'));
    if (stage==='review') {
      assert.ok(html.includes('1 of 12 reviewed'));
      assert.ok(html.includes('Narrow the geographic claim'));
      assert.equal(targets.filter(t=>t.path.startsWith('review.checks.')).length, 0);
      assert.equal(model.sections.find(s=>s.key==='review-checks').children, undefined);
      assert.ok(!html.includes('Not yet reviewed'));
      assert.ok(html.includes('Completion is not a quality score.'));
    }
  }
});

test('User text and selector labels are escaped, while paragraph breaks and numeric zero survive', () => {
  const session = fixture();
  session.trends[0].title = '<img src=x onerror="bad()">';
  session.trends[0].evidence = 'A & B\n<script>bad()</script>';
  const html = renderPreview(previewModel(session, 'scan'));
  assert.ok(!html.includes('<img'));
  assert.ok(!html.includes('<script'));
  assert.ok(html.includes('&lt;img'));
  assert.ok(html.includes('A &amp; B\n&lt;script&gt;'));
});

test('Every generated edit target corresponds to a worksheet field, and every example key resolves', () => {
  const session = fixture();
  const fields = {
    scan:new Set(session.trends.flatMap(t=>['title','category','direction','evidence','uncertainty','outlook'].map(key=>`trend.${t.id}.${key}`))),
    prioritise:new Set(session.trends.flatMap(t=>['proposition','likelihood','impact','votes','rationale','watch'].map(key=>`trend.${t.id}.${key}`))),
    narrative:new Set([...session.trends.map(t=>`trend.${t.id}.shortlist`), ...Object.keys(session.narrative).map(key=>`narrative.${key}`)]),
    write:new Set(['briefing.intro','briefing.conclusion',...session.trends.filter(t=>t.shortlist||session.briefing.trends[t.id]).flatMap(t=>briefFields.map(([key])=>`brief.${t.id}.${key}`))]),
    review:new Set(['review.notes',...session.review.checks.map((_,index)=>`review.checks.${index}`)])
  };
  for (const {id} of stages) {
    const entries = exampleEntries(id);
    for (const target of previewTargets(previewModel(session,id))) assert.ok(fields[target.stage].has(target.path), JSON.stringify(target));
    for (const path of fields[id]) {
      const key = exampleKeyForField(id,path);
      assert.ok(entries.some(entry=>entry.key===key), `${id}: ${path}`);
      assert.ok(renderCompanionExample(id).includes(`id="companion-example-${id}-${key}"`));
      assert.ok(fieldId(path).startsWith('f-'));
    }
    assert.equal(new Set(entries.map(e=>e.key)).size, entries.length);
    assert.ok(renderCompanionExample(id).includes('Fictional Luma example'));
  }
  assert.ok(!exportMarkdown(session).includes('Luma'));
  assert.throws(()=>previewModel(session,'missing'));
});
