// DOM Elements
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');
const navLinks = document.querySelectorAll('.nav-link');
const navbar = document.querySelector('.navbar');
const reviewForm = document.getElementById('reviewForm');
const reviewsGrid = document.getElementById('reviewsGrid');

// Mobile Navigation Toggle
hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close mobile menu when clicking on a link
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

// Navbar scroll effect
window.addEventListener('scroll', () => {
    if (window.scrollY > 100) {
        navbar.style.background = 'rgba(255, 255, 255, 0.98)';
        navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.15)';
    } else {
        navbar.style.background = 'rgba(255, 255, 255, 0.95)';
        navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
    }
});

// Scroll Animations
const animateOnScroll = () => {
    const elements = document.querySelectorAll('.animate-on-scroll, .feature-card, .service-card, .review-card');
    
    elements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const elementBottom = element.getBoundingClientRect().bottom;
        
        if (elementTop < window.innerHeight && elementBottom > 0) {
            element.classList.add('animated');
        }
    });
};

// Add animation classes
document.addEventListener('DOMContentLoaded', () => {
    // Add animate-on-scroll class to elements
    const serviceCards = document.querySelectorAll('.service-card');
    const reviewCards = document.querySelectorAll('.review-card');
    const featureCards = document.querySelectorAll('.feature-card');
    
    serviceCards.forEach((card, index) => {
        card.classList.add('animate-on-scroll');
        card.style.animationDelay = `${index * 0.1}s`;
    });
    
    reviewCards.forEach((card, index) => {
        card.classList.add('animate-on-scroll');
        card.style.animationDelay = `${index * 0.1}s`;
    });
    
    featureCards.forEach((card, index) => {
        card.classList.add('animate-on-scroll');
        card.style.animationDelay = `${index * 0.1}s`;
    });
    
    // Initial check for elements in view
    animateOnScroll();
});

// Scroll event listener for animations
window.addEventListener('scroll', animateOnScroll);

// Reviews Management
class ReviewsManager {
    constructor() {
        this.reviews = [];
        this.init();
    }

    async init() {
        await this.loadReviews();
        this.renderReviews();
        this.setupFormHandler();
    }

    async loadReviews() {
        try {
            // Try to load from localStorage first (for demo purposes)
            const localReviews = localStorage.getItem('beautyReviews');
            if (localReviews) {
                this.reviews = JSON.parse(localReviews);
            } else {
                // Default reviews if no local storage
                this.reviews = [
                    {
                        id: 1,
                        name: "Priya Sharma",
                        rating: 5,
                        comment: "Absolutely amazing makeup service! I felt so beautiful on my wedding day. The attention to detail was incredible.",
                        date: "2024-01-15"
                    },
                    {
                        id: 2,
                        name: "Anjali Patel",
                        rating: 5,
                        comment: "The mehndi designs were stunning and so intricate. Everyone at my wedding complimented the beautiful patterns. Highly recommend!",
                        date: "2024-01-10"
                    },
                    {
                        id: 4,
                        name: "Kavita Reddy",
                        rating: 4,
                        comment: "Great nail art service! The designs were exactly what I wanted and the gel polish lasted for weeks.",
                        date: "2024-01-05"
                    }
                ];
                this.saveReviews();
            }
        } catch (error) {
            console.error('Error loading reviews:', error);
            // Fallback to default reviews
            this.reviews = [];
        }
    }

    saveReviews() {
        try {
            localStorage.setItem('beautyReviews', JSON.stringify(this.reviews));
        } catch (error) {
            console.error('Error saving reviews:', error);
        }
    }

    renderReviews() {
        reviewsGrid.innerHTML = '';
        
        if (this.reviews.length === 0) {
            reviewsGrid.innerHTML = '<p style="text-align: center; color: #666;">No reviews yet. Be the first to share your experience!</p>';
            return;
        }

        // Sort reviews by date (newest first)
        const sortedReviews = [...this.reviews].sort((a, b) => new Date(b.date) - new Date(a.date));
        
        sortedReviews.forEach(review => {
            const reviewCard = this.createReviewCard(review);
            reviewsGrid.appendChild(reviewCard);
        });
    }

    createReviewCard(review) {
        const card = document.createElement('div');
        card.className = 'review-card animate-on-scroll';
        
        const stars = '⭐'.repeat(review.rating) + '☆'.repeat(5 - review.rating);
        const formattedDate = new Date(review.date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });

        card.innerHTML = `
            <div class="review-header">
                <div>
                    <div class="review-name">${review.name}</div>
                    <small style="color: #999;">${formattedDate}</small>
                </div>
                <div class="review-rating">${stars}</div>
            </div>
            <div class="review-comment">${review.comment}</div>
        `;

        return card;
    }

    setupFormHandler() {
        reviewForm.addEventListener('submit', (e) => {
            e.preventDefault();
            this.addReview();
        });
    }

    addReview() {
        const name = document.getElementById('reviewName').value.trim();
        const rating = parseInt(document.getElementById('reviewRating').value);
        const comment = document.getElementById('reviewComment').value.trim();

        if (!name || !rating || !comment) {
            this.showNotification('Please fill in all fields', 'error');
            return;
        }

        const newReview = {
            id: Date.now(),
            name,
            rating,
            comment,
            date: new Date().toISOString().split('T')[0]
        };

        this.reviews.unshift(newReview);
        this.saveReviews();
        this.renderReviews();
        
        // Reset form
        reviewForm.reset();
        
        // Show success message
        this.showNotification('Thank you for your review!', 'success');
        
        // Scroll to reviews section
        document.getElementById('reviews').scrollIntoView({ behavior: 'smooth' });
    }

    showNotification(message, type) {
        // Create notification element
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            padding: 15px 25px;
            background: ${type === 'success' ? 'linear-gradient(135deg, #4CAF50, #45a049)' : 'linear-gradient(135deg, #f44336, #da190b)'};
            color: white;
            border-radius: 8px;
            box-shadow: 0 5px 20px rgba(0,0,0,0.2);
            z-index: 10000;
            font-weight: 500;
            transform: translateX(400px);
            transition: transform 0.3s ease;
        `;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Remove after 3 seconds
        setTimeout(() => {
            notification.style.transform = 'translateX(400px)';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }
}

// Initialize Reviews Manager
const reviewsManager = new ReviewsManager();

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const offsetTop = target.offsetTop - 80; // Account for fixed navbar
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// Parallax effect for hero section
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const heroContent = document.querySelector('.hero-content');
    if (heroContent) {
        heroContent.style.transform = `translateY(${scrolled * 0.5}px)`;
        heroContent.style.opacity = 1 - scrolled / 800;
    }
});

// Service cards hover effect enhancement
document.querySelectorAll('.service-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-15px) scale(1.02)';
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) scale(1)';
    });
});

// Add loading animation
window.addEventListener('load', () => {
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 0.5s ease';
        document.body.style.opacity = '1';
    }, 100);
});

// Form validation enhancement
document.getElementById('reviewName').addEventListener('input', function() {
    this.setCustomValidity('');
    if (this.value.trim().length < 2) {
        this.setCustomValidity('Name must be at least 2 characters long');
    }
});

document.getElementById('reviewComment').addEventListener('input', function() {
    this.setCustomValidity('');
    if (this.value.trim().length < 10) {
        this.setCustomValidity('Comment must be at least 10 characters long');
    }
});

// Add keyboard navigation support
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navMenu.classList.contains('active')) {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    }
});

// Performance optimization - Debounce scroll events
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

// Debounced scroll handlers
const debouncedScrollHandler = debounce(() => {
    animateOnScroll();
}, 10);

window.removeEventListener('scroll', animateOnScroll);
window.addEventListener('scroll', debouncedScrollHandler);

// Add intersection observer for better performance
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animated');
        }
    });
}, observerOptions);

// Observe elements for animation
document.addEventListener('DOMContentLoaded', () => {
    const animatedElements = document.querySelectorAll('.animate-on-scroll, .feature-card, .service-card, .review-card');
    animatedElements.forEach(el => observer.observe(el));
});
