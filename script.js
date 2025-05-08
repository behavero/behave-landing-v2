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