document.addEventListener('DOMContentLoaded', () => {
    // Reveal on scroll
    const revealElements = document.querySelectorAll('.reveal');

    const revealOnScroll = () => {
        const windowHeight = window.innerHeight;
        const revealPoint = 100;

        revealElements.forEach(el => {
            const revealTop = el.getBoundingClientRect().top;
            if (revealTop < windowHeight - revealPoint) {
                el.classList.add('active');
            }
        });
    };

    window.addEventListener('scroll', revealOnScroll);
    // Trigger once on load
    revealOnScroll();

    // Active navigation link on scroll
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (scrollY >= (sectionTop - 200)) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').includes(current)) {
                link.classList.add('active');
            }
        });
    });

    // Header styling on scroll
    const header = document.querySelector('.header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.style.background = 'rgba(17, 24, 39, 0.85)';
            header.style.boxShadow = '0 4px 20px rgba(0,0,0,0.5)';
        } else {
            header.style.background = 'rgba(17, 24, 39, 0.7)';
            header.style.boxShadow = 'none';
        }
    });

    // AI Chatbot Logic
    const chatBtn = document.getElementById('ai-chat-btn');
    const chatWindow = document.getElementById('ai-chat-window');
    const closeChatBtn = document.getElementById('close-chat');
    const chatInput = document.getElementById('chat-input');
    const sendBtn = document.getElementById('send-btn');
    const chatMessages = document.getElementById('chat-messages');

    // Toggle Chat Window
    chatBtn.addEventListener('click', () => {
        chatWindow.classList.toggle('hidden');
        if (!chatWindow.classList.contains('hidden')) {
            chatInput.focus();
        }
    });

    closeChatBtn.addEventListener('click', () => {
        chatWindow.classList.add('hidden');
    });

    // Handle Sending Messages
    const handleSendMessage = () => {
        const text = chatInput.value.trim();
        if (!text) return;

        // 1. Add User Message
        addMessage(text, 'user-message');
        chatInput.value = '';

        // 2. Simulate AI "Typing" Delay, then respond
        setTimeout(() => {
            const response = generateAIResponse(text.toLowerCase());
            addMessage(response, 'ai-message');
        }, 600);
    };

    sendBtn.addEventListener('click', handleSendMessage);
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleSendMessage();
    });

    // Helper to add messages to DOM
    function addMessage(text, className) {
        const msgDiv = document.createElement('div');
        msgDiv.className = `message ${className}`;
        msgDiv.textContent = text;
        chatMessages.appendChild(msgDiv);
        
        // Auto-scroll to bottom
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    // "Simulated" AI Engine specific to Nagababu's Portfolio
    function generateAIResponse(input) {
        if (input.includes('hi') || input.includes('hello')) {
            return "Hi there! I'm Nagababu's virtual assistant. How can I help you today?";
        }
        if (input.includes('skill') || input.includes('know')) {
            return "Nagababu is skilled in Manual & Automation Testing, Defect Management (Jira), Agile, and is currently mastering DevOps tools like Docker, Kubernetes, CI/CD, and AWS/Azure.";
        }
        if (input.includes('experience') || input.includes('work')) {
            return "He has 2.8 years of experience as a Test Engineer at Changepond Technologies, where he designed test plans, automated processes, and ensured high-quality software delivery.";
        }
        if (input.includes('devops')) {
            return "He is expanding his horizons into DevOps! He focuses on CI/CD pipelines, containerization (Docker/Kubernetes), and Infrastructure as Code to bridge the gap between QA and operations.";
        }
        if (input.includes('contact') || input.includes('email') || input.includes('hire')) {
            return "You can reach Nagababu via email at nagababui.urs@gmail.com, or check out his LinkedIn and GitHub links in the footer below!";
        }
        
        // Fallback
        return "That's an interesting question! I am just a simple simulated AI right now, but you can email Nagababu directly at nagababui.urs@gmail.com for more details.";
    }

    // Portfolio Search functionality
    const searchInput = document.getElementById('site-search');
    const searchBtn = document.getElementById('search-btn');
    const searchResults = document.getElementById('search-results');
    
    if (searchInput && searchBtn && searchResults) {
        // Collect all searchable data once
        const searchableItems = [];
        
        // Experience
        document.querySelectorAll('.timeline-item').forEach(item => {
            searchableItems.push({
                title: item.querySelector('h3') ? item.querySelector('h3').textContent : 'Experience',
                desc: item.querySelector('ul') ? item.querySelector('ul').textContent : item.textContent,
                link: '#experience'
            });
        });
        
        // Skills
        document.querySelectorAll('.skill-card').forEach(card => {
            searchableItems.push({
                title: card.querySelector('h3') ? card.querySelector('h3').textContent : 'Skill',
                desc: card.querySelector('p') ? card.querySelector('p').textContent : card.textContent,
                link: '#skills'
            });
        });
        
        // Manual Testing
        document.querySelectorAll('.slide').forEach(slide => {
            searchableItems.push({
                title: slide.querySelector('h3') ? slide.querySelector('h3').textContent : 'Manual Testing',
                desc: slide.querySelector('p') ? slide.querySelector('p').textContent : slide.textContent,
                link: '#manual-testing'
            });
        });
        
        // DevOps
        document.querySelectorAll('.devops-tags .tag').forEach(tag => {
            searchableItems.push({
                title: tag.textContent,
                desc: 'DevOps Journey',
                link: '#devops'
            });
        });

        const performSearch = () => {
            const query = searchInput.value.toLowerCase().trim();
            searchResults.innerHTML = '';
            
            if (!query) {
                searchResults.classList.add('hidden');
                return;
            }
            
            const matches = searchableItems.filter(item => 
                item.title.toLowerCase().includes(query) || 
                item.desc.toLowerCase().includes(query)
            );
            
            if (matches.length === 0) {
                searchResults.innerHTML = '<div class="no-results">No results found for "' + query + '"</div>';
            } else {
                matches.forEach(match => {
                    const el = document.createElement('a');
                    el.href = match.link;
                    el.className = 'search-result-item';
                    el.innerHTML = `
                        <div class="search-result-title">${match.title}</div>
                        <div class="search-result-desc">${match.desc}</div>
                    `;
                    // Hide search on click
                    el.addEventListener('click', () => {
                        searchResults.classList.add('hidden');
                    });
                    searchResults.appendChild(el);
                });
            }
            
            searchResults.classList.remove('hidden');
        };

        searchBtn.addEventListener('click', performSearch);
        
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                performSearch();
            }
        });
        
        // Hide when clicking outside
        document.addEventListener('click', (e) => {
            if (!searchInput.contains(e.target) && !searchBtn.contains(e.target) && !searchResults.contains(e.target)) {
                searchResults.classList.add('hidden');
            }
        });
    }

    // Dropdown toggle functionality
    const aboutToggle = document.getElementById('about-toggle');
    const aboutDropdown = document.getElementById('about-dropdown');

    if (aboutToggle && aboutDropdown) {
        aboutToggle.addEventListener('click', (e) => {
            e.preventDefault(); // Prevent navigating to #
            aboutDropdown.classList.toggle('active');
        });

        // Close dropdown when clicking outside
        document.addEventListener('click', (e) => {
            if (!aboutDropdown.contains(e.target)) {
                aboutDropdown.classList.remove('active');
            }
        });
    }
});
