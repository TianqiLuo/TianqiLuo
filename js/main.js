(function () {
  'use strict';

  const DATA_FILES = {
    personal: 'data/personal.json',
    news: 'data/news.json',
    publications: 'data/publications.json',
    honors: 'data/honors.json',
    education: 'data/education.json',
    experience: 'data/experience.json',
    services: 'data/services.json',
  };

  async function loadData() {
    const entries = Object.entries(DATA_FILES);
    const results = await Promise.all(
      entries.map(([key, url]) =>
        fetch(url)
          .then((r) => r.json())
          .then((data) => [key, data])
          .catch(() => [key, key === 'personal' ? {} : []])
      )
    );
    return Object.fromEntries(results);
  }

  // ─── Renderers ───────────────────────────────────────────

  function renderSidebar(personal) {
    const avatar = document.getElementById('avatar');
    avatar.src = personal.avatar || 'assets/avatar.svg';
    avatar.alt = personal.name || '';

    document.getElementById('profile-name').textContent = personal.name || '';
    document.getElementById('profile-title').textContent =
      `${personal.title || ''} · ${personal.affiliation || ''}`;

    const keywordsEl = document.getElementById('profile-keywords');
    (personal.keywords || []).forEach((kw) => {
      const span = document.createElement('span');
      span.className = 'keyword-tag';
      span.textContent = kw;
      keywordsEl.appendChild(span);
    });

    const locEl = document.getElementById('profile-location');
    locEl.querySelector('span').textContent = personal.location || '';

    const mobileName = document.querySelector('.mobile-name');
    if (mobileName) mobileName.textContent = personal.name || '';

    renderProfileLinks(personal.links || {});
  }

  function renderProfileLinks(links) {
    const container = document.getElementById('profile-links');
    const iconMap = {
      email: 'fas fa-envelope',
      cv: 'fas fa-file-alt',
      github: 'fab fa-github',
      google_scholar: 'fas fa-graduation-cap',
      twitter: 'fab fa-twitter',
    };
    const labelMap = {
      email: 'Email',
      cv: 'CV',
      github: 'GitHub',
      google_scholar: 'Google Scholar',
      twitter: 'Twitter',
    };

    Object.entries(links).forEach(([key, url]) => {
      if (!url) return;
      const a = document.createElement('a');
      a.href = url;
      a.className = 'profile-link';
      a.title = labelMap[key] || key;
      a.target = key === 'email' ? '_self' : '_blank';
      a.rel = 'noopener noreferrer';
      a.innerHTML = `<i class="${iconMap[key] || 'fas fa-link'}"></i>`;
      container.appendChild(a);
    });
  }

  function renderAbout(personal) {
    const greeting = document.getElementById('greeting');
    greeting.innerHTML = `${personal.name || ''} <span class="wave">👋</span>`;

    const bio = document.getElementById('bio');
    let html = `<p>${personal.bio || ''}</p>`;
    if (personal.collaboration_note) {
      html += `<p>${personal.collaboration_note}</p>`;
    }
    bio.innerHTML = html;

    const actions = document.getElementById('bio-actions');
    const links = personal.links || {};
    if (links.google_scholar) {
      actions.innerHTML += `<a href="${links.google_scholar}" class="btn btn-outline" target="_blank"><i class="fas fa-graduation-cap"></i> Google Scholar</a>`;
    }
  }

  function renderNews(newsData) {
    const recentList = document.getElementById('news-list');
    const earlierList = document.getElementById('news-earlier-list');
    const earlierContainer = document.getElementById('news-earlier');
    const toggleBtn = document.getElementById('news-toggle');

    const recent = newsData.filter((n) => n.recent);
    const earlier = newsData.filter((n) => !n.recent);

    recent.forEach((item) => {
      recentList.appendChild(createNewsItem(item));
    });

    if (earlier.length > 0) {
      earlier.forEach((item) => {
        earlierList.appendChild(createNewsItem(item));
      });
      toggleBtn.style.display = 'inline-flex';

      toggleBtn.addEventListener('click', () => {
        const expanded = earlierContainer.style.display !== 'none';
        earlierContainer.style.display = expanded ? 'none' : 'block';
        toggleBtn.classList.toggle('expanded', !expanded);
        toggleBtn.querySelector('span').textContent = expanded
          ? 'Show earlier updates'
          : 'Hide earlier updates';
      });
    }
  }

  function createNewsItem(item) {
    const div = document.createElement('div');
    div.className = 'news-item';
    div.innerHTML = `
      <span class="news-date">${item.date}</span>
      <span class="news-text">${item.text}</span>
    `;
    return div;
  }

  function parseDate(dateStr) {
    if (!dateStr) return 0;
    const parts = dateStr.split('.');
    return parseInt(parts[0]) * 100 + parseInt(parts[1] || 0);
  }

  function renderPublications(pubData) {
    const container = document.getElementById('publications-list');

    const sorted = [...pubData].sort((a, b) => parseDate(b.date) - parseDate(a.date));
    const years = [...new Set(sorted.map((p) => p.year))];

    years.forEach((year) => {
      const group = document.createElement('div');
      group.className = 'pub-year-group';
      group.innerHTML = `<div class="pub-year-heading">${year}</div>`;

      sorted
        .filter((p) => p.year === year)
        .forEach((pub) => {
          group.appendChild(createPubCard(pub));
        });

      container.appendChild(group);
    });
  }

  function createPubCard(pub) {
    const card = document.createElement('div');
    card.className = 'pub-card' + (pub.highlight ? ' highlighted' : '');

    const imageHtml = pub.image
      ? `<div class="pub-image"><img src="${pub.image}" alt="${pub.title}"></div>`
      : `<div class="pub-image"><span class="pub-image-placeholder"><i class="fas fa-file-alt"></i></span></div>`;

    const authorsHtml = (pub.authors || [])
      .map((a) =>
        a === 'Tianqi Luo'
          ? `<span class="self">${a}</span>`
          : a
      )
      .join(', ');

    const badgesHtml = (pub.badges || [])
      .map((b) => `<span class="pub-badge">🏆 ${b}</span>`)
      .join('');

    const linkIcons = {
      paper: { icon: 'fas fa-file-pdf', label: 'Paper' },
      homepage: { icon: 'fas fa-globe', label: 'Homepage' },
      code: { icon: 'fab fa-github', label: 'Code' },
      slides: { icon: 'fas fa-desktop', label: 'Slides' },
      pdf: { icon: 'fas fa-file-pdf', label: 'PDF' },
      video: { icon: 'fas fa-video', label: 'Video' },
    };

    const linksHtml = Object.entries(pub.links || {})
      .filter(([, url]) => url)
      .map(([key, url]) => {
        const info = linkIcons[key] || { icon: 'fas fa-link', label: key };
        return `<a href="${url}" class="pub-link" target="_blank" rel="noopener noreferrer"><i class="${info.icon}"></i> ${info.label}</a>`;
      })
      .join('');

    const titleHtml = pub.links && pub.links.paper
      ? `<a href="${pub.links.paper}" target="_blank" rel="noopener noreferrer">${pub.title}</a>`
      : pub.title;

    card.innerHTML = `
      ${imageHtml}
      <div class="pub-info">
        <span class="pub-venue">${pub.venue}</span>
        <div class="pub-title">${titleHtml}</div>
        <div class="pub-authors">${authorsHtml}</div>
        ${badgesHtml ? `<div class="pub-badges">${badgesHtml}</div>` : ''}
        <div class="pub-links">${linksHtml}</div>
      </div>
    `;
    return card;
  }

  function renderHonors(honorsData) {
    const container = document.getElementById('honors-list');

    if (!honorsData || honorsData.length === 0) {
      container.closest('.section').style.display = 'none';
      const navLink = document.querySelector('a[href="#honors"]');
      if (navLink) navLink.style.display = 'none';
      return;
    }

    const years = [...new Set(honorsData.map((h) => h.year))].sort((a, b) =>
      String(b).localeCompare(String(a))
    );

    container.classList.remove('timeline');

    years.forEach((year) => {
      const group = document.createElement('div');
      group.className = 'honors-year-group';
      group.innerHTML = `<div class="honors-year-heading">${year}</div>`;

      honorsData
        .filter((h) => h.year === year)
        .forEach((honor) => {
          const item = document.createElement('div');
          item.className = 'honor-item';
          item.innerHTML = `
            <div class="honor-icon"><i class="fas fa-trophy"></i></div>
            <div class="honor-info">
              <div class="honor-title">${honor.title}</div>
              ${honor.context ? `<div class="honor-context">${honor.context}</div>` : ''}
            </div>
          `;
          group.appendChild(item);
        });

      container.appendChild(group);
    });
  }

  function renderEducation(eduData) {
    const container = document.getElementById('education-list');

    if (!eduData || eduData.length === 0) {
      container.closest('.section').style.display = 'none';
      const navLink = document.querySelector('a[href="#education"]');
      if (navLink) navLink.style.display = 'none';
      return;
    }

    eduData.forEach((edu) => {
      const item = document.createElement('div');
      item.className = 'timeline-item';
      item.innerHTML = `
        <div class="timeline-period">${edu.period}</div>
        <div class="timeline-title">${edu.degree}</div>
        <div class="timeline-subtitle">
          ${edu.school_url ? `<a href="${edu.school_url}" target="_blank" rel="noopener noreferrer">${edu.school}</a>` : edu.school}
        </div>
        ${edu.details ? `<div class="timeline-details">${edu.details}</div>` : ''}
      `;
      container.appendChild(item);
    });
  }

  function renderExperience(expData) {
    const container = document.getElementById('experience-list');

    if (!expData || expData.length === 0) {
      container.closest('.section').style.display = 'none';
      const navLink = document.querySelector('a[href="#experience"]');
      if (navLink) navLink.style.display = 'none';
      return;
    }

    expData.forEach((exp) => {
      const item = document.createElement('div');
      item.className = 'timeline-item';
      item.innerHTML = `
        <div class="timeline-period">${exp.period}</div>
        <div class="timeline-title">${exp.title}</div>
        <div class="timeline-subtitle">${exp.company}</div>
        ${exp.location ? `<div class="timeline-location"><i class="fas fa-map-marker-alt"></i>${exp.location}</div>` : ''}
        ${exp.description ? `<div class="timeline-details">${exp.description}</div>` : ''}
      `;
      container.appendChild(item);
    });
  }

  function renderServices(servicesData) {
    const container = document.getElementById('services-list');

    if (!servicesData || servicesData.length === 0) {
      container.closest('.section').style.display = 'none';
      const navLink = document.querySelector('a[href="#services"]');
      if (navLink) navLink.style.display = 'none';
      return;
    }

    const iconMap = {
      reviewer: 'fas fa-search',
      chair: 'fas fa-users',
      talk: 'fas fa-microphone',
      organizer: 'fas fa-calendar-alt',
    };

    servicesData.forEach((svc) => {
      const item = document.createElement('div');
      item.className = 'service-item';
      const icon = iconMap[svc.type] || 'fas fa-hands-helping';
      item.innerHTML = `
        <div class="service-icon"><i class="${icon}"></i></div>
        <div class="service-info">
          <div class="service-role">${svc.role}</div>
          <div class="service-venue">${svc.venue_url ? `<a href="${svc.venue_url}" target="_blank" rel="noopener noreferrer">${svc.venue}</a>` : svc.venue || ''}</div>
        </div>
      `;
      container.appendChild(item);
    });
  }

  // ─── Interactions ────────────────────────────────────────

  function initScrollSpy() {
    const sections = document.querySelectorAll('.section');
    const navLinks = document.querySelectorAll('.nav-link');

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.id;
            navLinks.forEach((link) => {
              link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
            });
          }
        });
      },
      { rootMargin: '-20% 0px -60% 0px' }
    );

    sections.forEach((section) => {
      if (section.style.display !== 'none') {
        observer.observe(section);
      }
    });
  }

  function initMobileNav() {
    const hamburger = document.querySelector('.hamburger');
    const sidebar = document.getElementById('sidebar');
    let overlay = document.querySelector('.sidebar-overlay');

    if (!overlay) {
      overlay = document.createElement('div');
      overlay.className = 'sidebar-overlay';
      document.body.appendChild(overlay);
    }

    function close() {
      sidebar.classList.remove('open');
      overlay.classList.remove('active');
    }

    hamburger.addEventListener('click', () => {
      const isOpen = sidebar.classList.contains('open');
      sidebar.classList.toggle('open', !isOpen);
      overlay.classList.toggle('active', !isOpen);
    });

    overlay.addEventListener('click', close);

    document.querySelectorAll('.nav-link').forEach((link) => {
      link.addEventListener('click', close);
    });
  }

  function initFooter() {
    const yearEl = document.getElementById('footer-year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();
  }

  // ─── Bootstrap ───────────────────────────────────────────

  async function init() {
    const data = await loadData();

    renderSidebar(data.personal);
    renderAbout(data.personal);
    renderNews(data.news);
    renderPublications(data.publications);
    renderHonors(data.honors);
    renderEducation(data.education);
    renderExperience(data.experience);
    renderServices(data.services);

    initScrollSpy();
    initMobileNav();
    initFooter();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
