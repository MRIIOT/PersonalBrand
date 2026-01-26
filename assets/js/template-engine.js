/* =============================================
   Template Engine
   Applies configuration to site pages
   ============================================= */

(function() {
  'use strict';

  const TemplateEngine = {
    config: null,

    init: function() {
      // Load config from localStorage or use default
      this.loadConfig();
      this.applyConfig();
      this.setupDynamicElements();
    },

    loadConfig: function() {
      // Try to load from localStorage first
      const savedConfig = localStorage.getItem('siteConfig');
      if (savedConfig) {
        try {
          this.config = JSON.parse(savedConfig);
        } catch (e) {
          console.warn('Failed to parse saved config, using default');
          this.config = window.siteConfig || {};
        }
      } else {
        this.config = window.siteConfig || {};
      }
    },

    saveConfig: function(config) {
      this.config = config;
      localStorage.setItem('siteConfig', JSON.stringify(config));
      this.applyConfig();
    },

    resetConfig: function() {
      localStorage.removeItem('siteConfig');
      this.config = window.siteConfig || {};
      this.applyConfig();
    },

    applyConfig: function() {
      if (!this.config) return;

      this.applyBranding();
      this.applyPersonalInfo();
      this.applyContact();
      this.applySocial();
      this.applyHeroSlides();
      this.applyServices();
      this.applySolutions();
      this.applyTimeline();
      this.applyProcess();
      this.applyTestimonials();
      this.applyPhilosophy();
      this.applyProblems();
      this.applyGallery();
      this.applyImages();
      this.applyAudit();
      this.applySEO();
      this.applyFooter();
    },

    // ==========================================
    // BRANDING
    // ==========================================
    applyBranding: function() {
      const branding = this.config.branding;
      if (!branding) return;

      // Apply colors as CSS variables
      if (branding.colors) {
        const root = document.documentElement;
        root.style.setProperty('--primary-color', branding.colors.primary);
        root.style.setProperty('--secondary-color', branding.colors.secondary);
        root.style.setProperty('--accent-color', branding.colors.accent);
        root.style.setProperty('--text-color', branding.colors.text);
        root.style.setProperty('--text-muted', branding.colors.textMuted);
        root.style.setProperty('--border-color', branding.colors.border);
      }

      // Apply light theme if set
      if (branding.lightTheme) {
        document.body.classList.add('v-light');
      }

      // Apply logo
      const logos = document.querySelectorAll('[data-template="logo"]');
      logos.forEach(logo => {
        if (branding.logoUrl) {
          logo.innerHTML = `<img src="${branding.logoUrl}" alt="${branding.siteName}">`;
        } else {
          logo.innerHTML = `<span class="text-logo">${branding.siteName}</span>`;
        }
      });

      // Apply favicon
      if (branding.faviconUrl) {
        let favicon = document.querySelector('link[rel="icon"]');
        if (favicon) {
          favicon.href = branding.faviconUrl;
        }
      }
    },

    // ==========================================
    // PERSONAL INFO
    // ==========================================
    applyPersonalInfo: function() {
      const personal = this.config.personal;
      if (!personal) return;

      this.replaceText('[data-template="name"]', personal.name);
      this.replaceText('[data-template="firstName"]', personal.firstName);
      this.replaceText('[data-template="lastName"]', personal.lastName);
      this.replaceText('[data-template="title"]', personal.title);
      this.replaceText('[data-template="tagline"]', personal.tagline);
      this.replaceText('[data-template="shortBio"]', personal.shortBio);
      this.replaceText('[data-template="yearsExperience"]', personal.yearsExperience);
      this.replaceText('[data-template="location"]', personal.location);

      // Full bio with line breaks
      const fullBioEls = document.querySelectorAll('[data-template="fullBio"]');
      fullBioEls.forEach(el => {
        el.innerHTML = personal.fullBio.split('\n\n').map(p => `<p>${p}</p>`).join('');
      });
    },

    // ==========================================
    // CONTACT
    // ==========================================
    applyContact: function() {
      const contact = this.config.contact;
      if (!contact) return;

      this.replaceText('[data-template="email"]', contact.email);
      this.replaceText('[data-template="phone"]', contact.phone);
      this.replaceText('[data-template="responseTime"]', contact.responseTime);

      // Email links
      document.querySelectorAll('[data-template="emailLink"]').forEach(el => {
        el.href = `mailto:${contact.email}`;
        el.textContent = contact.email;
      });

      // Phone links
      if (contact.phone) {
        document.querySelectorAll('[data-template="phoneLink"]').forEach(el => {
          el.href = `tel:${contact.phone.replace(/\D/g, '')}`;
          el.textContent = contact.phone;
          el.closest('.contact-info-item')?.classList.remove('hidden');
        });
      }
    },

    // ==========================================
    // SOCIAL LINKS
    // ==========================================
    applySocial: function() {
      const social = this.config.social;
      if (!social) return;

      const socialContainers = document.querySelectorAll('[data-template="socialLinks"]');
      socialContainers.forEach(container => {
        container.innerHTML = '';

        const platforms = [
          { key: 'linkedin', icon: 'fab fa-linkedin-in', url: social.linkedin },
          { key: 'twitter', icon: 'fab fa-twitter', url: social.twitter },
          { key: 'github', icon: 'fab fa-github', url: social.github },
          { key: 'instagram', icon: 'fab fa-instagram', url: social.instagram },
          { key: 'youtube', icon: 'fab fa-youtube', url: social.youtube },
          { key: 'facebook', icon: 'fab fa-facebook-f', url: social.facebook },
          { key: 'dribbble', icon: 'fab fa-dribbble', url: social.dribbble },
          { key: 'behance', icon: 'fab fa-behance', url: social.behance }
        ];

        platforms.forEach(platform => {
          if (platform.url) {
            const link = document.createElement('a');
            link.href = platform.url;
            link.target = '_blank';
            link.rel = 'noopener noreferrer';
            link.innerHTML = `<i class="${platform.icon}"></i>`;
            container.appendChild(link);
          }
        });
      });
    },

    // ==========================================
    // HERO SLIDES
    // ==========================================
    applyHeroSlides: function() {
      const slides = this.config.heroSlides;
      if (!slides || !slides.length) return;

      const slidesContainer = document.querySelector('[data-template="heroSlides"]');
      if (!slidesContainer) return;

      slidesContainer.innerHTML = slides.map(slide => `
        <div class="swiper-slide">
          <div class="hero-slide-bg" style="background-image: url('${slide.image}');" data-overlay="5"></div>
          <div class="hero-content">
            <span class="sub-title mgc-up">${slide.subtitle}</span>
            <h1 class="title mgc-up" data-delay="100">${slide.title}</h1>
            <p class="description mgc-up" data-delay="200">${slide.description}</p>
            <a href="${slide.buttonLink}" class="btn mgc-up" data-delay="300">${slide.buttonText}</a>
          </div>
        </div>
      `).join('');

      // Reinitialize slider if Swiper exists
      if (typeof Swiper !== 'undefined') {
        const existingSlider = document.querySelector('.hero-slider')?.swiper;
        if (existingSlider) existingSlider.destroy();

        new Swiper('.hero-slider', {
          slidesPerView: 1,
          loop: true,
          speed: 1000,
          autoplay: { delay: 5000, disableOnInteraction: false },
          effect: 'fade',
          fadeEffect: { crossFade: true },
          navigation: {
            nextEl: '.slider-nav-btn.next, .swiper-button-next',
            prevEl: '.slider-nav-btn.prev, .swiper-button-prev'
          }
        });
      }
    },

    // ==========================================
    // SERVICES
    // ==========================================
    applyServices: function() {
      const services = this.config.services;
      if (!services || !services.length) return;

      // Services accordion
      const accordionContainer = document.querySelector('[data-template="servicesAccordion"]');
      if (accordionContainer) {
        accordionContainer.innerHTML = services.map(service => `
          <div class="dsn-accordion-item">
            <div class="dsn-accordion-header">
              <div class="dsn-accordion-title">
                <span class="service-icon"><i class="${service.icon}"></i></span>
                <span class="service-name">${service.title}</span>
              </div>
              <div class="dsn-accordion-icon"><i class="fas fa-plus"></i></div>
            </div>
            <div class="dsn-accordion-content">
              <div class="dsn-accordion-content-inner">
                <p>${service.fullDesc}</p>
              </div>
            </div>
          </div>
        `).join('');

        // Reinitialize accordion
        this.initAccordion(accordionContainer);
      }

      // Services grid
      const gridContainer = document.querySelector('[data-template="servicesGrid"]');
      if (gridContainer) {
        gridContainer.innerHTML = services.map((service, index) => `
          <div class="service-card mgc-up" data-delay="${index * 100}">
            <div class="number">${String(index + 1).padStart(2, '0')}</div>
            <h4>${service.title}</h4>
            <p>${service.shortDesc}</p>
            <ul style="margin-top: 20px; color: var(--text-muted);">
              ${service.features.map(f => `<li style="margin-bottom: 8px;">- ${f}</li>`).join('')}
            </ul>
          </div>
        `).join('');
      }

      // Card slider
      const sliderContainer = document.querySelector('[data-template="cardSlider"]');
      if (sliderContainer) {
        sliderContainer.innerHTML = services.map(service => `
          <div class="card-slider-item">
            <div class="icon"><i class="${service.icon}"></i></div>
            <h4 class="card-title">${service.title}</h4>
            <p class="card-text">${service.shortDesc}</p>
          </div>
        `).join('');

        // Reinitialize slick if exists
        if (typeof jQuery !== 'undefined' && jQuery.fn.slick) {
          const $slider = jQuery(sliderContainer);
          if ($slider.hasClass('slick-initialized')) {
            $slider.slick('unslick');
          }
          $slider.slick({
            slidesToShow: 3,
            slidesToScroll: 1,
            infinite: true,
            dots: true,
            arrows: true,
            autoplay: true,
            autoplaySpeed: 4000,
            responsive: [
              { breakpoint: 991, settings: { slidesToShow: 2, arrows: false }},
              { breakpoint: 575, settings: { slidesToShow: 1, arrows: false }}
            ]
          });
        }
      }
    },

    // ==========================================
    // SOLUTIONS
    // ==========================================
    applySolutions: function() {
      const solutions = this.config.solutions;
      if (!solutions || !solutions.length) return;

      const container = document.querySelector('[data-template="solutions"]');
      if (!container) return;

      container.innerHTML = solutions.map((solution, index) => `
        <div class="solution-card mgc-up" data-delay="${index * 100}">
          <div class="solution-number">${String(index + 1).padStart(2, '0')}</div>
          <div class="solution-content">
            <h4>${solution.title}</h4>
            <p>${solution.description}</p>
            <div class="solution-details">
              <ul style="margin-top: 20px; color: var(--text-muted);">
                ${solution.features.map(f => `<li style="margin-bottom: 10px;">- ${f}</li>`).join('')}
              </ul>
            </div>
            <div class="solution-toggle">Learn More</div>
          </div>
        </div>
      `).join('');

      // Reinitialize solution toggles
      container.querySelectorAll('.solution-toggle').forEach(toggle => {
        toggle.addEventListener('click', function() {
          const card = this.closest('.solution-card');
          card.classList.toggle('expanded');
          this.textContent = card.classList.contains('expanded') ? 'Show Less' : 'Learn More';
        });
      });
    },

    // ==========================================
    // TIMELINE
    // ==========================================
    applyTimeline: function() {
      const timeline = this.config.timeline;
      if (!timeline || !timeline.length) return;

      const container = document.querySelector('[data-template="timeline"]');
      if (!container) return;

      container.innerHTML = timeline.map(item => `
        <div class="timeline-item">
          <div class="timeline-date">${item.period}</div>
          <h4 class="timeline-title">${item.title}</h4>
          <div class="timeline-content">
            <p>${item.description}</p>
          </div>
        </div>
      `).join('');
    },

    // ==========================================
    // PROCESS
    // ==========================================
    applyProcess: function() {
      const process = this.config.process;
      if (!process || !process.length) return;

      // Process steps
      const stepsContainer = document.querySelector('[data-template="processSteps"]');
      if (stepsContainer) {
        stepsContainer.innerHTML = process.map((step, index) => `
          <div class="process-step">
            <div class="step-number">${index + 1}</div>
            <h5>${step.title}</h5>
            <p>${step.shortDesc}</p>
          </div>
        `).join('');
      }

      // Process accordion
      const accordionContainer = document.querySelector('[data-template="processAccordion"]');
      if (accordionContainer) {
        accordionContainer.innerHTML = process.map((step, index) => `
          <div class="dsn-accordion-item ${index === 0 ? 'active' : ''}">
            <div class="step-number">${index + 1}</div>
            <div class="dsn-accordion-header">
              <h4 class="dsn-accordion-title">${step.title}</h4>
              <div class="dsn-accordion-icon"><i class="fas fa-plus"></i></div>
            </div>
            <div class="dsn-accordion-content">
              <div class="dsn-accordion-content-inner">
                <p>${step.fullDesc}</p>
                <ul style="margin-top: 20px;">
                  ${step.deliverables.map(d => `<li>${d}</li>`).join('')}
                </ul>
              </div>
            </div>
          </div>
        `).join('');

        this.initAccordion(accordionContainer);
      }
    },

    // ==========================================
    // TESTIMONIALS
    // ==========================================
    applyTestimonials: function() {
      const testimonials = this.config.testimonials;
      if (!testimonials || !testimonials.length) return;

      const container = document.querySelector('[data-template="testimonials"]');
      if (!container) return;

      container.innerHTML = testimonials.map(t => `
        <div class="testimonial-card">
          <p class="testimonial-text">"${t.quote}"</p>
          <div class="testimonial-author">
            <div class="testimonial-author-info">
              <h6>${t.author}</h6>
              <span>${t.role}${t.company ? `, ${t.company}` : ''}</span>
            </div>
          </div>
        </div>
      `).join('');

      // Reinitialize slick
      if (typeof jQuery !== 'undefined' && jQuery.fn.slick) {
        const $slider = jQuery(container);
        if ($slider.hasClass('slick-initialized')) {
          $slider.slick('unslick');
        }
        $slider.slick({
          slidesToShow: 1,
          slidesToScroll: 1,
          infinite: true,
          dots: true,
          arrows: true,
          autoplay: true,
          autoplaySpeed: 6000,
          fade: true
        });
      }
    },

    // ==========================================
    // PHILOSOPHY
    // ==========================================
    applyPhilosophy: function() {
      const philosophy = this.config.philosophy;
      if (!philosophy || !philosophy.length) return;

      const container = document.querySelector('[data-template="philosophy"]');
      if (!container) return;

      container.innerHTML = philosophy.map(item => `
        <div class="philosophy-item">
          <div class="icon"><i class="${item.icon}"></i></div>
          <h5>${item.title}</h5>
          <p>${item.description}</p>
        </div>
      `).join('');
    },

    // ==========================================
    // PROBLEMS
    // ==========================================
    applyProblems: function() {
      const problems = this.config.problems;
      if (!problems || !problems.length) return;

      const container = document.querySelector('[data-template="problems"]');
      if (!container) return;

      container.innerHTML = problems.map(item => `
        <div class="dsn-accordion-item">
          <div class="dsn-accordion-header">
            <h5 class="dsn-accordion-title">${item.problem}</h5>
            <div class="dsn-accordion-icon"><i class="fas fa-plus"></i></div>
          </div>
          <div class="dsn-accordion-content">
            <div class="dsn-accordion-content-inner">
              <p>${item.solution}</p>
            </div>
          </div>
        </div>
      `).join('');

      this.initAccordion(container);
    },

    // ==========================================
    // GALLERY
    // ==========================================
    applyGallery: function() {
      const gallery = this.config.gallery;
      if (!gallery || !gallery.length) return;

      const container = document.querySelector('[data-template="gallery"]');
      if (!container) return;

      container.innerHTML = gallery.map((img, index) => `
        <div class="gallery-item">
          <img src="${img}" alt="Gallery Image ${index + 1}">
        </div>
      `).join('');
    },

    // ==========================================
    // IMAGES
    // ==========================================
    applyImages: function() {
      const images = this.config.images;
      if (!images) return;

      Object.keys(images).forEach(key => {
        const elements = document.querySelectorAll(`[data-template-image="${key}"]`);
        elements.forEach(el => {
          if (el.tagName === 'IMG') {
            el.src = images[key];
          } else {
            el.style.backgroundImage = `url('${images[key]}')`;
          }
        });
      });
    },

    // ==========================================
    // AUDIT
    // ==========================================
    applyAudit: function() {
      const audit = this.config.audit;
      if (!audit) return;

      this.replaceText('[data-template="auditTitle"]', audit.title);
      this.replaceText('[data-template="auditSubtitle"]', audit.subtitle);
      this.replaceText('[data-template="auditDescription"]', audit.description);
      this.replaceText('[data-template="auditDuration"]', audit.duration);

      const benefitsContainer = document.querySelector('[data-template="auditBenefits"]');
      if (benefitsContainer && audit.benefits) {
        benefitsContainer.innerHTML = audit.benefits.map(benefit => `
          <div class="audit-benefit-item">
            <div class="icon"><i class="${benefit.icon}"></i></div>
            <div>
              <h5>${benefit.title}</h5>
              <p>${benefit.description}</p>
            </div>
          </div>
        `).join('');
      }
    },

    // ==========================================
    // SEO
    // ==========================================
    applySEO: function() {
      const seo = this.config.seo;
      if (!seo) return;

      // Update title
      if (seo.siteTitle) {
        const titleEl = document.querySelector('title');
        if (titleEl) {
          const pageName = titleEl.textContent.split('|')[0].trim();
          titleEl.textContent = pageName ? `${pageName} | ${seo.siteTitle}` : seo.siteTitle;
        }
      }

      // Update meta description
      if (seo.siteDescription) {
        let metaDesc = document.querySelector('meta[name="description"]');
        if (metaDesc) {
          metaDesc.content = seo.siteDescription;
        }
      }
    },

    // ==========================================
    // FOOTER
    // ==========================================
    applyFooter: function() {
      const footer = this.config.footer;
      if (!footer) return;

      this.replaceText('[data-template="footerTagline"]', footer.tagline);
      this.replaceText('[data-template="copyright"]', `© ${new Date().getFullYear()} ${footer.copyright}. All Rights Reserved.`);

      if (footer.showPoweredBy) {
        const poweredBy = document.querySelector('[data-template="poweredBy"]');
        if (poweredBy) {
          poweredBy.style.display = 'block';
        }
      }
    },

    // ==========================================
    // UTILITY METHODS
    // ==========================================
    replaceText: function(selector, text) {
      if (!text) return;
      document.querySelectorAll(selector).forEach(el => {
        el.textContent = text;
      });
    },

    initAccordion: function(container) {
      container.querySelectorAll('.dsn-accordion-header').forEach(header => {
        header.addEventListener('click', function() {
          const item = this.parentElement;
          const accordion = item.parentElement;

          if (!accordion.classList.contains('multiple')) {
            accordion.querySelectorAll('.dsn-accordion-item').forEach(i => {
              if (i !== item) i.classList.remove('active');
            });
          }

          item.classList.toggle('active');
        });
      });
    },

    setupDynamicElements: function() {
      // Set up any additional dynamic behaviors
    }
  };

  // Initialize on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => TemplateEngine.init());
  } else {
    TemplateEngine.init();
  }

  // Expose globally
  window.TemplateEngine = TemplateEngine;

})();
