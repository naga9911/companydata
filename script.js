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
    
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase();
            
            // Filter Timeline Items (Experience)
            document.querySelectorAll('.timeline-item').forEach(item => {
                const text = item.textContent.toLowerCase();
                item.style.display = text.includes(query) ? '' : 'none';
            });
            
            // Filter Skill Cards
            document.querySelectorAll('.skill-card').forEach(card => {
                const text = card.textContent.toLowerCase();
                card.style.display = text.includes(query) ? '' : 'none';
            });
            
            // Filter Manual Testing Slides
            document.querySelectorAll('.slide').forEach(slide => {
                const text = slide.textContent.toLowerCase();
                slide.style.display = text.includes(query) ? '' : 'none';
            });
            
            // Filter DevOps Tags
            document.querySelectorAll('.devops-tags .tag').forEach(tag => {
                const text = tag.textContent.toLowerCase();
                tag.style.display = text.includes(query) ? '' : 'none';
            });
        });
    }
});
