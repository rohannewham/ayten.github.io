// DOM Content Loaded Event
document.addEventListener('DOMContentLoaded', function() {
    initializeWebsite();
});

// Initialize all website functionality
function initializeWebsite() {
    setupSmoothScrolling();
    setupScrollAnimations();
    setupChatBlogInteractions();
    setupImagePlaceholders();
    setupKeyboardNavigation();
    setupInitialAnimations();
}

// Smooth scrolling for navigation links
function setupSmoothScrolling() {
    document.querySelectorAll('nav a').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
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
}

// Fade in animation on scroll
function setupScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    document.querySelectorAll('.fade-in').forEach(el => {
        observer.observe(el);
    });
}

// Interactive chat blog actions
function setupChatBlogInteractions() {
    document.querySelectorAll('.chat-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const action = this.textContent.trim();
            
            if (action.includes('Like')) {
                handleLikeAction(this);
            } else if (action.includes('Reply')) {
                handleReplyAction(this);
            } else if (action.includes('Share')) {
                handleShareAction(this);
            }
        });
    });
}

// Handle like button action
function handleLikeAction(button) {
    if (button.innerHTML.includes('Liked')) {
        button.innerHTML = '👍 Like';
        button.style.color = '#667eea';
    } else {
        button.innerHTML = '❤️ Liked';
        button.style.color = '#e74c3c';
        
        // Add a small animation
        button.style.transform = 'scale(1.2)';
        setTimeout(() => {
            button.style.transform = 'scale(1)';
        }, 200);
    }
}

// Handle reply button action
function handleReplyAction(button) {
    // Create a simple reply box
    const chatBlog = button.closest('.chat-blog');
    let replyBox = chatBlog.querySelector('.reply-box');
    
    if (replyBox) {
        replyBox.remove();
    } else {
        replyBox = document.createElement('div');
        replyBox.className = 'reply-box';
        replyBox.innerHTML = `
            <textarea placeholder="Write your reply..." rows="3" style="width: 100%; margin-top: 10px; padding: 10px; border: 1px solid #ddd; border-radius: 8px; resize: vertical;"></textarea>
            <div style="margin-top: 10px;">
                <button onclick="submitReply(this)" style="background: #667eea; color: white; border: none; padding: 8px 16px; border-radius: 5px; cursor: pointer;">Submit</button>
                <button onclick="cancelReply(this)" style="background: #ccc; color: #333; border: none; padding: 8px 16px; border-radius: 5px; cursor: pointer; margin-left: 10px;">Cancel</button>
            </div>
        `;
        chatBlog.appendChild(replyBox);
        replyBox.querySelector('textarea').focus();
    }
}

// Handle share button action
function handleShareAction(button) {
    const chatBlog = button.closest('.chat-blog');
    const authorName = chatBlog.querySelector('.chat-info h3').textContent;
    const content = chatBlog.querySelector('.chat-content').textContent;
    
    // Create share URL (in real implementation, this would be the actual post URL)
    const shareText = `Check out this post by ${authorName}: "${content.substring(0, 100)}..."`;
    
    // Try to use Web Share API if available
    if (navigator.share) {
        navigator.share({
            title: 'Shared Post',
            text: shareText,
            url: window.location.href
        }).catch(err => console.log('Error sharing:', err));
    } else {
        // Fallback: copy to clipboard
        navigator.clipboard.writeText(shareText).then(() => {
            showNotification('Post content copied to clipboard!');
        }).catch(() => {
            showNotification('Share feature coming soon!');
        });
    }
}

// Submit reply function
function submitReply(button) {
    const replyBox = button.closest('.reply-box');
    const textarea = replyBox.querySelector('textarea');
    const replyText = textarea.value.trim();
    
    if (replyText) {
        showNotification('Reply submitted successfully!');
        replyBox.remove();
    } else {
        showNotification('Please write a reply before submitting.');
    }
}

// Cancel reply function
function cancelReply(button) {
    const replyBox = button.closest('.reply-box');
    replyBox.remove();
}

// Show notification function
function showNotification(message) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #667eea;
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        z-index: 1000;
        animation: slideIn 0.3s ease;
    `;
    notification.textContent = message;
    
    // Add animation keyframes
    if (!document.querySelector('#notification-styles')) {
        const style = document.createElement('style');
        style.id = 'notification-styles';
        style.textContent = `
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
        `;
        document.head.appendChild(style);
    }
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideIn 0.3s ease reverse';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// Image placeholder click interaction
function setupImagePlaceholders() {
    document.querySelectorAll('.image-placeholder').forEach(placeholder => {
        placeholder.addEventListener('click', function() {
            const originalText = this.innerHTML;
            const originalBg = this.style.background;
            const originalColor = this.style.color;
            
            // Change appearance on click
            this.style.background = 'linear-gradient(45deg, #667eea, #764ba2)';
            this.style.color = 'white';
            this.innerHTML = '📸 Click to upload your image';
            
            // Reset after 2 seconds
            setTimeout(() => {
                this.style.background = originalBg;
                this.style.color = originalColor;
                this.innerHTML = originalText;
            }, 2000);
        });
    });
}

// Add keyboard navigation
function setupKeyboardNavigation() {
    document.addEventListener('keydown', function(e) {
        if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
            e.preventDefault();
            const sections = document.querySelectorAll('.section');
            let currentIndex = 0;
            
            sections.forEach((section, index) => {
                const rect = section.getBoundingClientRect();
                if (rect.top <= 100) currentIndex = index;
            });
            
            if (e.key === 'ArrowDown' && currentIndex < sections.length - 1) {
                sections[currentIndex + 1].scrollIntoView({ behavior: 'smooth' });
            } else if (e.key === 'ArrowUp' && currentIndex > 0) {
                sections[currentIndex - 1].scrollIntoView({ behavior: 'smooth' });
            }
        }
    });
}

// Initial page load animations
function setupInitialAnimations() {
    window.addEventListener('load', function() {
        setTimeout(() => {
            document.querySelectorAll('.fade-in').forEach((el, index) => {
                setTimeout(() => {
                    el.classList.add('visible');
                }, index * 200);
            });
        }, 500);
    });
}

// Search functionality for blogs
function searchBlogs(query) {
    const blogs = document.querySelectorAll('.chat-blog');
    const searchQuery = query.toLowerCase();
    
    blogs.forEach(blog => {
        const content = blog.textContent.toLowerCase();
        if (content.includes(searchQuery)) {
            blog.style.display = 'block';
            blog.style.opacity = '1';
        } else {
            blog.style.display = 'none';
            blog.style.opacity = '0';
        }
    });
    
    // Show message if no results found
    const visibleBlogs = Array.from(blogs).filter(blog => blog.style.display !== 'none');
    if (visibleBlogs.length === 0 && query.trim() !== '') {
        showNotification('No blog posts found matching your search.');
    }
}

// Utility function to add new blog post (for future use)
function addNewBlogPost(author, content, avatar = 'UN') {
    const blogContainer = document.querySelector('.chat-blogs');
    const newBlog = document.createElement('article');
    newBlog.className = 'chat-blog';
    
    const currentTime = new Date().toLocaleString();
    
    newBlog.innerHTML = `
        <div class="chat-header">
            <div class="avatar">${avatar}</div>
            <div class="chat-info">
                <h3>${author}</h3>
                <span class="chat-time">Just now</span>
            </div>
        </div>
        <div class="chat-content">
            ${content}
        </div>
        <div class="chat-actions">
            <button class="chat-btn">👍 Like</button>
            <button class="chat-btn">💬 Reply</button>
            <button class="chat-btn">🔄 Share</button>
        </div>
    `;
    
    // Add event listeners to new buttons
    newBlog.querySelectorAll('.chat-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const action = this.textContent.trim();
            
            if (action.includes('Like')) {
                handleLikeAction(this);
            } else if (action.includes('Reply')) {
                handleReplyAction(this);
            } else if (action.includes('Share')) {
                handleShareAction(this);
            }
        });
    });
    
    blogContainer.insertBefore(newBlog, blogContainer.firstChild);
    
    // Animate the new blog post
    newBlog.style.opacity = '0';
    newBlog.style.transform = 'translateY(-20px)';
    
    setTimeout(() => {
        newBlog.style.transition = 'all 0.6s ease';
        newBlog.style.opacity = '1';
        newBlog.style.transform = 'translateY(0)';
    }, 100);
}

// Scroll to top function
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// Theme toggle function (for future enhancement)
function toggleTheme() {
    document.body.classList.toggle('dark-theme');
    const isDark = document.body.classList.contains('dark-theme');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
}

// Performance monitoring
function logPerformance() {
    if (performance.timing) {
        const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
        console.log(`Page load time: ${loadTime}ms`);
    }
}

// Call performance logging after page load
window.addEventListener('load', logPerformance);
