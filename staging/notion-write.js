// staging/notion-write.js
// Browser-side Notion write utility — shared across all staging pages.
// Click-to-edit pattern: fields display as styled pills/text;
// clicking swaps them for an appropriate input, saves on change/blur, then restores.
// Exposes window._nw

(function () {
  'use strict';

  // ─── CSS ────────────────────────────────────────────────────────────────────
  const css = `
    /* Click-to-edit — no visible hint until hover */
    .nw-editable {
      cursor: pointer;
      display: inline-block;
      border-bottom: 1px solid transparent;
      transition: opacity .15s, border-color .15s;
    }
    .nw-editable:hover { opacity: .75; border-bottom-color: #d0d0c8; }

    /* Status pills — own CSS so they work on every page */
    .nw-status {
      font-size: 11px; font-weight: 600; padding: 3px 10px;
      border-radius: 20px; white-space: nowrap; display: inline-block;
    }
    .nw-st-live     { background:#e8f5e9; color:#1b5e20; }
    .nw-st-progress { background:#fff8e1; color:#7a5a00; }
    .nw-st-planned  { background:#eef2ff; color:#3730a3; }
    .nw-st-review   { background:#f3e5f5; color:#6a1b9a; }
    .nw-st-done     { background:#f0f0ee; color:#5a5a54; }

    /* Pillar tag */
    .nw-pillar {
      font-size: 11px; font-weight: 500; padding: 2px 8px;
      border-radius: 10px; display: inline-block;
    }

    /* Plain text values (quarter, priority, lead) */
    .nw-text       { font-size: 12px; font-weight: 500; color: #5a5a54; }
    .nw-text-muted { font-size: 12px; color: #d0d0c8; font-style: italic; }
    .nw-prio-p1    { color: #b84714; font-weight: 700; }

    /* Inline edit controls (appear on click) */
    .nw-edit-sel, .nw-edit-inp {
      font-size: 12px; padding: 2px 7px; border-radius: 6px;
      border: 1.5px solid #6366f1; background: #fff;
      color: #374151; outline: none;
      font-family: 'DM Sans', sans-serif;
    }
    .nw-edit-sel { cursor: pointer; }
    .nw-edit-inp { min-width: 130px; }
    /* Number input — no font-size so it inherits (large in flyout, small in table) */
    .nw-edit-num {
      width: 100%; max-width: 90px; padding: 2px 4px; border-radius: 4px;
      border: 1.5px solid #6366f1; background: #fff;
      color: inherit; outline: none; text-align: center; box-sizing: border-box;
      font-family: 'DM Sans', sans-serif; font-size: inherit; font-weight: inherit;
    }

    /* Dev/AI type badge */
    .dd-badge{display:inline-flex;align-items:center;gap:4px;font-size:11px;font-weight:600;padding:2px 8px;border-radius:10px;white-space:nowrap}
    .dd-dev{background:#e8f5e9;color:#1b5e20;border:1px solid #a8d4aa}
    .dd-ai{background:#eef2ff;color:#3730a3;border:1px solid #c7d2fe}

    /* Lead hint text */
    .nw-lead-hint { font-size: 10px; color: #9ca3af; margin-top: 3px; }

    /* ── Comments section ─────────────────────────────────────────────────── */
    .comments-section { margin-top: 24px; border-top: 1px solid #f0f0ee; padding-top: 20px; width: 100%; box-sizing: border-box; }
    .comments-list { display: flex; flex-direction: column; gap: 14px; margin-bottom: 16px; width: 100%; }
    .comment-input-row, .comment-item { pointer-events: all; }
    .comment-empty { font-size: 12px; color: #9a9a94; font-style: italic; margin: 0; }
    .comment-item { display: flex; gap: 10px; align-items: flex-start; }
    .comment-avatar {
      width: 28px; height: 28px; border-radius: 50%; flex-shrink: 0;
      background: #e8f0fd; color: #1a5fa8; font-size: 10px; font-weight: 700;
      display: flex; align-items: center; justify-content: center;
      text-transform: uppercase; letter-spacing: .02em;
    }
    .comment-body { flex: 1; min-width: 0; }
    .comment-header { display: flex; align-items: baseline; gap: 8px; margin-bottom: 3px; }
    .comment-author { font-size: 12px; font-weight: 600; color: #1a1a1a; }
    .comment-date   { font-size: 11px; color: #9a9a94; }
    .comment-text   { font-size: 13px; color: #374151; line-height: 1.55; word-break: break-word; }
    .comment-item.comment-new .comment-avatar { background: #e8f5e9; color: #2e7d32; }
    .comment-input-row { display: flex; gap: 10px; align-items: flex-start; margin-top: 4px; }
    .comment-input-avatar {
      width: 28px; height: 28px; border-radius: 50%; flex-shrink: 0;
      background: #e8f5e9; color: #2e7d32; font-size: 9px; font-weight: 700;
      display: flex; align-items: center; justify-content: center; letter-spacing: .02em;
    }
    .comment-input-wrap { flex: 1; display: flex; flex-direction: column; gap: 6px; }
    .comment-textarea {
      width: 100%; resize: none; overflow: hidden; min-height: 36px;
      padding: 8px 10px; border: 1px solid #e0e0e0; border-radius: 8px;
      font-family: 'DM Sans', sans-serif; font-size: 13px; color: #1a1a1a;
      background: #fafafa; outline: none; box-sizing: border-box;
      transition: border-color .15s;
    }
    .comment-textarea:focus { border-color: #6366f1; background: #fff; }
    .comment-textarea::placeholder { color: #b0b0a8; }
    .comment-submit-btn {
      align-self: flex-end; padding: 6px 16px; border-radius: 6px;
      border: none; background: #1a2419; color: #fff; font-size: 12px;
      font-weight: 600; cursor: pointer; font-family: 'DM Sans', sans-serif;
      transition: opacity .15s;
    }
    .comment-submit-btn:hover { opacity: .8; }
    .comment-submit-btn:disabled { opacity: .45; cursor: not-allowed; }

    /* Flyout prop — consistent on all pages */
    .flyout-prop { display: flex; flex-direction: column; gap: 4px; }

    /* Toast */
    #nwToast {
      position: fixed; bottom: 76px; left: 50%; transform: translateX(-50%);
      background: #1f2937; color: #f9fafb; padding: 8px 20px;
      border-radius: 20px; font-size: 13px; z-index: 99999;
      opacity: 0; transition: opacity .25s; pointer-events: none; white-space: nowrap;
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

  // ─── N8N Webhook ─────────────────────────────────────────────────────────────
  // All Notion writes are routed through N8N — no token stored in the browser.
  // Swap to the production URL once the workflow is activated.
  const N8N_WEBHOOK = 'https://workflow.sih.services/webhook/product-workspace-notion-update';

  async function notionPatch(notionId, properties) {
    try {
      const res = await fetch(N8N_WEBHOOK, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notionPageId: notionId, properties }),
      });
      if (!res.ok) {
        showToast(`⚠ Save failed (${res.status}) — check N8N workflow`);
        return false;
      }
      showToast('✓ Saved to Notion');
      return true;
    } catch (err) {
      showToast('⚠ Could not reach N8N — check your connection');
      return false;
    }
  }

  // ─── Reverse status map ───────────────────────────────────────────────────────
  const STATUS_TO_NOTION = {
    planned:  '3. Scheduled for Development',
    progress: '4. In progress',
    review:   '5. QA',
    live:     'Live',
    done:     '10. Done',
  };

  function buildProps(field, value) {
    switch (field) {
      case 'status':   return { Status: { status: { name: STATUS_TO_NOTION[value] || value } } };
      case 'theme':    return { 'Strategic Pillar': value ? { select: { name: value } } : { select: null } };
      case 'qLabel':   return { Quarter: value ? { select: { name: value } } : { select: null } };
      case 'priority': return { Priority: value ? { select: { name: value } } : { select: null } };
      case 'r':        return { Reach:      { number: Number(value) } };
      case 'i':        return { Impact:     { number: Number(value) } };
      case 'c':        return { Confidence: { number: Number(value) } };
      case 'e':        return { Effort:     { number: Math.max(1, Number(value)) } };
      case 'depDev': return { 'Dependent on Dev': value === '' ? { select: null } : { select: { name: value === 'true' ? 'Yes' : 'No' } } };
      default: return null;
    }
  }

  // ─── Local data update ────────────────────────────────────────────────────────
  function updateLocal(notionId, field, value) {
    const arr = (typeof PROJECTS !== 'undefined' ? PROJECTS : null)
             || (typeof ITEMS    !== 'undefined' ? ITEMS    : null);
    if (!arr) return;
    const item = arr.find(p => p.notionId === notionId);
    if (item) item[field] = value;
  }

  // ─── Option lists ─────────────────────────────────────────────────────────────
  const STATUS_OPTIONS = [
    { value: 'planned',  label: 'Planned' },
    { value: 'progress', label: 'In Progress' },
    { value: 'review',   label: 'In Review' },
    { value: 'live',     label: 'Live' },
    { value: 'done',     label: 'Done' },
  ];

  const PILLAR_OPTIONS = [
    'Top Line Growth', 'Margin Improvements', 'Cost Control & Cash Flow',
    'People', 'Internal Working Improvement', 'UX/UI', 'Other',
  ].map(v => ({ value: v, label: v }));

  const PRIORITY_OPTIONS = [
    { value: 'P1 🔥 Critical', label: 'P1 🔥 Critical' },
    { value: 'P2',             label: 'P2' },
    { value: 'P3',             label: 'P3' },
    { value: 'P4',             label: 'P4' },
    { value: 'P5',             label: 'P5' },
    { value: '',               label: '— None —' },
  ];

  function quarterOptions() {
    const arr = (typeof PROJECTS !== 'undefined' ? PROJECTS : null)
             || (typeof ITEMS    !== 'undefined' ? ITEMS    : null) || [];
    return [...new Set(arr.map(p => p.qLabel).filter(Boolean))].sort()
      .map(v => ({ value: v, label: v }));
  }

  function optionsFor(field) {
    switch (field) {
      case 'status':   return STATUS_OPTIONS;
      case 'theme':    return PILLAR_OPTIONS;
      case 'qLabel':   return quarterOptions();
      case 'priority': return PRIORITY_OPTIONS;
      case 'depDev': return [
        { value:'true',  label:'🧑‍💻 Yes — Dev Required' },
        { value:'false', label:'✦ No — AI / No Dev' },
        { value:'',      label:'— Not Set —' },
      ];
      default: return [];
    }
  }

  // ─── Pillar colour map (matches THEME_COLORS in all pages) ───────────────────
  const PILLAR_STYLES = {
    'Top Line Growth':              'background:#e8f5e9;border:1px solid #a8d4aa;color:#1b5e20',
    'Margin Improvements':          'background:#fce4ec;border:1px solid #f48fb1;color:#880e4f',
    'Cost Control & Cash Flow':     'background:#ede7f6;border:1px solid #b39ddb;color:#4527a0',
    'People':                       'background:#fce4ec;border:1px solid #ef9a9a;color:#b71c1c',
    'Internal Working Improvement': 'background:#e8f1fc;border:1px solid #90bef5;color:#1a5fa8',
    'UX/UI':                        'background:#eef2ff;border:1px solid #c7d2fe;color:#3730a3',
    'Other':                        'background:#f5f5f5;border:1px solid #ddd;color:#555',
  };

  // ─── Display HTML for a field value (shown inside the editable span) ──────────
  function displayHtml(field, val) {
    const v = val || '';
    switch (field) {
      case 'status': {
        const cls = { live:'nw-st-live', progress:'nw-st-progress', planned:'nw-st-planned',
                      review:'nw-st-review', done:'nw-st-done' }[v] || 'nw-st-planned';
        const lbl = STATUS_OPTIONS.find(o => o.value === v)?.label || 'Planned';
        return `<span class="nw-status ${cls}">${esc(lbl)}</span>`;
      }
      case 'theme': {
        if (!v) return `<span class="nw-text-muted">—</span>`;
        const style = PILLAR_STYLES[v] || PILLAR_STYLES['Other'];
        return `<span class="nw-pillar" style="${style}">${esc(v)}</span>`;
      }
      case 'qLabel':
        return v
          ? `<span class="nw-text">${esc(v)}</span>`
          : `<span class="nw-text-muted">—</span>`;
      case 'priority': {
        if (!v) return `<span class="nw-text-muted">—</span>`;
        // Abbreviate "P1 🔥 Critical" → "P1 🔥" to prevent column overflow
        const short = v === 'P1 🔥 Critical' ? 'P1 🔥' : v;
        const cls = v === 'P1 🔥 Critical' ? 'nw-text nw-prio-p1' : 'nw-text';
        return `<span class="${cls}">${short}</span>`;
      }
      case 'lead':
        return v
          ? `<span class="nw-text">${esc(v)}</span>`
          : `<span class="nw-text-muted">—</span>`;
      case 'r': return Number(v||0).toLocaleString();
      case 'i': return String(Number(v||0));
      case 'c': return String(Number(v||0)) + '%';
      case 'e': return String(Number(v||0) || 1);
      default:
        return v ? esc(v) : '<span class="nw-text-muted">—</span>';
    }
  }

  // ─── Build editable span string (for table cells & flyout values) ─────────────
  // stopProp=true adds event.stopPropagation() — use for table cells
  function buildEditSpanHtml(field, val, notionId, stopProp) {
    const click = stopProp
      ? `event.stopPropagation();window._nw.startEdit(this)`
      : `window._nw.startEdit(this)`;
    return `<span class="nw-editable" data-field="${field}" data-nid="${esc(notionId)}" data-val="${esc(val||'')}" onclick="${click}">${displayHtml(field, val)}</span>`;
  }

  // For table cells (stopProp = true)
  function buildEditSpan(field, val, notionId) {
    return buildEditSpanHtml(field, val, notionId, true);
  }

  // For flyout RICE cells — no label wrapper, span sits directly inside coloured div
  function buildRiceEditSpan(field, val, notionId) {
    return buildEditSpanHtml(field, val, notionId, false);
  }

  // For flyout property rows
  function buildFlyoutProp(field, val, notionId, label) {
    const hint = field === 'lead' ? '<div class="nw-lead-hint">Must match a Notion workspace member</div>' : '';
    return `<div class="flyout-prop">
      <div class="flyout-prop-lbl">${label}</div>
      <div>${buildEditSpanHtml(field, val, notionId, false)}${hint}</div>
    </div>`;
  }

  // ─── Lead save (routed via N8N — N8N resolves name → Notion user ID) ─────────
  async function saveLeadInternal(notionId, newName) {
    try {
      const res = await fetch(N8N_WEBHOOK, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notionPageId: notionId, leadName: newName }),
      });
      if (!res.ok) { showToast(`⚠ Save failed (${res.status})`); return; }
      showToast('✓ Saved to Notion');
      updateLocal(notionId, 'lead', newName);
      document.querySelectorAll(`.nw-editable[data-field="lead"][data-nid="${CSS.escape(notionId)}"]`)
        .forEach(s => { s.dataset.val = newName; s.innerHTML = displayHtml('lead', newName); });
    } catch (err) {
      showToast('⚠ Could not reach N8N — check your connection');
    }
  }

  // ─── Recalculate rice score after an r/i/c/e edit ───────────────────────────
  function updateRiceScore(notionId) {
    const arr = (typeof PROJECTS !== 'undefined' ? PROJECTS : null)
             || (typeof ITEMS    !== 'undefined' ? ITEMS    : null) || [];
    const itm = arr.find(p => p.notionId === notionId);
    if (!itm) return;
    const newRice = Math.round((itm.r||0) * (itm.i||0) * ((itm.c||0)/100) / (itm.e||1));
    itm.rice = newRice;
    // Update any visible score display (flyout stays open during table edits)
    document.querySelectorAll('.f-rice-score, .rice-score-num').forEach(el => {
      el.textContent = newRice.toLocaleString();
    });
  }

  // ─── Core click-to-edit handler ───────────────────────────────────────────────
  function startEdit(span) {
    const field     = span.dataset.field;
    const notionId  = span.dataset.nid;
    const currentVal = span.dataset.val || '';
    const stopPropAttr = span.getAttribute('onclick') || '';
    const isLead   = field === 'lead';
    const isNumber = ['r','i','c','e'].includes(field);

    // Build appropriate input element
    let el;
    if (isLead) {
      el = document.createElement('input');
      el.type = 'text';
      el.className = 'nw-edit-inp';
      el.value = currentVal;
      el.placeholder = 'Name…';
    } else if (isNumber) {
      el = document.createElement('input');
      el.type = 'number';
      el.className = 'nw-edit-num';
      el.step = 1;
      el.min = field === 'e' ? 1 : 0;
      if (field === 'c') el.max = 100;
      el.value = currentVal !== '' ? Number(currentVal) : 0;
    } else {
      el = document.createElement('select');
      el.className = 'nw-edit-sel';
      optionsFor(field).forEach(o => {
        const opt = document.createElement('option');
        opt.value = o.value;
        opt.textContent = o.label;
        if (o.value === currentVal) opt.selected = true;
        el.appendChild(opt);
      });
    }

    span.replaceWith(el);
    el.focus();
    if (isLead || isNumber) el.select();

    // Restore the span (with a given value) and remove the input from DOM
    function restore(val) {
      if (!el.parentNode) return; // already replaced
      const newSpan = document.createElement('span');
      newSpan.className = 'nw-editable';
      newSpan.dataset.field = field;
      newSpan.dataset.nid = notionId;
      newSpan.dataset.val = val;
      newSpan.innerHTML = displayHtml(field, val);
      newSpan.setAttribute('onclick', stopPropAttr);
      el.replaceWith(newSpan);
    }

    let committed = false;

    async function commit() {
      if (committed) return;
      committed = true;

      if (isLead) {
        const newVal = el.value.trim();
        restore(currentVal);
        await saveLeadInternal(notionId, newVal);
      } else if (isNumber) {
        const rawNum = parseFloat(el.value);
        const numVal = isNaN(rawNum) ? (field === 'e' ? 1 : 0)
                     : field === 'e' ? Math.max(1, rawNum)
                     : field === 'c' ? Math.min(100, Math.max(0, rawNum))
                     : Math.max(0, rawNum);
        restore(String(numVal));
        updateLocal(notionId, field, numVal);
        updateRiceScore(notionId);
        if (typeof updateStats  === 'function') updateStats();
        if (typeof applyFilters === 'function') applyFilters();
        const props = buildProps(field, numVal);
        if (props) notionPatch(notionId, props);
      } else {
        const newVal = el.value;
        restore(newVal);
        updateLocal(notionId, field, newVal);
        if (typeof updateStats  === 'function') updateStats();
        if (typeof applyFilters === 'function') applyFilters();
        const props = buildProps(field, newVal);
        if (props) notionPatch(notionId, props);
      }
    }

    function cancel() {
      if (committed) return;
      committed = true;
      restore(currentVal);
    }

    if (isLead) {
      el.addEventListener('blur', commit);
      el.addEventListener('keydown', e => {
        if (e.key === 'Enter') { e.preventDefault(); el.blur(); }
        if (e.key === 'Escape') { committed = true; restore(currentVal); }
      });
    } else if (isNumber) {
      el.addEventListener('blur', commit);
      el.addEventListener('keydown', e => {
        if (e.key === 'Enter') { e.preventDefault(); commit(); }
        if (e.key === 'Escape') cancel();
      });
    } else {
      el.addEventListener('change', commit);
      el.addEventListener('blur', () => setTimeout(() => { if (!committed) cancel(); }, 120));
      el.addEventListener('keydown', e => { if (e.key === 'Escape') cancel(); });
    }
  }

  // ─── HTML escape ─────────────────────────────────────────────────────────────
  function esc(s) {
    return String(s ?? '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  }

  // ─── Public API ───────────────────────────────────────────────────────────────
  // ─── Comments ────────────────────────────────────────────────────────────────
  function escHtml(s) {
    return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  }

  function buildCommentsHtml(item) {
    const comments = item.comments || [];
    const listHtml = comments.map(c => {
      const d = new Date(c.date);
      const dateStr = isNaN(d) ? '' : d.toLocaleDateString('en-GB', {day:'2-digit', month:'short', year:'numeric'});
      const initials = c.author.split(' ').map(w => w[0] || '').join('').slice(0,2).toUpperCase();
      return `<div class="comment-item">
        <div class="comment-avatar" title="${escHtml(c.author)}">${escHtml(initials)}</div>
        <div class="comment-body">
          <div class="comment-header">
            <span class="comment-author">${escHtml(c.author)}</span>
            <span class="comment-date">${escHtml(dateStr)}</span>
          </div>
          <div class="comment-text">${escHtml(c.text).replace(/\n/g,'<br>')}</div>
        </div>
      </div>`;
    }).join('');

    const nid = escHtml(item.notionId);
    return `<div class="flyout-section comments-section">
      <div class="flyout-section-hdr">
        <span class="flyout-section-title">💬 Comments${comments.length ? ` <span style="font-weight:400;color:#9a9a94">(${comments.length})</span>` : ''}</span>
      </div>
      <div class="comments-list" id="commentsList_${nid}">
        ${listHtml || '<p class="comment-empty">No comments yet.</p>'}
      </div>
      <div class="comment-input-row">
        <div class="comment-input-avatar">PW</div>
        <div class="comment-input-wrap">
          <textarea class="comment-textarea" id="commentInput_${nid}"
            placeholder="Add a comment… (Ctrl+Enter to post)"
            rows="1"
            oninput="this.style.height='auto';this.style.height=this.scrollHeight+'px'"
            onkeydown="if(event.key==='Enter'&&(event.ctrlKey||event.metaKey)){window._nw.submitComment('${nid}');event.preventDefault()}"
          ></textarea>
          <button class="comment-submit-btn" onclick="window._nw.submitComment('${nid}')">Post</button>
        </div>
      </div>
    </div>`;
  }

  async function postComment(notionId, text) {
    const res = await fetch(N8N_WEBHOOK, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'comment', notionId, text }),
    });
    if (!res.ok) throw new Error(res.status);
    return true;
  }

  async function submitComment(notionId) {
    const ta  = document.getElementById('commentInput_'  + notionId);
    const list = document.getElementById('commentsList_' + notionId);
    if (!ta || !ta.value.trim()) return;
    const text = ta.value.trim();
    const btn  = ta.closest('.comment-input-wrap').querySelector('.comment-submit-btn');

    // Optimistic UI — append immediately
    const dateStr = new Date().toLocaleDateString('en-GB', {day:'2-digit', month:'short', year:'numeric'});
    const empty = list.querySelector('.comment-empty');
    if (empty) empty.remove();
    list.insertAdjacentHTML('beforeend', `<div class="comment-item comment-new">
      <div class="comment-avatar">PW</div>
      <div class="comment-body">
        <div class="comment-header">
          <span class="comment-author">Product Workspace</span>
          <span class="comment-date">${dateStr}</span>
        </div>
        <div class="comment-text">${escHtml(text).replace(/\n/g,'<br>')}</div>
      </div>
    </div>`);
    ta.value = '';
    ta.style.height = 'auto';
    if (btn) { btn.disabled = true; btn.textContent = 'Posting…'; }

    try {
      await postComment(notionId, text);
      showToast('✓ Comment posted to Notion');
    } catch(e) {
      showToast('⚠ Could not post comment — check N8N workflow');
    } finally {
      if (btn) { btn.disabled = false; btn.textContent = 'Post'; }
    }
  }

  window._nw = {
    startEdit,
    buildEditSpan,
    buildRiceEditSpan,
    buildFlyoutProp,
    notionPatch,       // exposed so matrix Impact/Effort saves can call it directly
    showToast,
    // Legacy wrappers kept for back-compat (pages that still call old names)
    buildSelect:        buildEditSpan,
    buildFlyoutSelect:  (field, val, nid, label) => buildFlyoutProp(field, val, nid, label),
    buildLeadInput:     (val, nid) => buildFlyoutProp('lead', val, nid, 'Project Lead'),
    buildCommentsHtml,
    submitComment,
  };
})();
