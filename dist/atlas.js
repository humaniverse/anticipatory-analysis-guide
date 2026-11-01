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
    <div class="observation-reading" id="observation-reading" aria-live="polite" aria-atomic="true"><p class="source-meta"><span class="evidence-dot" aria-hidden="true"></span> Evidence: ${o.source}<span>${o.date}</span></p><p class="observation-quote">${o.quote}</p><details class="evidence-reading" data-view-key="observation-interpretation"><summary>Interpretation: what can we infer?</summary><p>${o.reading}</p><p class="open-question">${o.question}</p></details></div>
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
      <path d="m60 63 4-12" stroke="#2862b3" stroke-width="2.5"/>`,
    'before-you-begin':`<path fill="#eef3f8" stroke="none" d="M14 33c8-17 33-21 57-15s42 24 34 45-29 27-54 21S3 56 14 33Z"/>
      <path d="m25 15 54 5-5 64-55-5Z" fill="white"/>
      <path d="m35 30 29 3m-30 7 23 2m-24 8 17 1m-18 9 11 1" stroke="#2862b3" stroke-width="1.4"/>
      <path d="M80 44c13-1 24 9 24 22s-9 24-23 24-24-10-24-23 9-23 23-23Z" fill="white"/>
      <path d="M81 50c10 0 17 8 17 17s-7 17-17 17-18-7-18-17 8-17 18-17Z" stroke="#2862b3" stroke-width="1.2"/>
      <path d="m81 55-5 12 5 12 5-12Z" fill="#eef3f8" stroke="#2862b3" stroke-width="1.2"/>
      <path d="m81 55-5 12h10Z" fill="#2862b3" stroke="none"/>
      <path d="M67 67h3m22 0h3" stroke="#2862b3" stroke-width="1.2"/>`,
    'five-stages':`<path fill="#eef3f8" stroke="none" d="M12 32c11-17 39-24 63-15s39 28 28 48-37 25-61 17S0 52 12 32Z"/>
      <path d="m28 16 34 2-3 41-34-3Z" fill="white"/>
      <path d="m34 27 18 1m-19 7 14 1m-14 7 9 1" stroke="#2862b3" stroke-width="1.4"/>
      <path d="M47 65c16 3 15-21 30-23m-6-4 6 4-4 6" stroke="#2862b3"/>
      <path d="m79 51 24 3-4 34-26-3Z" fill="white"/>
      <path d="m84 61 12 1m-13 6 11 1m-12 6 8 1" stroke="#2862b3" stroke-width="1.4"/>
      <path d="M16 64c8-8 14-7 20-2m-5-1 5 1-2 5M80 32c6-8 13-12 20-12" stroke="#2862b3" stroke-dasharray="3 4"/>
      <circle cx="14" cy="67" r="3" fill="white" stroke="#2862b3"/>
      <circle cx="44" cy="65" r="3" fill="white" stroke="#2862b3"/>
      <path d="m104 20-3 15" stroke="#2862b3" stroke-width="2.5"/>`,
    facilitation:`<path fill="#eef3f8" stroke="none" d="M19 28c15-13 44-17 67-5s28 34 14 51-44 19-66 10S4 45 19 28Z"/>
      <path d="M42 16c12-4 28-3 39 1 4 2 6 5 5 10l-1 12c0 4-3 7-7 7l-12 1-9 8 1-9-15-1c-5 0-8-4-8-8V26c0-5 2-8 7-10Z" fill="white"/>
      <g fill="#2862b3" stroke="none"><circle cx="48" cy="31" r="2"/><circle cx="60" cy="31" r="2"/><circle cx="72" cy="31" r="2"/></g>
      <path d="M28 51c5 0 9 4 9 9s-4 9-9 9-9-4-9-9 4-9 9-9ZM91 51c5 0 9 4 9 9s-4 9-9 9-9-4-9-9 4-9 9-9ZM59 66c5 0 9 4 9 9s-4 9-9 9-9-4-9-9 4-9 9-9Z" fill="white"/>
      <path d="M13 83c0-7 6-12 15-12s15 5 15 12M76 83c0-7 6-12 15-12s15 5 15 12M44 96c0-6 6-10 15-10s15 4 15 10" stroke="#2862b3"/>
      <path d="m40 55 6-5m29 0 6 5" stroke="#2862b3" stroke-width="1.2"/>`,
    'communicate-and-continue':`<path fill="#eef3f8" stroke="none" d="M21 30c13-15 38-20 61-10s31 32 19 49-39 22-61 14S4 50 21 30Z"/>
      <path d="m25 48 34-23 40 22-2 39-71-1Z" fill="white"/>
      <path d="m38 17 35 2 13 13-2 41-48-2Z" fill="white"/>
      <path d="m73 19-1 13h14"/>
      <path d="m45 33 17 1m-18 9 30 1m-30 8 24 1" stroke="#2862b3" stroke-width="1.4"/>
      <path d="m25 48 35 22 39-23-2 39-71-1Z" fill="white"/>
      <path d="m27 83 23-19m23 0 23 20" stroke="#2862b3" stroke-width="1.4"/>
      <path d="M20 77C6 67 5 47 20 34m-8 1 8-1-2 8" stroke="#2862b3"/>
      <path d="M94 18c10 3 15 12 14 21" stroke="#2862b3" stroke-dasharray="3 4"/>`,
    'session-scan':`<path fill="#eef3f8" stroke="none" d="M14 33c9-17 36-23 61-15s38 28 29 47-37 25-62 18S3 53 14 33Z"/>
      <path d="m24 45 9-24 14 1 9 24m8 0 9-25 14 1 9 24" fill="white"/>
      <path d="m33 21 1-6 13 1v6m26-1 1-6 13 1v6M54 47c3-4 9-4 13 0"/>
      <path d="M36 38c12 0 22 10 22 22S48 83 36 83 14 73 14 61s10-23 22-23ZM83 38c12 0 23 10 23 22S96 83 84 83 61 74 61 61s10-23 22-23Z" fill="white"/>
      <path d="M36 45c8 0 15 7 15 15s-7 16-15 16-15-7-15-15 7-16 15-16ZM83 45c9 0 16 7 16 15s-7 16-15 16-16-7-16-15 7-16 15-16Z" fill="#eef3f8" stroke="#2862b3" stroke-width="1.4"/>
      <path d="M28 59c0-4 3-7 7-7m41 7c0-4 3-7 7-7" stroke="#2862b3" stroke-width="1.4"/>`,
    'session-prioritise':`<path fill="#eef3f8" stroke="none" d="M16 32c13-16 37-20 61-13s37 29 27 47-37 23-61 15S3 52 16 32Z"/>
      <path d="m31 20 70 2-2 62-69-2Z" fill="white"/>
      <path d="m67 21 34 1-1 30-34-1Z" fill="#eef3f8" stroke="none"/>
      <path d="m67 22-2 60M31 51l69 1" stroke="#2862b3" stroke-width="1.2"/>
      <path d="m40 29 17 2-2 14-17-2Zm37 33 16-1 1 15-17 1ZM8 61l17-3 3 16-17 3Z" fill="white"/>
      <path d="m43 35 9 1m30 32 7-1m-74 0 7-1" stroke="#2862b3" stroke-width="1.4"/>
      <path d="M18 49c0-12 6-20 16-20m-6-4 6 4-5 6" stroke="#2862b3"/>`,
    'session-narrative':`<path fill="#eef3f8" stroke="none" d="M15 33c11-18 39-22 63-12s37 28 24 47-39 23-63 13S4 51 15 33Z"/>
      <path d="M34 56c7-5 7-15 15-20m-7-1 7 1-2 7M73 38c7 5 7 16 15 22m-1-7 1 7-7-1" stroke="#2862b3"/>
      <path d="M73 29c7-8 15-10 23-10" stroke="#2862b3" stroke-dasharray="3 4"/>
      <path d="m10 49 24 2-1 27-25-2Zm40-32 25 2-2 28-25-2Zm39 36 23 1-2 28-24-2Z" fill="white"/>
      <path d="m16 59 12 1m-13 7 9 1m41-39-10-1m-1 8 12 1m28 27 12 1m-13 7 9 1" stroke="#2862b3" stroke-width="1.4"/>
      <circle cx="102" cy="18" r="5" fill="white" stroke="#2862b3"/>`,
    'session-write':`<path fill="#eef3f8" stroke="none" d="M17 33c12-18 39-21 61-12s35 27 24 46-37 25-62 15S6 51 17 33Z"/>
      <path d="m31 13 46 2 14 14-3 59-61-3Z" fill="white"/>
      <path d="m77 15-1 14h15"/>
      <path d="m42 33 21 1m-22 9 34 1m-34 9 26 1m-27 9 20 1m-20 9 13 1" stroke="#2862b3" stroke-width="1.4"/>
      <path d="m72 73 24-44 8 5-25 44-9 5Z" fill="white"/>
      <path d="m96 29 3-5 8 5-3 5Z" fill="#2862b3" stroke="#2862b3" stroke-width="1.2"/>
      <path d="m72 73 7 5-9 5Z" fill="#2862b3" stroke="#2862b3" stroke-width="1.2"/>
      <path d="m77 71 23-40" stroke="#2862b3" stroke-width="1.2"/>`,
    'session-review':`<path fill="#eef3f8" stroke="none" d="M15 33c11-16 35-21 60-13s38 29 27 48-38 23-62 14S3 53 15 33Z"/>
      <path d="M32 18h49c4 0 7 3 7 7l-1 59c0 4-3 7-7 7l-49-1c-4 0-6-3-6-7l1-58c0-4 2-7 6-7Z" fill="white"/>
      <path d="m35 31 43 1-1 49-43-1Z" stroke="#2862b3" stroke-width="1.2"/>
      <path d="m46 12 23 1 1 13-25-1Z" fill="white"/>
      <path d="m40 43 4 4 6-8m-10 23 4 4 6-8m7-14 13 1m-13 19 9 1" stroke="#2862b3" stroke-width="1.4"/>
      <path d="M90 47c9 0 16 7 16 16s-7 17-16 17-17-7-17-16 8-17 17-17Z" fill="white"/>
      <path d="M90 52c6 0 11 5 11 11s-5 12-11 12-12-5-12-11 6-12 12-12Zm12 24 10 12" stroke="#2862b3" stroke-width="1.4"/>`,
    'session-checklist':`<path fill="#eef3f8" stroke="none" d="M15 32c12-17 38-21 62-12s37 29 25 48-39 23-63 13S4 50 15 32Z"/>
      <path d="m29 13 45 2 15 15-3 58-62-3Z" fill="white"/>
      <path d="m74 15-1 15h16"/>
      <path d="m35 33 10 1-1 10-10-1Zm-1 21 10 1-1 10-10-1Zm-1 21 10 1-1 7-10-1Z" stroke="#2862b3" stroke-width="1.2"/>
      <path d="m37 38 2 2 5-6m-8 25 2 2 5-6m10-16 17 1m-18 20 9 1" stroke="#2862b3" stroke-width="1.4"/>
      <path d="M86 56c10 0 18 7 18 17s-8 18-18 18-18-8-18-18 8-17 18-17Z" fill="white"/>
      <path d="m77 73 6 6 12-13" stroke="#2862b3" stroke-width="2"/>`,
    'session-save':`<path fill="#eef3f8" stroke="none" d="M17 30c14-15 40-19 62-9s34 27 23 46-38 24-61 15S4 48 17 30Z"/>
      <path d="M18 34v-9l28 1 9 10 44 1 2 47-82 1Z" fill="white"/>
      <path d="m36 14 41 1 13 13-2 43-54-1Z" fill="white"/>
      <path d="m77 15-1 13h14"/>
      <path d="m44 30 19 1m-20 7 34 1" stroke="#2862b3" stroke-width="1.4"/>
      <path d="m12 45 95 1-9 40-79-1Z" fill="white"/>
      <path d="m60 53-1 20m-7-8 7 8 8-8M47 78h24" stroke="#2862b3" stroke-width="1.8"/>`
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

function observationExcerpt(index, context = false) {
  const o=observations[index];
  return `<section class="connection-source" data-source="${o.letter}"><span class="semantic-label evidence">Evidence ${o.letter}${context ? ': livelihood context' : ''}</span><h4>${o.source}</h4><p class="connection-source-date">${o.date}. Fictional source.</p><blockquote>${o.quote}</blockquote></section>`;
}
function coverageLimit() {
  const o=observations[2];
  return `<p class="connection-limit" data-source="${o.letter}"><strong>Coverage limit</strong> ${o.quote}<span>${o.source}. ${o.date}.</span></p>`;
}
function pathway() {
  return `<section class="case-pathway"><h2>Follow the proposed connection</h2><p class="muted">Open a connection to examine its assumption and the evidence available.</p>
    <div class="pathway-sequence">
      <div class="pathway-node"><span class="semantic-label evidence">Evidence: observed pattern</span><h3>Uneven seasonal rainfall</h3></div>
      <details class="pathway-link" name="luma-connection" data-connection="rainfall-livelihoods" data-view-key="rainfall-livelihoods">
        <summary><span aria-hidden="true">↓</span> Assumption: rainfall to livelihoods</summary>
        <div class="connection-detail"><div class="connection-assumption"><span class="semantic-label assumption">Assumption</span><p>The rainfall pattern reaches farming areas during planting, and farmers cannot fully adapt their timing or crops.</p></div>
          <div class="connection-evidence" aria-label="Evidence for the rainfall to livelihoods connection">${observationExcerpt(0)}${observationExcerpt(1)}${coverageLimit()}<p class="connection-limit">These observations suggest a connection; they do not establish causality.</p></div>
        </div>
      </details>
      <div class="pathway-node"><span class="semantic-label interpretation">Interpretation: possible effect</span><h3>Disrupted planting and income</h3></div>
      <details class="pathway-link" name="luma-connection" data-connection="livelihoods-food-access" data-view-key="livelihoods-food-access">
        <summary><span aria-hidden="true">↓</span> Assumption: livelihoods to food access</summary>
        <div class="connection-detail"><div class="connection-assumption"><span class="semantic-label assumption">Assumption</span><p>Lost agricultural income is not offset by savings, alternative livelihoods, accessible markets or support.</p></div>
          <div class="connection-evidence" aria-label="Evidence and gap for the livelihoods to food access connection">${observationExcerpt(1,true)}<p class="connection-gap"><strong>Evidence gap</strong> No direct evidence of food-access effects is recorded in this fictional case. The responder discussion describes livelihoods; the consequence remains an interpretation.</p>${coverageLimit()}</div>
        </div>
      </details>
      <div class="pathway-node"><span class="semantic-label interpretation">Interpretation: possible consequence</span><h3>Pressure on household food access</h3></div>
    </div>
    <details class="alternative-reading"><summary>Interpretation: another explanation</summary><p>The short record could reflect temporary variability. Where market access, crop choices or household resources differ, the consequences could also differ.</p><p><strong>Look for:</strong> longer rainfall records, planting progress and perspectives from households outside the station coverage.</p></details>
  </section>`;
}

export function caseStage(id,selected=0) {
  if(id==='scan')return `<div id="case-explorer">${observationExplorer(selected)}</div>`;
  if(id==='prioritise')return `<section class="case-priority"><div><span class="semantic-label interpretation">Interpretation: proposition for discussion</span><h2>Will rainfall irregularity put food access under pressure?</h2><p>Consider the next six months, the areas represented by the evidence, and households with limited alternatives.</p><div class="judgement-labels"><span>Medium likelihood</span><span>High impact</span></div><p class="caption">Illustrative qualitative judgements. No probability or risk score is calculated.</p></div><div class="example-matrix" role="img" aria-label="Illustrative matrix: rainfall is placed at medium likelihood and high impact."><span class="matrix-axis">Higher humanitarian impact</span><div class="example-matrix-grid">${Array.from({length:9},(_,i)=>`<div class="${i===1?'placed':''}">${i===1?'<span>Rainfall<br>irregularity</span>':''}</div>`).join('')}</div><span class="matrix-axis">Increasing likelihood</span></div></section><details class="alternative-reading"><summary>Interpretation: a possibility to watch</summary><p>An unusually severe coastal flood remains a possibility to monitor despite a low likelihood judgement. Prioritisation should retain important outliers.</p></details>`;
  if(id==='narrative')return pathway();
  if(id==='write')return `<article class="case-briefing"><div class="briefing-meta"><span>Fictional briefing excerpt</span><span>Six-month outlook</span></div><h2>Rainfall, livelihoods and food access</h2><p class="briefing-lead">Uneven seasonal rainfall could increase pressure on agricultural livelihoods in the areas of Luma represented by the available evidence.</p><p>The extent of any food-access consequences would depend on market conditions, household coping options and support.</p><details class="briefing-annotation"><summary>Examine the evidence behind this claim</summary><p>The invented station summary and responder discussion suggest a pattern to investigate. Geographic coverage is limited and the record is short.</p></details><details class="alternative-reading"><summary>Interpretation: a competing explanation</summary><p>The apparent shift could reflect short-term variability rather than an enduring pattern. This would change the outlook and the observations needed to assess it.</p></details><div class="briefing-indicators"><h3>What to watch</h3><p>Rainfall distribution, planting progress, staple prices and reported coping strategies.</p></div></article>`;
  return `<section class="case-revision"><h2>Let the challenge change the claim</h2><div class="draft-claim"><span class="semantic-label">Initial draft</span><p>“Rainfall disruption will reduce food access across Luma.”</p></div><aside class="reviewer-note"><span class="semantic-label">Reviewer’s question</span><p>Can one station support a region-wide claim? What could interrupt the pathway to food-access problems?</p></aside><details class="revision-reveal"><summary>Reveal the revised assessment</summary><div class="revised-claim"><span class="semantic-label interpretation">Interpretation after review</span><p>“In the areas represented by the available evidence, continued rainfall irregularity could disrupt planting and agricultural income over the next six months. Food-access consequences would depend on market access, household resources and support.”</p><ul><li>The geographic claim follows the evidence.</li><li>The time horizon is explicit.</li><li>The outcome is conditional.</li></ul></div></details><p class="caption">The revision makes the reasoning easier to examine. It does not add new evidence.</p></section>`;
}
