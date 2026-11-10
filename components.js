/**
 * X Power Program Kenya
 * Modern Client Showcase & Talent Discovery Template Engine
 * Engineered by Philip Maina (@Kivice)
 */

document.addEventListener('DOMContentLoaded', () => {
  initClientThemeSwitcher();
  initRoleSandbox();
  initSkillMatchEngine();
  initJobsFilter();
  initApplicationModal();
  initNavigation();
  highlightActiveNav();
});

/* ==========================================================================
   Multi-Theme Switcher
   ========================================================================== */
function initClientThemeSwitcher() {
  const savedTheme = localStorage.getItem('xpower_client_theme') || 'blue';
  document.documentElement.setAttribute('data-client-theme', savedTheme);

  const swatches = document.querySelectorAll('.theme-swatch');
  swatches.forEach(swatch => {
    const theme = swatch.getAttribute('data-theme');
    if (theme === savedTheme) swatch.classList.add('active');

    swatch.addEventListener('click', () => {
      swatches.forEach(s => s.classList.remove('active'));
      swatch.classList.add('active');
      document.documentElement.setAttribute('data-client-theme', theme);
      localStorage.setItem('xpower_client_theme', theme);

      const themeNames = {
        blue: 'Silicon Savannah Blue',
        emerald: 'AgriTech Emerald',
        indigo: 'FinTech Indigo',
        coral: 'Sunset Coral'
      };
      showToast(`🎨 Theme Palette: ${themeNames[theme] || theme}`);
    });
  });
}

/* ==========================================================================
   Role Sandbox Switcher
   ========================================================================== */
function initRoleSandbox() {
  const roleButtons = document.querySelectorAll('.role-pill-btn');
  const roleDisplay = document.getElementById('activeRoleDisplay');

  roleButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      roleButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const role = btn.getAttribute('data-role');
      localStorage.setItem('xpower_demo_role', role);

      const roleDescriptions = {
        'seeker': '👤 Job Seeker Mode: Browsing as Amina Mwangi (Senior FinTech Engineer · 94% Match to Safaricom)',
        'employer': '🏢 Employer Mode: Logged in as Safaricom PLC (Verified BRS Badge · 14 Active Applicants)',
        'admin': '🛡️ Admin Mode: Kenya Data Protection Act Oversight & BRS Verification Queue Active'
      };

      if (roleDisplay) {
        roleDisplay.textContent = roleDescriptions[role] || '';
      }

      showToast(roleDescriptions[role] || 'Role switched.');
    });
  });
}

/* ==========================================================================
   Interactive 100-Point Skill-Match Diagnostics Engine
   ========================================================================== */
function initSkillMatchEngine() {
  const skillChips = document.querySelectorAll('.skill-chip');
  const scoreDisplay = document.getElementById('diagnosticScore');
  const meterFill = document.getElementById('diagnosticMeterFill');
  const matchCategory = document.getElementById('diagnosticCategory');
  const breakdownSkills = document.getElementById('breakdownSkills');

  if (!skillChips.length || !scoreDisplay) return;

  // Benchmark requirement: 5 core skills for Safaricom FinTech Role
  // Target skills: TypeScript, Next.js, SQL, AWS, M-Pesa API
  const targetSkills = ['typescript', 'nextjs', 'sql', 'aws', 'mpesa'];

  function recalculateScore() {
    let selectedSkills = [];
    skillChips.forEach(chip => {
      if (chip.classList.contains('selected')) {
        selectedSkills.push(chip.getAttribute('data-skill'));
      }
    });

    let matchedCount = 0;
    selectedSkills.forEach(s => {
      if (targetSkills.includes(s)) matchedCount++;
    });

    // Scoring formula:
    // Technical Skills: up to 50 pts (10 pts per required skill)
    // Proximity / Nairobi alignment: 25 pts
    // Senior Experience: 25 pts (if at least 3 skills)
    const skillScore = Math.min(50, matchedCount * 10);
    const locationScore = 25; // Candidate is Nairobi-based
    const experienceScore = selectedSkills.length >= 3 ? 24 : 14;

    const totalScore = Math.min(100, skillScore + locationScore + experienceScore);

    scoreDisplay.textContent = totalScore;
    if (meterFill) meterFill.style.width = `${totalScore}%`;
    if (breakdownSkills) breakdownSkills.textContent = `${skillScore} / 50 pts`;

    if (matchCategory) {
      if (totalScore >= 90) {
        matchCategory.textContent = '★ Excellent Match (Top 5% Candidate)';
        matchCategory.style.color = '#10b981';
      } else if (totalScore >= 75) {
        matchCategory.textContent = '● Strong Compatibility (Recommended)';
        matchCategory.style.color = '#38bdf8';
      } else {
        matchCategory.textContent = '▲ Moderate Match (Upskilling Opportunity)';
        matchCategory.style.color = '#f59e0b';
      }
    }
  }

  skillChips.forEach(chip => {
    chip.addEventListener('click', () => {
      chip.classList.toggle('selected');
      recalculateScore();
    });
  });

  recalculateScore();
}

/* ==========================================================================
   Jobs Directory & Multi-County Filter
   ========================================================================== */
function initJobsFilter() {
  const tabs = document.querySelectorAll('.job-filter-tab');
  const cards = document.querySelectorAll('.job-card');
  const searchInput = document.getElementById('jobSearchInput');

  if (!cards.length) return;

  function filterCards() {
    const activeTab = document.querySelector('.job-filter-tab.active');
    const countyFilter = activeTab ? activeTab.getAttribute('data-county') : 'all';
    const query = searchInput ? searchInput.value.toLowerCase().trim() : '';

    cards.forEach(card => {
      const cardCounty = card.getAttribute('data-county') || '';
      const text = card.textContent.toLowerCase();

      const matchesCounty = countyFilter === 'all' || cardCounty === countyFilter;
      const matchesQuery = !query || text.includes(query);

      if (matchesCounty && matchesQuery) {
        card.style.display = 'flex';
      } else {
        card.style.display = 'none';
      }
    });
  }

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      filterCards();
    });
  });

  if (searchInput) {
    searchInput.addEventListener('input', filterCards);
  }
}

/* ==========================================================================
   Application Simulator Modal
   ========================================================================== */
function initApplicationModal() {
  const applyButtons = document.querySelectorAll('.quick-apply-btn');

  applyButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const jobTitle = btn.getAttribute('data-job') || 'Software Engineering Role';
      const company = btn.getAttribute('data-company') || 'Verified Employer';
      const score = btn.getAttribute('data-score') || '94%';

      showApplicationModal(jobTitle, company, score);
    });
  });
}

function showApplicationModal(jobTitle, company, score) {
  let modal = document.getElementById('applicationModal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'applicationModal';
    modal.className = 'modal-backdrop';
    document.body.appendChild(modal);
  }

  modal.innerHTML = `
    <div class="modal-box">
      <button class="modal-close" onclick="closeApplicationModal()">&times;</button>
      <div style="margin-bottom: 1.5rem;">
        <span class="badge badge-success" style="margin-bottom: 0.5rem;">One-Click Demo Application</span>
        <h3 style="font-size: 1.35rem; font-weight: 800; color: #0f172a; margin-bottom: 0.25rem;">${jobTitle}</h3>
        <p style="font-size: 0.875rem; color: #64748b;">${company} · <strong>${score} Match Score</strong></p>
      </div>

      <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 1.25rem; margin-bottom: 1.5rem;">
        <div style="font-size: 0.75rem; font-weight: 700; color: #64748b; text-transform: uppercase; margin-bottom: 0.75rem;">Candidate Profile Attached</div>
        <div style="display: flex; align-items: center; gap: 0.85rem;">
          <div style="width: 44px; height: 44px; border-radius: 50%; background: #0284c7; color: white; display: flex; align-items: center; justify-content: center; font-weight: 800;">
            AM
          </div>
          <div>
            <div style="font-weight: 800; font-size: 0.95rem; color: #0f172a;">Amina Mwangi</div>
            <div style="font-size: 0.8125rem; color: #64748b;">amina.mwangi@example.com · Nairobi, Kenya</div>
          </div>
        </div>
        <div style="margin-top: 0.85rem; padding-top: 0.85rem; border-top: 1px dashed #cbd5e1; font-size: 0.8125rem; color: #475569; display: flex; justify-content: space-between;">
          <span>📄 Resume: <strong>Amina_Mwangi_CV.pdf</strong></span>
          <span style="color: #10b981; font-weight: 700;">Verified BRS Active</span>
        </div>
      </div>

      <div id="applicationReceiptArea">
        <button id="submitApplicationDemoBtn" class="btn btn-primary" style="width: 100%; padding: 0.85rem;" onclick="confirmDemoApplication('${jobTitle}', '${company}')">
          Dispatch Application to Recruiter ➔
        </button>
      </div>
    </div>
  `;

  modal.classList.add('open');
}

window.closeApplicationModal = function() {
  const modal = document.getElementById('applicationModal');
  if (modal) modal.classList.remove('open');
};

window.confirmDemoApplication = function(jobTitle, company) {
  const area = document.getElementById('applicationReceiptArea');
  if (!area) return;

  const refCode = 'XP-KEN-' + Math.floor(10000 + Math.random() * 90000);

  area.innerHTML = `
    <div style="background: #0f172a; color: white; border-radius: 12px; padding: 1.25rem; text-align: center; border-left: 4px solid #10b981;">
      <div style="font-size: 0.75rem; text-transform: uppercase; color: #94a3b8; letter-spacing: 0.08em;">Tracking Reference Code</div>
      <div style="font-family: monospace; font-size: 1.25rem; font-weight: 800; color: #38bdf8; margin: 0.35rem 0;">${refCode}</div>
      <p style="font-size: 0.8125rem; color: #cbd5e1; margin-bottom: 1rem;">Candidate dispatch recorded in Recruiter Review Queue.</p>
      
      <div style="display: flex; justify-content: space-between; font-size: 0.75rem; color: #94a3b8; padding: 0.5rem 0; border-top: 1px dashed rgba(255, 255, 255, 0.15);">
        <span>Stage 1 of 5: <strong>Submitted</strong></span>
        <span>Notification: <strong>SMS &amp; Email Sent</strong></span>
      </div>

      <button class="btn btn-secondary" style="width: 100%; margin-top: 1rem; padding: 0.5rem;" onclick="closeApplicationModal()">
        Done
      </button>
    </div>
  `;

  showToast(`Application submitted! Tracking: ${refCode}`);
};

/* ==========================================================================
   Navigation
   ========================================================================== */
function initNavigation() {
  const toggle = document.querySelector('.mobile-toggle');
  const navLinks = document.querySelector('.nav-links');

  if (toggle && navLinks) {
    toggle.addEventListener('click', () => {
      const isOpen = navLinks.classList.toggle('open');
      toggle.setAttribute('aria-expanded', isOpen);
      toggle.textContent = isOpen ? '✕' : '☰';
    });

    document.addEventListener('click', (e) => {
      if (!toggle.contains(e.target) && !navLinks.contains(e.target) && navLinks.classList.contains('open')) {
        navLinks.classList.remove('open');
        toggle.textContent = '☰';
      }
    });
  }
}

function highlightActiveNav() {
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  const links = document.querySelectorAll('.nav-link');
  links.forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPath || (currentPath === '' && href === 'index.html')) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
}

function showToast(message, duration = 4000) {
  let toast = document.querySelector('.toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'toast';
    document.body.appendChild(toast);
  }

  toast.innerHTML = `<span>✓</span><span>${message}</span>`;
  toast.classList.add('show');

  setTimeout(() => {
    toast.classList.remove('show');
  }, duration);
}
