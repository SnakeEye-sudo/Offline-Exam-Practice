// Offline Exam Practice App - Main Script
// MCQ/Question Logic with Local Storage for Analytics

const examApp = {
    currentQuestion: 0,
    score: 0,
    selectedAnswers: [],
    timer: null,
    timeRemaining: 0,
    
    // Static question bank - local data only
    questionBank: {
        upsc: [
            {
                id: 1,
                subject: 'History',
                topic: 'Ancient India',
                question: 'Who was the founder of the Maurya Empire?',
                options: ['Ashoka', 'Chandragupta Maurya', 'Bindusara', 'Samudragupta'],
                correctAnswer: 1,
                difficulty: 'medium'
            },
            {
                id: 2,
                subject: 'Geography',
                topic: 'Indian Geography',
                question: 'Which is the longest river in India?',
                options: ['Yamuna', 'Brahmaputra', 'Ganga', 'Godavari'],
                correctAnswer: 2,
                difficulty: 'easy'
            }
        ],
        bpsc: [
            {
                id: 1,
                subject: 'Bihar History',
                topic: 'Ancient Bihar',
                question: 'Nalanda University was established during which dynasty?',
                options: ['Gupta', 'Maurya', 'Pala', 'Kushana'],
                correctAnswer: 0,
                difficulty: 'medium'
            }
        ],
        local: [
            {
                id: 1,
                subject: 'General Knowledge',
                topic: 'Current Affairs',
                question: 'What is the capital of Bihar?',
                options: ['Patna', 'Gaya', 'Muzaffarpur', 'Bhagalpur'],
                correctAnswer: 0,
                difficulty: 'easy'
            }
        ]
    },
    
    // Initialize app
    init() {
        this.loadAnalytics();
        this.setupEventListeners();
        this.displaySubjects();
    },
    
    // Setup event listeners
    setupEventListeners() {
        document.addEventListener('DOMContentLoaded', () => {
            this.displaySubjects();
        });
    },
    
    // Display available subjects
    displaySubjects() {
        const container = document.getElementById('subjectContainer');
        if (!container) return;
        
        const subjects = Object.keys(this.questionBank);
        container.innerHTML = subjects.map(subject => `
            <button class="subject-btn" onclick="examApp.selectSubject('${subject}')">
                ${subject.toUpperCase()}
            </button>
        `).join('');
    },
    
    // Select subject and display topics
    selectSubject(subject) {
        const questions = this.questionBank[subject];
        const topics = [...new Set(questions.map(q => q.topic))];
        
        const container = document.getElementById('topicContainer');
        if (!container) return;
        
        container.innerHTML = `
            <h3>Select Topic (${subject.toUpperCase()})</h3>
            ${topics.map(topic => `
                <button class="topic-btn" onclick="examApp.startPractice('${subject}', '${topic}')">
                    ${topic}
                </button>
            `).join('')}
        `;
    },
    
    // Start practice mode
    startPractice(subject, topic) {
        const questions = this.questionBank[subject].filter(q => q.topic === topic);
        this.currentQuestions = questions;
        this.currentQuestion = 0;
        this.score = 0;
        this.selectedAnswers = [];
        this.timeRemaining = questions.length * 60; // 1 minute per question
        
        this.displayQuestion();
        this.startTimer();
    },
    
    // Display current question
    displayQuestion() {
        if (this.currentQuestion >= this.currentQuestions.length) {
            this.endPractice();
            return;
        }
        
        const q = this.currentQuestions[this.currentQuestion];
        const container = document.getElementById('questionContainer');
        if (!container) return;
        
        container.innerHTML = `
            <div class="question-card">
                <div class="question-header">
                    <span>Question ${this.currentQuestion + 1}/${this.currentQuestions.length}</span>
                    <span id="timer">Time: ${this.formatTime(this.timeRemaining)}</span>
                </div>
                <h3>${q.question}</h3>
                <div class="options">
                    ${q.options.map((option, index) => `
                        <label class="option">
                            <input type="radio" name="answer" value="${index}" 
                                onchange="examApp.selectAnswer(${index})">
                            ${option}
                        </label>
                    `).join('')}
                </div>
                <div class="navigation">
                    <button onclick="examApp.previousQuestion()" ${this.currentQuestion === 0 ? 'disabled' : ''}>
                        Previous
                    </button>
                    <button onclick="examApp.nextQuestion()">
                        ${this.currentQuestion === this.currentQuestions.length - 1 ? 'Finish' : 'Next'}
                    </button>
                </div>
            </div>
        `;
        
        // Restore previously selected answer
        if (this.selectedAnswers[this.currentQuestion] !== undefined) {
            const radio = document.querySelector(`input[value="${this.selectedAnswers[this.currentQuestion]}"]`);
            if (radio) radio.checked = true;
        }
    },
    
    // Select answer
    selectAnswer(answerIndex) {
        this.selectedAnswers[this.currentQuestion] = answerIndex;
    },
    
    // Navigate to next question
    nextQuestion() {
        this.currentQuestion++;
        this.displayQuestion();
    },
    
    // Navigate to previous question
    previousQuestion() {
        if (this.currentQuestion > 0) {
            this.currentQuestion--;
            this.displayQuestion();
        }
    },
    
    // Start timer
    startTimer() {
        if (this.timer) clearInterval(this.timer);
        
        this.timer = setInterval(() => {
            this.timeRemaining--;
            const timerEl = document.getElementById('timer');
            if (timerEl) {
                timerEl.textContent = `Time: ${this.formatTime(this.timeRemaining)}`;
            }
            
            if (this.timeRemaining <= 0) {
                this.endPractice();
            }
        }, 1000);
    },
    
    // Format time display
    formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    },
    
    // End practice and show results
    endPractice() {
        clearInterval(this.timer);
        
        // Calculate score
        this.score = 0;
        this.currentQuestions.forEach((q, index) => {
            if (this.selectedAnswers[index] === q.correctAnswer) {
                this.score++;
            }
        });
        
        // Save analytics
        this.saveAnalytics();
        
        // Display results
        this.displayResults();
    },
    
    // Display results
    displayResults() {
        const container = document.getElementById('questionContainer');
        if (!container) return;
        
        const percentage = ((this.score / this.currentQuestions.length) * 100).toFixed(2);
        
        container.innerHTML = `
            <div class="results-card">
                <h2>Practice Complete!</h2>
                <div class="score-display">
                    <p>Score: ${this.score}/${this.currentQuestions.length}</p>
                    <p>Percentage: ${percentage}%</p>
                </div>
                <div class="review">
                    <h3>Review Answers</h3>
                    ${this.currentQuestions.map((q, index) => {
                        const userAnswer = this.selectedAnswers[index];
                        const isCorrect = userAnswer === q.correctAnswer;
                        return `
                            <div class="review-item ${isCorrect ? 'correct' : 'incorrect'}">
                                <p><strong>Q${index + 1}:</strong> ${q.question}</p>
                                <p>Your Answer: ${q.options[userAnswer] || 'Not answered'}</p>
                                <p>Correct Answer: ${q.options[q.correctAnswer]}</p>
                            </div>
                        `;
                    }).join('')}
                </div>
                <button onclick="location.reload()">Start New Practice</button>
            </div>
        `;
    },
    
    // Save analytics to local storage
    saveAnalytics() {
        const analytics = this.loadAnalytics();
        
        const attempt = {
            date: new Date().toISOString(),
            score: this.score,
            total: this.currentQuestions.length,
            percentage: ((this.score / this.currentQuestions.length) * 100).toFixed(2),
            subject: this.currentQuestions[0]?.subject || 'Unknown'
        };
        
        analytics.attempts.push(attempt);
        analytics.totalAttempts++;
        analytics.totalScore += this.score;
        analytics.totalQuestions += this.currentQuestions.length;
        
        localStorage.setItem('examAppAnalytics', JSON.stringify(analytics));
    },
    
    // Load analytics from local storage
    loadAnalytics() {
        const stored = localStorage.getItem('examAppAnalytics');
        
        if (stored) {
            return JSON.parse(stored);
        }
        
        return {
            attempts: [],
            totalAttempts: 0,
            totalScore: 0,
            totalQuestions: 0
        };
    },
    
    // Display analytics
    displayAnalytics() {
        const analytics = this.loadAnalytics();
        const container = document.getElementById('analyticsContainer');
        if (!container) return;
        
        const overallPercentage = analytics.totalQuestions > 0 
            ? ((analytics.totalScore / analytics.totalQuestions) * 100).toFixed(2)
            : 0;
        
        container.innerHTML = `
            <div class="analytics-card">
                <h2>Your Analytics</h2>
                <div class="stats">
                    <p>Total Attempts: ${analytics.totalAttempts}</p>
                    <p>Overall Score: ${analytics.totalScore}/${analytics.totalQuestions}</p>
                    <p>Overall Percentage: ${overallPercentage}%</p>
                </div>
                <div class="history">
                    <h3>Recent Attempts</h3>
                    ${analytics.attempts.slice(-10).reverse().map(attempt => `
                        <div class="attempt-item">
                            <p>${new Date(attempt.date).toLocaleString()}</p>
                            <p>${attempt.subject}: ${attempt.score}/${attempt.total} (${attempt.percentage}%)</p>
                        </div>
                    `).join('')}
                </div>
                <button onclick="examApp.clearAnalytics()">Clear Analytics</button>
            </div>
        `;
    },
    
    // Clear analytics
    clearAnalytics() {
        if (confirm('Are you sure you want to clear all analytics data?')) {
            localStorage.removeItem('examAppAnalytics');
            alert('Analytics cleared successfully!');
            this.displayAnalytics();
        }
    }
};

// Initialize app when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => examApp.init());
} else {
    examApp.init();
}
