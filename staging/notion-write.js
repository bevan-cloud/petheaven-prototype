// staging/notion-write.js
// Browser-side Notion write utility — shared across all staging pages.
// Exposes window._nw with helpers for editable selects / inputs that PATCH Notion.
// Loaded after the inline scripts so PROJECTS / ITEMS globals are available.

(function () {
  'use strict';

  // ─── CSS ────────────────────────────────────────────────────────────────────
  const css = `
    .nw-sel {
      font-size: 12px; padding: 3px 7px; border-radius: 6px;
      border: 1px solid #d1d5db; background: #fff;
      cursor: pointer; color: #374151; max-width: 100%;
      transition: border-color .15s, box-shadow .15s;
    }
    .nw-sel:hover  { border-color: #6366f1; }
    .nw-sel:focus  { outline: none; border-color: #6366f1; box-shadow: 0 0 0 2px rgba(99,102,241,.15); }
    .nw-sel.saving { opacity: .55; pointer-events: none; }
    .nw-sel.saved  { border-color: #22c55e !important; }
    .nw-sel.error  { border-color: #ef4444 !important; }
    .nw-sel-wide   { width: 100%; box-sizing: border-box; }

    .nw-input {
      font-size: 12px; padding: 4px 8px; border-radius: 6px;
      border: 1px solid #d1d5db; background: #fff;
      color: #374151; width: 100%; box-sizing: border-box;
      transition: border-color .15s, box-shadow .15s;
    }
    .nw-input:hover  { border-color: #6366f1; }
    .nw-input:focus  { outline: none; border-color: #6366f1; box-shadow: 0 0 0 2px rgba(99,102,241,.15); }
    .nw-input.saving { opacity: .55; pointer-events: none; }
    .nw-input.saved  { border-color: #22c55e !important; }
    .nw-input.error  { border-color: #ef4444 !important; }

    .nw-lead-hint { font-size: 10px; color: #9ca3af; margin-top: 3px; }

    #nwToast {
      position: fixed; bottom: 76px; left: 50%; transform: translateX(-50%);
      background: #1f2937; color: #f9fafb; padding: 8px 20px;
      border-radius: 20px; font-size: 13px; z-index: 99999;
      opacity: 0; transition: opacity .25s; pointer-events: none;
      white-space: nowrap;
    }
    #nwToast.show { opacity: 1; }
  `;
  const styleEl = document.createElement('style');
  styleEl.textContent = css;
  document.head.appendChild(styleEl);

  // ─── Toast ───────────────────────────────────────────────────────────────────
  const toastEl = document.createElement('div');
  toastEl.id = 'nwToast';
  document.body.appendChild(toastEl);
  let _toastTimer;
  function showToast(msg, ms = 2800) {
    toastEl.textContent = msg;
    toastEl.classList.add('show');
    clearTimeout(_toastTimer);
    _toastTimer = setTimeout(() => toastEl.classList.remove('show'), ms);
  }

  // ─── Token ───────────────────────────────────────────────────────────────────
  const TOKEN_KEY = 'notion_write_token';
  function getToken() { return localStorage.getItem(TOKEN_KEY); }
  function clearToken() { localStorage.removeItem(TOKEN_KEY); }
  function ensureToken() {
    let t = getToken();
    if (t) return t;
    t = prompt('Enter your Notion integration token (ntn_…) to enable editing:');
    if (t && t.startsWith('ntn_')) { localStorage.setItem(TOKEN_KEY, t.trim()); return t.trim(); }
    showToast('⚠ Token required to edit');
    return null;
  }

  // ─── Notion API headers ──────────────────────────────────────────────────────
  function headers(token) {
    return {
      'Authorization': `Bearer ${token}`,
      'Notion-Version': '2022-06-28',
      'Content-Type': 'application/json',
    };
  }

  // ─── Reverse status map (display key → Notion status name) ──────────────────
  const STATUS_TO_NOTION = {
    planned:  '3. Scheduled for Development',
    progress: '4. In progress',
    review:   '5. QA',
    live:     'Live',
    done:     '10. Done',
  };

  // ─── Build Notion property patch body ───────────────────────────────────────
  function buildProps(field, value) {
    switch (field) {
      case 'status':
        return { Status: { status: { name: STATUS_TO_NOTION[value] || value } } };
      case 'theme':
        return { 'Strategic Pillar': value ? { select: { name: value } } : { select: null } };
      case 'qLabel':
        return { Quarter: value ? { select: { name: value } } : { select: null } };
      case 'priority':
        return { Priority: value ? { select: { name: value } } : { select: null } };
      default:
        return null;
    }
  }

  // ─── Core PATCH ─────────────────────────────────────────────────────────────
  async function notionPatch(notionId, properties, el) {
    const token = ensureToken();
    if (!token) return false;
    if (el) el.classList.add('saving');
    try {
      const res = await fetch(`https://api.notion.com/v1/pages/${notionId}`, {
        method: 'PATCH',
        headers: headers(token),
        body: JSON.stringify({ properties }),
      });
      if (!res.ok) {
        const txt = await res.text();
        if (res.status === 401) { clearToken(); showToast('⚠ Token invalid — cleared, try again'); }
        else showToast(`⚠ Notion ${res.status}`);
        if (el) { el.classList.remove('saving'); el.classList.add('error'); setTimeout(() => el.classList.remove('error'), 2000); }
        return false;
      }
      if (el) { el.classList.remove('saving'); el.classList.add('saved'); setTimeout(() => el.classList.remove('saved'), 1500); }
      showToast('✓ Saved to Notion');
      return true;
    } catch (err) {
      const msg = (err.name === 'TypeError' || err.message?.includes('fetch'))
        ? '⚠ Network error — check CORS / token'
        : '⚠ ' + err.message;
      showToast(msg);
      if (el) { el.classList.remove('saving'); el.classList.add('error'); setTimeout(() => el.classList.remove('error'), 2000); }
      return false;
    }
  }

  // ─── Update local data array in place ───────────────────────────────────────
  function updateLocal(notionId, field, value) {
    // Support both PROJECTS (projects page) and ITEMS (prioritization page)
    const arr = (typeof PROJECTS !== 'undefined' ? PROJECTS : null)
             || (typeof ITEMS    !== 'undefined' ? ITEMS    : null);
    if (!arr) return;
    const item = arr.find(p => p.notionId === notionId);
    if (item) item[field] = value;
  }

  // ─── saveField — called by table <select> onchange ───────────────────────────
  async function saveField(el, notionId, field) {
    const value = el.value;
    updateLocal(notionId, field, value);
    const props = buildProps(field, value);
    if (!props) { showToast('⚠ Unknown field: ' + field); return; }
    const ok = await notionPatch(notionId, props, el);
    // Refresh stats (banner counts) — render() / updateStats() are globals
    if (ok) {
      if (typeof updateStats === 'function') updateStats();
      if (typeof applyFilters === 'function') applyFilters();
    }
  }

  // ─── Users cache (for Lead picker) ──────────────────────────────────────────
  let _notionUsers = null;
  async function fetchUsers(token) {
    if (_notionUsers) return _notionUsers;
    try {
      const res = await fetch('https://api.notion.com/v1/users', {
        headers: { 'Authorization': `Bearer ${token}`, 'Notion-Version': '2022-06-28' },
      });
      if (!res.ok) return [];
      const data = await res.json();
      _notionUsers = (data.results || []).filter(u => u.type === 'person');
    } catch { _notionUsers = []; }
    return _notionUsers;
  }

  // ─── saveLead — called by lead <input> onblur / Enter ───────────────────────
  async function saveLead(el, notionId) {
    const newName = el.value.trim();
    const token = ensureToken();
    if (!token) return;

    el.classList.add('saving');
    const users = await fetchUsers(token);

    let people = [];
    if (newName) {
      const match = users.find(u =>
        u.name?.toLowerCase() === newName.toLowerCase() ||
        u.name?.toLowerCase().includes(newName.toLowerCase())
      );
      if (!match) {
        showToast(`⚠ No Notion user matching "${newName}"`);
        el.classList.remove('saving');
        el.classList.add('error');
        setTimeout(() => el.classList.remove('error'), 2500);
        return;
      }
      people = [{ object: 'user', id: match.id }];
      el.value = match.name; // normalise to exact name
    }

    const ok = await notionPatch(notionId, { Lead: { people } }, el);
    if (ok) updateLocal(notionId, 'lead', el.value);
  }

  // ─── HTML escape ────────────────────────────────────────────────────────────
  function esc(s) {
    return String(s ?? '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  }

  // ─── Option sets ────────────────────────────────────────────────────────────
  const STATUS_OPTIONS = [
    { value: 'planned',  label: 'Planned' },
    { value: 'progress', label: 'In Progress' },
    { value: 'review',   label: 'In Review' },
    { value: 'live',     label: 'Live' },
    { value: 'done',     label: 'Done' },
  ];

  const PILLAR_OPTIONS = [
    'Top Line Growth',
    'Margin Improvements',
    'Cost Control & Cash Flow',
    'People',
    'Internal Working Improvement',
    'UX/UI',
    'Other',
  ].map(v => ({ value: v, label: v }));

  const PRIORITY_OPTIONS = [
    { value: 'P1 🔥 Critical', label: 'P1 🔥 Critical' },
    { value: 'P2', label: 'P2' },
    { value: 'P3', label: 'P3' },
    { value: 'P4', label: 'P4' },
    { value: 'P5', label: 'P5' },
    { value: '',   label: '— None —' },
  ];

  function quarterOptions() {
    const arr = (typeof PROJECTS !== 'undefined' ? PROJECTS : null)
             || (typeof ITEMS    !== 'undefined' ? ITEMS    : null)
             || [];
    return [...new Set(arr.map(p => p.qLabel).filter(Boolean))].sort()
      .map(v => ({ value: v, label: v }));
  }

  function optionsFor(field) {
    switch (field) {
      case 'status':   return STATUS_OPTIONS;
      case 'theme':    return PILLAR_OPTIONS;
      case 'qLabel':   return quarterOptions();
      case 'priority': return PRIORITY_OPTIONS;
      default: return [];
    }
  }

  // ─── Build inline table cell <select> ────────────────────────────────────────
  // Stops click propagation so the row's onclick (openFlyout) is not triggered.
  function buildSelect(field, currentVal, notionId) {
    const opts = optionsFor(field).map(o =>
      `<option value="${esc(o.value)}"${o.value === currentVal ? ' selected' : ''}>${esc(o.label)}</option>`
    ).join('');
    return `<select class="nw-sel" onclick="event.stopPropagation()" onchange="window._nw.saveField(this,'${esc(notionId)}','${field}')">${opts}</select>`;
  }

  // ─── Build flyout property row with <select> ─────────────────────────────────
  function buildFlyoutSelect(field, currentVal, notionId, label) {
    const opts = optionsFor(field).map(o =>
      `<option value="${esc(o.value)}"${o.value === currentVal ? ' selected' : ''}>${esc(o.label)}</option>`
    ).join('');
    return `<div class="flyout-prop">
      <div class="flyout-prop-lbl">${label}</div>
      <select class="nw-sel nw-sel-wide" onchange="window._nw.saveField(this,'${esc(notionId)}','${field}')">${opts}</select>
    </div>`;
  }

  // ─── Build flyout Project Lead input ─────────────────────────────────────────
  function buildLeadInput(currentVal, notionId) {
    return `<div class="flyout-prop">
      <div class="flyout-prop-lbl">Project Lead</div>
      <input type="text" class="nw-input" value="${esc(currentVal)}" placeholder="Name…"
             onblur="window._nw.saveLead(this,'${esc(notionId)}')"
             onkeydown="if(event.key==='Enter')this.blur()">
      <div class="nw-lead-hint">Must match a Notion workspace member name</div>
    </div>`;
  }

  // ─── Public API ──────────────────────────────────────────────────────────────
  window._nw = {
    saveField,
    saveLead,
    notionPatch,
    updateLocal,
    buildSelect,
    buildFlyoutSelect,
    buildLeadInput,
    showToast,
    STATUS_OPTIONS,
    PILLAR_OPTIONS,
    PRIORITY_OPTIONS,
    quarterOptions,
  };
})();
