// Modern Portfolio Animations - Inspired by monzim.com

// Initialize GSAP only if it's available
if (typeof gsap !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
}

// Modern contact form handler
function setupContactForm() {
    const form = document.getElementById('contactForm');
    if (!form) return;
    
    const submitButton = document.getElementById('submitButton');
    const buttonText = document.getElementById('buttonText');
    const buttonLoader = document.getElementById('buttonLoader');
    const successMessage = document.getElementById('successMessage');
    const errorMessage = document.getElementById('errorMessage');

    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        // Hide previous messages
        successMessage.style.display = 'none';
        errorMessage.style.display = 'none';

        // Show loading state
        submitButton.disabled = true;
        buttonText.style.display = 'none';
        buttonLoader.style.display = 'inline';

        try {
            const formData = new FormData(form);
            
            // Add additional form data for better email delivery
            formData.append('_subject', 'New Contact Form Submission from Portfolio');
            formData.append('_replyto', formData.get('email'));
            
            const response = await fetch('https://formspree.io/f/mnnnnzdy', {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            });

            const data = await response.json();

            if (response.ok) {
                successMessage.style.display = 'block';
                form.reset();
                // Scroll to success message
                successMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
            } else {
                throw new Error(data.error || 'Form submission failed');
            }
        } catch (error) {
            console.error('Error:', error);
            errorMessage.style.display = 'block';
            // Scroll to error message
            errorMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
        } finally {
            // Reset button state
            submitButton.disabled = false;
            buttonText.style.display = 'inline';
            buttonLoader.style.display = 'none';
        }
    });
}

// Modern smooth scroll for navigation
function setupSmoothScroll() {
    document.querySelectorAll('.nav-links a, .footer-section a').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href && href.startsWith('#')) {
                e.preventDefault();
                const section = document.querySelector(href);
                if (section) {
                    section.scrollIntoView({ 
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });
}

// Enhanced intersection observer for animations
function setupIntersectionObserver() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
                
                // Add stagger effect for grids
                if (entry.target.classList.contains('skills-grid') || 
                    entry.target.classList.contains('projects-grid') ||
                    entry.target.classList.contains('education-grid')) {
                    
                    const items = entry.target.children;
                    Array.from(items).forEach((item, index) => {
                        setTimeout(() => {
                            item.classList.add('animate');
                        }, index * 100);
                    });
                }
            }
        });
    }, observerOptions);

    // Observe all animatable elements
    document.querySelectorAll('.skill-item, .modern-card, .education-card, .skills-grid, .projects-grid, .education-grid').forEach(el => {
        observer.observe(el);
    });
}

// Modern navigation scroll effects
function setupNavigationEffects() {
    const nav = document.querySelector('.modern-nav');
    let lastScrollY = window.scrollY;
    let ticking = false;

    function updateNav() {
        const scrollY = window.scrollY;
        
        // Show nav when user starts scrolling down
        if (scrollY > 100) {
            nav.classList.add('show');
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('show');
            nav.classList.remove('scrolled');
        }

        // Hide/show nav based on scroll direction (only after it's shown)
        if (nav.classList.contains('show')) {
            if (scrollY > lastScrollY && scrollY > 200) {
                nav.style.transform = 'translateY(-100%)';
            } else {
                nav.style.transform = 'translateY(0)';
            }
        }

        lastScrollY = scrollY;
        ticking = false;
    }

    function requestTick() {
        if (!ticking) {
            requestAnimationFrame(updateNav);
            ticking = true;
        }
    }

    window.addEventListener('scroll', requestTick);
}

// Modern card hover effects
function setupCardEffects() {
    const cards = document.querySelectorAll('.modern-card, .skill-item, .education-card');
    
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            // Subtle scale effect
            this.style.transform = 'translateY(-5px) scale(1.02)';
        });

        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
}

// Profile image parallax effect
function setupProfileParallax() {
    const profileImg = document.querySelector('.profile-img');
    if (!profileImg) return;

    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const rate = scrolled * -0.5;
        
        if (scrolled < window.innerHeight) {
            profileImg.style.transform = `translateY(${rate}px) scale(1.05)`;
        }
    });
}

// Typing effect for hero text (if Typed.js is available)
function setupTypingEffect() {
    if (typeof Typed === 'undefined') return;

    const heroTitle = document.querySelector('.hero-text h1');
    if (heroTitle) {
        const originalText = heroTitle.textContent;
        heroTitle.textContent = '';
        
        new Typed('.hero-text h1', {
            strings: [originalText],
            typeSpeed: 50,
            showCursor: false,
            onComplete: function() {
                // Add animation class after typing completes
                heroTitle.classList.add('typing-complete');
            }
        });
    }
}

// Modern loading sequence
function initializeLoadingSequence() {
    const loadingScreen = document.querySelector('.loading');
    const body = document.body;
    
    // Ensure minimum loading time for smooth experience
    const minLoadTime = 800;
    const startTime = Date.now();
    
    function hideLoading() {
        const elapsed = Date.now() - startTime;
        const delay = Math.max(0, minLoadTime - elapsed);
        
        setTimeout(() => {
            loadingScreen.style.opacity = '0';
            setTimeout(() => {
                loadingScreen.style.display = 'none';
                body.classList.add('loaded');
            }, 300);
        }, delay);
    }

    if (document.readyState === 'complete') {
        hideLoading();
    } else {
        window.addEventListener('load', hideLoading);
    }
}

// Performance optimized scroll handler
function throttle(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Initialize all modern features
function initializeModernPortfolio() {
    // Core functionality
    setupContactForm();
    setupSmoothScroll();
    setupIntersectionObserver();
    setupNavigationEffects();
    
    // Enhanced effects
    setupCardEffects();
    setupProfileParallax();
    
    // Optional enhancements
    if (typeof Typed !== 'undefined') {
        setupTypingEffect();
    }
    
    // Add loaded class to body for CSS transitions
    setTimeout(() => {
        document.body.classList.add('animations-ready');
    }, 100);
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    initializeLoadingSequence();
    
    // Delay initialization slightly to ensure DOM is fully ready
    setTimeout(initializeModernPortfolio, 100);
});

// Handle page visibility changes
document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') {
        // Re-trigger animations when page becomes visible
        document.querySelectorAll('.animate').forEach(el => {
            el.style.animationPlayState = 'running';
        });
    }
});

// Export functions for external use
window.PortfolioAnimations = {
    setupContactForm,
    setupSmoothScroll,
    setupIntersectionObserver,
    setupNavigationEffects,
    setupCardEffects
};