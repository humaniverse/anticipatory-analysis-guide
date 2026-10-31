import {stages} from './content.js';
// Illustrations and fictional learning material. Nothing here is added to a working session.
const observations = [
  {letter:'A',title:'Uneven rainfall',source:'Station summary',date:'1 October',quote:'The onset and distribution of seasonal rain have become less reliable in the station record.',reading:'A pattern worth investigating. One short record cannot establish a lasting change across the region.',question:'Does the pattern hold beyond this station?',position:[236,106]},
  {letter:'B',title:'Planting disruption',source:'Responder discussion',date:'4 October',quote:'Some farmers describe interrupted planting and less predictable agricultural income.',reading:'A possible connection between rainfall and livelihoods. The discussion does not establish how widespread the disruption is.',question:'Which households have other sources of income?',position:[154,226]},
  {letter:'C',title:'Local accounts differ',source:'Accounts within the example',date:'Coverage unknown',quote:'Local accounts vary. The short station record may not represent the whole coastal region.',reading:'An important limit on the assessment. Different conditions and coping options could produce different outcomes.',question:'Whose experience is missing from the evidence?',position:[358,216]}
];

export function lumaMap(selected=0) {
  return `<svg class="luma-map" viewBox="0 0 600 330" role="img" aria-labelledby="luma-map-title luma-map-desc">
    <title id="luma-map-title">Luma, a fictional coastal region</title>
    <desc id="luma-map-desc">A schematic coastline with a station, planting area and coastal settlements. Observation ${observations[selected].letter}, ${observations[selected].title.toLowerCase()}, is highlighted. Locations illustrate the case; they are not geographic evidence.</desc>
    <defs><pattern id="sea-lines" width="22" height="22" patternUnits="userSpaceOnUse"><path d="M0 21h22" stroke="#c8dbe9" stroke-width=".6"/></pattern><pattern id="field-lines" width="14" height="14" patternUnits="userSpaceOnUse" patternTransform="rotate(-24)"><path d="M0 0v14" stroke="#b5c1a5" stroke-width="3"/></pattern></defs>
    <path fill="#dfecf4" d="M0 0h600v330H0z"/><path fill="url(#sea-lines)" d="M0 0h600v330H0z"/>
    <path d="M0 0h346c-5 23-42 36-29 61 13 27 72 35 62 62-12 34-73 30-63 65 9 29 72 24 83 55 13 37-34 58-18 87H0z" fill="#f7f9f4"/>
    <g fill="none" stroke="#dce3d6" stroke-width="1.2"><path d="M-20 55c89-93 256-4 264 70S80 186 91 285"/><path d="M-20 76c91-88 235-8 240 48S59 183 69 294"/><path d="M-20 99c82-88 214-8 215 33S40 186 46 302"/><path d="M-20 122c81-90 192-13 194 17S15 195 23 313"/><path d="M91-20c109 7 191 41 188 120s-51 112-11 173"/><path d="M121-20c107 21 183 45 180 123s-39 100 1 171"/></g>
    <path d="M346 0c-5 23-42 36-29 61 13 27 72 35 62 62-12 34-73 30-63 65 9 29 72 24 83 55 13 37-34 58-18 87" fill="none" stroke="#6d91aa" stroke-width="2"/>
    <path d="M332 18c-20 21-38 43-20 65M396 140c-20 21-58 22-60 48M418 253c4 23-30 43-17 66" fill="none" stroke="#adc9db" stroke-width="1"/>
    <path d="M120 186l66-16 33 65-69 22z" fill="#e8edda"/><path d="M120 186l66-16 33 65-69 22z" fill="url(#field-lines)"/>
    <path d="M224 81c22-3 52 8 56 30s-31 47-49 42-41-56-7-72z" fill="#dbe8f3" fill-opacity=".6" stroke="#7197b7" stroke-dasharray="4 5"/>
    <path d="M238 106c-7 48-58 48-80 95s40 88 44 129M158 202c57 3 132-30 200 14" fill="none" stroke="#bbab8d" stroke-width="2" stroke-dasharray="4 4"/>
    <path d="M76 0c4 60 80 61 70 108s-58 69-30 116 9 74-3 106" fill="none" stroke="#a7c9d8" stroke-width="3"/>
    <g fill="#bac8d0"><path d="M337 229h7v8h-7zM347 239h9v7h-9zM365 234h8v8h-8zM370 250h7v7h-7zM347 255h7v6h-7z"/></g>
    <g font-family="Commissioner, sans-serif" fill="#536c7c" font-size="13"><text x="48" y="44">Inland hills</text><text x="89" y="277">Planting area</text><text x="386" y="211">Coastal settlements</text><text x="277" y="82">Station</text><text x="453" y="102" fill="#7498af" font-size="18">Luma coast</text></g>
    <g fill="none" stroke="#7498af" stroke-width="1"><path d="M552 269v-31m-5 8 5-8 5 8"/></g><text x="547" y="288" fill="#536c7c" font-family="Commissioner, sans-serif" font-size="12">N</text>
    ${observations.map((o,i)=>`<g class="map-pin ${i===selected?'selected':''}"><circle cx="${o.position[0]}" cy="${o.position[1]}" r="${i===selected?23:16}" fill="${i===selected?'#2862b3':'#fff'}" stroke="${i===selected?'#fff':'#7190ad'}" stroke-width="${i===selected?5:1.5}"/><text x="${o.position[0]}" y="${o.position[1]+5}" text-anchor="middle" fill="${i===selected?'#fff':'#172d43'}" font-family="Commissioner, sans-serif" font-size="14" font-weight="600">${o.letter}</text></g>`).join('')}
  </svg>`;
}

export function observationExplorer(selected=0) {
  const o=observations[selected];
  return `<div class="atlas-explorer">
    <div class="atlas-map-heading"><span><strong>Luma</strong> A fictional coastal region</span><span class="case-badge">Learning case</span></div>
    ${lumaMap(selected)}
    <div class="observation-controls" role="group" aria-label="Explore three fictional observations">${observations.map((item,i)=>`<button type="button" data-action="observe" data-index="${i}" aria-pressed="${selected===i}" aria-controls="observation-reading"><span>${item.letter}</span>${item.title}</button>`).join('')}</div>
    <div class="observation-reading" id="observation-reading" aria-live="polite" aria-atomic="true"><p class="source-meta"><span class="evidence-dot" aria-hidden="true"></span> ${o.source}<span>${o.date}</span></p><p class="observation-quote">${o.quote}</p><details class="evidence-reading"><summary>What can we infer?</summary><p>${o.reading}</p><p class="open-question">${o.question}</p></details></div>
    <p class="map-caption">All observations and locations are invented. The map is schematic.</p>
  </div>`;
}

export function routeIllustration(id) {
  const sketches={
    guide:`<path fill="#eef3f8" stroke="none" d="M11 38C16 16 46 12 75 20s40 27 32 48-34 22-62 17S4 63 11 38Z"/>
      <path fill="white" d="m13 30-1 46c16-3 31 0 47 9 16-8 32-11 49-8l-1-46c-17-4-33 0-48 9-14-9-30-12-46-10Z"/>
      <path d="M16 26c16-2 30 2 43 11 14-9 29-12 45-10l-1 45c-16-2-31 2-44 11-14-9-28-13-44-11Z" fill="white"/>
      <path d="M59 37c-1 15 1 31 0 46"/>
      <path d="m82 27-1 19 5-4 5 5 1-21" fill="#2862b3" stroke="none"/>
      <path d="M25 39c9 0 16 3 23 7m-23 4c8 0 15 3 23 7m-23 4c8 0 15 3 22 7M70 51l7-2m-7 11c7-3 14-4 22-4m-22 13c7-3 14-4 22-4" stroke="#2862b3" stroke-width="1.4"/>`,
    briefing:`<path fill="#eef3f8" stroke="none" d="M17 20c17-12 39-6 58 1s35 24 28 44-30 23-56 18S0 56 9 38Z"/>
      <path d="M37 64c11-3 14-14 25-17m-8-2 8 2-5 6M83 35c6-4 10-10 12-17" stroke="#2862b3"/>
      <path d="M84 48c9 4 12 12 15 20" stroke="#2862b3" stroke-dasharray="3 5"/>
      <path d="m18 53 20 1-1 22-21-1Zm44-25 23 1-1 26-23-1Z" fill="white"/>
      <path d="m22 61 10 1m-10 6 7 1m39-32 11 1m-11 6 8 1" stroke="#2862b3" stroke-width="1.4"/>
      <path d="M90 15c1-5 10-7 14-3s3 11-2 13c-6 2-12-3-12-10Z" fill="white" stroke="#2862b3"/>
      <path d="m90 75 13-2 3 14-14 2Z" fill="white" stroke="#2862b3" stroke-dasharray="3 4"/>`,
    workshop:`<path fill="#eef3f8" stroke="none" d="M20 26c17-13 47-16 69-5s23 36 8 51-47 19-68 9S2 40 20 26Z"/>
      <g fill="white"><path d="m43 12 16-1 1 13-16 1Zm23 0 15 1-1 13-15-1ZM44 79l16 1-1 12-16-1Zm24 1 15-1 1 12-16 1ZM9 40l13-1 1 17-13 1Zm91-1 12 1-1 17-12-1Z"/></g>
      <path d="M35 26c17-4 39-4 52 1 6 2 10 8 10 15l-1 18c0 7-5 13-12 14-17 3-35 3-51-1-7-2-11-8-11-15V42c0-8 5-14 13-16Z" fill="white"/>
      <path d="m38 38 17-2 2 20-17 2Zm29 14 14 1-1 12-14-1Z" fill="#eef3f8" stroke="#2862b3" stroke-width="1.4"/>
      <path d="m44 43 7-1m-6 7 6-1m21-11 10 5m-11-3 10 5" stroke="#2862b3" stroke-width="1.4"/>
      <path d="m60 63 4-12" stroke="#2862b3" stroke-width="2.5"/>`
  };
  return `<svg class="route-illustration" viewBox="0 0 120 100" width="120" height="100" aria-hidden="true" focusable="false" fill="none" stroke="#172d43" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">${sketches[id]||''}</svg>`;
}

export function stageGlyph(id) {
  const dot=(x,y,r=3,tone='')=>`<circle cx="${x}" cy="${y}" r="${r}" fill="white" ${tone?`class="glyph-${tone}"`:''}/>`;
  const paths={
    scan:`<path class="glyph-guide" d="M6 47h48"/>${dot(12,38)}${dot(22,18)}${dot(31,32)}${dot(45,13)}${dot(49,41,2,'ochre')}${dot(10,11,2)}`,
    prioritise:`<path class="glyph-guide" d="M6 47h48"/><path class="glyph-cluster" d="M9 35C8 20 22 9 33 16s10 23-3 27S10 43 9 35Z"/>${dot(13,35)}${dot(24,21)}${dot(34,32)}${dot(48,13,2)}${dot(49,41,2,'ochre')}`,
    narrative:`<path d="M13 39 29 20 47 34"/><path class="glyph-assumption" d="m29 20 18-9"/>${dot(13,39)}${dot(29,20)}${dot(47,34)}${dot(47,11,2,'ochre')}`,
    write:`<path class="glyph-guide" d="M10 7h40v46H10z"/><path d="M18 18h24M18 29h24M18 40h17"/>${dot(18,18)}${dot(18,29)}${dot(18,40)}<path class="glyph-assumption" d="M39 40h4"/>`,
    review:`<path class="glyph-guide" d="M10 7h37v46H10z"/><path d="M18 18h21M18 29h21M18 40h14"/>${dot(18,18)}${dot(18,29)}${dot(18,40)}<path class="glyph-annotation" d="M40 29h14M40 33h10M35 40h5l7 7"/>${dot(50,49,3,'plum')}`
  };
  return `<svg class="stage-glyph" viewBox="0 0 60 60" aria-hidden="true" focusable="false" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">${paths[id]||paths.scan}</svg>`;
}

export function methodThread(){
  return `<nav class="method-thread" aria-label="The five-stage process">${stages.map((stage,index)=>`<a href="#lesson/${stage.id}">${stageGlyph(stage.id)}<span>${index+1}. ${stage.short}</span></a>`).join('')}</nav>`;
}

function pathway() {
  return `<section class="case-pathway"><h2>Follow the proposed connection</h2><p class="muted">Open each connection to examine what would have to be true.</p><div class="pathway-sequence"><div class="pathway-node"><span class="semantic-label evidence">Observed pattern</span><h3>Uneven seasonal rainfall</h3></div><details class="pathway-link"><summary><span aria-hidden="true">↓</span> What are we assuming?</summary><p>The rainfall pattern reaches farming areas during planting, and farmers cannot fully adapt their timing or crops.</p></details><div class="pathway-node"><span class="semantic-label assumption">Possible effect</span><h3>Disrupted planting and income</h3></div><details class="pathway-link"><summary><span aria-hidden="true">↓</span> What are we assuming?</summary><p>Lost agricultural income is not offset by savings, alternative livelihoods, accessible markets or support.</p></details><div class="pathway-node"><span class="semantic-label interpretation">Possible consequence</span><h3>Pressure on household food access</h3></div></div><details class="alternative-reading"><summary>Consider another interpretation</summary><p>The short record could reflect temporary variability. Where market access, crop choices or household resources differ, the consequences could also differ.</p><p><strong>Look for:</strong> longer rainfall records, planting progress and perspectives from households outside the station coverage.</p></details></section>`;
}

export function caseStage(id,selected=0) {
  if(id==='scan')return `<div id="case-explorer">${observationExplorer(selected)}</div>`;
  if(id==='prioritise')return `<section class="case-priority"><div><span class="semantic-label interpretation">Proposition for discussion</span><h2>Will rainfall irregularity put food access under pressure?</h2><p>Consider the next six months, the areas represented by the evidence, and households with limited alternatives.</p><div class="judgement-labels"><span>Medium likelihood</span><span>High impact</span></div><p class="caption">Illustrative qualitative judgements. No probability or risk score is calculated.</p></div><div class="example-matrix" role="img" aria-label="Illustrative matrix: rainfall is placed at medium likelihood and high impact."><span class="matrix-axis">Higher humanitarian impact</span><div class="example-matrix-grid">${Array.from({length:9},(_,i)=>`<div class="${i===1?'placed':''}">${i===1?'<span>Rainfall<br>irregularity</span>':''}</div>`).join('')}</div><span class="matrix-axis">Increasing likelihood</span></div></section><details class="alternative-reading"><summary>What deserves a place on the watch list?</summary><p>An unusually severe coastal flood remains a possibility to monitor despite a low likelihood judgement. Prioritisation should retain important outliers.</p></details>`;
  if(id==='narrative')return pathway();
  if(id==='write')return `<article class="case-briefing"><div class="briefing-meta"><span>Fictional briefing excerpt</span><span>Six-month outlook</span></div><h2>Rainfall, livelihoods and food access</h2><p class="briefing-lead">Uneven seasonal rainfall could increase pressure on agricultural livelihoods in the areas of Luma represented by the available evidence.</p><p>The extent of any food-access consequences would depend on market conditions, household coping options and support.</p><details class="briefing-annotation"><summary>Examine the evidence behind this claim</summary><p>The invented station summary and responder discussion suggest a pattern to investigate. Geographic coverage is limited and the record is short.</p></details><details class="alternative-reading"><summary>Read a competing interpretation</summary><p>The apparent shift could reflect short-term variability rather than an enduring pattern. This would change the outlook and the observations needed to assess it.</p></details><div class="briefing-indicators"><h3>What to watch</h3><p>Rainfall distribution, planting progress, staple prices and reported coping strategies.</p></div></article>`;
  return `<section class="case-revision"><h2>Let the challenge change the claim</h2><div class="draft-claim"><span class="semantic-label">Initial draft</span><p>“Rainfall disruption will reduce food access across Luma.”</p></div><aside class="reviewer-note"><span class="semantic-label assumption">Reviewer’s question</span><p>Can one station support a region-wide claim? What could interrupt the pathway to food-access problems?</p></aside><details class="revision-reveal"><summary>Reveal the revised assessment</summary><div class="revised-claim"><span class="semantic-label evidence">After review</span><p>“In the areas represented by the available evidence, continued rainfall irregularity could disrupt planting and agricultural income over the next six months. Food-access consequences would depend on market access, household resources and support.”</p><ul><li>The geographic claim follows the evidence.</li><li>The time horizon is explicit.</li><li>The outcome is conditional.</li></ul></div></details><p class="caption">The revision makes the reasoning easier to examine. It does not add new evidence.</p></section>`;
}
