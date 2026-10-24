(() => {
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const loginModal = $('#loginModal');
  const infoModal = $('#infoModal');
  const loginMessage = $('#loginMessage');
  let previousFocus = null;

  $('#year').textContent = new Date().getFullYear() + 543;

  function showModal(modal) {
    previousFocus = document.activeElement;
    modal.hidden = false;
    document.body.style.overflow = 'hidden';
    const focusTarget = $('input, button', modal);
    if (focusTarget) setTimeout(() => focusTarget.focus(), 30);
  }
  function hideModal(modal) {
    modal.hidden = true;
    document.body.style.overflow = '';
    if (previousFocus && typeof previousFocus.focus === 'function') previousFocus.focus();
  }
  function openLogin() {
    loginMessage.hidden = true;
    loginMessage.textContent = '';
    $('#studentLoginForm').reset();
    setLoginMode('student');
    showModal(loginModal);
  }
  $('#openLogin').addEventListener('click', openLogin);
  $('#heroLogin').addEventListener('click', openLogin);
  $('#howtoLogin').addEventListener('click', openLogin);
  $$('[data-action="login"]').forEach(button => button.addEventListener('click', openLogin));
  $('#closeLogin').addEventListener('click', () => hideModal(loginModal));
  $('#closeInfo').addEventListener('click', () => hideModal(infoModal));
  $('#infoContinue').addEventListener('click', () => hideModal(infoModal));
  [loginModal, infoModal].forEach(modal => modal.addEventListener('click', event => {
    if (event.target === modal) hideModal(modal);
  }));
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') {
      if (!loginModal.hidden) hideModal(loginModal);
      if (!infoModal.hidden) hideModal(infoModal);
    }
  });

  function setLoginMode(mode) {
    $$('.login-tab').forEach(tab => {
      const selected = tab.dataset.loginMode === mode;
      tab.classList.toggle('selected', selected);
      tab.setAttribute('aria-pressed', String(selected));
    });
    $('#studentLoginForm').hidden = mode !== 'student';
    $('#googleLoginPanel').hidden = mode !== 'google';
  }
  $$('.login-tab').forEach(tab => tab.addEventListener('click', () => setLoginMode(tab.dataset.loginMode)));
  $('#googleInfo').addEventListener('click', () => {
    loginMessage.hidden = false;
    loginMessage.textContent = 'ต้องตั้งค่า Google Identity หรือ Firebase Authentication และกำหนดโดเมนที่อนุญาตก่อน จึงจะลงชื่อเข้าใช้จริงได้';
  });

  $('#studentLoginForm').addEventListener('submit', event => {
    event.preventDefault();
    // This is deliberately a demo only: do not transmit or store credentials.
    loginMessage.hidden = false;
    loginMessage.textContent = 'นี่คือหน้าสาธิตเท่านั้น ยังไม่ได้เชื่อมฐานข้อมูลหรือระบบยืนยันตัวตน กรุณาอย่าใช้รหัสผ่านจริงในเวอร์ชันนี้';
  });

  let selectedGrade = 'all';
  const searchInput = $('#courseSearch');
  function filterCourses() {
    const query = searchInput.value.trim().toLocaleLowerCase('th');
    let visibleCount = 0;
    $$('.course-card').forEach(card => {
      const gradeMatch = selectedGrade === 'all' || card.dataset.grade === selectedGrade;
      const searchable = `${card.dataset.search} ${$('h3', card).textContent}`.toLocaleLowerCase('th');
      const textMatch = !query || searchable.includes(query);
      card.hidden = !(gradeMatch && textMatch);
      if (!card.hidden) visibleCount++;
    });
    $('#emptyState').hidden = visibleCount > 0;
  }
  $$('.grade-tab').forEach(tab => tab.addEventListener('click', () => {
    selectedGrade = tab.dataset.grade;
    $$('.grade-tab').forEach(item => {
      const selected = item === tab;
      item.classList.toggle('selected', selected);
      item.setAttribute('aria-pressed', String(selected));
    });
    filterCourses();
  }));
  searchInput.addEventListener('input', filterCourses);

  $$('.course-link').forEach(button => button.addEventListener('click', () => {
    $('#infoTitle').textContent = button.dataset.course;
    $('#infoText').textContent = `ห้องเรียน “${button.dataset.course}” เป็นตัวอย่างหน้ารายละเอียดรายวิชา สามารถเพิ่มบทเรียน สื่อ วิดีโอ แบบทดสอบ และแบบส่งงานได้เมื่อเชื่อมระบบจริง`;
    showModal(infoModal);
  }));
  $$('[data-action="assignment"]').forEach(button => button.addEventListener('click', () => {
    $('#infoTitle').textContent = 'ส่งงานออนไลน์';
    $('#infoText').textContent = 'ระบบส่งงานจริงควรให้เข้าสู่ระบบก่อน เลือกชั้นเรียนและงาน จากนั้นจึงแนบภาพถ่ายหรือไฟล์ พร้อมบันทึกวันเวลาและสถานะการส่ง';
    showModal(infoModal);
  }));

  const menuToggle = $('#menuToggle');
  const navLinks = $('#navLinks');
  menuToggle.addEventListener('click', () => {
    const open = navLinks.classList.toggle('open');
    menuToggle.setAttribute('aria-expanded', String(open));
    menuToggle.setAttribute('aria-label', open ? 'ปิดเมนู' : 'เปิดเมนู');
  });
  $$('nav a', navLinks).forEach(link => link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.setAttribute('aria-label', 'เปิดเมนู');
  }));
})();
