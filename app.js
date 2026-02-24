/* ═══════════════════════════════════════════════════════════
   THE SINGULARITY DASHBOARD — Application Layer v3
   Rational Optimist Society © 2026

   Features: Animated sparklines, linear ghost lines,
   forecast projections, watchlist, insights bar,
   compare mode, search, share buttons
   ═══════════════════════════════════════════════════════════ */

(function() {
  'use strict';

  // ─── STATE ───
  let currentFilter = 'all';
  let currentSort = 'progress';
  let searchQuery = '';
  let compareMode = false;
  let compareList = [];
  let compareChart = null;
  let compareLogScale = false;
  let deepDiveCharts = {};
  let watchlist = JSON.parse(localStorage.getItem('ros-watchlist') || '[]');
  let insightsIndex = 0;
  let insightsInterval = null;

  // ─── HERO PARTICLES — Soft bokeh circles for light mode ───
  function initParticles() {
    const container = document.getElementById('hero-particles');
    if (!container) return;
    const colors = [
      'rgba(8, 145, 178, 0.12)',
      'rgba(124, 58, 237, 0.10)',
      'rgba(6, 182, 212, 0.08)',
      'rgba(167, 139, 250, 0.08)',
      'rgba(219, 39, 119, 0.06)'
    ];
    for (let i = 0; i < 20; i++) {
      const p = document.createElement('div');
      p.className = 'hero-particle';
      p.style.left = Math.random() * 100 + '%';
      p.style.top = (50 + Math.random() * 50) + '%';
      p.style.animationDelay = Math.random() * 14 + 's';
      p.style.animationDuration = (12 + Math.random() * 10) + 's';
      const size = (20 + Math.random() * 60);
      p.style.width = size + 'px';
      p.style.height = size + 'px';
      p.style.background = colors[Math.floor(Math.random() * colors.length)];
      p.style.filter = `blur(${8 + Math.random() * 12}px)`;
      container.appendChild(p);
    }
  }

  // ─── ANIMATED SPARKLINE RENDERER ───
  function drawSparkline(canvas, data, color, animate = false) {
    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    const w = rect.width;
    const h = rect.height;
    const max = Math.max(...data);
    const min = Math.min(...data);
    const range = max - min || 1;
    const step = w / (data.length - 1);
    const pad = 6;

    function getY(v) {
      return h - pad - ((v - min) / range) * (h - pad * 2);
    }

    function drawFrame(progress) {
      ctx.clearRect(0, 0, w, h);
      const drawCount = Math.floor(progress * data.length);
      if (drawCount < 2) return;

      const drawData = data.slice(0, drawCount);

      // Horizontal gradient for area: transparent left → colored right (intensification)
      const areaGrad = ctx.createLinearGradient(0, 0, w * progress, 0);
      areaGrad.addColorStop(0, color + '05');
      areaGrad.addColorStop(0.5, color + '15');
      areaGrad.addColorStop(1, color + '30');

      // Filled area
      ctx.beginPath();
      ctx.moveTo(0, h);
      drawData.forEach((v, i) => {
        ctx.lineTo(i * step, getY(v));
      });
      ctx.lineTo((drawData.length - 1) * step, h);
      ctx.closePath();
      ctx.fillStyle = areaGrad;
      ctx.fill();

      // Line with gradient intensification
      const lineGrad = ctx.createLinearGradient(0, 0, w * progress, 0);
      lineGrad.addColorStop(0, color + '60');
      lineGrad.addColorStop(0.6, color + 'cc');
      lineGrad.addColorStop(1, color);

      ctx.beginPath();
      drawData.forEach((v, i) => {
        const x = i * step;
        const y = getY(v);
        if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      });
      ctx.strokeStyle = lineGrad;
      ctx.lineWidth = 2.5;
      ctx.lineJoin = 'round';
      ctx.lineCap = 'round';
      ctx.stroke();

      // Endpoint dot
      if (progress >= 0.95) {
        const lastX = (drawData.length - 1) * step;
        const lastY = getY(drawData[drawData.length - 1]);
        ctx.beginPath();
        ctx.arc(lastX, lastY, 4, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.fill();
        ctx.beginPath();
        ctx.arc(lastX, lastY, 6, 0, Math.PI * 2);
        ctx.strokeStyle = color + '40';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Store endpoint for pulsing tip
        canvas.dataset.endX = lastX;
        canvas.dataset.endY = lastY;
      }
    }

    if (animate) {
      let start = null;
      const duration = 1200;
      function step(timestamp) {
        if (!start) start = timestamp;
        const progress = Math.min((timestamp - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
        drawFrame(eased);
        if (progress < 1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
    } else {
      drawFrame(1);
    }
  }

  // ─── SPARKLINE TOOLTIPS ───
  function initSparklineTooltips(card, data, color) {
    const container = card.querySelector('.sparkline-container');
    const canvas = card.querySelector('.sparkline-canvas');
    if (!container || !canvas) return;

    let tooltip = container.querySelector('.spark-tooltip');
    if (!tooltip) {
      tooltip = document.createElement('div');
      tooltip.className = 'spark-tooltip';
      container.appendChild(tooltip);
    }

    canvas.addEventListener('mousemove', (e) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const idx = Math.round((x / rect.width) * (data.length - 1));
      const clampedIdx = Math.max(0, Math.min(data.length - 1, idx));
      tooltip.textContent = data[clampedIdx].toFixed(1);
      tooltip.style.left = (x) + 'px';
      tooltip.style.opacity = '1';
    });

    canvas.addEventListener('mouseleave', () => {
      tooltip.style.opacity = '0';
    });
  }

  // ─── PULSING TIP DOT ───
  function addPulsingTip(card, canvas, color, acceleration) {
    if (acceleration < 4) return;
    const container = card.querySelector('.sparkline-container');
    if (!container) return;

    // Wait for canvas to render
    setTimeout(() => {
      const endX = parseFloat(canvas.dataset.endX);
      const endY = parseFloat(canvas.dataset.endY);
      if (isNaN(endX) || isNaN(endY)) return;

      let pulse = container.querySelector('.sparkline-pulse');
      if (!pulse) {
        pulse = document.createElement('div');
        pulse.className = 'sparkline-pulse';
        container.appendChild(pulse);
      }
      pulse.style.left = (endX - 4) + 'px';
      pulse.style.top = (endY - 4) + 'px';
      pulse.style.background = color;
      pulse.style.color = color;
    }, 1400);
  }

  // ─── SEARCH ───
  function initSearch() {
    const input = document.getElementById('tech-search');
    const clearBtn = document.getElementById('search-clear');
    if (!input) return;

    input.addEventListener('input', () => {
      searchQuery = input.value.trim().toLowerCase();
      clearBtn.classList.toggle('visible', searchQuery.length > 0);
      applySearch();
    });

    clearBtn.addEventListener('click', () => {
      input.value = '';
      searchQuery = '';
      clearBtn.classList.remove('visible');
      applySearch();
    });
  }

  function applySearch() {
    const cards = document.querySelectorAll('.tech-card');
    if (!searchQuery) {
      cards.forEach(c => { c.classList.remove('search-match', 'search-dim'); });
      return;
    }

    cards.forEach(card => {
      const id = card.dataset.id;
      const tech = TECHNOLOGIES.find(t => t.id === id);
      if (!tech) return;

      const searchable = [
        tech.name, tech.tagline, tech.whatItIs, tech.whyItMatters,
        tech.keyMetric.label, tech.keyMetric.value,
        ...tech.innovators.map(i => i.name + ' ' + i.desc),
        ...tech.whatItUnlocks,
        tech.category
      ].join(' ').toLowerCase();

      if (searchable.includes(searchQuery)) {
        card.classList.add('search-match');
        card.classList.remove('search-dim');
      } else {
        card.classList.remove('search-match');
        card.classList.add('search-dim');
      }
    });
  }

  // ─── WATCHLIST ───
  function toggleWatchlist(techId) {
    const idx = watchlist.indexOf(techId);
    if (idx >= 0) {
      watchlist.splice(idx, 1);
    } else {
      watchlist.push(techId);
    }
    localStorage.setItem('ros-watchlist', JSON.stringify(watchlist));
    updateWatchlistUI();
  }

  function updateWatchlistUI() {
    // Update star icons
    document.querySelectorAll('.tech-card-star').forEach(star => {
      const id = star.dataset.id;
      star.classList.toggle('starred', watchlist.includes(id));
      star.textContent = watchlist.includes(id) ? '\u2605' : '\u2606';
    });

    // Show/hide watchlist filter pill
    const filterBar = document.querySelector('.filter-bar');
    let watchPill = document.getElementById('watchlist-pill');
    if (watchlist.length > 0 && !watchPill) {
      watchPill = document.createElement('button');
      watchPill.id = 'watchlist-pill';
      watchPill.className = 'filter-pill';
      watchPill.dataset.filter = 'watchlist';
      watchPill.textContent = '\u2B50 My Watchlist';
      filterBar.insertBefore(watchPill, filterBar.firstChild.nextSibling);
      watchPill.addEventListener('click', () => {
        document.querySelectorAll('.filter-pill').forEach(b => b.classList.remove('active'));
        watchPill.classList.add('active');
        currentFilter = 'watchlist';
        buildTechCards();
        animateCardsIn();
        filterDeepDives();
      });
    } else if (watchlist.length === 0 && watchPill) {
      watchPill.remove();
      if (currentFilter === 'watchlist') {
        currentFilter = 'all';
        document.querySelector('.filter-pill[data-filter="all"]').classList.add('active');
        buildTechCards();
        animateCardsIn();
      }
    }
  }

  // ─── BUILD TECH CARDS ───
  function buildTechCards() {
    const grid = document.getElementById('tech-grid');
    if (!grid) return;

    grid.innerHTML = '';
    const sorted = getSortedTechs();

    if (sorted.length === 0) {
      grid.innerHTML = '<div class="search-no-results">No technologies match your current filters.</div>';
      return;
    }

    sorted.forEach((tech, index) => {
      const card = document.createElement('div');
      card.className = 'tech-card';
      card.dataset.id = tech.id;
      card.dataset.category = tech.category;
      card.style.setProperty('--card-accent', tech.accentColor);
      card.style.animationDelay = (index * 0.06) + 's';

      const accelClass = tech.acceleration >= 5 ? 'extreme' : '';
      const accelArrows = '\u25B2'.repeat(tech.acceleration);
      const isCompared = compareList.includes(tech.id);
      const isStarred = watchlist.includes(tech.id);

      // Get start/end years from data
      const years = tech.dataTable.map(r => r.period);
      const startYear = years[0] || '';
      const endYear = years[years.length - 1] || '';

      card.innerHTML = `
        <button class="tech-card-star ${isStarred ? 'starred' : ''}" data-id="${tech.id}" title="Add to watchlist">${isStarred ? '\u2605' : '\u2606'}</button>
        <div class="tech-card-compare ${isCompared ? 'checked' : ''}" data-id="${tech.id}">\u2713</div>
        <div class="tech-card-header">
          <div class="tech-card-icon">${tech.icon}</div>
          <div class="tech-card-accel ${accelClass}">
            ${accelArrows} ${tech.accelerationLabel}
          </div>
        </div>
        <div class="tech-card-title">${tech.name}</div>
        <div class="tech-card-tagline">${tech.tagline}</div>
        <div class="sparkline-container">
          <canvas class="sparkline-canvas" data-values="${tech.sparkline.join(',')}" data-color="${tech.accentColor}"></canvas>
        </div>
        <div class="sparkline-years">
          <span>${startYear}</span>
          <span>${endYear}</span>
        </div>
        <div class="tech-card-metric">
          <span class="metric-label">${tech.keyMetric.label}</span>
          <span class="metric-value">${tech.keyMetric.value}</span>
          <span class="metric-change">${tech.keyMetric.change}</span>
        </div>
        <div class="progress-container">
          <div class="progress-labels">
            <span>${tech.startValue} (${tech.startYear})</span>
            <span class="progress-value">${tech.progressPercent}%</span>
            <span>\u2192 ${tech.targetValue}</span>
          </div>
          <div class="progress-track">
            <div class="progress-fill" style="width: 0%; background: linear-gradient(90deg, ${tech.accentColor}, ${tech.accentColor}cc);" data-target="${tech.progressPercent}"></div>
          </div>
        </div>
        <div class="tech-card-hint">Click to explore deep dive \u2192</div>
      `;

      // Watchlist star click
      card.querySelector('.tech-card-star').addEventListener('click', (e) => {
        e.stopPropagation();
        toggleWatchlist(tech.id);
      });

      // Compare checkbox click
      card.querySelector('.tech-card-compare').addEventListener('click', (e) => {
        e.stopPropagation();
        toggleCompare(tech.id);
      });

      card.addEventListener('click', () => {
        if (!compareMode) scrollToDeepDive(tech.id);
      });

      grid.appendChild(card);
    });

    // Animated sparklines with IntersectionObserver
    const sparklineObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const canvas = entry.target;
          const values = canvas.dataset.values.split(',').map(Number);
          const color = canvas.dataset.color;
          drawSparkline(canvas, values, color, true);

          // Add pulsing tip
          const card = canvas.closest('.tech-card');
          if (card) {
            const techId = card.dataset.id;
            const tech = TECHNOLOGIES.find(t => t.id === techId);
            if (tech) addPulsingTip(card, canvas, color, tech.acceleration);
          }

          sparklineObserver.unobserve(canvas);
        }
      });
    }, { threshold: 0.3 });

    requestAnimationFrame(() => {
      document.querySelectorAll('.sparkline-canvas').forEach(canvas => {
        sparklineObserver.observe(canvas);
      });

      // Add tooltips
      document.querySelectorAll('.tech-card').forEach(card => {
        const canvas = card.querySelector('.sparkline-canvas');
        if (canvas) {
          const values = canvas.dataset.values.split(',').map(Number);
          initSparklineTooltips(card, values, canvas.dataset.color);
        }
      });
    });

    if (searchQuery) applySearch();
  }

  // ─── BUILD DEEP DIVE PANELS ───
  function buildDeepDives() {
    const container = document.getElementById('deep-dive-panels');
    if (!container) return;
    container.innerHTML = '';

    TECHNOLOGIES.forEach((tech, index) => {
      const panel = document.createElement('div');
      panel.className = 'deep-dive-panel';
      panel.id = `dd-${tech.id}`;
      panel.dataset.category = tech.category;
      panel.style.animationDelay = (index * 0.04) + 's';

      const milestonesHTML = tech.milestones.map(m =>
        `<div class="dd-milestone ${m.past ? 'past' : ''}">
          <span class="dd-milestone-year">${m.year}</span>
          <span class="dd-milestone-text">${m.text}</span>
        </div>`
      ).join('');

      const unlocksHTML = tech.whatItUnlocks.map(u => `<li>${u}</li>`).join('');

      const innovatorsHTML = tech.innovators.map(inn =>
        `<div class="innovator-card">
          <div class="innovator-name">${inn.name}</div>
          <div class="innovator-desc">${inn.desc}</div>
          <span class="innovator-tag">${inn.tag}</span>
        </div>`
      ).join('');

      const tableRowsHTML = tech.dataTable.map(row =>
        `<tr>
          <td>${row.period}</td>
          <td class="mono highlight">${row.value}</td>
          <td>${row.context}</td>
        </tr>`
      ).join('');

      const ds = tech.dataSource || {};
      const autoClass = ds.automated ? 'live' : 'manual';
      const autoLabel = ds.automated ? '\uD83D\uDFE2 LIVE' : '\uD83D\uDFE1 MANUAL';
      const sourceHTML = ds.name ? `
        <div class="dd-source">
          <span class="dd-source-auto ${autoClass}">${autoLabel}</span>
          <span>Source: <a href="${ds.url}" target="_blank" rel="noopener">${ds.name}</a></span>
          <span>\u2022 Updated: ${ds.lastPull || 'N/A'}</span>
          <span>\u2022 ${ds.frequency || ''}</span>
        </div>
      ` : '';

      const shareText = encodeURIComponent(`${tech.icon} ${tech.name}: ${tech.keyMetric.value} (${tech.keyMetric.change})\n\nTracked on The Singularity Dashboard by @disruptionhedge \uD83D\uDE80`);
      const shareURL = encodeURIComponent('https://rationaloptimistsociety.com/singularity-dashboard');
      const shareHTML = `
        <div class="share-row">
          <a class="share-btn" href="https://x.com/intent/tweet?text=${shareText}&url=${shareURL}" target="_blank" rel="noopener">
            <svg viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
            Share on \uD835\uDD4F
          </a>
          <button class="share-btn copy-link" data-tech="${tech.id}">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg>
            Copy Stats
          </button>
        </div>
      `;

      const chartHTML = `
        <div class="dd-chart-section">
          <div class="dd-chart-header">
            <h4>\uD83D\uDCC8 Interactive Chart</h4>
            <div class="dd-chart-controls">
              <button class="chart-toggle dd-log-btn" data-tech="${tech.id}" title="Toggle logarithmic scale">Log Scale</button>
            </div>
          </div>
          <div class="dd-chart-wrap">
            <canvas id="chart-${tech.id}"></canvas>
          </div>
        </div>
      `;

      panel.innerHTML = `
        <div class="dd-header">
          <div class="dd-icon">${tech.icon}</div>
          <div class="dd-title-area">
            <div class="dd-title">${tech.name}</div>
            <div class="dd-subtitle">${tech.tagline}</div>
          </div>
          <div class="dd-progress-mini">
            <div class="progress-track">
              <div class="progress-fill" style="width: ${tech.progressPercent}%; background: ${tech.accentColor};"></div>
            </div>
          </div>
          <div class="dd-chevron">\u25BC</div>
        </div>
        <div class="dd-body">
          <div class="dd-content">
            ${sourceHTML}
            <div class="dd-grid">
              <div class="dd-block">
                <h4>What It Is</h4>
                <p>${tech.whatItIs}</p>
              </div>
              <div class="dd-block">
                <h4>Why It Matters</h4>
                <p>${tech.whyItMatters}</p>
              </div>
              <div class="dd-block dd-full">
                <h4>What It Unlocks</h4>
                <ul>${unlocksHTML}</ul>
              </div>
              <div class="dd-block">
                <h4>Key Milestones</h4>
                <div class="dd-milestones">${milestonesHTML}</div>
              </div>
              <div class="dd-block">
                <h4>The Data</h4>
                <table class="dd-data-table">
                  <thead><tr><th>Period</th><th>Value</th><th>Context</th></tr></thead>
                  <tbody>${tableRowsHTML}</tbody>
                </table>
              </div>
              <div class="dd-block dd-full">
                <h4>Leading Innovators</h4>
                <div class="dd-innovators">${innovatorsHTML}</div>
              </div>
            </div>
            ${chartHTML}
            ${shareHTML}
          </div>
        </div>
      `;

      panel.querySelector('.dd-header').addEventListener('click', () => {
        const isExpanded = panel.classList.contains('expanded');
        document.querySelectorAll('.deep-dive-panel.expanded').forEach(p => {
          if (p !== panel) p.classList.remove('expanded');
        });
        panel.classList.toggle('expanded');

        if (!isExpanded) {
          setTimeout(() => {
            panel.scrollIntoView({ behavior: 'smooth', block: 'start' });
            initDeepDiveChart(tech);
          }, 100);
        }
      });

      panel.addEventListener('click', (e) => {
        const copyBtn = e.target.closest('.copy-link');
        if (copyBtn) {
          const statsText = `${tech.icon} ${tech.name}\n${tech.keyMetric.label}: ${tech.keyMetric.value} (${tech.keyMetric.change})\nProgress: ${tech.progressPercent}% toward ${tech.targetValue}\n\nSource: The Singularity Dashboard by Rational Optimist Society`;
          navigator.clipboard.writeText(statsText).then(() => {
            const origHTML = copyBtn.innerHTML;
            copyBtn.innerHTML = '<span class="copied-msg">\u2713 Copied!</span>';
            setTimeout(() => { copyBtn.innerHTML = origHTML; }, 2000);
          });
        }
      });

      panel.addEventListener('click', (e) => {
        const logBtn = e.target.closest('.dd-log-btn');
        if (logBtn) {
          logBtn.classList.toggle('active');
          initDeepDiveChart(tech, logBtn.classList.contains('active'));
        }
      });

      container.appendChild(panel);
    });
  }

  // ─── DEEP DIVE CHARTS — with ghost line + forecast projection ───
  function initDeepDiveChart(tech, logScale = false) {
    const canvasId = `chart-${tech.id}`;
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;

    if (deepDiveCharts[tech.id]) {
      deepDiveCharts[tech.id].destroy();
    }

    const labels = tech.dataTable.map(r => r.period);
    const values = tech.dataTable.map(r => parseNumericValue(r.value));

    const ctx = canvas.getContext('2d');

    // Horizontal gradient for area fill (intensifies toward present)
    const areaGrad = ctx.createLinearGradient(0, 0, canvas.parentElement.offsetWidth, 0);
    areaGrad.addColorStop(0, tech.accentColor + '05');
    areaGrad.addColorStop(0.5, tech.accentColor + '15');
    areaGrad.addColorStop(1, tech.accentColor + '35');

    // Linear expectation ghost line
    const firstVal = values[0] || 0;
    const lastVal = values[values.length - 1] || 0;
    const linearStep = values.length > 1 ? (lastVal - firstVal) / (values.length - 1) : 0;
    const linearData = values.map((_, i) => firstVal + linearStep * i);

    // Forecast projection (extrapolate using last 3 data points)
    const forecastLabels = [...labels];
    const forecastData = [...values];
    const forecastLinear = [...linearData];
    const numForecast = 3;

    if (values.length >= 3) {
      const recent = values.slice(-3);
      const recentRatios = [];
      for (let i = 1; i < recent.length; i++) {
        if (recent[i - 1] !== 0) {
          recentRatios.push(recent[i] / recent[i - 1]);
        }
      }
      const avgRatio = recentRatios.length > 0
        ? recentRatios.reduce((a, b) => a + b, 0) / recentRatios.length
        : 1;

      let lastForecast = values[values.length - 1];
      let lastLinear = linearData[linearData.length - 1];
      for (let i = 1; i <= numForecast; i++) {
        const yearNum = parseInt(labels[labels.length - 1]) || 2026;
        forecastLabels.push(String(yearNum + i) + '?');
        lastForecast *= avgRatio;
        forecastData.push(lastForecast);
        lastLinear += linearStep;
        forecastLinear.push(lastLinear);
      }
    }

    // Build actual data + null padding for forecast portion
    const actualData = values.concat(Array(numForecast).fill(null));
    // Build forecast data: null for actuals except last point (to connect), then forecast
    const projectedData = Array(values.length).fill(null);
    projectedData[values.length - 1] = values[values.length - 1]; // connect point
    if (values.length >= 3) {
      let lastForecast = values[values.length - 1];
      const recent = values.slice(-3);
      const recentRatios = [];
      for (let i = 1; i < recent.length; i++) {
        if (recent[i - 1] !== 0) recentRatios.push(recent[i] / recent[i - 1]);
      }
      const avgRatio = recentRatios.length > 0
        ? recentRatios.reduce((a, b) => a + b, 0) / recentRatios.length
        : 1;
      for (let i = 0; i < numForecast; i++) {
        lastForecast *= avgRatio;
        projectedData.push(lastForecast);
      }
    }

    const datasets = [
      {
        label: tech.keyMetric.label || tech.name,
        data: actualData,
        borderColor: tech.accentColor,
        backgroundColor: areaGrad,
        borderWidth: 3,
        pointRadius: 5,
        pointHoverRadius: 8,
        pointBackgroundColor: tech.accentColor,
        pointBorderColor: '#ffffff',
        pointBorderWidth: 2,
        fill: true,
        tension: 0.3,
        spanGaps: false,
      },
      {
        label: 'Linear Expectation',
        data: forecastLinear,
        borderColor: 'rgba(0, 0, 0, 0.15)',
        borderWidth: 2,
        borderDash: [6, 4],
        pointRadius: 0,
        pointHoverRadius: 0,
        fill: false,
        tension: 0,
      },
      {
        label: 'Projected',
        data: projectedData,
        borderColor: tech.accentColor + '80',
        borderWidth: 2.5,
        borderDash: [8, 5],
        pointRadius: function(ctx) {
          return ctx.dataIndex >= values.length ? 4 : 0;
        },
        pointBackgroundColor: tech.accentColor + '80',
        pointBorderColor: '#ffffff',
        pointBorderWidth: 2,
        fill: false,
        tension: 0.3,
        spanGaps: true,
      }
    ];

    deepDiveCharts[tech.id] = new Chart(ctx, {
      type: 'line',
      data: {
        labels: forecastLabels,
        datasets: datasets
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
          mode: 'index',
          intersect: false,
        },
        plugins: {
          legend: {
            display: true,
            position: 'top',
            labels: {
              color: 'rgba(17, 17, 17, 0.50)',
              font: { family: 'Inter', size: 11 },
              usePointStyle: true,
              pointStyle: 'circle',
              padding: 16,
            }
          },
          tooltip: {
            backgroundColor: 'rgba(255, 255, 255, 0.97)',
            titleColor: '#111111',
            bodyColor: 'rgba(17, 17, 17, 0.70)',
            borderColor: 'rgba(0, 0, 0, 0.10)',
            borderWidth: 1,
            padding: 14,
            titleFont: { family: 'Space Grotesk', size: 14, weight: '600' },
            bodyFont: { family: 'JetBrains Mono', size: 12 },
            cornerRadius: 10,
            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.10)',
            callbacks: {
              label: (context) => {
                if (context.datasetIndex === 0) {
                  const row = tech.dataTable[context.dataIndex];
                  if (row) return [`Value: ${row.value}`, `Context: ${row.context}`];
                }
                if (context.datasetIndex === 1) return `Linear: ${formatChartValue(context.raw)}`;
                if (context.datasetIndex === 2 && context.raw !== null) return `Projected: ${formatChartValue(context.raw)}`;
                return null;
              }
            }
          },
        },
        scales: {
          x: {
            ticks: {
              color: 'rgba(17, 17, 17, 0.35)',
              font: { family: 'Inter', size: 11 }
            },
            grid: { color: 'rgba(0, 0, 0, 0.04)' },
          },
          y: {
            type: logScale ? 'logarithmic' : 'linear',
            ticks: {
              color: 'rgba(17, 17, 17, 0.35)',
              font: { family: 'JetBrains Mono', size: 11 },
              callback: (v) => formatChartValue(v),
            },
            grid: { color: 'rgba(0, 0, 0, 0.04)' },
          }
        }
      }
    });
  }

  function parseNumericValue(str) {
    if (typeof str === 'number') return str;
    str = String(str).replace(/[,~+>]/g, '').trim();

    const sciMatch = str.match(/(\d+(?:\.\d+)?)\s*[×x]\s*10\^?(\d+)/i);
    if (sciMatch) return parseFloat(sciMatch[1]) * Math.pow(10, parseInt(sciMatch[2]));

    const eMatch = str.match(/(\d+(?:\.\d+)?)[eE]\+?(\d+)/);
    if (eMatch) return parseFloat(eMatch[1]) * Math.pow(10, parseInt(eMatch[2]));

    const suffixMatch = str.match(/([\d.]+)\s*(T|B|M|K|GW|GWh|TWh|hrs?|min)/i);
    if (suffixMatch) {
      const num = parseFloat(suffixMatch[1]);
      const suffix = suffixMatch[2].toLowerCase();
      const multipliers = { 't': 1e12, 'b': 1e9, 'm': 1e6, 'k': 1e3, 'gw': 1, 'gwh': 1, 'twh': 1, 'hr': 1, 'hrs': 1, 'min': 1/60 };
      return num * (multipliers[suffix] || 1);
    }

    const currMatch = str.match(/\$?([\d.]+)/);
    if (currMatch) return parseFloat(currMatch[1]);

    const num = parseFloat(str);
    return isNaN(num) ? 0 : num;
  }

  function formatChartValue(v) {
    if (v >= 1e12) return (v / 1e12).toFixed(1) + 'T';
    if (v >= 1e9) return (v / 1e9).toFixed(1) + 'B';
    if (v >= 1e6) return (v / 1e6).toFixed(1) + 'M';
    if (v >= 1e3) return (v / 1e3).toFixed(1) + 'K';
    if (v >= 1) return v.toFixed(1);
    if (v >= 0.01) return v.toFixed(2);
    return v.toFixed(4);
  }

  // ─── COMPARISON MODE ───
  function initCompareMode() {
    const toggleBtn = document.getElementById('compare-toggle');
    if (!toggleBtn) return;

    toggleBtn.addEventListener('click', () => {
      compareMode = !compareMode;
      toggleBtn.classList.toggle('active', compareMode);
      document.getElementById('tech-grid').classList.toggle('compare-mode', compareMode);

      const panel = document.getElementById('compare-panel');
      if (compareMode) {
        panel.style.display = 'block';
      } else {
        panel.style.display = 'none';
        compareList = [];
        updateCompareUI();
      }
    });

    const logBtn = document.getElementById('compare-log-toggle');
    if (logBtn) {
      logBtn.addEventListener('click', () => {
        compareLogScale = !compareLogScale;
        logBtn.classList.toggle('active', compareLogScale);
        updateCompareChart();
      });
    }

    const clearBtn = document.getElementById('compare-clear');
    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        compareList = [];
        updateCompareUI();
        buildTechCards();
      });
    }
  }

  function toggleCompare(techId) {
    const idx = compareList.indexOf(techId);
    if (idx >= 0) {
      compareList.splice(idx, 1);
    } else {
      if (compareList.length >= 6) return;
      compareList.push(techId);
    }
    updateCompareUI();
    document.querySelectorAll('.tech-card-compare').forEach(cb => {
      cb.classList.toggle('checked', compareList.includes(cb.dataset.id));
    });
  }

  function updateCompareUI() {
    const selectedDiv = document.getElementById('compare-selected');
    if (!selectedDiv) return;

    selectedDiv.innerHTML = compareList.map(id => {
      const tech = TECHNOLOGIES.find(t => t.id === id);
      if (!tech) return '';
      return `<span class="compare-pill" style="background:${tech.accentColor}">
        ${tech.icon} ${tech.name}
        <span class="remove-pill" data-id="${id}">&times;</span>
      </span>`;
    }).join('');

    selectedDiv.querySelectorAll('.remove-pill').forEach(btn => {
      btn.addEventListener('click', () => {
        toggleCompare(btn.dataset.id);
        document.querySelectorAll('.tech-card-compare').forEach(cb => {
          cb.classList.toggle('checked', compareList.includes(cb.dataset.id));
        });
      });
    });

    updateCompareChart();
  }

  function updateCompareChart() {
    const canvas = document.getElementById('compare-chart');
    if (!canvas) return;

    if (compareChart) {
      compareChart.destroy();
      compareChart = null;
    }

    if (compareList.length === 0) return;

    const datasets = compareList.map(id => {
      const tech = TECHNOLOGIES.find(t => t.id === id);
      if (!tech) return null;

      return {
        label: tech.name,
        data: tech.sparkline,
        borderColor: tech.accentColor,
        backgroundColor: tech.accentColor + '10',
        borderWidth: 2.5,
        pointRadius: 3,
        pointHoverRadius: 6,
        pointBackgroundColor: tech.accentColor,
        fill: false,
        tension: 0.3,
      };
    }).filter(Boolean);

    const maxLen = Math.max(...datasets.map(d => d.data.length));
    const labels = Array.from({length: maxLen}, (_, i) => `T-${maxLen - 1 - i}`);

    const ctx = canvas.getContext('2d');
    compareChart = new Chart(ctx, {
      type: 'line',
      data: { labels, datasets },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: { mode: 'index', intersect: false },
        plugins: {
          legend: {
            display: true,
            position: 'top',
            labels: {
              color: 'rgba(17, 17, 17, 0.55)',
              font: { family: 'Inter', size: 12 },
              usePointStyle: true,
              pointStyle: 'circle',
              padding: 16,
            }
          },
          tooltip: {
            backgroundColor: 'rgba(255, 255, 255, 0.97)',
            titleColor: '#111111',
            bodyColor: 'rgba(17, 17, 17, 0.70)',
            borderColor: 'rgba(0, 0, 0, 0.10)',
            borderWidth: 1,
            padding: 12,
            cornerRadius: 10,
          }
        },
        scales: {
          x: {
            ticks: { color: 'rgba(17, 17, 17, 0.30)', font: { family: 'Inter', size: 11 } },
            grid: { color: 'rgba(0, 0, 0, 0.04)' },
          },
          y: {
            type: compareLogScale ? 'logarithmic' : 'linear',
            ticks: {
              color: 'rgba(17, 17, 17, 0.30)',
              font: { family: 'JetBrains Mono', size: 11 },
            },
            grid: { color: 'rgba(0, 0, 0, 0.04)' },
            title: {
              display: true,
              text: 'Normalized Progress (0-100)',
              color: 'rgba(17, 17, 17, 0.30)',
              font: { family: 'Inter', size: 11 },
            }
          }
        }
      }
    });
  }

  // ─── SCROLL TO DEEP DIVE ───
  function scrollToDeepDive(techId) {
    const panel = document.getElementById(`dd-${techId}`);
    if (!panel) return;

    document.querySelectorAll('.deep-dive-panel.expanded').forEach(p => p.classList.remove('expanded'));
    panel.classList.add('expanded');

    setTimeout(() => {
      panel.scrollIntoView({ behavior: 'smooth', block: 'start' });
      const tech = TECHNOLOGIES.find(t => t.id === techId);
      if (tech) initDeepDiveChart(tech);
    }, 150);
  }

  // ─── FILTER & SORT ───
  function getSortedTechs() {
    let techs = [...TECHNOLOGIES];

    if (currentFilter === 'watchlist') {
      techs = techs.filter(t => watchlist.includes(t.id));
    } else if (currentFilter !== 'all') {
      techs = techs.filter(t => t.category === currentFilter);
    }

    // Watchlist items float to top
    if (currentFilter !== 'watchlist' && watchlist.length > 0) {
      techs.sort((a, b) => {
        const aW = watchlist.includes(a.id) ? 1 : 0;
        const bW = watchlist.includes(b.id) ? 1 : 0;
        if (aW !== bW) return bW - aW;
        return 0;
      });
    }

    if (searchQuery) {
      techs = techs.filter(t => {
        const searchable = [
          t.name, t.tagline, t.whatItIs, t.whyItMatters,
          t.keyMetric.label, t.keyMetric.value,
          ...t.innovators.map(i => i.name + ' ' + i.desc),
          ...t.whatItUnlocks,
          t.category
        ].join(' ').toLowerCase();
        return searchable.includes(searchQuery);
      });
    }

    switch (currentSort) {
      case 'progress':
        techs.sort((a, b) => {
          const aW = watchlist.includes(a.id) ? 1 : 0;
          const bW = watchlist.includes(b.id) ? 1 : 0;
          if (aW !== bW) return bW - aW;
          return b.progressPercent - a.progressPercent;
        });
        break;
      case 'acceleration':
        techs.sort((a, b) => {
          const aW = watchlist.includes(a.id) ? 1 : 0;
          const bW = watchlist.includes(b.id) ? 1 : 0;
          if (aW !== bW) return bW - aW;
          return b.acceleration - a.acceleration || b.progressPercent - a.progressPercent;
        });
        break;
      case 'name':
        techs.sort((a, b) => a.name.localeCompare(b.name));
        break;
    }

    return techs;
  }

  function initFilters() {
    document.querySelectorAll('.filter-pill').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.filter-pill').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentFilter = btn.dataset.filter;
        buildTechCards();
        animateCardsIn();
        filterDeepDives();
      });
    });

    document.querySelectorAll('.sort-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.sort-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentSort = btn.dataset.sort;
        buildTechCards();
        animateCardsIn();
      });
    });
  }

  function filterDeepDives() {
    document.querySelectorAll('.deep-dive-panel').forEach(panel => {
      if (currentFilter === 'all' || currentFilter === 'watchlist' || panel.dataset.category === currentFilter) {
        panel.style.display = '';
      } else {
        panel.style.display = 'none';
        panel.classList.remove('expanded');
      }
    });
  }

  // ─── ANIMATION ON SCROLL ───
  function animateCardsIn() {
    const cards = document.querySelectorAll('.tech-card');
    cards.forEach((card, i) => {
      setTimeout(() => card.classList.add('visible'), i * 60);
    });

    setTimeout(() => {
      document.querySelectorAll('.progress-fill[data-target]').forEach(bar => {
        bar.style.width = bar.dataset.target + '%';
      });
    }, 300);
  }

  function initScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    document.querySelectorAll('.deep-dive-panel').forEach(panel => {
      observer.observe(panel);
    });
  }

  // ─── HERO STATS ───
  function updateHeroStats() {
    const avg = Math.round(TECHNOLOGIES.reduce((s, t) => s + t.progressPercent, 0) / TECHNOLOGIES.length);
    const accelerating = TECHNOLOGIES.filter(t => t.acceleration >= 4).length;

    animateNumber('stat-avg-progress', avg, '%');
    animateNumber('stat-acceleration', accelerating, '/' + TECHNOLOGIES.length);
  }

  function animateNumber(id, target, suffix) {
    const el = document.getElementById(id);
    if (!el) return;

    let current = 0;
    const step = target / 40;
    const interval = setInterval(() => {
      current += step;
      if (current >= target) {
        current = target;
        clearInterval(interval);
      }
      el.textContent = Math.round(current) + suffix;
    }, 30);
  }

  // ─── ABUNDANCE CLOCK ───
  function updateAbundanceClock() {
    const fill = document.getElementById('abundance-fill');
    const value = document.getElementById('abundance-value');
    if (!fill || !value) return;

    const avg = TECHNOLOGIES.reduce((s, t) => s + t.progressPercent, 0) / TECHNOLOGIES.length;
    const abundancePercent = Math.round(avg);

    setTimeout(() => {
      fill.style.width = abundancePercent + '%';
    }, 500);

    const hours = Math.round((abundancePercent / 100) * 12);
    const minutes = Math.round(((abundancePercent / 100) * 12 % 1) * 60);
    value.textContent = `${abundancePercent}% toward abundance \u2014 ${hours} hours past midnight`;
  }

  // ─── INSIGHTS BAR ───
  function initInsightsBar() {
    const insights = generateInsights();
    const bar = document.getElementById('insights-bar');
    if (!bar || insights.length === 0) return;

    const textWrap = bar.querySelector('.insights-text-wrap');
    const prevBtn = bar.querySelector('.insights-prev');
    const nextBtn = bar.querySelector('.insights-next');

    // Create all text elements
    insights.forEach((text, i) => {
      const el = document.createElement('div');
      el.className = 'insights-text' + (i === 0 ? ' active' : ' enter');
      el.textContent = text;
      textWrap.appendChild(el);
    });

    function rotate(direction) {
      const items = textWrap.querySelectorAll('.insights-text');
      const current = items[insightsIndex];
      current.className = 'insights-text exit';

      insightsIndex = direction === 'next'
        ? (insightsIndex + 1) % insights.length
        : (insightsIndex - 1 + insights.length) % insights.length;

      const next = items[insightsIndex];
      next.className = 'insights-text enter';

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          next.className = 'insights-text active';
        });
      });
    }

    if (prevBtn) prevBtn.addEventListener('click', () => { rotate('prev'); resetInterval(); });
    if (nextBtn) nextBtn.addEventListener('click', () => { rotate('next'); resetInterval(); });

    function resetInterval() {
      clearInterval(insightsInterval);
      insightsInterval = setInterval(() => rotate('next'), 6000);
    }

    resetInterval();
  }

  function generateInsights() {
    const insights = [];

    TECHNOLOGIES.forEach(tech => {
      const dt = tech.dataTable;
      if (dt.length >= 2) {
        const first = dt[0];
        const last = dt[dt.length - 1];

        // Cost reduction insights
        if (tech.keyMetric.change && tech.keyMetric.change.includes('-')) {
          insights.push(`${tech.icon} ${tech.name}: ${tech.keyMetric.value} ${tech.keyMetric.change}`);
        }

        // Acceleration insights
        if (tech.acceleration >= 5) {
          insights.push(`${tech.icon} ${tech.name} is at maximum acceleration \u2014 ${tech.accelerationLabel}`);
        }

        // High progress insights
        if (tech.progressPercent >= 80) {
          insights.push(`${tech.icon} ${tech.name}: ${tech.progressPercent}% of the way to its tipping point`);
        }
      }

      // Use tagline as insight
      if (tech.tagline.length < 80) {
        insights.push(`${tech.icon} ${tech.name}: ${tech.tagline}`);
      }
    });

    // Shuffle and take top 12
    for (let i = insights.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [insights[i], insights[j]] = [insights[j], insights[i]];
    }

    return insights.slice(0, 12);
  }

  // ─── MOBILE MENU ───
  function initMobileMenu() {
    const btn = document.querySelector('.mobile-menu-btn');
    const links = document.querySelector('.nav-links');
    if (!btn || !links) return;

    btn.addEventListener('click', () => links.classList.toggle('open'));
    links.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => links.classList.remove('open'));
    });
  }

  // ─── SMOOTH SCROLL ───
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(a => {
      a.addEventListener('click', (e) => {
        const target = document.querySelector(a.getAttribute('href'));
        if (target) {
          e.preventDefault();
          const offset = 70;
          const y = target.getBoundingClientRect().top + window.pageYOffset - offset;
          window.scrollTo({ top: y, behavior: 'smooth' });
        }
      });
    });
  }

  // ─── RESIZE HANDLER ───
  let resizeTimeout;
  function initResizeHandler() {
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        document.querySelectorAll('.sparkline-canvas').forEach(canvas => {
          const values = canvas.dataset.values.split(',').map(Number);
          const color = canvas.dataset.color;
          drawSparkline(canvas, values, color, false);
        });
      }, 250);
    });
  }

  // ─── KEYBOARD NAVIGATION ───
  function initKeyboard() {
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        const overlay = document.getElementById('modal-overlay');
        if (overlay && overlay.classList.contains('active')) {
          overlay.classList.remove('active');
        }
        document.querySelectorAll('.deep-dive-panel.expanded').forEach(p => p.classList.remove('expanded'));

        const input = document.getElementById('tech-search');
        if (input && document.activeElement === input) {
          input.value = '';
          searchQuery = '';
          document.getElementById('search-clear').classList.remove('visible');
          applySearch();
        }
      }

      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        const input = document.getElementById('tech-search');
        if (input) input.focus();
      }
    });
  }

  // ─── INITIALIZE EVERYTHING ───
  function init() {
    initParticles();
    buildTechCards();
    buildDeepDives();
    initFilters();
    initSearch();
    initCompareMode();
    updateHeroStats();
    updateAbundanceClock();
    initInsightsBar();
    updateWatchlistUI();
    initMobileMenu();
    initSmoothScroll();
    initResizeHandler();
    initKeyboard();
    initScrollAnimations();

    setTimeout(animateCardsIn, 200);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
