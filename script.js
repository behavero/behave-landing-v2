document.addEventListener('DOMContentLoaded', function() {
    // Form handling
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = this.querySelector('input[type="email"]').value;
            if (email) {
                // Here you would typically send the email to your backend
                console.log('Email submitted:', email);
                alert('Thank you for subscribing! We\'ll be in touch soon.');
                this.reset();
            }
        });
    });

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Add fade-in animation to sections
    const sections = document.querySelectorAll('section');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-fade-in');
            }
        });
    }, {
        threshold: 0.1
    });

    sections.forEach(section => {
        observer.observe(section);
    });

    // Scroll-activated How It Works section
    activateHowItWorksSteps();
    window.addEventListener('resize', activateHowItWorksSteps);

    // GSAP ScrollTrigger for How It Works section
    gsapHowItWorksScroll();
    setTimeout(gsapHowItWorksScroll, 300); // Wait for GSAP to load
    window.addEventListener('resize', gsapHowItWorksScroll);

    patchGsapStepSync();
    document.addEventListener('scroll', syncProgressDots, true);
});

function activateHowItWorksSteps() {
    const steps = document.querySelectorAll('#how-it-works-scroll .how-step');
    if (!steps.length) return;
    if (window.innerWidth <= 768) {
        steps.forEach(step => {
            step.classList.add('active');
            step.classList.remove('past');
        });
        return;
    }
    let lastActive = -1;
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            const idx = Array.from(steps).indexOf(entry.target);
            if (entry.isIntersecting && entry.intersectionRatio > 0.5) {
                steps.forEach((s, i) => {
                    s.classList.remove('active', 'past');
                    if (i < idx) s.classList.add('past');
                });
                entry.target.classList.add('active');
                lastActive = idx;
            } else if (!entry.isIntersecting && lastActive >= 0) {
                entry.target.classList.remove('active');
            }
        });
    }, {
        threshold: [0.5]
    });
    steps.forEach(step => observer.observe(step));
}

// GSAP ScrollTrigger for How It Works section
function gsapHowItWorksScroll() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
    const section = document.querySelector('#how-it-works-scroll');
    const steps = gsap.utils.toArray('#how-it-works-scroll .how-step');
    if (!section || steps.length === 0) return;

    // Reset any previous triggers
    ScrollTrigger.getAll().forEach(t => t.kill());
    gsap.set(steps, { opacity: 0.4, scale: 0.98 });

    // Pin the section and animate steps
    gsap.timeline({
        scrollTrigger: {
            trigger: section,
            start: 'top top',
            end: `+=${steps.length * 100}%`,
            scrub: true,
            pin: true,
            anticipatePin: 1,
        }
    })
    .to(steps, {
        opacity: 1,
        scale: 1.04,
        stagger: 1 / steps.length,
        duration: 0.5,
        ease: 'power1.inOut',
    })
    .to(steps, {
        opacity: (i, target, targets) => i < targets.length - 1 ? 0.6 : 1,
        scale: (i, target, targets) => i < targets.length - 1 ? 0.99 : 1.04,
        stagger: 1 / steps.length,
        duration: 0.5,
        ease: 'power1.inOut',
    }, ">-0.5");

    // Animate each step individually for scroll up/down
    steps.forEach((step, i) => {
        ScrollTrigger.create({
            trigger: step,
            start: () => `top+=${i * window.innerHeight * 0.5} center`,
            end: () => `top+=${(i + 1) * window.innerHeight * 0.5} center`,
            onEnter: () => {
                steps.forEach((s, idx) => {
                    s.classList.remove('active', 'past');
                    if (idx < i) s.classList.add('past');
                });
                step.classList.add('active');
            },
            onEnterBack: () => {
                steps.forEach((s, idx) => {
                    s.classList.remove('active', 'past');
                    if (idx < i) s.classList.add('past');
                });
                step.classList.add('active');
            },
            onLeave: () => step.classList.remove('active'),
            onLeaveBack: () => step.classList.remove('active'),
        });
    });
}

// Animate progress dots in sync with steps
function syncProgressDots() {
    const steps = document.querySelectorAll('#how-it-works-scroll .how-step');
    const dots = document.querySelectorAll('#how-it-works-scroll .progress-dot');
    let activeIdx = -1;
    steps.forEach((step, i) => {
        if (step.classList.contains('active')) activeIdx = i;
    });
    dots.forEach((dot, i) => {
        dot.classList.remove('active', 'past');
        if (i === activeIdx) dot.classList.add('active');
        else if (i < activeIdx) dot.classList.add('past');
    });
}

// Patch GSAP triggers to sync dots
function patchGsapStepSync() {
    const steps = document.querySelectorAll('#how-it-works-scroll .how-step');
    steps.forEach(step => {
        const observer = new MutationObserver(syncProgressDots);
        observer.observe(step, { attributes: true, attributeFilter: ['class'] });
    });
    syncProgressDots();
} 