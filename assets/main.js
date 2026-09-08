document.addEventListener('DOMContentLoaded', () => {
    // 1. Header scroll effect
    const header = document.querySelector('header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // 2. Mobile Nav menu toggle
    const navToggle = document.querySelector('.mobile-nav-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    if (navToggle && navLinks) {
        navToggle.addEventListener('click', () => {
            navToggle.classList.toggle('active');
            navLinks.classList.toggle('active');
        });

        // Close mobile nav when clicking a link
        document.querySelectorAll('.nav-links a').forEach(link => {
            link.addEventListener('click', () => {
                navToggle.classList.remove('active');
                navLinks.classList.remove('active');
            });
        });
    }

    // 3. Scroll Reveal Observer
    const revealElements = document.querySelectorAll('.reveal');
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                revealObserver.unobserve(entry.target); // Reveal once
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(el => {
        revealObserver.observe(el);
    });

    // 4. Interactive Canvas Particles Background
    initParticlesBackground();

    // 5. Initialize Features Inline
    initTypewriter();
    initTerminal();
    initProjects();
    initStats();
    initContactForm();
});

// Lightweight interactive background particle script
function initParticlesBackground() {
    const container = document.getElementById('particle-canvas-container');
    if (!container) return;

    // Clear any existing canvases (like those created during hot-reloads)
    container.innerHTML = '';

    const canvas = document.createElement('canvas');
    canvas.style.display = 'block';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    container.appendChild(canvas);

    const ctx = canvas.getContext('2d');
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    // Handle resizing
    window.addEventListener('resize', () => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    });

    const particles = [];
    const count = 40;
    const colors = ['rgba(0, 229, 255, 0.3)', 'rgba(123, 97, 255, 0.3)'];

    class Particle {
        constructor() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.radius = Math.random() * 2 + 1;
            this.speedX = (Math.random() - 0.5) * 0.4;
            this.speedY = (Math.random() - 0.5) * 0.4;
            this.color = colors[Math.floor(Math.random() * colors.length)];
        }

        update() {
            this.x += this.speedX;
            this.y += this.speedY;

            // Bounce on boundaries
            if (this.x < 0 || this.x > width) this.speedX *= -1;
            if (this.y < 0 || this.y > height) this.speedY *= -1;
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = this.color;
            ctx.shadowBlur = 10;
            ctx.shadowColor = this.color;
            ctx.fill();
        }
    }

    // Populate particles array
    for (let i = 0; i < count; i++) {
        particles.push(new Particle());
    }

    function animate() {
        ctx.clearRect(0, 0, width, height);
        ctx.shadowBlur = 0; // reset shadow for clear
        
        particles.forEach(p => {
            p.update();
            p.draw();
        });
        
        requestAnimationFrame(animate);
    }

    animate();
}

// 6. Typewriter Effect
function initTypewriter() {
    const element = document.getElementById('typewriter');
    if (!element) return;

    const phrases = [
        "AI Algorithms.",
        "High-Availability Data Pipelines.",
        "Machine Learning Systems.",
        "Fast Rust Code.",
        "Autonomous Agents."
    ];

    let phraseIndex = 0;
    let charIndex = phrases[0].length;
    let isDeleting = true;
    let typingSpeed = 100;

    function type() {
        const currentPhrase = phrases[phraseIndex];
        
        if (isDeleting) {
            element.textContent = currentPhrase.substring(0, charIndex - 1);
            charIndex--;
            typingSpeed = 50;
        } else {
            element.textContent = currentPhrase.substring(0, charIndex + 1);
            charIndex++;
            typingSpeed = 100;
        }

        if (!isDeleting && charIndex === currentPhrase.length) {
            // Pause at completion
            isDeleting = true;
            typingSpeed = 2000; // Pause at end of phrase
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            phraseIndex = (phraseIndex + 1) % phrases.length;
            typingSpeed = 500; // Pause before typing new phrase
        }

        setTimeout(type, typingSpeed);
    }

    // Start with typing
    setTimeout(type, 1000);
}

// 7. Interactive Terminal Logic
function initTerminal() {
    const terminalScreen = document.getElementById('terminal-screen');
    const terminalInput = document.getElementById('terminal-input');
    const terminalWidget = document.querySelector('.terminal-widget');

    if (!terminalScreen || !terminalInput) return;

    // Focus input on terminal click
    if (terminalWidget) {
        terminalWidget.addEventListener('click', () => {
            terminalInput.focus();
        });
    }

    const commands = {
        help: `Available commands:<br>
&nbsp;&nbsp;about&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; - Summarize professional background<br>
&nbsp;&nbsp;skills&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- List main technical skills<br>
&nbsp;&nbsp;experience&nbsp;&nbsp;- Detail professional timeline<br>
&nbsp;&nbsp;education&nbsp;&nbsp; - Detail academic degrees<br>
&nbsp;&nbsp;certs&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; - List achievements & certifications<br>
&nbsp;&nbsp;projects&nbsp;&nbsp;&nbsp;&nbsp;- Show featured projects<br>
&nbsp;&nbsp;clear&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; - Clear the console output<br>
&nbsp;&nbsp;help&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- View this menu`,

        about: `Krishan Kumar - AI & Data Engineer. Specializes in scaling ML pipelines and high-volume data architectures. Ex-Mumbai Airport Systems Engineer managing databases for 40M+ travelers. Currently developing LLM + Causal AI agents at University of Naples.`,

        skills: `<strong>Languages:</strong> Python (Expert), Rust, SQL, C++, Java, PHP<br>
<strong>AI & ML:</strong> LLMs, RAG, PyTorch, Scikit-Learn, Causal Inference, YOLOv8, FAISS<br>
<strong>Cloud & MLOps:</strong> AWS, Docker, Kubernetes, Apache Airflow, CI/CD<br>
<strong>Databases:</strong> PostgreSQL, MySQL, Spark, Hadoop`,

        experience: `<strong>Professional Experience:</strong><br>
• <strong>Thesis Researcher (MSc Data Science)</strong> | Univ. of Naples (2025 - 2026)<br>
&nbsp;&nbsp;Combining LLMs + Causal Inference inside Kubernetes.<br>
• <strong>System Engineer (Data Eng)</strong> | Mumbai Airport (2019 - 2023)<br>
&nbsp;&nbsp;Database management and ETL pipelines for 40M+ annual travelers.<br>
• <strong>Software Engineer (Full-Stack)</strong> | PYTOSOFT (2015 - 2019)<br>
&nbsp;&nbsp;Built PHP/SQL services & Python microservices on AWS/Docker.`,

        education: `<strong>Education:</strong><br>
• <strong>M.Sc. Data Science</strong> | University of Naples Federico II, Italy (2023 - 2026)<br>
• <strong>B.Tech Computer Science & Eng</strong> | Rajasthan Technical University, India (2010 - 2014)`,

        certs: `<strong>Achievements & Certifications:</strong><br>
• Machine Learning Specialization (Coursera)<br>
• Master of ELT Best Practices (dlt-hub)<br>
• Microsoft Training Associate: Core Java & Database Administration<br>
• NIIT Professional Certification: C Programming & OOPs`,

        projects: `<strong>Featured Projects:</strong><br>
1. <strong>Production-Grade RAG Architecture</strong> (Python/Rust, FAISS, LLMs)<br>
2. <strong>Microservices Causal Inference Testing</strong> (Kubernetes, Causal Inference)<br>
3. <strong>Diaper Sales Prediction Model</strong> (Scikit-Learn, Decision Trees)<br>
4. <strong>AI Trip Planner</strong> (Python, Streamlit, LLMs)<br>
5. <strong>Stanford Dog Classifier</strong> (PyTorch, ResNet, YOLOv8)<br>
6. <strong>FlyIndia Simulator</strong> (Java, OOP, SQL)`
    };

    terminalInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            const inputVal = terminalInput.value.trim();
            const cmd = inputVal.toLowerCase();

            // Append echo line
            const echoLine = document.createElement('div');
            echoLine.className = 'terminal-line';
            echoLine.innerHTML = `<span class="term-prompt">guest@krishan-portfolio:~$</span> <span class="term-cmd">${inputVal}</span>`;
            
            // Insert before the interactive line
            const interactiveLine = terminalScreen.querySelector('.terminal-interactive-line');
            terminalScreen.insertBefore(echoLine, interactiveLine);

            if (cmd === 'clear') {
                // Remove all lines except the interactive line
                const lines = Array.from(terminalScreen.querySelectorAll('.terminal-line'));
                lines.forEach(line => line.remove());
            } else if (cmd !== '') {
                const outputLine = document.createElement('div');
                outputLine.className = 'terminal-line output-line';

                if (commands[cmd]) {
                    outputLine.innerHTML = commands[cmd];
                } else {
                    outputLine.innerHTML = `Command not found: <span class="text-primary">${inputVal}</span>. Type <span class="text-secondary">'help'</span> for list of commands.`;
                }
                
                terminalScreen.insertBefore(outputLine, interactiveLine);
            }

            terminalInput.value = '';
            
            // Auto scroll terminal to bottom
            terminalScreen.scrollTop = terminalScreen.scrollHeight;
        }
    });
}

// 8. Combined Project Search & Category Filtering
function initProjects() {
    const searchInput = document.getElementById('project-search');
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    if (!projectCards.length) return;

    let activeFilter = 'all';
    let searchQuery = '';

    function applyFilterAndSearch() {
        projectCards.forEach(card => {
            const categories = card.getAttribute('data-category').split(' ');
            const techStack = card.getAttribute('data-tech').toLowerCase();
            const title = card.querySelector('.project-title').textContent.toLowerCase();
            const desc = card.querySelector('.project-desc').textContent.toLowerCase();

            const matchesCategory = (activeFilter === 'all' || categories.includes(activeFilter));
            const matchesSearch = (!searchQuery || 
                                   techStack.includes(searchQuery) || 
                                   title.includes(searchQuery) || 
                                   desc.includes(searchQuery));

            if (matchesCategory && matchesSearch) {
                card.style.display = 'flex';
                // Trigger reflow for animation
                setTimeout(() => {
                    card.style.opacity = '1';
                    card.style.transform = 'scale(1)';
                }, 10);
            } else {
                card.style.opacity = '0';
                card.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    card.style.display = 'none';
                }, 300); // match transition duration
            }
        });
    }

    // Category button click
    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            activeFilter = btn.getAttribute('data-filter');
            applyFilterAndSearch();
        });
    });

    // Search input typing
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            searchQuery = e.target.value.toLowerCase().trim();
            applyFilterAndSearch();
        });
    }
}

// 9. Stats Counter Animation
function initStats() {
    const statsCards = document.querySelectorAll('.stat-card');
    if (!statsCards.length) return;

    const options = {
        threshold: 0.5,
        rootMargin: '0px'
    };

    const statsObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, options);

    statsCards.forEach(card => statsObserver.observe(card));

    function animateCounter(card) {
        const numElement = card.querySelector('.stat-num');
        if (!numElement) return;

        const targetStr = card.getAttribute('data-target');
        const prefix = card.getAttribute('data-prefix') || '';
        const suffix = card.getAttribute('data-suffix') || '';
        
        // Extract numeric value (ignoring prefix/suffix sign)
        const isNegative = targetStr.startsWith('-');
        const cleanTargetStr = isNegative ? targetStr.slice(1) : targetStr;
        const targetVal = parseFloat(cleanTargetStr);
        
        const duration = 2000; // 2 seconds animation
        const startTime = performance.now();
        const hasDecimal = cleanTargetStr.includes('.');
        const decimalPrecision = hasDecimal ? cleanTargetStr.split('.')[1].length : 0;

        function update(currentTime) {
            const elapsedTime = currentTime - startTime;
            const progress = Math.min(elapsedTime / duration, 1);
            
            // Easing function (easeOutQuad)
            const easeProgress = progress * (2 - progress);
            const currentVal = easeProgress * targetVal;
            
            let formattedVal = currentVal.toFixed(decimalPrecision);
            
            // Re-apply negative sign if necessary
            let displayVal = (isNegative ? '-' : '') + formattedVal;

            numElement.textContent = prefix + displayVal;

            if (progress < 1) {
                requestAnimationFrame(update);
            } else {
                // Ensure exact final number is set
                numElement.textContent = prefix + (isNegative ? '-' : '') + targetVal.toFixed(decimalPrecision);
            }
        }

        requestAnimationFrame(update);
    }
}

// 10. Contact Form Simulate Terminal Log Submission
function initContactForm() {
    const form = document.getElementById('contact-form');
    const formTerminal = document.getElementById('form-terminal');

    if (!form || !formTerminal) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        // Hide form inputs
        form.style.display = 'none';
        
        // Show simulated terminal
        formTerminal.style.display = 'block';
        formTerminal.innerHTML = ''; // Clear logs

        const logs = [
            { text: '> Initiating SMTP secure tunnel handshake...', color: 'text-secondary' },
            { text: '> Parsing form payload (name, email, message)...', color: 'text-secondary' },
            { text: '> Encrypting payload with TLS v1.3 cipher...', color: 'text-secondary' },
            { text: '> Sending message packets to kk9289@gmail.com...', color: 'text-primary' },
            { text: '> Mail transaction completed successfully! Response code: 250 OK', color: 'text-primary' },
            { text: '> Thank you, message received. Krishan will get back to you shortly!', color: 'text-success' }
        ];

        let logIndex = 0;

        function printNextLog() {
            if (logIndex < logs.length) {
                const log = logs[logIndex];
                const line = document.createElement('div');
                line.className = 'term-log-line';
                line.innerHTML = `<span class="${log.color}">${log.text}</span>`;
                formTerminal.appendChild(line);
                
                logIndex++;
                setTimeout(printNextLog, 600); // 600ms delay per line
            }
        }

        // Start logging progression
        printNextLog();
    });
}