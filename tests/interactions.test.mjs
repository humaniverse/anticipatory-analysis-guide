import test from 'node:test';
import assert from 'node:assert/strict';
import {createMotion, createStageViewMemory} from '../dist/interactions.js';
import {caseStage, observationExplorer} from '../dist/atlas.js';
import {blankSession, newTrend} from '../dist/session.js';
import {previewModel, renderPreview} from '../dist/work-preview.js';

function motionFixture(reduced = false) {
  const media = new EventTarget();
  media.matches = reduced;
  const calls = [], animations = [];
  const element = {
    animate(frames, options) {
      calls.push({frames, options});
      const animation = new EventTarget();
      animation.cancelled = false;
      animation.cancel = () => { animation.cancelled = true; animation.dispatchEvent(new Event('cancel')); };
      animations.push(animation);
      return animation;
    },
    scrollIntoView(options) { calls.push(options); }
  };
  return {media, element, calls, animations, motion:createMotion(media)};
}

test('Reduced motion skips effects and explicit smooth scrolling, including after a live preference change', () => {
  const {media, element, calls, animations, motion} = motionFixture();
  motion.settleTrend(element);
  motion.stageContent(element);
  motion.scrollIntoView(element, {block:'nearest', behavior:'smooth'});
  media.matches = true;
  media.dispatchEvent(new Event('change'));
  assert.ok(animations.every(animation => animation.cancelled));
  assert.deepEqual(calls.at(-1), {block:'nearest', behavior:'instant'});
  motion.settleTrend(element);
  motion.stageContent(element);
  assert.equal(animations.length, 2);
  motion.scrollIntoView(element, {block:'nearest', behavior:'smooth'});
  assert.deepEqual(calls.at(-1), {block:'nearest', behavior:'instant'});
  const reduced = motionFixture(true);
  reduced.motion.settleTrend(reduced.element);
  assert.equal(reduced.animations.length, 0);
  media.matches = false;
  media.dispatchEvent(new Event('change'));
  motion.stageContent(element);
  assert.equal(animations.length, 3);
});

test('Navigation cancels pending effects; completed effects and missing animation support are harmless', () => {
  const {element, animations, motion} = motionFixture();
  motion.settleTrend(element);
  motion.stageContent(element);
  animations[0].dispatchEvent(new Event('finish'));
  motion.cancel();
  assert.equal(animations[0].cancelled, false);
  assert.equal(animations[1].cancelled, true);
  assert.doesNotThrow(() => motion.stageContent({}));
  assert.doesNotThrow(() => motion.cancel());
});

test('Stage reading memory restores both open and closed sections by identity, excluding the companion', () => {
  const detail = (id, open = false, companion = false) => ({id, open, dataset:{}, querySelector:() => null, closest:() => companion ? {} : null});
  let nodes = [detail('one',true), detail('two'), detail('companion',true,true)];
  const memory = createStageViewMemory({querySelectorAll:() => nodes});
  const scan = {valid:true,view:'tool',id:'scan'};
  memory.capture(scan, 420);
  nodes = [detail('two',true), detail('new',true), detail('one'), detail('companion',false,true)];
  assert.equal(memory.restore(scan), 420);
  assert.deepEqual(nodes.map(node => node.open), [false,true,true,false]);
  assert.equal(memory.restore({...scan,view:'example'}), null);
  memory.clear();
  assert.equal(memory.restore(scan), null);
  assert.equal(memory.isStage({...scan,id:'purpose'}), false);
});

test('The fictional pathway reuses dated observations and identifies the unsupported food-access inference', () => {
  const pathway = caseStage('narrative');
  for (const index of [0,1]) {
    const observation = observationExplorer(index);
    const quote = observation.match(/class="observation-quote">([^<]+)/)[1];
    assert.ok(pathway.includes(quote));
  }
  for (const text of ['1 October','4 October','Coverage limit','do not establish causality','Evidence B: livelihood context','No direct evidence of food-access effects']) assert.ok(pathway.includes(text));
  assert.ok(caseStage('review').includes('Interpretation after review'));
});

test('Preview labels distinguish evidence, explicit assumptions and interpretations from general uncertainty', () => {
  const session = blankSession();
  session.trends.push({...newTrend('rain'),shortlist:true});
  const scan = previewModel(session,'scan').sections[0].children;
  assert.equal(scan.find(field => field.path.endsWith('.uncertainty')).tone, '');
  assert.ok(renderPreview(previewModel(session,'scan')).includes('Interpretation: Outlook'));
  const narrative = renderPreview(previewModel(session,'narrative'));
  assert.ok(narrative.includes('Assumption: driver to trend'));
  assert.ok(narrative.includes('Interpretation: Possible humanitarian consequence'));
  const draft = previewModel(session,'write').sections.find(section => section.key === 'briefing').children.find(section => section.key === 'brief-rain');
  assert.equal(draft.children.find(field => field.path.endsWith('.uncertainties')).tone, '');
  assert.equal(draft.children.find(field => field.path.endsWith('.evidence')).tone, 'evidence');
});
