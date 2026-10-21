
(function () {
  const sidebar = document.querySelector('.sidebar');
  if (!sidebar) return;

  const toggle = document.createElement('button');
  toggle.type = 'button';
  toggle.className = 'sidebar-toggle';
  toggle.setAttribute('aria-label', 'Toggle navigation');
  toggle.setAttribute('aria-expanded', 'true');
  toggle.innerHTML = '<i class="fa-solid fa-bars"></i>';
  sidebar.prepend(toggle);

  const backdrop = document.createElement('button');
  backdrop.type = 'button';
  backdrop.className = 'sidebar-backdrop';
  backdrop.setAttribute('aria-label', 'Close navigation');
  document.body.appendChild(backdrop);

  function setCollapsed(collapsed) {
    sidebar.classList.toggle('collapsed', collapsed);
    document.body.classList.toggle('sidebar-collapsed', collapsed);
    toggle.setAttribute('aria-expanded', String(!collapsed));
    toggle.innerHTML = `<i class="fa-solid fa-${collapsed ? 'bars' : 'xmark'}"></i>`;
  }

  function isSmallScreen() { return window.matchMedia('(max-width: 760px)').matches; }
  setCollapsed(isSmallScreen());
  toggle.addEventListener('click', () => setCollapsed(!sidebar.classList.contains('collapsed')));
  backdrop.addEventListener('click', () => setCollapsed(true));
  sidebar.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => { if (isSmallScreen()) setCollapsed(true); }));
  window.addEventListener('resize', () => { setCollapsed(isSmallScreen() ? true : false); });
}());
