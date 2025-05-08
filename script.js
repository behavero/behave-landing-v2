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

    // GSAP + ScrollTrigger Animations for Behave Landing Page

    // 1. Hero Section Animation
    gsap.timeline()
        .from('section.gradient-bg h1', {opacity: 0, y: 40, duration: 0.7})
        .from('section.gradient-bg p', {opacity: 0, y: 30, duration: 0.6}, '-=0.4')
        .from('section.gradient-bg .flex > button', {opacity: 0, y: 20, stagger: 0.15, duration: 0.5}, '-=0.3')
        .from('section.gradient-bg iframe', {opacity: 0, scale: 0.96, duration: 0.7}, '-=0.3');

    // 2. How It Works Section Animation
    const steps = document.querySelectorAll('#how-it-works-scroll .how-step');
    const dots = document.querySelectorAll('#how-it-works-scroll .progress-dot');

    steps.forEach((step, i) => {
        gsap.from(step, {
            scrollTrigger: {
                trigger: step,
                start: 'top 80%',
                toggleActions: 'play none none reverse',
            },
            opacity: 0,
            x: -40,
            duration: 0.7,
            ease: 'power2.out',
            onStart: () => setActiveStep(i),
            onReverseComplete: () => setActiveStep(i - 1),
        });
    });

    // Sticky mockup fade-in
    if (window.innerWidth >= 768) {
        gsap.from('.sticky-mockup', {
            scrollTrigger: {
                trigger: '#how-it-works-scroll',
                start: 'top 80%',
                toggleActions: 'play none none reverse',
            },
            opacity: 0,
            y: 40,
            duration: 0.8,
            ease: 'power2.out',
        });
    }

    // Progress dot state logic
    function setActiveStep(activeIdx) {
        dots.forEach((dot, idx) => {
            if (idx < activeIdx) {
                dot.classList.add('bg-[#D0D3D4]');
                dot.classList.remove('bg-[#212322]');
                dot.classList.remove('border-[#212322]');
            } else if (idx === activeIdx) {
                dot.classList.add('bg-[#212322]');
                dot.classList.remove('bg-[#D0D3D4]');
                dot.classList.remove('border-[#212322]');
            } else {
                dot.classList.remove('bg-[#212322]', 'bg-[#D0D3D4]');
                dot.classList.add('border-[#212322]');
            }
        });
    }

    // 3. Product Logic Visual Animation
    gsap.from('.bg-\[\#B76CA4\], .bg-\[\#FED1BD\], .bg-\[\#CE785D\], .bg-\[\#212322\]', {
        scrollTrigger: {
            trigger: '.bg-\[\#B76CA4\]',
            start: 'top 80%',
        },
        opacity: 0,
        y: 40,
        stagger: 0.2,
        duration: 0.7,
        ease: 'power2.out',
    });

    // 4. Testimonials Animation
    gsap.from('section.bg-white blockquote', {
        scrollTrigger: {
            trigger: 'section.bg-white blockquote',
            start: 'top 85%',
        },
        opacity: 0,
        y: 40,
        duration: 0.7,
        ease: 'power2.out',
    });
    gsap.from('section.bg-white .flex.flex-wrap', {
        scrollTrigger: {
            trigger: 'section.bg-white .flex.flex-wrap',
            start: 'top 90%',
        },
        opacity: 0,
        y: 30,
        duration: 0.6,
        ease: 'power2.out',
    });

    // 5. CTA Animation
    gsap.from('section.bg-\[\#F3F4F5\] h2', {
        scrollTrigger: {
            trigger: 'section.bg-\[\#F3F4F5\] h2',
            start: 'top 90%',
        },
        opacity: 0,
        y: 40,
        duration: 0.7,
        ease: 'power2.out',
    });
    gsap.from('section.bg-\[\#F3F4F5\] button', {
        scrollTrigger: {
            trigger: 'section.bg-\[\#F3F4F5\] button',
            start: 'top 95%',
        },
        opacity: 0,
        y: 20,
        stagger: 0.15,
        duration: 0.5,
        ease: 'power2.out',
    });
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