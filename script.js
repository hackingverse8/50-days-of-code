class PasswordGame {
    constructor() {
        this.password = '';
        this.currentLevel = 0;
        this.completedLevels = [];
        this.selectedTasks = [];
        this.gameStarted = false;
        this.startTime = null;
        
        // Initialize Lucide icons
        lucide.createIcons();
        
        this.initializeElements();
        this.setupEventListeners();
        
        // Ensure correct initial visibility
        this.startScreen.classList.remove('hidden');
        this.gameScreen.classList.add('hidden');
        this.victoryScreen.classList.add('hidden');
    }

    initializeElements() {
        this.startScreen = document.getElementById('startScreen');
        this.gameScreen = document.getElementById('gameScreen');
        this.passwordInput = document.getElementById('passwordInput');
        this.currentTaskElement = document.getElementById('currentTask');
        this.completedTasksElement = document.getElementById('completedTasks');
        this.victoryScreen = document.getElementById('victoryScreen');
        this.progressFill = document.getElementById('progressFill');
        this.progressText = document.querySelector('.progress-text');
        this.taskCompleteSound = document.getElementById('taskCompleteSound');
        this.victorySound = document.getElementById('victorySound');
        this.taskFailSound = document.getElementById('taskFailSound');
    }

    setupEventListeners() {
        document.getElementById('startGameBtn').addEventListener('click', () => this.startNewGame());
        this.passwordInput.addEventListener('input', (e) => this.handlePasswordChange(e));
        document.querySelector('.play-again-btn').addEventListener('click', () => this.startNewGame());
        document.getElementById('copyPassword').addEventListener('click', () => this.copyPassword());
    }

    // Define all possible tasks
    allTasks = [
        {
            id: 1,
            text: "Include at least one uppercase letter",
            icon: "type",
            check: (pwd) => /[A-Z]/.test(pwd)
        },
        {
            id: 2,
            text: "Include at least one number",
            icon: "hash",
            check: (pwd) => /\d/.test(pwd)
        },
        {
            id: 3,
            text: "Include a special character",
            icon: "star",
            check: (pwd) => /[!@#$%^&*]/.test(pwd)
        },
        {
            id: 4,
            text: "Include your favorite color",
            icon: "palette",
            check: (pwd) => /(red|blue|green|yellow|purple|pink|orange|black|white)/i.test(pwd)
        },
        {
            id: 5,
            text: "Add an emoji 😊",
            icon: "smile",
            check: (pwd) => /[\u{1F300}-\u{1F9FF}]/u.test(pwd)
        },
        {
            id: 6,
            text: "Include a month of the year",
            icon: "calendar",
            check: (pwd) => /(january|february|march|april|may|june|july|august|september|october|november|december)/i.test(pwd)
        },
        {
            id: 7,
            text: "Add a mathematical operator (+,-,*,/)",
            icon: "plus",
            check: (pwd) => /[\+\-\*\/]/.test(pwd)
        },
        {
            id: 8,
            text: "Include a two-digit number (10-99)",
            icon: "hash",
            check: (pwd) => /(?:^|\D)[1-9]\d(?:\D|$)/.test(pwd)
        },
        {
            id: 9,
            text: "Add a country name",
            icon: "globe",
            check: (pwd) => /(usa|india|china|japan|france|germany|italy|spain|brazil|canada)/i.test(pwd)
        },
        {
            id: 10,
            text: "Include a word in CAPS",
            icon: "type",
            check: (pwd) => /[A-Z]{2,}/.test(pwd)
        },
        {
            id: 11,
            text: "Add a day of the week",
            icon: "calendar",
            check: (pwd) => /(monday|tuesday|wednesday|thursday|friday|saturday|sunday)/i.test(pwd)
        },
        {
            id: 12,
            text: "Include a fruit name",
            icon: "apple",
            check: (pwd) => /(apple|banana|orange|grape|mango|kiwi|peach|plum)/i.test(pwd)
        },
        {
            id: 13,
            text: "Add a programming language",
            icon: "code",
            check: (pwd) => /(python|java|javascript|ruby|php|swift|golang|rust)/i.test(pwd)
        },
        {
            id: 14,
            text: "Include a superhero name",
            icon: "zap",
            check: (pwd) => /(batman|superman|spiderman|ironman|thor|hulk|flash)/i.test(pwd)
        },
        {
            id: 15,
            text: "Add a punctuation mark (.,;:?!)",
            icon: "type",
            check: (pwd) => /[.,;:?!]/.test(pwd)
        },
        {
            id: 16,
            text: "Include a season",
            icon: "sun",
            check: (pwd) => /(spring|summer|autumn|winter|fall)/i.test(pwd)
        },
        {
            id: 17,
            text: "Add a three-letter word",
            icon: "type",
            check: (pwd) => /\b[a-zA-Z]{3}\b/.test(pwd)
        },
        {
            id: 18,
            text: "Include a planet name",
            icon: "globe",
            check: (pwd) => /(mercury|venus|earth|mars|jupiter|saturn|uranus|neptune)/i.test(pwd)
        },
        {
            id: 19,
            text: "Add a sport name",
            icon: "trophy",
            check: (pwd) => /(soccer|football|basketball|tennis|cricket|hockey|golf|badminton|rugby)/i.test(pwd)
        },
        {
            id: 20,
            text: "Include an animal name",
            icon: "dog",
            check: (pwd) => /(dog|cat|lion|tiger|elephant|giraffe|zebra|monkey)/i.test(pwd)
        },
        // Additional tasks
        {
            id: 21,
            text: "Add a musical instrument",
            icon: "music",
            check: (pwd) => /(piano|guitar|violin|drums|flute|saxophone|trumpet)/i.test(pwd)
        },
        {
            id: 22,
            text: "Include a weather condition",
            icon: "cloud",
            check: (pwd) => /(sunny|rainy|cloudy|snowy|windy|stormy)/i.test(pwd)
        },
        {
            id: 23,
            text: "Add a cardinal direction",
            icon: "compass",
            check: (pwd) => /(north|south|east|west|N|S|E|W)/i.test(pwd)
        },
        {
            id: 24,
            text: "Include a precious stone",
            icon: "gem",
            check: (pwd) => /(diamond|gold|ruby|emerald|sapphire|pearl|jade|silver)/i.test(pwd)
        },
        {
            id: 25,
            text: "Add a social media platform",
            icon: "share",
            check: (pwd) => /(facebook|twitter|instagram|linkedin|tiktok|youtube)/i.test(pwd)
        },
        {
            id: 26,
            text: "Include a car brand",
            icon: "car",
            check: (pwd) => /(toyota|honda|ford|bmw|audi|tesla|mercedes)/i.test(pwd)
        },
        {
            id: 27,
            text: "Add a currency symbol",
            icon: "currency",
            check: (pwd) => /[\₹\$\€\£\¥]/.test(pwd)
        },
        {
            id: 28,
            text: "Include a greeting word",
            icon: "message-circle",
            check: (pwd) => /(hello|hi|hey|bye|welcome|ciao|hola)/i.test(pwd)
        },
        {
            id: 29,
            text: "Add a time unit",
            icon: "clock",
            check: (pwd) => /(second|minute|hour|day|week|month|year)/i.test(pwd)
        },
        {
            id: 30,
            text: "Include a chemical element",
            icon: "flask",
            check: (pwd) => /(gold|silver|iron|copper|zinc|oxygen|carbon)/i.test(pwd)
        },
        {
            id: 31,
            text: "Add a shape name",
            icon: "square",
            check: (pwd) => /(circle|square|triangle|rectangle|oval|diamond)/i.test(pwd)
        },
        {
            id: 32,
            text: "Include a profession",
            icon: "briefcase",
            check: (pwd) => /(doctor|teacher|engineer|artist|chef|pilot|lawyer)/i.test(pwd)
        },
        {
            id: 33,
            text: "Add a number in words",
            icon: "type",
            check: (pwd) => /(one|two|three|four|five|six|seven|eight|nine|ten)/i.test(pwd)
        },
        {
            id: 34,
            text: "Include a Roman numeral (I,V,X,L,C)",
            icon: "roman-numeral",
            check: (pwd) => /[IVXLC]/.test(pwd)
        },
        {
            id: 35,
            text: "Password must be at least 12 characters",
            icon: "lock",
            check: (pwd) => pwd.length >= 12
        }
    ];

    startNewGame() {
        const shuffled = [...this.allTasks];
        // Move 12-character requirement to the end
        const minLengthTask = shuffled.find(task => task.id === 35);
        const otherTasks = shuffled.filter(task => task.id !== 35);
        this.shuffleArray(otherTasks);
        
        // Select first 14 random tasks + minimum length requirement
        this.selectedTasks = [...otherTasks.slice(0, 14), minLengthTask];
        
        this.currentLevel = 0;
        this.completedLevels = [];
        this.password = '';
        this.gameStarted = true;
        this.startTime = new Date();
        
        // Update visibility
        this.startScreen.classList.add('hidden');
        this.gameScreen.classList.remove('hidden');
        this.victoryScreen.classList.add('hidden');
        
        // Reset input and progress
        this.passwordInput.value = '';
        this.updateProgress();
        this.updateUI();
    }

    shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    handlePasswordChange(e) {
        this.password = e.target.value;
        this.checkCurrentLevel();
        this.updatePasswordStrength();
    }

    updatePasswordStrength() {
        const strength = this.calculatePasswordStrength();
        const strengthBar = document.querySelector('.strength-bar');
        const strengthText = document.querySelector('.strength-text');
        
        strengthBar.style.width = `${strength}%`;
        strengthBar.style.backgroundColor = 
            strength < 33 ? 'var(--danger)' :
            strength < 66 ? 'var(--warning)' :
            'var(--success)';
            
        strengthText.textContent = `Password Strength: ${
            strength < 33 ? 'Weak' :
            strength < 66 ? 'Medium' :
            'Strong'
        }`;
    }

    calculatePasswordStrength() {
        let strength = 0;
        strength += this.password.length >= 8 ? 20 : 0;
        strength += /[A-Z]/.test(this.password) ? 20 : 0;
        strength += /[a-z]/.test(this.password) ? 20 : 0;
        strength += /[0-9]/.test(this.password) ? 20 : 0;
        strength += /[^A-Za-z0-9]/.test(this.password) ? 20 : 0;
        return strength;
    }

    checkCurrentLevel() {
        if (!this.gameStarted) return;
        
        const currentTask = this.selectedTasks[this.currentLevel];
        if (!currentTask) return;

        if (currentTask.check(this.password) && !this.completedLevels.includes(this.currentLevel)) {
            this.taskCompleteSound.currentTime = 0;
            this.taskCompleteSound.play();
            this.completedLevels.push(this.currentLevel);
            
            if (this.currentLevel < 14) {
                this.currentLevel++;
            }
            
            if (this.completedLevels.length === 15) {
                this.victorySound.play();
                this.showVictoryScreen();
            }
            
            this.updateProgress();
            this.updateUI();
        }
    }

    updateProgress() {
        const progress = (this.completedLevels.length / 15) * 100;
        this.progressFill.style.width = `${progress}%`;
        this.progressText.textContent = `Challenge ${this.completedLevels.length}/15`;
    }

    updateUI() {
        // Update current task display
        const currentTask = this.selectedTasks[this.currentLevel];
        this.currentTaskElement.innerHTML = `
            <div class="task-content">
                <div class="task-icon">
                    <i data-lucide="${currentTask.icon}"></i>
                </div>
                <div>
                    <h3>Level ${this.currentLevel + 1}</h3>
                    <p>${currentTask.text}</p>
                </div>
            </div>
        `;

        // Update completed tasks
        this.completedTasksElement.innerHTML = this.completedLevels
            .map(level => `
                <div class="completed-task">
                    <div class="task-icon">
                        <i data-lucide="${this.selectedTasks[level].icon}"></i>
                    </div>
                    <span>${this.selectedTasks[level].text}</span>
                    <i data-lucide="check-circle" class="check-icon"></i>
                </div>
            `).join('');

        // Refresh Lucide icons
        lucide.createIcons();
    }

    showVictoryScreen() {
        const endTime = new Date();
        const timeSpent = Math.floor((endTime - this.startTime) / 1000);
        const minutes = Math.floor(timeSpent / 60);
        const seconds = timeSpent % 60;
        
        document.getElementById('timeSpent').textContent = 
            `${minutes}:${seconds.toString().padStart(2, '0')}`;
        document.getElementById('finalPassword').value = this.password;
        
        this.victoryScreen.classList.remove('hidden');
        this.createConfetti();
    }

    copyPassword() {
        navigator.clipboard.writeText(this.password);
        const copyBtn = document.getElementById('copyPassword');
        copyBtn.innerHTML = '<i data-lucide="check"></i>Copied!';
        lucide.createIcons();
        
        setTimeout(() => {
            copyBtn.innerHTML = '<i data-lucide="copy"></i>Copy';
            lucide.createIcons();
        }, 2000);
    }

    createConfetti() {
        const confettiContainer = document.querySelector('.confetti-container');
        for (let i = 0; i < 50; i++) {
            const confetti = document.createElement('div');
            confetti.className = 'confetti';
            confetti.style.left = Math.random() * 100 + 'vw';
            confetti.style.animationDelay = Math.random() * 3 + 's';
            confetti.style.backgroundColor = `hsl(${Math.random() * 360}, 100%, 50%)`;
            confettiContainer.appendChild(confetti);
        }
    }
}

// Initialize the game when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new PasswordGame();
});
