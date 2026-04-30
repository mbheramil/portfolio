/* ─── js/chat.js ──────────────────────────────────────────
   AI chat widget powered by OpenAI API.
   Reads key and quick questions from window.SiteConfig.ai.
   ─────────────────────────────────────────────────────── */

(function () {
  'use strict';

  const C = window.SiteConfig;
  if (!C || !C.ai) return;

  /* ── DOM REFS ─────────────────────────────────────────── */
  const fab      = document.getElementById('aiFab');
  const panel    = document.getElementById('aiPanel');
  const closeBtn = document.getElementById('aiClose');
  const msgList  = document.getElementById('aiMessages');
  const input    = document.getElementById('aiInput');
  const sendBtn  = document.getElementById('aiSend');
  const quickWrap= document.getElementById('aiQuickBtns');  // rendered by render.js
  if (!fab || !panel || !msgList || !input || !sendBtn) return;

  /* ── PANEL TOGGLE ─────────────────────────────────────── */
  fab.addEventListener('click', () => togglePanel(true));
  if (closeBtn) closeBtn.addEventListener('click', () => togglePanel(false));

  function togglePanel(open) {
    panel.classList.toggle('open', open);
    fab.classList.toggle('active', open);
    if (open) input.focus();
  }

  /* ── QUICK BUTTONS ────────────────────────────────────── */
  if (quickWrap) {
    quickWrap.addEventListener('click', e => {
      const btn = e.target.closest('.ai-quick');
      if (!btn) return;
      input.value = btn.dataset.q;
      sendMessage();
    });
  }

  /* ── SEND ON ENTER (no shift) ─────────────────────────── */
  input.addEventListener('keydown', e => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  });
  sendBtn.addEventListener('click', sendMessage);

  /* ── MESSAGE HELPERS ──────────────────────────────────── */
  const history = [
    {
      role:    'system',
      content: `You are the portfolio AI assistant for ${C.name}, a web developer specialising in WordPress, Shopify, Wix, SEO, AI integration, and custom plugin development. Answer questions about their services, pricing, process, and availability professionally and concisely. Keep replies under 120 words unless a detailed answer is clearly needed.`,
    },
  ];

  function appendMsg(role, html) {
    const div = document.createElement('div');
    div.className = `ai-msg ai-msg--${role}`;
    div.innerHTML = `<div class="ai-msg__bubble">${html}</div>`;
    msgList.appendChild(div);
    msgList.scrollTop = msgList.scrollHeight;
    return div;
  }

  function showTyping() {
    return appendMsg('assistant', '<span class="ai-dots"><span></span><span></span><span></span></span>');
  }

  async function sendMessage() {
    const text = input.value.trim();
    if (!text) return;

    appendMsg('user', escapeHtml(text));
    input.value = '';
    input.disabled  = true;
    sendBtn.disabled = true;

    history.push({ role: 'user', content: text });

    const typingEl = showTyping();

    try {
      const resp = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + C.ai.openaiKey,
        },
        body: JSON.stringify({
          model:       'gpt-4o-mini',
          messages:    history,
          max_tokens:  200,
          temperature: 0.7,
        }),
      });

      if (!resp.ok) throw new Error('API error ' + resp.status);

      const json = await resp.json();
      const reply = json.choices[0].message.content.trim();

      history.push({ role: 'assistant', content: reply });
      typingEl.querySelector('.ai-msg__bubble').innerHTML = escapeHtml(reply).replace(/\n/g, '<br>');
    } catch (err) {
      console.error('Chat error:', err);
      typingEl.querySelector('.ai-msg__bubble').textContent =
        'Sorry, the AI is unavailable right now. Please reach out via the contact form.';
    } finally {
      input.disabled   = false;
      sendBtn.disabled = false;
      input.focus();
    }
  }

  function escapeHtml(str) {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

})();
