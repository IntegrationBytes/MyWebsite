(function(){
  const STORAGE_KEY = 'admin_guides_v1';
  // Simple one-way sync: if guides exist (edited), surface a notice and allow copy of prompts into playbooks section via console
  document.addEventListener('DOMContentLoaded', () => {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (!data) return;
      const note = document.createElement('div');
      note.className = 'callout console';
      note.style.marginTop = '8px';
      note.innerHTML = '<div class="title">Guides edited</div><p class="muted">Your Guides prompts have local edits. Export from Guides to propagate or run window.syncGuidesToClipboard() to copy JSON now.</p>';
      const tools = document.getElementById('tools');
      if (tools) tools.prepend(note);
      window.syncGuidesToClipboard = async function(){ await navigator.clipboard.writeText(data||'[]'); alert('Guides JSON copied. Paste into playbooks or version control.'); };
    } catch {}
  });
})();








