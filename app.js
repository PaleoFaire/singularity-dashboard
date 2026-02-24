/* ═══════════════════════════════════════════════════════════
   THE SINGULARITY DASHBOARD — Application Layer v2
   Rational Optimist Society © 2026

   Features: Interactive charts, search, compare mode,
   share buttons, log-scale toggles, sparkline tooltips
   ═══════════════════════════════════════════════════════════ */

(function() {
  'use strict';

  // ─── STATE ───
  let currentFilter = 'all';
  let currentSort = 'progress';
  let searchQuery = '';
  let compareMode = false;
  let compareList = []; // tech IDs selected for comparison
  let compareChart = null;
  let compareLogScale = false;
  let deepDiveCharts = {}; // id -> Chart instance

  // ─── HERO PARTICLES ───
  function initParticles() {
    const container = document.getElementById('hero-particles');
    if (!container) return;
    for (let i = 0; i < 30; i++) {
      const p = document.createElement('div');
      p.className = 'hero-particle';
      p.style.left = Math.random() * 100 + '%';
      p.style.animationDelay = Math.random() * 8 + 's';
      p.style.animationDuration = (6 + Math.random() * 6) + 's';
      p.style.width = p.style.height = (1 + Math.random() * 3) + 'px';
      container.appendChild(p);
    }
  }

  // ─── SPARKLINE RENDERER ───
  function drawSparkline(canvas, data, color) {
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
    const pad = 4;

    // Filled area
    ctx.beginPath();
    ctx.moveTo(0, h);
    data.forEach((v, i) => {
      const x = i * step;
      const y = h - pad - ((v - min) / range) * (h - pad * 2);
      ctx.lineTo(x, y);
    });
    ctx.lineTo(w, h);
    ctx.closePath();

    const grad = ctx.createLinearGradient(0, 0, 0, h);
    grad.addColorStop(0, color + '30');
    grad.addColorStop(1, color + '05');
    ctx.fillStyle = grad;
    ctx.fill();

    // Line
    ctx.beginPath();
    data.forEach((v, i) => {
      const x = i * step;
      const y = h - pad - ((v - min) / range) * (h - pad * 2);
      if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    });
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.lineJoin = 'round';
    ctx.stroke();

    // Endpoint dot
    const lastX = (data.length - 1) * step;
    const lastY = h - pad - ((data[data.length - 1] - min) / range) * (h - pad * 2);
    ctx.beginPath();
    ctx.arc(lastX, lastY, 3, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.fill();
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

    let matchCount = 0;
    cards.forEach(card => {
      const id = card.dataset.id;
      const tech = TECHNOLOGIES.find(t => t.id === id);
      if (!tech) return;

      // Search across multiple fields
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
        matchCount++;
      } else {
        card.classList.remove('search-match');
        card.classList.add('search-dim');
      }
    });
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
      const accelArrows = '▲'.repeat(tech.acceleration);
      const isCompared = compareList.includes(tech.id);

      card.innerHTML = `
        <div class="tech-card-compare ${isCompared ? 'checked' : ''}" data-id="${tech.id}">✓</div>
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
        <div class="tech-card-metric">
          <span class="metric-label">${tech.keyMetric.label}</span>
          <span class="metric-value">${tech.keyMetric.value}</span>
          <span class="metric-change">${tech.keyMetric.change}</span>
        </div>
        <div class="progress-container">
          <div class="progress-labels">
            <span>${tech.startValue} (${tech.startYear})</span>
            <span class="progress-value">${tech.progressPercent}%</span>
            <span>→ ${tech.targetValue}</span>
          </div>
          <div class="progress-track">
            <div class="progress-fill" style="width: 0%; background: linear-gradient(90deg, ${tech.accentColor}, ${tech.accentColor}cc);" data-target="${tech.progressPercent}"></div>
          </div>
        </div>
        <div class="tech-card-hint">Click to explore deep dive →</div>
      `;

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

    // Draw sparklines + tooltips
    requestAnimationFrame(() => {
      document.querySelectorAll('.sparkline-canvas').forEach(canvas => {
        const values = canvas.dataset.values.split(',').map(Number);
        const color = canvas.dataset.color;
        drawSparkline(canvas, values, color);
      });

      // Add tooltips
      document.querySelectorAll('.tech-card').forEach(card => {
        const canvas = card.querySelector('.sparkline-canvas');
        if (canvas) {
          const values = canvas.dataset.values.split(',').map(Number);
          const color = canvas.dataset.color;
          initSparklineTooltips(card, values, color);
        }
      });
    });

    // Reapply search if active
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

      // Data source badge
      const ds = tech.dataSource || {};
      const autoClass = ds.automated ? 'live' : 'manual';
      const autoLabel = ds.automated ? '🟢 LIVE' : '🟡 MANUAL';
      const sourceHTML = ds.name ? `
        <div class="dd-source">
          <span class="dd-source-auto ${autoClass}">${autoLabel}</span>
          <span>Source: <a href="${ds.url}" target="_blank" rel="noopener">${ds.name}</a></span>
          <span>• Updated: ${ds.lastPull || 'N/A'}</span>
          <span>• ${ds.frequency || ''}</span>
        </div>
      ` : '';

      // Share buttons
      const shareText = encodeURIComponent(`${tech.icon} ${tech.name}: ${tech.keyMetric.value} (${tech.keyMetric.change})\n\nTracked on The Singularity Dashboard by @disruptionhedge 🚀`);
      const shareURL = encodeURIComponent('https://rationaloptimistsociety.com/singularity-dashboard');
      const shareHTML = `
        <div class="share-row">
          <a class="share-btn" href="https://x.com/intent/tweet?text=${shareText}&url=${shareURL}" target="_blank" rel="noopener">
            <svg viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
            Share on 𝕏
          </a>
          <button class="share-btn copy-link" data-tech="${tech.id}">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg>
            Copy Stats
          </button>
        </div>
      `;

      // Chart canvas for deep dive
      const chartHTML = `
        <div class="dd-chart-section">
          <div class="dd-chart-header">
            <h4>📈 Interactive Chart</h4>
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
          <div class="dd-chevron">▼</div>
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

      // Expand/collapse
      panel.querySelector('.dd-header').addEventListener('click', () => {
        const isExpanded = panel.classList.contains('expanded');
        document.querySelectorAll('.deep-dive-panel.expanded').forEach(p => {
          if (p !== panel) p.classList.remove('expanded');
        });
        panel.classList.toggle('expanded');

        if (!isExpanded) {
          setTimeout(() => {
            panel.scrollIntoView({ behavior: 'smooth', block: 'start' });
            // Initialize chart when expanded
            initDeepDiveChart(tech);
          }, 100);
        }
      });

      // Copy stats button
      panel.addEventListener('click', (e) => {
        const copyBtn = e.target.closest('.copy-link');
        if (copyBtn) {
          const statsText = `${tech.icon} ${tech.name}\n${tech.keyMetric.label}: ${tech.keyMetric.value} (${tech.keyMetric.change})\nProgress: ${tech.progressPercent}% toward ${tech.targetValue}\n\nSource: The Singularity Dashboard by Rational Optimist Society`;
          navigator.clipboard.writeText(statsText).then(() => {
            const origHTML = copyBtn.innerHTML;
            copyBtn.innerHTML = '<span class="copied-msg">✓ Copied!</span>';
            setTimeout(() => { copyBtn.innerHTML = origHTML; }, 2000);
          });
        }
      });

      // Log toggle for deep dive chart
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

  // ─── DEEP DIVE INTERACTIVE CHARTS ───
  function initDeepDiveChart(tech, logScale = false) {
    const canvasId = `chart-${tech.id}`;
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;

    // Destroy existing chart
    if (deepDiveCharts[tech.id]) {
      deepDiveCharts[tech.id].destroy();
    }

    // Build chart data from dataTable
    const labels = tech.dataTable.map(r => r.period);
    const values = tech.dataTable.map(r => {
      // Extract numeric value from string
      return parseNumericValue(r.value);
    });

    const ctx = canvas.getContext('2d');
    const gradient = ctx.createLinearGradient(0, 0, 0, 300);
    gradient.addColorStop(0, tech.accentColor + '40');
    gradient.addColorStop(1, tech.accentColor + '05');

    deepDiveCharts[tech.id] = new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [{
          label: tech.keyMetric.label || tech.name,
          data: values,
          borderColor: tech.accentColor,
          backgroundColor: gradient,
          borderWidth: 3,
          pointRadius: 5,
          pointHoverRadius: 8,
          pointBackgroundColor: tech.accentColor,
          pointBorderColor: '#000',
          pointBorderWidth: 2,
          fill: true,
          tension: 0.3,
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
          mode: 'index',
          intersect: false,
        },
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: '#1a1a1a',
            titleColor: '#f0f0fa',
            bodyColor: '#f0f0fa',
            borderColor: tech.accentColor,
            borderWidth: 1,
            padding: 12,
            titleFont: { family: 'Space Grotesk', size: 14, weight: '600' },
            bodyFont: { family: 'JetBrains Mono', size: 13 },
            callbacks: {
              label: (ctx) => {
                const row = tech.dataTable[ctx.dataIndex];
                return [
                  `Value: ${row.value}`,
                  `Context: ${row.context}`
                ];
              }
            }
          },
        },
        scales: {
          x: {
            ticks: { color: 'rgba(240,240,250,0.5)', font: { family: 'Inter', size: 11 } },
            grid: { color: 'rgba(255,255,255,0.05)' },
          },
          y: {
            type: logScale ? 'logarithmic' : 'linear',
            ticks: {
              color: 'rgba(240,240,250,0.5)',
              font: { family: 'JetBrains Mono', size: 11 },
              callback: (v) => formatChartValue(v),
            },
            grid: { color: 'rgba(255,255,255,0.05)' },
          }
        }
      }
    });
  }

  function parseNumericValue(str) {
    if (typeof str === 'number') return str;
    str = String(str).replace(/[,~+>]/g, '').trim();

    // Handle scientific notation
    const sciMatch = str.match(/(\d+(?:\.\d+)?)\s*[×x]\s*10\^?(\d+)/i);
    if (sciMatch) return parseFloat(sciMatch[1]) * Math.pow(10, parseInt(sciMatch[2]));

    // Handle e notation
    const eMatch = str.match(/(\d+(?:\.\d+)?)[eE]\+?(\d+)/);
    if (eMatch) return parseFloat(eMatch[1]) * Math.pow(10, parseInt(eMatch[2]));

    // Handle suffixes
    const suffixMatch = str.match(/([\d.]+)\s*(T|B|M|K|GW|GWh|TWh|hrs?|min)/i);
    if (suffixMatch) {
      const num = parseFloat(suffixMatch[1]);
      const suffix = suffixMatch[2].toLowerCase();
      const multipliers = { 't': 1e12, 'b': 1e9, 'm': 1e6, 'k': 1e3, 'gw': 1, 'gwh': 1, 'twh': 1, 'hr': 1, 'hrs': 1, 'min': 1/60 };
      return num * (multipliers[suffix] || 1);
    }

    // Handle currency
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

    // Log scale toggle
    const logBtn = document.getElementById('compare-log-toggle');
    if (logBtn) {
      logBtn.addEventListener('click', () => {
        compareLogScale = !compareLogScale;
        logBtn.classList.toggle('active', compareLogScale);
        updateCompareChart();
      });
    }

    // Clear button
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
      if (compareList.length >= 6) return; // max 6
      compareList.push(techId);
    }
    updateCompareUI();
    // Update checkbox visual
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

    // Remove pill click
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

      // Normalize sparkline to 0-100 for fair comparison
      const data = tech.sparkline;
      return {
        label: tech.name,
        data: data,
        borderColor: tech.accentColor,
        backgroundColor: tech.accentColor + '15',
        borderWidth: 2.5,
        pointRadius: 3,
        pointHoverRadius: 6,
        pointBackgroundColor: tech.accentColor,
        fill: false,
        tension: 0.3,
      };
    }).filter(Boolean);

    // Generate labels (generic timeline)
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
              color: 'rgba(240,240,250,0.7)',
              font: { family: 'Inter', size: 12 },
              usePointStyle: true,
              pointStyle: 'circle',
              padding: 16,
            }
          },
          tooltip: {
            backgroundColor: '#1a1a1a',
            titleColor: '#f0f0fa',
            bodyColor: '#f0f0fa',
            borderColor: 'rgba(255,255,255,0.1)',
            borderWidth: 1,
            padding: 12,
          }
        },
        scales: {
          x: {
            ticks: { color: 'rgba(240,240,250,0.4)', font: { family: 'Inter', size: 11 } },
            grid: { color: 'rgba(255,255,255,0.04)' },
          },
          y: {
            type: compareLogScale ? 'logarithmic' : 'linear',
            ticks: {
              color: 'rgba(240,240,250,0.4)',
              font: { family: 'JetBrains Mono', size: 11 },
            },
            grid: { color: 'rgba(255,255,255,0.04)' },
            title: {
              display: true,
              text: 'Normalized Progress (0-100)',
              color: 'rgba(240,240,250,0.4)',
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

    if (currentFilter !== 'all') {
      techs = techs.filter(t => t.category === currentFilter);
    }

    // Apply search filter
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
        techs.sort((a, b) => b.progressPercent - a.progressPercent);
        break;
      case 'acceleration':
        techs.sort((a, b) => b.acceleration - a.acceleration || b.progressPercent - a.progressPercent);
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
      if (currentFilter === 'all' || panel.dataset.category === currentFilter) {
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
    value.textContent = `${abundancePercent}% toward abundance — ${hours} hours past midnight`;
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
          drawSparkline(canvas, values, color);
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

        // Clear search on Escape
        const input = document.getElementById('tech-search');
        if (input && document.activeElement === input) {
          input.value = '';
          searchQuery = '';
          document.getElementById('search-clear').classList.remove('visible');
          applySearch();
        }
      }

      // Ctrl/Cmd + K to focus search
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
    initMobileMenu();
    initSmoothScroll();
    initResizeHandler();
    initKeyboard();
    initScrollAnimations();

    // Animate cards in after a short delay
    setTimeout(animateCardsIn, 200);
  }

  // Wait for DOM
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
