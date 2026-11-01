import {previewModel, renderPreview, renderCompanionExample} from './work-preview.js';

// Patch presentation nodes in place: edits must not reset selects, disclosures or focus.
function patchChildren(parent, next) {
  const keyed = new Map([...parent.children].filter(node => node.dataset.key).map(node => [node.dataset.key, node]));
  let cursor = parent.firstChild;
  for (const fresh of [...next.childNodes]) {
    const key = fresh.nodeType === 1 ? fresh.dataset.key : null;
    let current = key ? keyed.get(key) : cursor;
    if (!key && current?.nodeType === 1 && current.dataset.key) current = null;
    if (!current || current.nodeType !== fresh.nodeType || current.nodeName !== fresh.nodeName) {
      const copy = fresh.cloneNode(true);
      parent.insertBefore(copy, cursor);
      cursor = copy.nextSibling;
      continue;
    }
    if (current !== cursor) parent.insertBefore(current, cursor);
    if (current.nodeType === 3) {
      if (current.textContent !== fresh.textContent) current.textContent = fresh.textContent;
    } else if (current.nodeType === 1) {
      for (const attr of [...current.attributes]) {
        if (attr.name === 'open' && current.tagName === 'DETAILS') continue;
        if (!fresh.hasAttribute(attr.name)) current.removeAttribute(attr.name);
      }
      for (const attr of fresh.attributes) if (current.getAttribute(attr.name) !== attr.value) current.setAttribute(attr.name, attr.value);
      patchChildren(current, fresh);
      if (current.tagName === 'SELECT') current.value = fresh.value;
    }
    cursor = current.nextSibling;
  }
  while (cursor) { const nextSibling = cursor.nextSibling; cursor.remove(); cursor = nextSibling; }
}

export function createWorksheetCompanion({getSession, editField}) {
  const preferences = new Map();
  const desktop = window.matchMedia('(min-width:1280px)');
  let stage = null, panel = null, dialog = null, host = null, frame = null;
  let returnFocus = null, returnScroll = 0, oldOverflow = '', modal = false;
  const prefs = () => preferences.get(stage);
  const content = tab => panel?.querySelector(`#companion-${tab}`);
  const remember = () => {
    if (!stage || !panel || !panel.getClientRects().length) return;
    for (const tab of ['preview','example']) {
      const pane = content(tab);
      if (!pane.hidden) prefs().scroll[tab] = pane.scrollTop;
    }
    prefs().open = [...content('preview').querySelectorAll('details[open][data-key]')].map(el => el.dataset.key);
  };
  function syncLayout() {
    if (!panel) return;
    const hidden = prefs().hidden;
    document.querySelector('.worksheet-workspace')?.classList.toggle('companion-hidden', hidden || !desktop.matches);
    host.hidden = hidden || !desktop.matches;
    const launcher = document.querySelector('.companion-launcher');
    launcher.hidden = desktop.matches && !hidden;
    panel.querySelector('[data-companion="close"]').textContent = desktop.matches ? 'Hide panel' : 'Close';
  }
  function selectTab(tab, focus = false, savePosition = true) {
    if (savePosition) remember();
    prefs().tab = tab;
    panel.querySelector('#companion-title').textContent = tab === 'example' ? 'Fictional example' : 'See your thinking take shape';
    for (const name of ['preview','example']) {
      const button = panel.querySelector(`#companion-tab-${name}`);
      button.setAttribute('aria-selected', String(name === tab));
      button.tabIndex = name === tab ? 0 : -1;
      content(name).hidden = name !== tab;
    }
    content(tab).scrollTop = prefs().scroll[tab];
    if (focus) panel.querySelector(`#companion-tab-${tab}`).focus({preventScroll:true});
  }
  function closeModal(restore = true) {
    if (!modal) return;
    remember();
    modal = false;
    dialog.close();
    host.append(panel);
    document.body.style.overflow = oldOverflow;
    syncLayout();
    if (restore) {
      returnFocus?.isConnected && returnFocus.focus({preventScroll:true});
      window.scrollTo({top:returnScroll, behavior:'instant'});
    }
  }
  function openPanel(tab, source, exampleKey = null) {
    remember();
    prefs().hidden = false;
    if (!desktop.matches && !modal) {
      returnFocus = source || document.activeElement;
      returnScroll = window.scrollY;
      oldOverflow = document.body.style.overflow;
      dialog.append(panel);
      modal = true;
      dialog.showModal();
      document.body.style.overflow = 'hidden';
    }
    syncLayout();
    selectTab(tab, true, false);
    if (exampleKey != null) {
      const target = document.getElementById(`companion-example-${stage}-${exampleKey}`);
      if (target) {
        const pane = content('example');
        pane.scrollTop += target.getBoundingClientRect().top - pane.getBoundingClientRect().top - 20;
        target.focus({preventScroll:true});
      }
    }
  }
  function refresh() {
    if (!panel || !stage) return;
    const model = previewModel(getSession(), stage, prefs().activeId);
    prefs().activeId = model.activeId;
    const pane = content('preview');
    const scroll = pane.scrollTop;
    const template = document.createElement('template');
    template.innerHTML = renderPreview(model);
    patchChildren(pane, template.content);
    pane.scrollTop = scroll;
  }
  function scheduleRefresh() {
    if (frame != null) return;
    frame = requestAnimationFrame(() => { frame = null; refresh(); });
  }
  function beforeRender() {
    remember();
    closeModal(false);
    if (frame != null) cancelAnimationFrame(frame);
    frame = null;
    stage = panel = host = dialog = null;
  }
  function mount(id) {
    stage = id;
    if (!preferences.has(id)) preferences.set(id, {tab:'preview', hidden:false, activeId:'', scroll:{preview:0,example:0}, open:[]});
    host = document.getElementById('companion-host');
    dialog = document.getElementById('companion-dialog');
    panel = document.createElement('section');
    panel.className = 'worksheet-companion';
    panel.setAttribute('aria-label', 'Worksheet preview and example');
    panel.innerHTML = `<div class="companion-heading"><span id="companion-title">See your thinking take shape</span><button type="button" data-companion="close">Hide panel</button></div><div class="companion-tabs" role="tablist" aria-label="Worksheet companion"><button type="button" id="companion-tab-preview" role="tab" aria-controls="companion-preview" data-companion="tab" data-tab="preview">Your preview</button><button type="button" id="companion-tab-example" role="tab" aria-controls="companion-example" data-companion="tab" data-tab="example">Example</button></div><div class="companion-content" id="companion-preview" role="tabpanel" tabindex="0" aria-labelledby="companion-tab-preview"></div><div class="companion-content" id="companion-example" role="tabpanel" tabindex="0" aria-labelledby="companion-tab-example">${renderCompanionExample(stage)}</div>`;
    host.append(panel);
    refresh();
    for (const node of content('preview').querySelectorAll('details[data-key]')) node.open = prefs().open.includes(node.dataset.key);
    // Set visibility before selecting, so initial empty panes do not overwrite saved scroll.
    for (const tab of ['preview','example']) content(tab).hidden = true;
    selectTab(prefs().tab, false, false);
    syncLayout();
    dialog.addEventListener('cancel', event => { event.preventDefault(); closeModal(); });
  }
  document.addEventListener('click', event => {
    const button = event.target.closest('[data-companion]');
    if (!button || !panel) return;
    const action = button.dataset.companion;
    if (action === 'open') openPanel(button.dataset.tab, button);
    if (action === 'example') openPanel('example', button, button.dataset.example || 'overview');
    if (action === 'tab') selectTab(button.dataset.tab);
    if (action === 'close') {
      if (modal) closeModal();
      else { remember(); prefs().hidden = true; syncLayout(); document.querySelector('[data-companion="open"]').focus({preventScroll:true}); }
    }
    if (action === 'edit') {
      closeModal(false);
      editField(button.dataset.stage, button.dataset.path);
    }
  });
  document.addEventListener('change', event => {
    if (event.target.matches('[data-companion="select-trend"]') && panel) {
      prefs().activeId = event.target.value;
      refresh();
    }
  });
  document.addEventListener('focusin', event => {
    if (!panel || !event.target.dataset.field) return;
    const [group, id] = event.target.dataset.field.split('.');
    if (['trend','brief'].includes(group) && prefs().activeId !== id) { prefs().activeId = id; scheduleRefresh(); }
  });
  document.addEventListener('keydown', event => {
    if (modal && event.key === 'Tab') {
      const focusable = [...panel.querySelectorAll('button,a[href],select,summary,[tabindex]')].filter(node => !node.disabled && node.tabIndex >= 0 && node.getClientRects().length);
      const first = focusable[0], last = focusable.at(-1);
      if (event.shiftKey && (document.activeElement === first || !panel.contains(document.activeElement))) {
        event.preventDefault(); last?.focus();
      } else if (!event.shiftKey && (document.activeElement === last || !panel.contains(document.activeElement))) {
        event.preventDefault(); first?.focus();
      }
    }
    if (!panel || !event.target.matches('[role="tab"][data-companion]')) return;
    if (['ArrowLeft','ArrowRight','Home','End'].includes(event.key)) {
      event.preventDefault();
      selectTab(event.key === 'Home' ? 'preview' : event.key === 'End' ? 'example' : prefs().tab === 'preview' ? 'example' : 'preview', true);
    }
  });
  desktop.addEventListener('change', () => {
    if (!panel) return;
    const wasPanelFocus = panel.contains(document.activeElement);
    closeModal(false);
    remember();
    syncLayout();
    if (wasPanelFocus && !desktop.matches) document.querySelector('[data-companion="open"]').focus({preventScroll:true});
  });
  return {
    beforeRender, mount, refresh:scheduleRefresh,
    resetSelection() { for (const state of preferences.values()) state.activeId = ''; },
    wrap(editor) {
      return `<div class="companion-launcher" aria-label="Worksheet companion"><span>Keep your thinking in view</span><button type="button" class="button quiet small" data-companion="open" data-tab="preview">Preview</button><button type="button" class="button quiet small" data-companion="open" data-tab="example">Example</button></div><div class="worksheet-workspace"><div class="worksheet-editor">${editor}</div><aside id="companion-host"></aside></div><dialog id="companion-dialog" class="companion-dialog" aria-labelledby="companion-title"></dialog>`;
    }
  };
}
