document.addEventListener("DOMContentLoaded", () => {

    // ============================================================
    // 1. MOBILE NAVBAR TOGGLE
    // ============================================================
    const menuBtn = document.getElementById('menu-icon');
    const navMenu = document.getElementById('navbar');

    menuBtn.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        menuBtn.classList.toggle('active');
    });

    document.querySelectorAll('.navbar a').forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            menuBtn.classList.remove('active');
        });
    });


    // ============================================================
    // 2. ACTIVE NAV LINK ON SCROLL
    // ============================================================
    const sections = document.querySelectorAll("section[id]");
    const navLinks = document.querySelectorAll(".navbar a");
    const header = document.getElementById('header');

    window.addEventListener("scroll", () => {
        const scrollY = window.pageYOffset;
        if (scrollY > 60) { header.classList.add('scrolled'); }
        else { header.classList.remove('scrolled'); }

        let current = "";
        sections.forEach(section => {
            if (scrollY >= section.offsetTop - 220)
                current = section.getAttribute("id");
        });

        navLinks.forEach(link => {
            link.classList.remove("active");
            if (link.getAttribute("href") === `#${current}`)
                link.classList.add("active");
        });
    });


    // ============================================================
    // 3. MARQUEE INFINITE CLONE
    // ============================================================
    document.querySelectorAll('.auto-clone').forEach(track => {
        track.innerHTML += track.innerHTML;
    });


    // ============================================================
    // 4. LIQUID TAB SLIDER  ← The "magic pill"
    // ============================================================
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabPanels = document.querySelectorAll('.tab-content');
    const slider = document.getElementById('tab-slider');
    const tabsWrap = document.getElementById('portfolio-tabs');

    function moveSlider(btn) {
        if (!slider || !tabsWrap) return;
        const wrapRect = tabsWrap.getBoundingClientRect();
        const btnRect = btn.getBoundingClientRect();
        slider.style.width = btnRect.width + 'px';
        slider.style.height = btnRect.height + 'px';
        slider.style.transform = `translate(${btnRect.left - wrapRect.left}px, ${btnRect.top - wrapRect.top}px)`;
    }

    // Init without transition (instant placement)
    const firstActive = document.querySelector('.tab-btn.active');
    if (firstActive) {
        requestAnimationFrame(() => {
            slider.style.transition = 'none';
            moveSlider(firstActive);
            requestAnimationFrame(() => { slider.style.transition = ''; });
        });
    }

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const target = btn.dataset.tab;
            tabBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            moveSlider(btn);   // liquid move!

            tabPanels.forEach(panel => {
                if (panel.id === `tab-${target}`) panel.classList.add('active');
                else panel.classList.remove('active');
            });
        });
    });

    window.addEventListener('resize', () => {
        const active = document.querySelector('.tab-btn.active');
        if (active) { slider.style.transition = 'none'; moveSlider(active); slider.style.transition = ''; }
    });


    // ============================================================
    // 5. LIGHTBOX
    // ============================================================
    const lightbox = document.getElementById('lightbox');
    const lbImg = document.getElementById('lightbox-img');
    const lbClose = document.getElementById('lightbox-close');
    const lbOverlay = document.getElementById('lightbox-overlay');
    const lbPrev = document.getElementById('lb-prev');
    const lbNext = document.getElementById('lb-next');
    let currentImages = [], currentIndex = 0;

    const openLightbox = (imgs, idx) => {
        currentImages = imgs; currentIndex = idx;
        lbImg.src = currentImages[currentIndex];
        lightbox.classList.add('open');
        document.body.style.overflow = 'hidden';
    };
    const closeLightbox = () => {
        lightbox.classList.remove('open');
        document.body.style.overflow = '';
        setTimeout(() => { lbImg.src = ''; }, 350);
    };
    const showPrev = () => {
        currentIndex = (currentIndex - 1 + currentImages.length) % currentImages.length;
        lbImg.style.opacity = '0';
        setTimeout(() => { lbImg.src = currentImages[currentIndex]; lbImg.style.opacity = '1'; }, 150);
    };
    const showNext = () => {
        currentIndex = (currentIndex + 1) % currentImages.length;
        lbImg.style.opacity = '0';
        setTimeout(() => { lbImg.src = currentImages[currentIndex]; lbImg.style.opacity = '1'; }, 150);
    };

    lbImg.style.transition = 'opacity 0.15s ease';
    lbClose.addEventListener('click', closeLightbox);
    lbOverlay.addEventListener('click', closeLightbox);
    lbPrev.addEventListener('click', showPrev);
    lbNext.addEventListener('click', showNext);
    document.addEventListener('keydown', e => {
        if (!lightbox.classList.contains('open')) return;
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowLeft') showPrev();
        if (e.key === 'ArrowRight') showNext();
    });

    document.querySelectorAll('.tab-content').forEach(panel => {
        const items = panel.querySelectorAll('.grid-item');
        const images = Array.from(items).map(i => i.dataset.src);
        items.forEach((item, idx) => item.addEventListener('click', () => openLightbox(images, idx)));
    });


    // ============================================================
    // 6. CUSTOM CURSOR  ← Dual-layer with lerp lag
    // ============================================================
    const cursorDot = document.getElementById('cursor-dot');
    const cursorRing = document.getElementById('cursor-ring');
    let mouseX = -100, mouseY = -100;
    let ringX = -100, ringY = -100;

    document.addEventListener('mousemove', e => {
        mouseX = e.clientX; mouseY = e.clientY;
        // Dot snaps instantly
        cursorDot.style.left = mouseX + 'px';
        cursorDot.style.top = mouseY + 'px';
    });

    // Ring lags behind with lerp interpolation
    (function animateRing() {
        ringX += (mouseX - ringX) * 0.11;
        ringY += (mouseY - ringY) * 0.11;
        cursorRing.style.left = ringX + 'px';
        cursorRing.style.top = ringY + 'px';
        requestAnimationFrame(animateRing);
    })();

    // Hover state (ring swells + turns purple)
    document.querySelectorAll('a, button, .grid-item, .tab-btn, .contact-card, .service-card, .rate-card, .ab-card, .experience-card').forEach(el => {
        el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
        el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
    });

    // Click burst (ring collapses briefly)
    document.addEventListener('mousedown', () => document.body.classList.add('cursor-click'));
    document.addEventListener('mouseup', () => document.body.classList.remove('cursor-click'));

    document.addEventListener('mouseleave', () => {
        cursorDot.style.opacity = cursorRing.style.opacity = '0';
    });
    document.addEventListener('mouseenter', () => {
        cursorDot.style.opacity = cursorRing.style.opacity = '1';
    });


    // ============================================================
    // 7. CANVAS PARTICLE NETWORK
    // ============================================================
    const canvas = document.getElementById('bg-canvas');
    const ctx = canvas.getContext('2d');
    let W = canvas.width = window.innerWidth;
    let H = canvas.height = window.innerHeight;

    window.addEventListener('resize', () => {
        W = canvas.width = window.innerWidth;
        H = canvas.height = window.innerHeight;
    });

    const COLORS = ['rgba(56,189,248,', 'rgba(139,92,246,', 'rgba(20,184,166,', 'rgba(236,72,153,', 'rgba(99,102,241,'];
    const particles = Array.from({ length: 65 }, () => ({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        r: Math.random() * 1.6 + 0.5,
        col: COLORS[Math.floor(Math.random() * COLORS.length)],
        alpha: Math.random() * 0.45 + 0.15,
    }));

    let cmx = -9999, cmy = -9999;
    document.addEventListener('mousemove', e => { cmx = e.clientX; cmy = e.clientY; });

    (function drawLoop() {
        ctx.clearRect(0, 0, W, H);

        particles.forEach(p => {
            // Gentle mouse attraction within 180px
            const dx = cmx - p.x, dy = cmy - p.y;
            const d = Math.sqrt(dx * dx + dy * dy);
            if (d < 180 && d > 0) { p.vx += (dx / d) * 0.011; p.vy += (dy / d) * 0.011; }

            // Speed limit
            const spd = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
            if (spd > 1.1) { p.vx *= 0.88; p.vy *= 0.88; }

            p.x += p.vx; p.y += p.vy;
            if (p.x < 0) p.x = W; if (p.x > W) p.x = 0;
            if (p.y < 0) p.y = H; if (p.y > H) p.y = 0;

            ctx.beginPath();
            ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
            ctx.fillStyle = p.col + p.alpha + ')';
            ctx.fill();
        });

        // Connection lines between nearby particles
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const a = particles[i], b = particles[j];
                const dx = a.x - b.x, dy = a.y - b.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 130) {
                    ctx.beginPath();
                    ctx.moveTo(a.x, a.y);
                    ctx.lineTo(b.x, b.y);
                    ctx.strokeStyle = `rgba(56,189,248,${(1 - dist / 130) * 0.15})`;
                    ctx.lineWidth = 0.6;
                    ctx.stroke();
                }
            }
        }
        requestAnimationFrame(drawLoop);
    })();


    // ============================================================
    // 8. ORB MOUSE PARALLAX (depth layers)
    // ============================================================
    const orbs = document.querySelectorAll('.orb');
    document.addEventListener('mousemove', e => {
        const rx = (e.clientX / window.innerWidth - 0.5);
        const ry = (e.clientY / window.innerHeight - 0.5);
        orbs.forEach((orb, i) => {
            const depth = (i + 1) * 7;
            // Compose with CSS animation via additional inline transform
            orb.style.setProperty('--px', `${rx * depth}px`);
            orb.style.setProperty('--py', `${ry * depth}px`);
        });
    });


    // ============================================================
    // 9. SCROLL REVEAL
    // ============================================================
    const revealEls = document.querySelectorAll(
        '.service-card, .experience-card, .ab-card, .rate-card, .contact-card, .result-card, .section-header'
    );

    new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animation = 'fadeInUp 0.65s ease both';
                obs.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }).observe
        ? (() => {
            const obs = new IntersectionObserver((entries, o) => {
                entries.forEach(e => {
                    if (e.isIntersecting) { e.target.style.animation = 'fadeInUp 0.65s ease both'; o.unobserve(e.target); }
                });
            }, { threshold: 0.08, rootMargin: '0px 0px -30px 0px' });
            revealEls.forEach((el, i) => {
                el.style.opacity = '0';
                el.style.animationDelay = `${(i % 5) * 70}ms`;
                obs.observe(el);
            });
        })()
        : revealEls.forEach(el => { el.style.opacity = '1'; });


    // ============================================================
    // 10. STATS COUNTER ANIMATION
    // ============================================================
    const counterObs = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            const el = entry.target;
            const txt = el.textContent;
            const num = parseFloat(txt.replace(/[^0-9.]/g, ''));
            const pre = txt.match(/^[^0-9]*/)[0];
            const suf = txt.match(/[^0-9.]*$/)[0];
            if (isNaN(num)) return;

            let s = 0;
            const inc = num / (1200 / 16);
            const t = setInterval(() => {
                s += inc;
                if (s >= num) { el.textContent = pre + num + suf; clearInterval(t); }
                else { el.textContent = pre + Math.floor(s) + suf; }
            }, 16);
            counterObs.unobserve(el);
        });
    }, { threshold: 0.5 });

    document.querySelectorAll('.hero-stats .stat strong').forEach(el => counterObs.observe(el));

});
