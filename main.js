// ===== NETWORK CANVAS BACKGROUND =====
(function initCanvas() {
  const canvas = document.getElementById('networkCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let W, H, nodes = [], raf;

  function resize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  function createNodes(count) {
    nodes = [];
    for (let i = 0; i < count; i++) {
      nodes.push({
        x: Math.random() * W,
        y: Math.random() * H,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        r: Math.random() * 2 + 1
      });
    }
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    const maxDist = 150;

    nodes.forEach(n => {
      n.x += n.vx;
      n.y += n.vy;
      if (n.x < 0 || n.x > W) n.vx *= -1;
      if (n.y < 0 || n.y > H) n.vy *= -1;

      ctx.beginPath();
      ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(0,212,255,0.6)';
      ctx.fill();
    });

    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dx = nodes[i].x - nodes[j].x;
        const dy = nodes[i].y - nodes[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < maxDist) {
          const alpha = (1 - dist / maxDist) * 0.5;
          ctx.beginPath();
          ctx.moveTo(nodes[i].x, nodes[i].y);
          ctx.lineTo(nodes[j].x, nodes[j].y);
          ctx.strokeStyle = `rgba(0,212,255,${alpha})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }
    }
    raf = requestAnimationFrame(draw);
  }

  resize();
  createNodes(60);
  draw();
  window.addEventListener('resize', () => {
    resize();
    createNodes(60);
  });
})();

// ===== COUNTER ANIMATION =====
(function initCounters() {
  const nums = document.querySelectorAll('.stat-num');
  if (!nums.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = parseInt(el.dataset.target, 10);
      let current = 0;
      const step = target / 60;
      const timer = setInterval(() => {
        current += step;
        if (current >= target) { current = target; clearInterval(timer); }
        el.textContent = Math.floor(current);
      }, 16);
      observer.unobserve(el);
    });
  }, { threshold: 0.5 });

  nums.forEach(n => observer.observe(n));
})();

// ===== TOAST =====
function showToast(msg, color) {
  const t = document.getElementById('toast');
  if (!t) return;
  t.textContent = msg;
  t.style.borderColor = color || 'var(--cyan)';
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 3000);
}

// ===== LOGIN =====
function handleLogin() {
  const user = document.getElementById('loginUser');
  const pass = document.getElementById('loginPass');
  const msg  = document.getElementById('loginMsg');
  if (!user || !pass) return;

  if (!user.value.trim() || !pass.value.trim()) {
    showToast('⚠️ Username dan password wajib diisi', '#FFB800');
    return;
  }

  showToast('✅ Login berhasil! Selamat datang, ' + user.value);
  if (msg) msg.textContent = '✓ Logged in as ' + user.value;
  const lb = document.getElementById('logoutBtn');
  if (lb) lb.style.display = 'block';
}

// ===== LOGOUT =====
function logout() {
  const msg = document.getElementById('loginMsg');
  if (msg) msg.textContent = '';
  const user = document.getElementById('loginUser');
  const pass = document.getElementById('loginPass');
  if (user) user.value = '';
  if (pass) pass.value = '';
  const lb = document.getElementById('logoutBtn');
  if (lb) lb.style.display = 'none';
  showToast('👋 Anda telah logout', '#FF6B6B');
}

// ===== REGISTER =====
function handleRegister() {
  const email = document.getElementById('regEmail');
  if (!email || !email.value.trim()) {
    showToast('⚠️ Masukkan email Anda', '#FFB800');
    return;
  }
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!re.test(email.value)) {
    showToast('⚠️ Format email tidak valid', '#FF6B6B');
    return;
  }
  showToast('📧 Link dikirim ke ' + email.value);
}

function createAccount() {
  showToast('🔗 Menuju halaman pendaftaran...');
  setTimeout(() => window.location.href = 'kontak.html', 1200);
}

// ===== SIDEBAR TOGGLE (mobile) =====
function toggleSidebar() {
  const sb = document.getElementById('sidebar');
  if (sb) sb.classList.toggle('open');
}

// Close sidebar on outside click
document.addEventListener('click', function(e) {
  const sb = document.getElementById('sidebar');
  const btn = document.getElementById('menuBtn');
  if (sb && sb.classList.contains('open')) {
    if (!sb.contains(e.target) && e.target !== btn) {
      sb.classList.remove('open');
    }
  }
});

// ===== ENTER KEY on inputs =====
document.addEventListener('keydown', function(e) {
  if (e.key === 'Enter') {
    const active = document.activeElement;
    if (active && active.id === 'loginPass') handleLogin();
    if (active && active.id === 'regEmail') handleRegister();
  }
});
