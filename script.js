// Mobile Navigation Toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-link').forEach(n => n.addEventListener('click', () => {
    hamburger.classList.remove('active');
    navMenu.classList.remove('active');
}));

// Page Transition System
const pageTransition = document.querySelector('.page-transition');

function triggerPageTransition(targetSection) {
    // Show transition overlay
    pageTransition.classList.add('active');
    
    // After transition animation completes, scroll to target
    setTimeout(() => {
        const target = document.querySelector(targetSection);
        if (target) {
            const offsetTop = target.offsetTop - 70; // Account for fixed navbar
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
        
        // Hide transition overlay after scroll
        setTimeout(() => {
            pageTransition.classList.remove('active');
        }, 800);
    }, 800);
}

// Active section tracking for horizontal layout
let currentSection = 'home';

function updateActiveSection() {
    const mainContainer = document.querySelector('.main-container');
    if (mainContainer) {
        const transform = mainContainer.style.transform;
        const translateX = transform ? parseInt(transform.match(/translateX\(([-\d.]+)vw\)/)?.[1] || '0') : 0;
        const sectionIndex = Math.abs(translateX / 100);
        
        const sections = ['home', 'about', 'skills', 'gallery', 'contact'];
        const newSection = sections[sectionIndex] || 'home';
        
        if (currentSection !== newSection) {
            currentSection = newSection;
            updateHeaderDisplay();
        }
    }
}

function updateHeaderDisplay() {
    const navLinks = document.querySelectorAll('.nav-link');
    const sectionNames = {
        'home': 'Home',
        'about': 'About',
        'skills': 'Skills', 
        'gallery': 'Gallery',
        'contact': 'Contact'
    };
    
    // Remove active class from all links
    navLinks.forEach(link => {
        link.classList.remove('active');
    });
    
    // Add active class to current section link
    const activeLink = document.querySelector(`a[href="#${currentSection}"]`);
    if (activeLink) {
        activeLink.classList.add('active');
    }
    
    // Update header title (optional - you can add this if you want a title in header)
    const headerTitle = document.querySelector('.header-title');
    if (headerTitle) {
        headerTitle.textContent = sectionNames[currentSection];
    }
}

// Horizontal navigation
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetSection = this.getAttribute('href');
        
        // Get section index for horizontal movement
        const sections = ['#home', '#about', '#skills', '#gallery', '#contact'];
        const targetIndex = sections.indexOf(targetSection);
        
        if (targetIndex !== -1) {
            // Calculate horizontal position
            const translateX = -(targetIndex * 100);
            
            // Trigger page transition
            triggerPageTransition(targetSection);
            
            // Move to target section horizontally
            setTimeout(() => {
                const mainContainer = document.querySelector('.main-container');
                if (mainContainer) {
                    mainContainer.style.transform = `translateX(${translateX}vw)`;
                }
            }, 800);
        }
    });
});

// Track scroll position to update active section
window.addEventListener('scroll', updateActiveSection);

// Initialize active section on page load
document.addEventListener('DOMContentLoaded', () => {
    updateActiveSection();
});

// Navbar Background on Scroll
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.style.background = 'linear-gradient(135deg, rgba(26, 26, 46, 0.98) 0%, rgba(22, 33, 62, 0.98) 50%, rgba(15, 15, 35, 0.98) 100%)';
    } else {
        navbar.style.background = 'linear-gradient(135deg, rgba(26, 26, 46, 0.95) 0%, rgba(22, 33, 62, 0.95) 50%, rgba(15, 15, 35, 0.95) 100%)';
    }
});

// Gallery Filter Functionality
const filterButtons = document.querySelectorAll('.filter-btn');
const galleryItems = document.querySelectorAll('.gallery-item');

filterButtons.forEach(button => {
    button.addEventListener('click', () => {
        // Remove active class from all buttons
        filterButtons.forEach(btn => btn.classList.remove('active'));
        // Add active class to clicked button
        button.classList.add('active');
        
        const filterValue = button.getAttribute('data-filter');
        
        galleryItems.forEach(item => {
            if (filterValue === 'all' || item.classList.contains(filterValue)) {
                item.style.display = 'flex';
                item.style.animation = 'fadeInUp 0.5s ease';
            } else {
                item.style.display = 'none';
            }
        });
    });
});

// Intersection Observer for Animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.animation = 'fadeInUp 0.8s ease forwards';
            entry.target.style.opacity = '1';
        }
    });
}, observerOptions);

// Observe elements for animation
document.querySelectorAll('.skill-card, .gallery-item, .contact-item, .stat-item').forEach(el => {
    el.style.opacity = '0';
    observer.observe(el);
});

// Parallax Effect for Hero Section
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero');
    const heroContent = document.querySelector('.hero-content');
    
    if (hero && heroContent) {
        const rate = scrolled * -0.5;
        heroContent.style.transform = `translateY(${rate}px)`;
    }
});

// 3D Earth System Interactions
const earthSystem = document.querySelector('.earth-system');
const earthElement = document.querySelector('.earth');

// Mouse tracking for 3D effect
let mouseX = 0;
let mouseY = 0;
let isHoveringEarth = false;

document.addEventListener('mousemove', (e) => {
    mouseX = (e.clientX / window.innerWidth) * 2 - 1;
    mouseY = (e.clientY / window.innerHeight) * 2 - 1;
    
    if (isHoveringEarth && earthSystem) {
        const rotationX = mouseY * 10;
        const rotationY = mouseX * 10;
        earthSystem.style.transform = `rotateX(${rotationX}deg) rotateY(${rotationY}deg)`;
    }
});

// Earth system hover effects
if (earthSystem) {
    earthSystem.addEventListener('mouseenter', () => {
        isHoveringEarth = true;
    });
    
    earthSystem.addEventListener('mouseleave', () => {
        isHoveringEarth = false;
        earthSystem.style.transform = '';
    });
}

// Satellite click effects
const satellites = document.querySelectorAll('.satellite');

satellites.forEach((satellite, index) => {
    satellite.addEventListener('click', () => {
        // Add glow effect
        const glow = document.createElement('div');
        glow.style.cssText = `
            position: absolute;
            top: -10px;
            left: -10px;
            right: -10px;
            bottom: -10px;
            background: radial-gradient(circle, rgba(255, 255, 255, 0.6) 0%, transparent 70%);
            border-radius: 20px;
            transform: scale(0);
            animation: satelliteGlow 1s ease-out;
            pointer-events: none;
            z-index: 10;
        `;
        
        satellite.appendChild(glow);
        
        // Remove glow after animation
        setTimeout(() => {
            if (glow.parentNode) {
                glow.parentNode.removeChild(glow);
            }
        }, 1000);
        
        // Highlight effect
        satellite.style.transform = 'translateX(-50%) scale(1.5) translateZ(50px)';
        satellite.style.boxShadow = '0 15px 40px rgba(255, 255, 255, 0.4)';
        satellite.style.zIndex = '200';
        
        // Reset after 3 seconds
        setTimeout(() => {
            satellite.style.transform = 'translateX(-50%)';
            satellite.style.boxShadow = '0 8px 20px rgba(0, 0, 0, 0.3)';
            satellite.style.zIndex = '';
        }, 3000);
        
        // Show notification for the clicked satellite
        const category = satellite.getAttribute('data-category');
        const satelliteTitles = {
            'gaming': 'Gaming',
            'music': 'Music', 
            'design': 'Design',
            'clips': 'Clips'
        };
        const satelliteEmojis = {
            'gaming': '🎮',
            'music': '🎸',
            'design': '🎨',
            'clips': '📹'
        };
        
        const title = satelliteTitles[category] || 'Satellite';
        const emoji = satelliteEmojis[category] || '🛰️';
        
        showNotification(`${emoji} ${title} satellite activated! Exploring your ${title.toLowerCase()} universe!`, 'info');
    });
    
    // Enhanced hover effects
    satellite.addEventListener('mouseenter', () => {
        satellite.style.filter = 'brightness(1.3) drop-shadow(0 0 10px rgba(255,255,255,0.5))';
    });
    
    satellite.addEventListener('mouseleave', () => {
        satellite.style.filter = '';
    });
});

// Particle interaction with cursor
const particles = document.querySelectorAll('.particle');
const particlesContainer = document.querySelector('.particles-container');

if (particlesContainer) {
    particlesContainer.addEventListener('mousemove', (e) => {
        const rect = particlesContainer.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        
        particles.forEach(particle => {
            const particleRect = particle.getBoundingClientRect();
            const particleX = particleRect.left - rect.left + particleRect.width / 2;
            const particleY = particleRect.top - rect.top + particleRect.height / 2;
            
            const distance = Math.sqrt(
                Math.pow(mouseX - particleX, 2) + Math.pow(mouseY - particleY, 2)
            );
            
            if (distance < 100) {
                const force = (100 - distance) / 100;
                const angle = Math.atan2(particleY - mouseY, particleX - mouseX);
                const pushX = Math.cos(angle) * force * 50;
                const pushY = Math.sin(angle) * force * 50;
                
                particle.style.transform += ` translate(${pushX}px, ${pushY}px)`;
                particle.style.boxShadow = `0 0 ${10 + force * 20}px rgba(255, 255, 255, ${0.5 + force * 0.5})`;
            }
        });
    });
}

// Typing Effect for Hero Title
function typeWriter(element, text, speed = 100) {
    let i = 0;
    element.innerHTML = '';
    
    function type() {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    
    type();
}

// Initialize typing effect when page loads
window.addEventListener('load', () => {
    const heroTitle = document.querySelector('.hero-title .gradient-text');
    if (heroTitle) {
        const originalText = heroTitle.textContent;
        typeWriter(heroTitle, originalText, 150);
    }
});

// Skill Cards Click and Hover Effects
document.querySelectorAll('.skill-card').forEach(card => {
    // Hover effects
    card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-15px) scale(1.02)';
        this.style.transition = 'all 0.3s ease';
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) scale(1)';
    });
    
    // Click effects - navigate to skill pages
    card.addEventListener('click', function() {
        // Add click animation
        this.style.transform = 'translateY(-5px) scale(0.98)';
        this.style.boxShadow = '0 15px 30px rgba(102, 126, 234, 0.4)';
        
        // Determine which skill card was clicked
        const skillType = this.classList.contains('gaming-card') ? 'gaming' :
                         this.classList.contains('guitar-card') ? 'guitar' :
                         this.classList.contains('design-card') ? 'design' :
                         this.classList.contains('clips-card') ? 'clips' : 'gaming';
        
        // Show transition effect
        showSkillPageTransition();
        
        // Navigate to the appropriate skill page
        setTimeout(() => {
            window.location.href = `${skillType}.html`;
        }, 500);
    });
});

// Skill Page Transition Function
function showSkillPageTransition() {
    // Create transition overlay
    const transition = document.createElement('div');
    transition.className = 'skill-page-transition';
    transition.innerHTML = '<div class="loading-icon"><i class="fas fa-rocket"></i></div>';
    
    document.body.appendChild(transition);
    
    // Show transition
    setTimeout(() => {
        transition.classList.add('active');
    }, 10);
}

// Gallery Item Click Effect
document.querySelectorAll('.gallery-item').forEach(item => {
    item.addEventListener('click', function() {
        // Add a pulse effect
        this.style.animation = 'pulse 0.6s ease';
        
        // Remove animation after it completes
        setTimeout(() => {
            this.style.animation = '';
        }, 600);
    });
});

// Add pulse animation to CSS dynamically
const pulseKeyframes = `
    @keyframes pulse {
        0% { transform: scale(1); }
        50% { transform: scale(1.05); }
        100% { transform: scale(1); }
    }
`;

const style = document.createElement('style');
style.textContent = pulseKeyframes;
document.head.appendChild(style);

// Contact Form Handling
const contactForm = document.querySelector('.contact-form form');
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(this);
        const name = this.querySelector('input[type="text"]').value;
        const email = this.querySelector('input[type="email"]').value;
        const message = this.querySelector('textarea').value;
        
        // Simple validation
        if (name && email && message) {
            // Show success message
            showNotification('Message sent! Thanks for reaching out!', 'success');
            this.reset();
        } else {
            showNotification('Please fill in all fields.', 'error');
        }
    });
}

// Notification System
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'success' ? '#4CAF50' : type === 'error' ? '#f44336' : '#2196F3'};
        color: white;
        padding: 15px 25px;
        border-radius: 10px;
        z-index: 10000;
        animation: slideInRight 0.3s ease;
        box-shadow: 0 4px 15px rgba(0,0,0,0.2);
        font-weight: 500;
    `;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Add notification animations to CSS
const notificationKeyframes = `
    @keyframes slideInRight {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideOutRight {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
`;

const notificationStyle = document.createElement('style');
notificationStyle.textContent = notificationKeyframes;
document.head.appendChild(notificationStyle);

// Stats Counter Animation
function animateCounter(element, target, duration = 2000) {
    const start = 0;
    const startTime = performance.now();
    
    function updateCounter(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function for smooth animation
        const easeOutCubic = 1 - Math.pow(1 - progress, 3);
        const current = Math.floor(start + (target - start) * easeOutCubic);
        
        if (target === Infinity) {
            element.textContent = '∞';
        } else {
            element.textContent = current + '+';
        }
        
        if (progress < 1) {
            requestAnimationFrame(updateCounter);
        } else {
            element.textContent = target === Infinity ? '∞' : target + '+';
        }
    }
    
    requestAnimationFrame(updateCounter);
}

// Repeating Counter Animation for Clips (0 to 999)
function animateRepeatingCounter(element, maxValue = 999, duration = 3000) {
    let currentValue = 0;
    const startTime = performance.now();
    
    function updateRepeatingCounter(currentTime) {
        const elapsed = currentTime - startTime;
        const cycleDuration = duration;
        const cycleProgress = (elapsed % cycleDuration) / cycleDuration;
        
        // Easing function for smooth animation
        const easeOutCubic = 1 - Math.pow(1 - cycleProgress, 3);
        currentValue = Math.floor(easeOutCubic * maxValue);
        
        element.textContent = currentValue + '+';
        
        // Continue the animation indefinitely
        requestAnimationFrame(updateRepeatingCounter);
    }
    
    requestAnimationFrame(updateRepeatingCounter);
}

// Trigger counter animation when stats section is visible
const statsSection = document.querySelector('.stats');
if (statsSection) {
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const statNumbers = entry.target.querySelectorAll('.stat-number');
                
                // Animate each counter
                animateRepeatingCounter(statNumbers[0], 999, 3000); // Clips (0-999 repeating)
                animateCounter(statNumbers[1], 3, 2000);   // Passions (0 to 3+ then stop)
                animateCounter(statNumbers[2], Infinity); // Good Times
                
                // Add infinity symbol effects to Good Times
                statNumbers[2].classList.add('infinity-symbol');
                
                statsObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    statsObserver.observe(statsSection);
}

// Easter Egg: Konami Code
let konamiCode = [];
const konamiSequence = [
    'ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown',
    'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight',
    'KeyB', 'KeyA'
];

document.addEventListener('keydown', (e) => {
    konamiCode.push(e.code);
    
    // Keep only the last 10 inputs
    if (konamiCode.length > 10) {
        konamiCode.shift();
    }
    
    // Check if the sequence matches
    if (konamiCode.join(',') === konamiSequence.join(',')) {
        showNotification('🎮 Konami Code activated! You found the easter egg!', 'success');
        
        // Add special effect
        document.body.style.animation = 'rainbow 2s ease';
        setTimeout(() => {
            document.body.style.animation = '';
        }, 2000);
        
        konamiCode = []; // Reset
    }
});

// Rainbow animation for easter egg
const rainbowKeyframes = `
    @keyframes rainbow {
        0% { filter: hue-rotate(0deg); }
        25% { filter: hue-rotate(90deg); }
        50% { filter: hue-rotate(180deg); }
        75% { filter: hue-rotate(270deg); }
        100% { filter: hue-rotate(360deg); }
    }
`;

const rainbowStyle = document.createElement('style');
rainbowStyle.textContent = rainbowKeyframes;
document.head.appendChild(rainbowStyle);

// Performance optimization: Debounce scroll events
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

// Apply debouncing to scroll events
const debouncedScroll = debounce(() => {
    // Scroll-based animations here
}, 16); // ~60fps

window.addEventListener('scroll', debouncedScroll);

// Meteor System
function createMeteor() {
    const meteor = document.createElement('div');
    meteor.className = 'meteor';
    
    // Random direction selection
    const directions = [
        'meteorFromTopLeft',
        'meteorFromTopRight', 
        'meteorFromBottomLeft',
        'meteorFromBottomRight',
        'meteorFromLeft',
        'meteorFromRight'
    ];
    
    const randomDirection = directions[Math.floor(Math.random() * directions.length)];
    meteor.style.animation = `${randomDirection} 2s linear forwards`;
    
    // Random size variation
    const size = Math.random() * 3 + 1;
    meteor.style.width = `${size}px`;
    meteor.style.height = `${size}px`;
    
    // Random color variation
    const colors = [
        'linear-gradient(45deg, #667eea, #764ba2, #ff6b6b)',
        'linear-gradient(45deg, #ff6b6b, #667eea, #764ba2)',
        'linear-gradient(45deg, #764ba2, #ff6b6b, #667eea)',
        'linear-gradient(45deg, #667eea, #ff6b6b, #764ba2)'
    ];
    meteor.style.background = colors[Math.floor(Math.random() * colors.length)];
    
    document.body.appendChild(meteor);
    
    // Remove meteor after animation
    setTimeout(() => {
        if (meteor.parentNode) {
            meteor.parentNode.removeChild(meteor);
        }
    }, 2000);
}

// Start meteor system
function startMeteorSystem() {
    // Create first meteor immediately
    createMeteor();
    
    // Create meteor every 6 seconds
    setInterval(createMeteor, 6000);
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('🎮 Welcome to Yazan\'s website!');
    console.log('🎸 Gamer • Guitarist • Designer');
    console.log('📹 Capturing all the good times!');
    
    // Add a subtle loading animation
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 0.5s ease';
        document.body.style.opacity = '1';
    }, 100);
    
    // Start meteor system
    startMeteorSystem();
});

// Add smooth reveal animations for sections
const revealSections = document.querySelectorAll('section');
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.animation = 'fadeInUp 0.8s ease forwards';
            entry.target.style.animationDelay = '0.2s';
        }
    });
}, { threshold: 0.1 });

revealSections.forEach(section => {
    revealObserver.observe(section);
});

// Earth interactions (removed - no click effects)
// Earth is now static and doesn't respond to clicks

// Add Earth system effects animations
const earthEffectsKeyframes = `
    @keyframes satelliteGlow {
        0% {
            transform: scale(0);
            opacity: 0;
        }
        50% {
            transform: scale(1.5);
            opacity: 1;
        }
        100% {
            transform: scale(2);
            opacity: 0;
        }
    }
    
    @keyframes earthBurst {
        0% {
            transform: translate(-50%, -50%) rotate(var(--burst-angle)) translateX(0) scale(1);
            opacity: 1;
        }
        100% {
            transform: translate(-50%, -50%) rotate(var(--burst-angle)) translateX(120px) scale(0);
            opacity: 0;
        }
    }
`;

const earthEffectsStyle = document.createElement('style');
earthEffectsStyle.textContent = earthEffectsKeyframes;
document.head.appendChild(earthEffectsStyle);

// Enhanced Section Entrance Animations
const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            
            // Add staggered animations for child elements
            const animatedElements = entry.target.querySelectorAll('.fade-in-up, .fade-in-left, .fade-in-right, .scale-in');
            animatedElements.forEach((el, index) => {
                setTimeout(() => {
                    el.classList.add('visible');
                }, index * 150);
            });
        }
    });
}, {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
});

// Observe sections for entrance animations
document.querySelectorAll('section').forEach(section => {
    section.classList.add('section-entrance');
    sectionObserver.observe(section);
});

// Add animation classes to specific elements
document.querySelectorAll('.skill-card').forEach(card => {
    card.classList.add('fade-in-up');
});

document.querySelectorAll('.gallery-item').forEach(item => {
    item.classList.add('scale-in');
});

document.querySelectorAll('.contact-item').forEach(item => {
    item.classList.add('fade-in-left');
});

document.querySelectorAll('.stat-item').forEach(item => {
    item.classList.add('fade-in-right');
});
