// ===== Custom Sword Cursor =====
const cursor = document.querySelector('.cursor');
const cursorFollower = document.querySelector('.cursor-follower');
let mouseX = 0, mouseY = 0;
let followerX = 0, followerY = 0;
let prevMouseX = 0, prevMouseY = 0;

// Sword trail particles
const trailParticles = [];
const maxTrailParticles = 8;

function createTrailParticle(x, y) {
    const particle = document.createElement('div');
    particle.className = 'sword-trail';
    particle.style.cssText = `
        position: fixed;
        left: ${x}px;
        top: ${y}px;
        width: 4px;
        height: 4px;
        background: radial-gradient(circle, #fcd34d, #f59e0b);
        border-radius: 50%;
        pointer-events: none;
        z-index: 9999;
        box-shadow: 0 0 10px rgba(251, 191, 36, 0.8);
        transition: all 0.3s ease;
    `;
    document.body.appendChild(particle);
    trailParticles.push(particle);
    
    // Fade out and remove
    setTimeout(() => {
        particle.style.opacity = '0';
        particle.style.transform = 'scale(0)';
    }, 50);
    
    setTimeout(() => {
        particle.remove();
        trailParticles.shift();
    }, 300);
}

document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursor.style.left = mouseX + 'px';
    cursor.style.top = mouseY + 'px';
    
    // Calculate movement speed
    const dx = mouseX - prevMouseX;
    const dy = mouseY - prevMouseY;
    const speed = Math.sqrt(dx * dx + dy * dy);
    
    // Create trail particles when moving fast
    if (speed > 10 && trailParticles.length < maxTrailParticles) {
        createTrailParticle(mouseX, mouseY);
    }
    
    // Rotate sword based on movement direction
    if (speed > 5) {
        const angle = Math.atan2(dy, dx) * (180 / Math.PI) + 45;
        cursor.style.transform = `translate(-10%, -10%) rotate(${angle}deg)`;
    }
    
    prevMouseX = mouseX;
    prevMouseY = mouseY;
});

// Smooth follower animation
function animateFollower() {
    followerX += (mouseX - followerX) * 0.1;
    followerY += (mouseY - followerY) * 0.1;
    cursorFollower.style.left = followerX + 'px';
    cursorFollower.style.top = followerY + 'px';
    requestAnimationFrame(animateFollower);
}
animateFollower();

// Cursor hover effects
const hoverElements = document.querySelectorAll('a, button, .project-card, .skill-card');
hoverElements.forEach(el => {
    el.addEventListener('mouseenter', () => {
        cursor.classList.add('hover');
        cursorFollower.classList.add('hover');
    });
    el.addEventListener('mouseleave', () => {
        cursor.classList.remove('hover');
        cursorFollower.classList.remove('hover');
    });
});

// ===== Minimal Particle Background =====
const canvas = document.getElementById('particles');
const ctx = canvas.getContext('2d');
let particles = [];
const particleCount = 40; // Reduced for minimal look

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

class Particle {
    constructor() {
        this.reset();
    }
    
    reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 1.5 + 0.5;
        this.speedY = Math.random() * 0.2 + 0.1; // Slow upward drift
        this.opacity = Math.random() * 0.3 + 0.1;
        this.color = '#ffffff';
    }
    
    update() {
        this.y -= this.speedY;
        
        // Reset when particle goes off screen
        if (this.y < -10) {
            this.y = canvas.height + 10;
            this.x = Math.random() * canvas.width;
        }
        
        // Subtle horizontal sway
        this.x += Math.sin(this.y * 0.01) * 0.2;
    }
    
    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.globalAlpha = this.opacity;
        ctx.fill();
        ctx.globalAlpha = 1;
    }
}

// Initialize particles
for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
}

function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    particles.forEach(particle => {
        particle.update();
        particle.draw();
    });
    
    requestAnimationFrame(animateParticles);
}
animateParticles();


// ===== Progress Bar =====
const progressBar = document.querySelector('.progress-bar');

function updateProgressBar() {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = (scrollTop / docHeight) * 100;
    progressBar.style.width = progress + '%';
}

window.addEventListener('scroll', updateProgressBar);

// ===== Navbar =====
const navbar = document.querySelector('.navbar');
const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('.nav-links');
const navLinkItems = document.querySelectorAll('.nav-link');

// Scroll effect
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Mobile menu toggle
navToggle.addEventListener('click', () => {
    navToggle.classList.toggle('active');
    navLinks.classList.toggle('active');
});

// Close mobile menu on link click
navLinkItems.forEach(link => {
    link.addEventListener('click', () => {
        navToggle.classList.remove('active');
        navLinks.classList.remove('active');
    });
});

// Active link on scroll
const sections = document.querySelectorAll('section');

function updateActiveLink() {
    const scrollPos = window.scrollY + 200;
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');
        
        if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
            navLinkItems.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === '#' + sectionId) {
                    link.classList.add('active');
                }
            });
        }
    });
}

window.addEventListener('scroll', updateActiveLink);

// ===== Scroll Reveal Animations =====
function reveal() {
    const reveals = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
    
    reveals.forEach(element => {
        const windowHeight = window.innerHeight;
        const elementTop = element.getBoundingClientRect().top;
        const revealPoint = 150;
        
        if (elementTop < windowHeight - revealPoint) {
            element.classList.add('active');
        }
    });
}

// Add reveal classes to elements
document.querySelectorAll('.section-header').forEach(el => el.classList.add('reveal'));
document.querySelectorAll('.skill-card').forEach((el, i) => {
    el.classList.add('reveal');
    el.style.transitionDelay = (i * 0.1) + 's';
});
document.querySelectorAll('.project-card').forEach((el, i) => {
    el.classList.add('reveal');
    el.style.transitionDelay = (i * 0.1) + 's';
});
document.querySelector('.about-image')?.classList.add('reveal-left');
document.querySelector('.about-text')?.classList.add('reveal-right');
document.querySelector('.contact-info')?.classList.add('reveal-left');
document.querySelector('.contact-form')?.classList.add('reveal-right');

window.addEventListener('scroll', reveal);
reveal(); // Initial check

// ===== Skill Progress Animation =====
function animateSkillBars() {
    const skillBars = document.querySelectorAll('.skill-progress');
    
    skillBars.forEach(bar => {
        const windowHeight = window.innerHeight;
        const elementTop = bar.getBoundingClientRect().top;
        
        if (elementTop < windowHeight - 100) {
            const progress = bar.getAttribute('data-progress');
            bar.style.width = progress + '%';
        }
    });
}

window.addEventListener('scroll', animateSkillBars);

// ===== Counter Animation =====
function animateCounters() {
    const counters = document.querySelectorAll('.stat-number');
    
    counters.forEach(counter => {
        const windowHeight = window.innerHeight;
        const elementTop = counter.getBoundingClientRect().top;
        
        if (elementTop < windowHeight - 100 && !counter.classList.contains('counted')) {
            counter.classList.add('counted');
            const target = parseInt(counter.getAttribute('data-target'));
            const duration = 2000;
            const increment = target / (duration / 16);
            let current = 0;
            
            const updateCounter = () => {
                current += increment;
                if (current < target) {
                    counter.textContent = Math.floor(current) + '+';
                    requestAnimationFrame(updateCounter);
                } else {
                    counter.textContent = target + '+';
                }
            };
            
            updateCounter();
        }
    });
}

window.addEventListener('scroll', animateCounters);


// ===== 3D Tilt Effect for Project Cards =====
const tiltCards = document.querySelectorAll('[data-tilt]');

tiltCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = (y - centerY) / 10;
        const rotateY = (centerX - x) / 10;
        
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-10px)`;
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
    });
});

// ===== Smooth Scroll =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const offsetTop = target.offsetTop - 80;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// ===== EmailJS Configuration =====
// SETUP INSTRUCTIONS:
// 1. Go to https://www.emailjs.com/ and create a free account
// 2. Add an email service (Gmail, Outlook, etc.) - get your SERVICE_ID
// 3. Create an email template with these variables: {{from_name}}, {{from_email}}, {{subject}}, {{message}}
// 4. Get your PUBLIC_KEY from Account > API Keys
// 5. Replace the values below with your actual IDs

const EMAILJS_PUBLIC_KEY = 'gTl2Aur_SClMWcwG_';      // Replace with your public key
const EMAILJS_SERVICE_ID = 'service_p4sgftu';      // Replace with your service ID  
const EMAILJS_TEMPLATE_ID = 'template_sg7adtn';    // Replace with your template ID

// Initialize EmailJS
(function() {
    if (typeof emailjs !== 'undefined') {
        emailjs.init(EMAILJS_PUBLIC_KEY);
    }
})();

// ===== Form Handling with EmailJS =====
const contactForm = document.getElementById('contactForm');
const formStatus = document.getElementById('formStatus');

contactForm?.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const btn = contactForm.querySelector('.btn-send');
    const btnText = btn.querySelector('.btn-text');
    const btnLoading = btn.querySelector('.btn-loading');
    
    // Show loading state
    btnText.style.display = 'none';
    btnLoading.style.display = 'inline';
    btn.disabled = true;
    
    // Get form data
    const templateParams = {
        from_name: contactForm.from_name.value,
        from_email: contactForm.from_email.value,
        subject: contactForm.subject.value || 'Portfolio Contact',
        message: contactForm.message.value
    };
    
    try {
        // Check if EmailJS is configured
        if (EMAILJS_PUBLIC_KEY === 'YOUR_PUBLIC_KEY') {
            // Demo mode - simulate success
            await new Promise(resolve => setTimeout(resolve, 1500));
            throw new Error('EmailJS not configured - Demo mode');
        }
        
        // Send email via EmailJS
        await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams);
        
        // Success
        btnText.textContent = '✓ Message Sent!';
        btnText.style.display = 'inline';
        btnLoading.style.display = 'none';
        btn.style.background = 'linear-gradient(135deg, #10b981, #059669)';
        
        formStatus.innerHTML = '<p class="success">Thank you! Your message has been sent successfully.</p>';
        formStatus.className = 'form-status show';
        
        contactForm.reset();
        
        // Reset button after 3 seconds
        setTimeout(() => {
            btnText.textContent = 'Send Message';
            btn.style.background = '';
            btn.disabled = false;
            formStatus.className = 'form-status';
        }, 3000);
        
    } catch (error) {
        // Error or Demo mode
        btnText.textContent = 'Failed - Try Again';
        btnText.style.display = 'inline';
        btnLoading.style.display = 'none';
        btn.style.background = 'linear-gradient(135deg, #ef4444, #dc2626)';
        
        const errorMsg = EMAILJS_PUBLIC_KEY === 'YOUR_PUBLIC_KEY' 
            ? 'EmailJS not configured yet. Please email directly at girishbabul068@gmail.com'
            : 'Oops! Something went wrong. Please try again or email directly.';
        
        formStatus.innerHTML = `<p class="error">${errorMsg}</p>`;
        formStatus.className = 'form-status show';
        
        setTimeout(() => {
            btnText.textContent = 'Send Message';
            btn.style.background = '';
            btn.disabled = false;
        }, 3000);
    }
});

// ===== Parallax Effect =====
window.addEventListener('scroll', () => {
    const scrolled = window.scrollY;
    
    // Parallax for hero visual
    const heroVisual = document.querySelector('.hero-visual');
    if (heroVisual) {
        heroVisual.style.transform = `translateY(${scrolled * 0.3}px)`;
    }
    
    // Parallax for hologram rings
    const rings = document.querySelectorAll('.hologram-ring');
    rings.forEach((ring, index) => {
        const speed = 0.1 * (index + 1);
        ring.style.transform = `rotate(${scrolled * speed}deg)`;
    });
});

// ===== Magnetic Button Effect =====
const magneticBtns = document.querySelectorAll('.btn');

magneticBtns.forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        
        btn.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
    });
    
    btn.addEventListener('mouseleave', () => {
        btn.style.transform = 'translate(0, 0)';
    });
});

// ===== Text Scramble Effect =====
class TextScramble {
    constructor(el) {
        this.el = el;
        this.chars = '!<>-_\\/[]{}—=+*^?#________';
        this.update = this.update.bind(this);
    }
    
    setText(newText) {
        const oldText = this.el.innerText;
        const length = Math.max(oldText.length, newText.length);
        const promise = new Promise(resolve => this.resolve = resolve);
        this.queue = [];
        
        for (let i = 0; i < length; i++) {
            const from = oldText[i] || '';
            const to = newText[i] || '';
            const start = Math.floor(Math.random() * 40);
            const end = start + Math.floor(Math.random() * 40);
            this.queue.push({ from, to, start, end });
        }
        
        cancelAnimationFrame(this.frameRequest);
        this.frame = 0;
        this.update();
        return promise;
    }
    
    update() {
        let output = '';
        let complete = 0;
        
        for (let i = 0, n = this.queue.length; i < n; i++) {
            let { from, to, start, end, char } = this.queue[i];
            
            if (this.frame >= end) {
                complete++;
                output += to;
            } else if (this.frame >= start) {
                if (!char || Math.random() < 0.28) {
                    char = this.randomChar();
                    this.queue[i].char = char;
                }
                output += `<span class="scramble">${char}</span>`;
            } else {
                output += from;
            }
        }
        
        this.el.innerHTML = output;
        
        if (complete === this.queue.length) {
            this.resolve();
        } else {
            this.frameRequest = requestAnimationFrame(this.update);
            this.frame++;
        }
    }
    
    randomChar() {
        return this.chars[Math.floor(Math.random() * this.chars.length)];
    }
}

// Apply scramble effect to hero title on load
const heroHighlight = document.querySelector('.hero-title .highlight');
if (heroHighlight) {
    const fx = new TextScramble(heroHighlight);
    setTimeout(() => {
        fx.setText('Girish Babu L');
    }, 1000);
}

// ===== Intersection Observer for Performance =====
const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
        }
    });
}, observerOptions);

document.querySelectorAll('section').forEach(section => {
    observer.observe(section);
});

// ===== Preloader (Optional Enhancement) =====
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
});

// ===== Keyboard Navigation =====
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        navToggle.classList.remove('active');
        navLinks.classList.remove('active');
    }
});

// ===== Back to Top Button =====
const backToTopBtn = document.getElementById('backToTop');

function toggleBackToTop() {
    if (window.scrollY > 500) {
        backToTopBtn.classList.add('visible');
    } else {
        backToTopBtn.classList.remove('visible');
    }
}

window.addEventListener('scroll', toggleBackToTop);

backToTopBtn?.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// ===== Console Easter Egg =====
console.log('%c👋 Hey there, curious developer!', 'font-size: 20px; font-weight: bold; color: #00f0ff;');
console.log('%cLooking for something? Feel free to reach out!', 'font-size: 14px; color: #a855f7;');


// ===== Advanced Scroll Fade Animations =====
const scrollSections = document.querySelectorAll('section');

// Add scroll-section class to all sections
scrollSections.forEach(section => {
    section.classList.add('scroll-section');
});

// Make hero visible by default
document.querySelector('.hero')?.classList.add('visible');

function handleScrollAnimations() {
    const windowHeight = window.innerHeight;
    
    scrollSections.forEach((section) => {
        const rect = section.getBoundingClientRect();
        const sectionTop = rect.top;
        const sectionBottom = rect.bottom;
        const sectionCenter = sectionTop + rect.height / 2;
        
        // Calculate visibility percentage
        const enterThreshold = windowHeight * 0.85;
        const exitThreshold = windowHeight * 0.15;
        
        // Section entering viewport (from bottom)
        if (sectionTop < enterThreshold && sectionBottom > exitThreshold) {
            section.classList.add('visible');
            section.classList.remove('fade-out');
        }
        
        // Section leaving viewport (scrolling up - section going above screen)
        if (sectionBottom < exitThreshold && sectionBottom > -rect.height * 0.5) {
            section.classList.add('fade-out');
            section.classList.remove('visible');
        }
        
        // Section coming back into view (scrolling down - from above)
        if (sectionTop > 0 && sectionTop < enterThreshold) {
            section.classList.remove('fade-out');
            section.classList.add('visible');
        }
        
        // Reset sections completely below viewport
        if (sectionTop > windowHeight) {
            section.classList.remove('visible');
            section.classList.remove('fade-out');
        }
        
        // Reset sections completely above viewport
        if (sectionBottom < -rect.height * 0.5) {
            section.classList.remove('visible');
            section.classList.add('fade-out');
        }
    });
}

// Throttle scroll events for performance
let ticking = false;

function onScroll() {
    if (!ticking) {
        requestAnimationFrame(() => {
            handleScrollAnimations();
            ticking = false;
        });
        ticking = true;
    }
}

window.addEventListener('scroll', onScroll, { passive: true });

// Initial call
handleScrollAnimations();

// ===== Smooth Scroll with Section Snapping (Optional) =====
let isScrolling = false;
let scrollTimeout;

function smoothScrollToSection(section) {
    if (isScrolling) return;
    
    isScrolling = true;
    const offsetTop = section.offsetTop - 80;
    
    window.scrollTo({
        top: offsetTop,
        behavior: 'smooth'
    });
    
    setTimeout(() => {
        isScrolling = false;
    }, 1000);
}

// ===== Element Visibility Tracker =====
function createScrollObserver() {
    const options = {
        root: null,
        rootMargin: '-10% 0px -10% 0px',
        threshold: [0, 0.25, 0.5, 0.75, 1]
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            const section = entry.target;
            
            if (entry.isIntersecting) {
                // Add visible class with delay for smooth effect
                setTimeout(() => {
                    section.classList.add('visible');
                }, 100);
            }
            
            // Track visibility ratio for advanced effects
            const ratio = entry.intersectionRatio;
            section.style.setProperty('--visibility', ratio);
        });
    }, options);
    
    scrollSections.forEach(section => {
        observer.observe(section);
    });
}

createScrollObserver();

// ===== Scroll Direction Detection =====
let lastScrollY = window.scrollY;
let scrollDirection = 'down';

window.addEventListener('scroll', () => {
    const currentScrollY = window.scrollY;
    scrollDirection = currentScrollY > lastScrollY ? 'down' : 'up';
    lastScrollY = currentScrollY;
    
    document.body.setAttribute('data-scroll-direction', scrollDirection);
}, { passive: true });
