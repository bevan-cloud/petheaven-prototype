// sync.js — Notion one-click sync trigger for all staging pages
// Loaded via <script src="../sync.js"> — injects CSS + adds triggerSync() globally

(function () {
  var style = document.createElement('style');
  style.textContent = [
    /* Sync button — sits next to home icon in nav */
    '.nav-sync-btn{display:flex;align-items:center;justify-content:center;width:32px;height:32px;border-radius:8px;background:rgba(255,255,255,.12);border:none;color:#fff;cursor:pointer;flex-shrink:0;transition:background .15s;padding:0}',
    '.nav-sync-btn:hover:not(:disabled){background:rgba(255,255,255,.22)}',
    '.nav-sync-btn:disabled{opacity:.5;cursor:not-allowed}',
    '.nav-sync-btn svg{display:block}',
    '.nav-sync-btn.syncing svg{animation:nspin 1s linear infinite}',
    '.nav-sync-btn.done{background:rgba(74,222,128,.28)}',
    '@keyframes nspin{to{transform:rotate(360deg)}}',
    /* Toast */
    '#syncToast{position:fixed;bottom:28px;left:50%;transform:translateX(-50%) translateY(8px);background:#1a1a1a;color:#fff;font-family:"DM Sans",sans-serif;font-size:13px;font-weight:500;padding:10px 22px;border-radius:24px;box-shadow:0 4px 24px rgba(0,0,0,.22);z-index:9999;opacity:0;pointer-events:none;transition:opacity .2s,transform .2s;white-space:nowrap}',
    '#syncToast.visible{opacity:1;transform:translateX(-50%) translateY(0)}',
  ].join('\n');
  document.head.appendChild(style);
})();

var _GH_OWNER    = 'bevan-cloud';
var _GH_REPO     = 'petheaven-prototype';
var _GH_WORKFLOW = 'sync-notion.yml';

function _showSyncToast(msg, ms) {
  var t = document.getElementById('syncToast');
  if (!t) {
    t = document.createElement('div');
    t.id = 'syncToast';
    document.body.appendChild(t);
  }
  t.textContent = msg;
  t.classList.add('visible');
  clearTimeout(t._hide);
  t._hide = setTimeout(function () { t.classList.remove('visible'); }, ms || 4000);
}

function triggerSync() {
  var token = localStorage.getItem('gh_sync_pat');

  if (!token) {
    token = prompt(
      'First-time setup: enter a GitHub Personal Access Token.\n\n' +
      'It needs the "workflow" scope (classic token) or "actions: write" (fine-grained).\n\n' +
      'Create one at:  github.com/settings/tokens\n\n' +
      'It is stored only in this browser — never sent anywhere except GitHub.'
    );
    if (!token) return;
    token = token.trim();
    localStorage.setItem('gh_sync_pat', token);
  }

  var btn = document.getElementById('navSyncBtn');
  if (btn) { btn.disabled = true; btn.classList.add('syncing'); btn.classList.remove('done'); }

  fetch(
    'https://api.github.com/repos/' + _GH_OWNER + '/' + _GH_REPO +
    '/actions/workflows/' + _GH_WORKFLOW + '/dispatches',
    {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + token,
        'Accept': 'application/vnd.github+json',
        'X-GitHub-Api-Version': '2022-11-28',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ ref: 'main' }),
    }
  )
  .then(function (res) {
    if (btn) btn.classList.remove('syncing');

    if (res.status === 204) {
      if (btn) btn.classList.add('done');
      _showSyncToast('✓ Sync triggered — page will refresh in ~60 seconds', 6000);
      // Auto-reload after ~70 s so the user sees fresh data without a manual refresh
      setTimeout(function () { location.reload(); }, 70000);
    } else if (res.status === 401) {
      localStorage.removeItem('gh_sync_pat');
      _showSyncToast('⚠ Token invalid or expired — click the button again to re-enter', 5000);
    } else if (res.status === 403) {
      _showSyncToast('⚠ Token is missing the "workflow" scope — update your PAT on GitHub', 6000);
    } else if (res.status === 404) {
      _showSyncToast('⚠ Workflow not found — make sure sync-notion.yml is committed', 6000);
    } else {
      res.json().catch(function () { return {}; }).then(function (body) {
        _showSyncToast('⚠ GitHub returned ' + res.status + ': ' + (body.message || 'unknown error'), 5000);
      });
    }
  })
  .catch(function () {
    if (btn) btn.classList.remove('syncing');
    _showSyncToast('⚠ Could not reach GitHub — check your connection', 4000);
  })
  .finally(function () {
    if (btn) btn.disabled = false;
  });
}
