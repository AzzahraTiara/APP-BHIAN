/**
 * PT BHIANTARA KONSTRUKSI
 * Main Application Logic & Interactive Features
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initStatsCounter();
  initPortfolioFilter();
  initProjectModal();
  initCostEstimator();
  initConsultationForm();
  initPdfDownload();
});

/* ==========================================================================
   1. NAVBAR & NAVIGATION INTERACTIONS
   ========================================================================== */
function initNavbar() {
  const navbar = document.getElementById('navbar');
  const mobileToggle = document.getElementById('mobileToggle');
  const navMenu = document.getElementById('navMenu');
  const navLinks = document.querySelectorAll('.nav-link');

  // Sticky navbar shadow on scroll
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
    updateActiveNavLink();
  }, { passive: true });

  // Mobile menu toggle
  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      navMenu.classList.toggle('open');
    });

    // Close mobile menu on clicking any link
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('open');
      });
    });
  }

  // Active section indicator on scroll
  const sections = document.querySelectorAll('section[id]');
  function updateActiveNavLink() {
    const scrollY = window.pageYOffset;

    sections.forEach(current => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - 120;
      const sectionId = current.getAttribute('id');
      const targetLink = document.querySelector(`.nav-link[href*="${sectionId}"]`);

      if (targetLink) {
        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
          targetLink.classList.add('active');
        } else {
          targetLink.classList.remove('active');
        }
      }
    });
  }
}

/* ==========================================================================
   2. ANIMATED STATS COUNTER
   ========================================================================== */
function initStatsCounter() {
  const counters = document.querySelectorAll('.counter');
  let started = false;

  const statsSection = document.querySelector('.hero-stats');
  if (!statsSection) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !started) {
        started = true;
        counters.forEach(counter => {
          const target = +counter.getAttribute('data-target');
          const speed = 25; // animation speed
          let count = 0;
          const inc = target / 50;

          const updateCount = () => {
            count += inc;
            if (count < target) {
              counter.innerText = Math.ceil(count);
              setTimeout(updateCount, speed);
            } else {
              counter.innerText = target;
            }
          };
          updateCount();
        });
      }
    });
  }, { threshold: 0.3 });

  observer.observe(statsSection);
}

/* ==========================================================================
   3. PORTFOLIO FILTER SYSTEM
   ========================================================================== */
function initPortfolioFilter() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Toggle active state
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      projectCards.forEach(card => {
        const cardCategory = card.getAttribute('data-category');
        if (filterValue === 'all' || cardCategory === filterValue) {
          card.style.display = 'flex';
          card.style.opacity = '0';
          card.style.transform = 'translateY(15px)';
          setTimeout(() => {
            card.style.transition = 'all 0.4s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 30);
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

/* ==========================================================================
   4. PROJECT DETAIL MODAL DIALOG
   ========================================================================== */
function initProjectModal() {
  const modal = document.getElementById('projectModal');
  const closeBtn = document.getElementById('modalCloseBtn');
  const dismissBtn = document.getElementById('modalDismissBtn');
  const consultBtn = document.getElementById('modalConsultBtn');
  const openBtns = document.querySelectorAll('.open-modal-btn');

  // Modal elements
  const modalImg = document.getElementById('modalImg');
  const modalTitle = document.getElementById('modalTitle');
  const modalCategory = document.getElementById('modalCategory');
  const modalLoc = document.getElementById('modalLoc');
  const modalArea = document.getElementById('modalArea');
  const modalDur = document.getElementById('modalDur');
  const modalClient = document.getElementById('modalClient');
  const modalDesc = document.getElementById('modalDesc');

  function openModal(btn) {
    modalImg.src = btn.getAttribute('data-image') || '';
    modalImg.alt = btn.getAttribute('data-title') || 'Proyek PT Bhiantara';
    modalTitle.textContent = btn.getAttribute('data-title') || '';
    modalCategory.textContent = btn.getAttribute('data-category') || '';
    modalLoc.textContent = btn.getAttribute('data-location') || '-';
    modalArea.textContent = btn.getAttribute('data-area') || '-';
    modalDur.textContent = btn.getAttribute('data-duration') || '-';
    modalClient.textContent = btn.getAttribute('data-client') || '-';
    modalDesc.textContent = btn.getAttribute('data-desc') || '';

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }

  openBtns.forEach(btn => {
    btn.addEventListener('click', () => openModal(btn));
  });

  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  if (dismissBtn) dismissBtn.addEventListener('click', closeModal);
  if (consultBtn) consultBtn.addEventListener('click', closeModal);

  // Close on backdrop click
  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });
  }

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      closeModal();
    }
  });
}

/* ==========================================================================
   5. INTERACTIVE COST ESTIMATOR (RAB SIMULATION)
   ========================================================================== */
function initCostEstimator() {
  // Inputs
  const typeOptions = document.querySelectorAll('.type-option');
  const inputArea = document.getElementById('inputArea');
  const inputFloors = document.getElementById('inputFloors');
  const specOptions = document.querySelectorAll('.spec-option');

  // Labels
  const lblBuildingType = document.getElementById('lblBuildingType');
  const lblAreaValue = document.getElementById('lblAreaValue');
  const lblFloorsValue = document.getElementById('lblFloorsValue');
  const lblSpecTier = document.getElementById('lblSpecTier');

  // Outputs
  const outGrandTotal = document.getElementById('outGrandTotal');
  const outCostPerM2 = document.getElementById('outCostPerM2');
  const outStructureCost = document.getElementById('outStructureCost');
  const outArchitectureCost = document.getElementById('outArchitectureCost');
  const outMepCost = document.getElementById('outMepCost');
  const btnShareWhatsApp = document.getElementById('btnShareWhatsApp');

  let currentBaseRate = 6500000; // Gedung Komersial default
  let currentTypeName = 'Gedung Kantor / Komersial';
  let currentSpecMultiplier = 1.15; // Premium Grade default
  let currentSpecName = 'Premium High-Grade';

  // Type Selector
  typeOptions.forEach(opt => {
    opt.addEventListener('click', () => {
      typeOptions.forEach(o => o.classList.remove('active'));
      opt.classList.add('active');
      currentBaseRate = parseInt(opt.getAttribute('data-base'), 10);
      currentTypeName = opt.querySelector('span').textContent.trim();
      lblBuildingType.textContent = currentTypeName;
      recalculate();
    });
  });

  // Area Slider
  if (inputArea) {
    inputArea.addEventListener('input', (e) => {
      const val = parseInt(e.target.value, 10);
      lblAreaValue.textContent = new Intl.NumberFormat('id-ID').format(val) + ' m²';
      recalculate();
    });
  }

  // Floors Slider
  if (inputFloors) {
    inputFloors.addEventListener('input', (e) => {
      const val = parseInt(e.target.value, 10);
      lblFloorsValue.textContent = val + ' Lantai';
      recalculate();
    });
  }

  // Spec Selector
  specOptions.forEach(spec => {
    spec.addEventListener('click', () => {
      specOptions.forEach(s => s.classList.remove('active'));
      spec.classList.add('active');
      currentSpecMultiplier = parseFloat(spec.getAttribute('data-multiplier'));
      currentSpecName = spec.querySelector('.spec-title').textContent.trim();
      lblSpecTier.textContent = currentSpecName;
      recalculate();
    });
  });

  function formatIDR(amount) {
    if (amount >= 1000000000) {
      const billions = amount / 1000000000;
      return 'Rp ' + billions.toLocaleString('id-ID', { minimumFractionDigits: 1, maximumFractionDigits: 2 }) + ' Milyar';
    } else if (amount >= 1000000) {
      const millions = amount / 1000000;
      return 'Rp ' + millions.toLocaleString('id-ID', { minimumFractionDigits: 0, maximumFractionDigits: 1 }) + ' Juta';
    }
    return 'Rp ' + new Intl.NumberFormat('id-ID').format(Math.round(amount));
  }

  function recalculate() {
    const area = parseInt(inputArea.value, 10);
    const floors = parseInt(inputFloors.value, 10);

    // Floor factor: high-rise additional structural complexity factor
    let floorFactor = 1.0;
    if (floors > 3) {
      floorFactor += (floors - 3) * 0.025; // 2.5% per additional floor above 3
    }

    const unitRate = Math.round(currentBaseRate * floorFactor * currentSpecMultiplier);
    const totalEstimated = unitRate * area;

    // Breakdown allocations
    const structureAmount = totalEstimated * 0.42;
    const architectureAmount = totalEstimated * 0.38;
    const mepAmount = totalEstimated * 0.20;

    // Update UI elements
    outGrandTotal.textContent = formatIDR(totalEstimated);
    outCostPerM2.textContent = 'Rp ' + new Intl.NumberFormat('id-ID').format(unitRate);
    outStructureCost.textContent = formatIDR(structureAmount);
    outArchitectureCost.textContent = formatIDR(architectureAmount);
    outMepCost.textContent = formatIDR(mepAmount);

    // Update WhatsApp pre-filled link
    const waText = encodeURIComponent(
      `Halo PT Bhiantara Konstruksi, saya melakukan simulasi RAB di website Anda:\n\n` +
      `🏢 *Tipe Bangunan*: ${currentTypeName}\n` +
      `📐 *Luas Total*: ${new Intl.NumberFormat('id-ID').format(area)} m²\n` +
      `🏗️ *Jumlah Lantai*: ${floors} Lantai\n` +
      `💎 *Spesifikasi*: ${currentSpecName}\n` +
      `💰 *Estimasi RAB*: ${formatIDR(totalEstimated)} (± Rp ${new Intl.NumberFormat('id-ID').format(unitRate)}/m²)\n\n` +
      `Mohon dihubungi untuk konsultasi lebih lanjut dan penjadwalan survey lokasi proyek kami. Terima kasih.`
    );

    if (btnShareWhatsApp) {
      btnShareWhatsApp.href = `https://wa.me/6281234567890?text=${waText}`;
      btnShareWhatsApp.target = '_blank';
    }
  }

  // Initial calculation run
  recalculate();
}

/* ==========================================================================
   6. CONSULTATION FORM SUBMISSION
   ========================================================================== */
function initConsultationForm() {
  const form = document.getElementById('consultationForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const fullName = document.getElementById('fullName').value.trim();
    const phone = document.getElementById('phoneWA').value.trim();
    const projectType = document.getElementById('projectType').value;

    if (!fullName || !phone || !projectType) {
      showToast('Harap lengkapi nama, nomor WhatsApp, dan kategori proyek Anda.');
      return;
    }

    // Success feedback
    showToast(`Terima kasih Bapak/Ibu ${fullName}! Permintaan penawaran proyek Anda telah kami terima. Tim estimator PT Bhiantara akan segera menghubungi Anda melalui WhatsApp.`);
    form.reset();
  });
}

/* ==========================================================================
   7. COMPANY PROFILE PDF DOWNLOAD
   ========================================================================== */
function initPdfDownload() {
  const btnDownload = document.getElementById('btnDownloadPDF');
  const inputEmail = document.getElementById('pdfEmail');

  if (btnDownload && inputEmail) {
    btnDownload.addEventListener('click', (e) => {
      e.preventDefault();
      const email = inputEmail.value.trim();
      if (!email || !email.includes('@')) {
        showToast('Silakan masukkan alamat email yang valid untuk mengunduh Company Profile.');
        return;
      }

      showToast(`Tautan unduh Company Profile PT Bhiantara (PDF) telah dikirimkan ke: ${email}`);
      inputEmail.value = '';
    });
  }
}

/* Toast Helper */
function showToast(message) {
  const toast = document.getElementById('toastNotice');
  const toastMsg = document.getElementById('toastMsg');
  if (!toast || !toastMsg) return;

  toastMsg.textContent = message;
  toast.classList.add('show');

  setTimeout(() => {
    toast.classList.remove('show');
  }, 4500);
}
