/* ==========================================
   PORTFOLIO WEBSITE - JAVASCRIPT
   Interactivity, Animations & Validations
   ========================================== */

// ==================== INITIALIZATION ====================
document.addEventListener('DOMContentLoaded', () => {
    initThemeToggle();
    initMobileMenu();
    initSmoothScrolling();
    initScrollAnimations();
    initContactForm();
    loadTheme();
});

// ==================== THEME TOGGLE ====================
/**
 * Initialize dark/light mode theme toggle
 * Saves preference to localStorage
 */
function initThemeToggle() {
    const themeToggle = document.getElementById('theme-toggle');
    
    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        updateThemeIcon();
        saveTheme();
    });
}

/**
 * Update theme toggle icon based on current mode
 */
function updateThemeIcon() {
    const themeToggle = document.getElementById('theme-toggle');
    const isDarkMode = document.body.classList.contains('dark-mode');
    
    themeToggle.innerHTML = isDarkMode 
        ? '<i class="fas fa-sun"></i>' 
        : '<i class="fas fa-moon"></i>';
}

/**
 * Save theme preference to localStorage
 */
function saveTheme() {
    const isDarkMode = document.body.classList.contains('dark-mode');
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
}

/**
 * Load saved theme preference from localStorage
 */
function loadTheme() {
    const savedTheme = localStorage.getItem('theme');
    
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-mode');
    }
    
    updateThemeIcon();
}

// ==================== MOBILE MENU ====================
/**
 * Initialize mobile hamburger menu functionality
 */
function initMobileMenu() {
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    
    // Toggle menu on hamburger click
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });
    
    // Close menu when a link is clicked
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.nav-container')) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        }
    });
}

// ==================== SMOOTH SCROLLING ====================
/**
 * Initialize smooth scrolling for navigation links
 */
function initSmoothScrolling() {
    const navLinks = document.querySelectorAll('a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            
            const targetId = link.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const offset = 70; // Account for sticky navbar
                const targetPosition = targetSection.offsetTop - offset;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// ==================== SCROLL ANIMATIONS ====================
/**
 * Initialize scroll-triggered animations using Intersection Observer
 */
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animation = 'slideUp 0.8s ease forwards';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe all elements that should animate
    const animateElements = document.querySelectorAll(
        '.about-content, .skill-category, .project-card, .achievement-card, .timeline-item'
    );
    
    animateElements.forEach(element => {
        element.style.opacity = '0';
        element.style.animation = 'none';
        observer.observe(element);
    });
    
    // Animate skill progress bars when visible
    const skillObserverOptions = {
        threshold: 0.5
    };
    
    const skillObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const progressBars = entry.target.querySelectorAll('.skill-progress');
                progressBars.forEach(bar => {
                    const width = bar.style.width;
                    bar.style.width = '0';
                    setTimeout(() => {
                        bar.style.width = width;
                    }, 100);
                });
                skillObserver.unobserve(entry.target);
            }
        });
    }, skillObserverOptions);
    
    const skillsSection = document.getElementById('skills');
    if (skillsSection) {
        skillObserver.observe(skillsSection);
    }
}

// ==================== FORM VALIDATION ====================
/**
 * Initialize contact form validation and submission
 */
function initContactForm() {
    const form = document.getElementById('contact-form');
    
    if (!form) return;
    
    // Real-time validation
    const inputs = form.querySelectorAll('input, textarea');
    inputs.forEach(input => {
        input.addEventListener('blur', () => validateField(input));
        input.addEventListener('input', () => {
            if (input.classList.contains('invalid')) {
                validateField(input);
            }
        });
    });
    
    // Form submission
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        if (validateForm(form)) {
            submitForm(form);
        }
    });
}

/**
 * Validate individual form field
 * @param {HTMLElement} field - The input or textarea element
 * @returns {boolean} - True if valid, false otherwise
 */
function validateField(field) {
    const errorElement = document.getElementById(`${field.name}-error`);
    let isValid = true;
    let errorMessage = '';
    
    // Remove previous error state
    field.classList.remove('invalid');
    if (errorElement) {
        errorElement.classList.remove('show');
        errorElement.textContent = '';
    }
    
    // Validate based on field type
    if (field.name === 'name') {
        if (field.value.trim().length < 3) {
            isValid = false;
            errorMessage = 'Name must be at least 3 characters long';
        }
    }
    
    if (field.name === 'email') {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(field.value.trim())) {
            isValid = false;
            errorMessage = 'Please enter a valid email address';
        }
    }
    
    if (field.name === 'subject') {
        if (field.value.trim().length < 5) {
            isValid = false;
            errorMessage = 'Subject must be at least 5 characters long';
        }
    }
    
    if (field.name === 'message') {
        if (field.value.trim().length < 10) {
            isValid = false;
            errorMessage = 'Message must be at least 10 characters long';
        }
    }
    
    // Display error if invalid
    if (!isValid) {
        field.classList.add('invalid');
        if (errorElement) {
            errorElement.textContent = errorMessage;
            errorElement.classList.add('show');
        }
    }
    
    return isValid;
}

/**
 * Validate entire form
 * @param {HTMLFormElement} form - The form element
 * @returns {boolean} - True if all fields are valid
 */
function validateForm(form) {
    const fields = form.querySelectorAll('input, textarea');
    let isValid = true;
    
    fields.forEach(field => {
        if (!validateField(field)) {
            isValid = false;
        }
    });
    
    return isValid;
}

/**
 * Submit form and show success message
 * @param {HTMLFormElement} form - The form element
 */
function submitForm(form) {
    const formMessage = document.getElementById('form-message');
    
    // Collect form data
    const formData = new FormData(form);
    const data = Object.fromEntries(formData);
    
    // Simulate form submission (In real scenario, send to backend)
    // For demo purposes, we'll just show success message
    
    // Disable submit button
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
    
    // Simulate network delay
    setTimeout(() => {
        // Show success message
        formMessage.classList.remove('error');
        formMessage.classList.add('success');
        formMessage.textContent = '✓ Message sent successfully! I\'ll get back to you soon.';
        
        // Reset form
        form.reset();
        
        // Clear error states
        form.querySelectorAll('.invalid').forEach(field => {
            field.classList.remove('invalid');
        });
        form.querySelectorAll('.error-message').forEach(msg => {
            msg.classList.remove('show');
        });
        
        // Reset button
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
        
        // Hide message after 5 seconds
        setTimeout(() => {
            formMessage.classList.remove('success');
            formMessage.textContent = '';
        }, 5000);
        
    }, 1500);
}

// ==================== RESUME DOWNLOAD ====================
/**
 * Initialize resume download functionality
 */
function initResumeDownload() {
    const resumeBtn = document.getElementById('resume-download');
    
    if (resumeBtn) {
        resumeBtn.addEventListener('click', (e) => {
            e.preventDefault();
            downloadResume();
        });
    }
}

/**
 * Create and download resume (demo - creates a text file)
 * In production, this would link to an actual PDF file
 */
function downloadResume() {
    // Create resume content
    const resumeContent = `
================================================================================
                    RIYA MUSMADE - RESUME
                   AI/ML Enthusiast
================================================================================

CONTACT INFORMATION:
Email: riyamusmade@gmail.com
LinkedIn: www.linkedin.com/in/riya-musmade-22231128b
GitHub: github.com/Riya-2203
Phone: +1 (XXX) XXX-XXXX

================================================================================
PROFESSIONAL SUMMARY:
================================================================================
Passionate Computer Engineering student specializing in Artificial Intelligence
and Machine Learning. Strong foundation in data science, machine learning
algorithms, and neural networks. Eager to apply technical skills to develop
innovative AI-driven solutions.

================================================================================
EDUCATION:
================================================================================
Bachelor of Engineering - Computer Engineering
University Name / Institution
Year 3 (Current)
Specialization: Artificial Intelligence & Machine Learning
GPA: 3.8/4.0

Relevant Coursework:
- Machine Learning Fundamentals
- Data Structures & Algorithms
- Neural Networks & Deep Learning
- Data Science & Analytics
- Database Management Systems

================================================================================
SKILLS:
================================================================================
Programming Languages:
- Python (Expert)
- C++ (Advanced)
- JavaScript (Advanced)

Machine Learning & Data Science:
- Supervised & Unsupervised Learning
- Neural Networks & Deep Learning
- Data Analysis & Feature Engineering
- Model Optimization & Evaluation

Libraries & Frameworks:
- NumPy, Pandas, Scikit-learn
- TensorFlow, PyTorch
- Matplotlib, Seaborn

Tools & Technologies:
- GitHub, Git
- Google Colab, Jupyter Notebook
- Linux, VS Code

================================================================================
PROJECTS:
================================================================================
1. SPAM MAIL PREDICTION
   - Developed ML classification model for email spam detection
   - Implemented using Scikit-learn and NLP techniques
   - Achieved 95% accuracy rate
   - GitHub: github.com/yourprofile/spam-detector

2. DIABETES PREDICTION MODEL
   - Created predictive healthcare AI model
   - Analyzed medical parameters for diabetes risk prediction
   - Implemented multiple algorithms (Logistic Regression, Random Forest)
   - GitHub: github.com/yourprofile/diabetes-predictor

3. SKILL GAP ANALYZER
   - Built intelligent recommendation system
   - Used collaborative filtering algorithms
   - Analyzes skills and provides personalized learning paths
   - GitHub: github.com/yourprofile/skill-gap-analyzer

================================================================================
ACHIEVEMENTS & CERTIFICATIONS:
================================================================================
- Google AI Essentials Certification (2024)
- Machine Learning Specialization (2024)
- Python for Data Science Certification (2023)
- MongoDB Certification (2024)
- SQL from Oracle (2024)

================================================================================
PROFESSIONAL EXPERIENCE:
================================================================================
[Add your internships, projects, or work experience here]

================================================================================
LANGUAGES:
================================================================================
- English (Fluent)
- [Other languages if applicable]

================================================================================
Last Updated: April 2024
    `;
    
    // Create blob from content
    const blob = new Blob([resumeContent], { type: 'text/plain' });
    
    // Create temporary URL
    const url = window.URL.createObjectURL(blob);
    
    // Create temporary link element
    const link = document.createElement('a');
    link.href = url;
    link.download = 'Resume_Riya_Musmade.txt';
    
    // Trigger download
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Clean up URL
    window.URL.revokeObjectURL(url);
    
    // Show feedback
    showDownloadFeedback();
}

/**
 * Show download feedback to user
 */
function showDownloadFeedback() {
    const resumeBtn = document.getElementById('resume-download');
    const originalHTML = resumeBtn.innerHTML;
    
    resumeBtn.innerHTML = '<i class="fas fa-check"></i> Downloaded!';
    resumeBtn.style.backgroundColor = '#10b981';
    
    setTimeout(() => {
        resumeBtn.innerHTML = originalHTML;
        resumeBtn.style.backgroundColor = '';
    }, 2000);
}

// ==================== UTILITY FUNCTIONS ====================

/**
 * Debounce function for performance optimization
 * @param {Function} func - The function to debounce
 * @param {number} wait - The wait time in milliseconds
 * @returns {Function} - Debounced function
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
 * Throttle function for performance optimization
 * @param {Function} func - The function to throttle
 * @param {number} limit - The limit time in milliseconds
 * @returns {Function} - Throttled function
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
 * Scroll to top button functionality
 */
function initScrollToTop() {
    const scrollTopBtn = document.getElementById('scroll-top');
    
    if (!scrollTopBtn) return;
    
    window.addEventListener('scroll', throttle(() => {
        if (window.pageYOffset > 300) {
            scrollTopBtn.style.display = 'block';
        } else {
            scrollTopBtn.style.display = 'none';
        }
    }, 100));
    
    scrollTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// ==================== PRINT FRIENDLY ====================
/**
 * Add print-friendly styles on page load
 */
function initPrintStyles() {
    if (window.matchMedia('print').matches) {
        document.body.style.background = 'white';
    }
}

// ==================== ACCESSIBILITY ENHANCEMENTS ====================
/**
 * Improve keyboard navigation
 */
function enhanceKeyboardNavigation() {
    document.addEventListener('keydown', (e) => {
        // Press 'T' for theme toggle
        if ((e.ctrlKey || e.metaKey) && e.key === 't') {
            e.preventDefault();
            document.getElementById('theme-toggle').click();
        }
        
        // Press 'Escape' to close mobile menu
        if (e.key === 'Escape') {
            const hamburger = document.getElementById('hamburger');
            const navMenu = document.querySelector('.nav-menu');
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        }
    });
}

// ==================== PERFORMANCE MONITORING ====================
/**
 * Log performance metrics (for development)
 */
function logPerformanceMetrics() {
    if (window.performance) {
        window.addEventListener('load', () => {
            const perfData = window.performance.timing;
            const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
            console.log('Page Load Time:', pageLoadTime + 'ms');
            
            // Additional metrics
            const metrics = {
                'DOM Interactive': perfData.domInteractive - perfData.navigationStart,
                'DOM Content Loaded': perfData.domContentLoadedEventEnd - perfData.navigationStart,
                'Page Load Time': pageLoadTime
            };
            
            console.table(metrics);
        });
    }
}

// ==================== INITIALIZE ALL FEATURES ====================
// Additional initialization (called after DOMContentLoaded)
setTimeout(() => {
    initScrollToTop();
    enhanceKeyboardNavigation();
}, 100);

// Development helper - uncomment to see performance metrics
// logPerformanceMetrics();

// ==================== ANALYTICS (OPTIONAL) ====================
/**
 * Track user interactions (optional - implement with your analytics service)
 */
function initAnalytics() {
    // Example: Track button clicks
    document.querySelectorAll('button, a.btn').forEach(element => {
        element.addEventListener('click', function() {
            // Send event to analytics
            // Example: gtag('event', 'button_click', { button_text: this.textContent });
        });
    });
}

// Uncomment to enable analytics tracking
// initAnalytics();
