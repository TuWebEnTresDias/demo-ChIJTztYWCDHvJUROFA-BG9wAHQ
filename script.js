/**
 * Esencia Café - Landing Page JavaScript
 * ========================================
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all modules
    initHeader();
    initMobileMenu();
    initScrollAnimations();
    initContactForm();
    initSmoothScroll();
    initParallax();
});

/**
 * Header scroll effect
 * Adds background and shadow on scroll
 */
function initHeader() {
    const header = document.getElementById('header');
    const scrollThreshold = 50;
    
    function handleScroll() {
        if (window.scrollY > scrollThreshold) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }
    
    // Initial check
    handleScroll();
    
    // Listen for scroll
    window.addEventListener('scroll', handleScroll, { passive: true });
}

/**
 * Mobile menu toggle
 * Handles hamburger menu for mobile devices
 */
function initMobileMenu() {
    const menuToggle = document.getElementById('menuToggle');
    const mainNav = document.getElementById('mainNav');
    const navLinks = mainNav.querySelectorAll('a');
    let isOpen = false;
    
    function toggleMenu() {
        isOpen = !isOpen;
        menuToggle.classList.toggle('active', isOpen);
        mainNav.classList.toggle('active', isOpen);
        document.body.style.overflow = isOpen ? 'hidden' : '';
    }
    
    function closeMenu() {
        isOpen = false;
        menuToggle.classList.remove('active');
        mainNav.classList.remove('active');
        document.body.style.overflow = '';
    }
    
    // Toggle menu on hamburger click
    menuToggle.addEventListener('click', toggleMenu);
    
    // Close menu when clicking a nav link
    navLinks.forEach(link => {
        link.addEventListener('click', closeMenu);
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', function(e) {
        if (isOpen && !mainNav.contains(e.target) && !menuToggle.contains(e.target)) {
            closeMenu();
        }
    });
    
    // Close menu on escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && isOpen) {
            closeMenu();
        }
    });
}

/**
 * Scroll animations using Intersection Observer
 * Animates elements as they enter the viewport
 */
function initScrollAnimations() {
    const animatedElements = document.querySelectorAll('.animate-fade-in');
    
    // Check if Intersection Observer is supported
    if (!('IntersectionObserver' in window)) {
        // Fallback: show all elements immediately
        animatedElements.forEach(el => el.classList.add('visible'));
        return;
    }
    
    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -50px 0px',
        threshold: 0.1
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Stop observing once animated
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe all animated elements
    animatedElements.forEach(el => observer.observe(el));
}

/**
 * Contact form submission
 * Formats message and opens WhatsApp with pre-filled message
 */
function initContactForm() {
    const form = document.getElementById('contactForm');
    
    if (!form) return;
    
    const whatsappNumber = '5491133739204';
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form values
        const name = document.getElementById('name').value.trim();
        const phone = document.getElementById('phone').value.trim();
        const message = document.getElementById('message').value.trim();
        
        // Validate required fields
        if (!name || !phone || !message) {
            showNotification('Por favor, completá todos los campos.', 'error');
            return;
        }
        
        // Build WhatsApp message
        const whatsappMessage = buildWhatsAppMessage(name, phone, message);
        
        // Encode message for URL
        const encodedMessage = encodeURIComponent(whatsappMessage);
        
        // Open WhatsApp
        window.open(`https://wa.me/${whatsappNumber}?text=${encodedMessage}`, '_blank');
        
        // Show success and reset form
        showNotification('¡Gracias! Te estamos redirigiendo a WhatsApp.', 'success');
        form.reset();
    });
}

/**
 * Build formatted WhatsApp message
 */
function buildWhatsAppMessage(name, phone, message) {
    return `Hola! Soy ${name}.

📱 Teléfono: ${phone}

💬 ${message}

_Enviado desde la web de Esencia Café_`;
}

/**
 * Show notification message
 */
function showNotification(text, type) {
    // Remove existing notification if any
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <span class="notification-text">${text}</span>
        <button class="notification-close" aria-label="Cerrar">&times;</button>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        bottom: 100px;
        right: 24px;
        max-width: 350px;
        padding: 1rem 1.5rem;
        background-color: ${type === 'success' ? '#5B7A57' : '#C44D4D'};
        color: white;
        border-radius: 8px;
        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
        z-index: 10000;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 1rem;
        font-family: 'Montserrat', sans-serif;
        font-size: 0.9rem;
        animation: slideIn 0.3s ease;
    `;
    
    // Add animation keyframes
    if (!document.getElementById('notificationStyles')) {
        const style = document.createElement('style');
        style.id = 'notificationStyles';
        style.textContent = `
            @keyframes slideIn {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
            @keyframes slideOut {
                from {
                    transform: translateX(0);
                    opacity: 1;
                }
                to {
                    transform: translateX(100%);
                    opacity: 0;
                }
            }
            .notification-close {
                background: none;
                border: none;
                color: white;
                font-size: 1.5rem;
                cursor: pointer;
                padding: 0;
                line-height: 1;
                opacity: 0.8;
                transition: opacity 0.2s;
            }
            .notification-close:hover {
                opacity: 1;
            }
        `;
        document.head.appendChild(style);
    }
    
    // Add to DOM
    document.body.appendChild(notification);
    
    // Close button functionality
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => removeNotification(notification));
    
    // Auto-remove after 5 seconds
    setTimeout(() => removeNotification(notification), 5000);
}

/**
 * Remove notification with animation
 */
function removeNotification(notification) {
    if (!notification || !notification.parentNode) return;
    
    notification.style.animation = 'slideOut 0.3s ease forwards';
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, 300);
}

/**
 * Smooth scroll for anchor links
 * Handles internal navigation smoothly
 */
function initSmoothScroll() {
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    
    anchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // Skip if it's just "#"
            if (href === '#') return;
            
            const target = document.querySelector(href);
            
            if (target) {
                e.preventDefault();
                
                const headerHeight = document.getElementById('header').offsetHeight;
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

/**
 * Subtle parallax effect for hero section
 */
function initParallax() {
    const heroBg = document.querySelector('.hero-bg img');
    
    if (!heroBg) return;
    
    let ticking = false;
    
    function updateParallax() {
        const scrolled = window.pageYOffset;
        const heroHeight = document.querySelector('.hero').offsetHeight;
        
        if (scrolled < heroHeight) {
            const parallaxValue = scrolled * 0.3;
            heroBg.style.transform = `scale(1.05) translateY(${parallaxValue}px)`;
        }
        
        ticking = false;
    }
    
    window.addEventListener('scroll', function() {
        if (!ticking) {
            requestAnimationFrame(updateParallax);
            ticking = true;
        }
    }, { passive: true });
}

/**
 * Lazy loading for images (fallback for older browsers)
 */
function initLazyLoading() {
    // Check if native lazy loading is supported
    if ('loading' in HTMLImageElement.prototype) {
        // Browser supports native lazy loading, do nothing
        return;
    }
    
    // Fallback: use Intersection Observer for lazy loading
    const lazyImages = document.querySelectorAll('img[loading="lazy"]');
    
    if (!lazyImages.length) return;
    
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                }
                imageObserver.unobserve(img);
            }
        });
    });
    
    lazyImages.forEach(img => imageObserver.observe(img));
}

/**
 * Add current year to footer copyright
 */
function updateFooterYear() {
    const yearElements = document.querySelectorAll('.current-year');
    const currentYear = new Date().getFullYear();
    
    yearElements.forEach(el => {
        el.textContent = currentYear;
    });
}

// Call utility functions
updateFooterYear();

/**
 * Preload critical images
 */
function preloadImages() {
    const criticalImages = [
        // Add any critical image URLs here if needed
    ];
    
    criticalImages.forEach(src => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'image';
        link.href = src;
        document.head.appendChild(link);
    });
}

// Initialize preloading
preloadImages();

/**
 * Handle visibility changes for performance
 * Pause animations when tab is not visible
 */
document.addEventListener('visibilitychange', function() {
    const heroImg = document.querySelector('.hero-bg img');
    
    if (heroImg) {
        if (document.hidden) {
            heroImg.style.animationPlayState = 'paused';
        } else {
            heroImg.style.animationPlayState = 'running';
        }
    }
});

/**
 * Debounce utility function
 */
function debounce(func, wait) {
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

/**
 * Throttle utility function
 */
function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

/**
 * Console branding
 */
console.log(
    '%c Esencia Café %c Landing Page ',
    'background: #5B7A57; color: white; padding: 4px 8px; border-radius: 4px 0 0 4px; font-weight: bold;',
    'background: #8EA88B; color: white; padding: 4px 8px; border-radius: 0 4px 4px 0;'
);