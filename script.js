(() => {
  const $ = (sel, root=document) => root.querySelector(sel);
  const $$ = (sel, root=document) => [...root.querySelectorAll(sel)];
  const menuButton = $('.menu-toggle');
  const mobileMenu = $('#mobile-menu');
  menuButton.addEventListener('click', () => {
    const open = menuButton.getAttribute('aria-expanded') === 'true';
    menuButton.setAttribute('aria-expanded', String(!open));
    menuButton.setAttribute('aria-label', open ? 'Open navigation menu' : 'Close navigation menu');
    mobileMenu.hidden = open;
  });
  $$('a', mobileMenu).forEach(a => a.addEventListener('click', () => {
    mobileMenu.hidden = true;
    menuButton.setAttribute('aria-expanded', 'false');
    menuButton.setAttribute('aria-label', 'Open navigation menu');
  }));
  document.addEventListener('keydown', e => { if(e.key === 'Escape' && !mobileMenu.hidden) { mobileMenu.hidden=true;menuButton.setAttribute('aria-expanded','false'); } });

  // The previews intentionally link to external travel-listing photographs, not locally redistributed copies.
  // Show an honest offline/error placeholder if an external host blocks hotlinking.
  $$('.property-img').forEach(img => img.addEventListener('error', () => {
    if(img.dataset.failed) return;
    img.dataset.failed = 'true';
    img.src = img.dataset.fallback || 'assets/images/photo-unavailable.svg';
    img.alt = 'Hotel photo unavailable; see the media source notes for the original listing';
  }));
  if('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => { if(entry.isIntersecting) { entry.target.classList.add('visible'); observer.unobserve(entry.target); } });
    }, {threshold:.09, rootMargin:'0px 0px 25px 0px'});
    $$('.reveal').forEach(el => observer.observe(el));
  } else { $$('.reveal').forEach(el => el.classList.add('visible')); }

  // Functional image category filters, with accurate pressed states.
  const filterButtons = $$('.gallery-filters button');
  filterButtons.forEach(btn => btn.addEventListener('click', () => {
    filterButtons.forEach(b => {b.classList.remove('active');b.setAttribute('aria-pressed','false');});
    btn.classList.add('active');btn.setAttribute('aria-pressed','true');
    const category = btn.dataset.filter;
    $$('.gallery-item').forEach(item => { item.hidden = category !== 'all' && item.dataset.category !== category; });
  }));

  const videoDialog = $('#video-dialog');
  const photoDialog = $('#photo-dialog');
  const enquiryDialog = $('#enquiry-dialog');
  const currentDialogs = [videoDialog, photoDialog, enquiryDialog];
  function closeDialog(dialog) { if(dialog.open) dialog.close(); }
  currentDialogs.forEach(d => {
    $$('[data-close-dialog]', d).forEach(btn => btn.addEventListener('click', () => closeDialog(d)));
    d.addEventListener('click', event => {if(event.target === d) closeDialog(d);});
  });
  $$('[data-video]').forEach(button => button.addEventListener('click', () => {
    const id = button.dataset.video;
    // The video stays on YouTube; embedding protects original video hosting and attribution.
    $('#video-frame').replaceChildren();
    const iframe = document.createElement('iframe');
    iframe.src = `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`;
    iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
    iframe.allowFullscreen = true;
    iframe.title = 'The Grand Shekhawati property tour';
    $('#video-frame').append(iframe);
    $('#youtube-direct').href = `https://www.youtube.com/watch?v=${id}`;
    videoDialog.showModal();
  }));
  videoDialog.addEventListener('close', () => $('#video-frame').replaceChildren());
  $$('.gallery-item').forEach(item => item.addEventListener('click', () => {
    const image = $('img',item);
    if(image.dataset.failed) return; // no misleading enlarged placeholder
    const enlarged = $('#lightbox-image');
    enlarged.src = item.dataset.full;
    enlarged.alt = image.alt;
    $('#lightbox-caption').textContent = item.dataset.caption;
    photoDialog.showModal();
  }));
  $('#lightbox-image').addEventListener('error', ()=> { $('#lightbox-image').src='assets/images/photo-unavailable.svg'; });

  const form = $('#enquiry-form');
  const today = new Date();
  const localDate = new Date(today.getTime() - today.getTimezoneOffset()*60000).toISOString().slice(0,10);
  const checkIn = form.elements.checkin;
  const checkOut = form.elements.checkout;
  checkIn.min = localDate;checkOut.min = localDate;
  checkIn.addEventListener('change', () => {
    const next = new Date(`${checkIn.value}T12:00:00`);
    next.setDate(next.getDate()+1);
    const dateString = [next.getFullYear(), String(next.getMonth()+1).padStart(2,'0'), String(next.getDate()).padStart(2,'0')].join('-');
    checkOut.min=dateString;
    if(!checkOut.value || checkOut.value <= checkIn.value) checkOut.value=dateString;
  });
  form.addEventListener('submit', event => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    if(checkOut.value <= checkIn.value) {checkOut.setCustomValidity('Check-out must be after check-in.');checkOut.reportValidity();return;}
    checkOut.setCustomValidity('');
    const d = new FormData(form);
    const text = [
      'Hello The Grand Shekhawati team,',
      '', 'I would like to enquire about availability:',
      `Check-in: ${d.get('checkin')}`, `Check-out: ${d.get('checkout')}`,
      `Guests: ${d.get('guests')}`, `Enquiry type: ${d.get('interest')}`,
      d.get('message')?.trim() ? `Notes: ${d.get('message').trim()}` : '',
      '', 'Please share the availability, rates and booking details. Thank you.'
    ].filter(Boolean).join('\n');
    $('#enquiry-output').textContent = text;
    $('#copy-enquiry').textContent = 'Copy message ↗';
    enquiryDialog.showModal();
  });
  checkOut.addEventListener('input', () => checkOut.setCustomValidity(''));
  $('#copy-enquiry').addEventListener('click', async () => {
    const text = $('#enquiry-output').textContent;
    try {
      if(navigator.clipboard && window.isSecureContext) await navigator.clipboard.writeText(text);
      else {
        const t = document.createElement('textarea');t.value = text;document.body.append(t);t.select();
        if(!document.execCommand('copy')) throw new Error('copy unavailable');t.remove();
      }
      $('#copy-enquiry').textContent = 'Copied ✓';
    } catch(e) { $('#copy-enquiry').textContent = 'Select text above to copy'; }
  });
  $('#year').textContent = new Date().getFullYear();
})();
