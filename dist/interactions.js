// Transient presentation only. No animation or reading position enters a session backup.
export function createMotion(media = window.matchMedia('(prefers-reduced-motion: reduce)')) {
  const active = new Set();
  let scrolling = null;
  function cancel() {
    for (const animation of active) animation.cancel();
    active.clear();
    if (scrolling) {
      const {element, options, release} = scrolling;
      release();
      element.scrollIntoView({...options, behavior:'instant'});
    }
  }
  media.addEventListener('change', () => { if (media.matches) cancel(); });
  function animate(element, frames, duration) {
    if (media.matches || !element?.animate) return;
    const animation = element.animate(frames, {duration, easing:'cubic-bezier(.2,.7,.2,1)'});
    active.add(animation);
    const release = () => active.delete(animation);
    animation.addEventListener('finish', release, {once:true});
    animation.addEventListener('cancel', release, {once:true});
    return animation;
  }
  return {
    cancel,
    settleTrend: element => animate(element, [{opacity:.85, transform:'translateY(4px)'}, {opacity:1, transform:'translateY(0)'}], 180),
    stageContent: element => animate(element, [{opacity:.85}, {opacity:1}], 140),
    scrollIntoView(element, options = {}) {
      scrolling?.release();
      if (!element) return;
      const behavior = media.matches ? 'instant' : options.behavior || 'instant';
      if (behavior === 'smooth') {
        const doc = element.ownerDocument;
        const events = ['scrollend','wheel','pointerdown','keydown'];
        const release = () => {
          clearTimeout(timeout);
          for (const name of events) doc?.removeEventListener(name, release, true);
          scrolling = null;
        };
        const timeout = setTimeout(release, 1500);
        for (const name of events) doc?.addEventListener(name, release, {once:true, capture:true});
        scrolling = {element, options, release};
      }
      element.scrollIntoView({...options, behavior});
    }
  };
}

export function createStageViewMemory(root) {
  const positions = new Map();
  const key = context => context?.valid && ['lesson','example','tool'].includes(context.view) &&
    ['scan','prioritise','narrative','write','review'].includes(context.id) ? `${context.view}/${context.id}` : null;
  const disclosures = () => [...root.querySelectorAll('details')].filter(node => !node.closest('.worksheet-companion'));
  // Field paths remain stable when trends are removed or reordered. Reading disclosures use their labels.
  const disclosureKey = node => node.dataset.viewKey || node.id || node.querySelector('[data-field]')?.dataset.field || node.querySelector('summary')?.textContent.trim();
  return {
    capture(context, scrollY) {
      const route = key(context);
      if (route) positions.set(route, {scrollY, open:new Map(disclosures().map(node => [disclosureKey(node), node.open]))});
    },
    restore(context) {
      const state = positions.get(key(context));
      if (!state) return null;
      for (const node of disclosures()) {
        const id = disclosureKey(node);
        if (state.open.has(id)) node.open = state.open.get(id);
      }
      return state.scrollY;
    },
    clear() { positions.clear(); },
    isStage: context => Boolean(key(context))
  };
}
