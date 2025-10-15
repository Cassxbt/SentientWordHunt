// =====================================================
//  SENTIENT WORD HUNT - MAIN GAME CONTROLLER
//  AI-powered word search game with dynamic levels
//  Built with 💜 by Cassxbt
// =====================================================

class SentientWordHunt {
    constructor() {
        // Game components
        this.wordGrid = null;
        this.validator = null;
        this.canvasDrawer = null;
        this.inputHandler = null;
        
        // Game state
        this.score = 0;
        this.currentLevel = 1;
        this.timeRemaining = 0;
        this.timerInterval = null;
        this.timerPaused = false; // Track if timer is paused (for dictionary view)
        this.gameStarted = false;
        this.gameEnded = false;
        
        // Hint system
        this.hintsRemaining = 0;
        this.hintsAllowed = 0;
        
        // Initialize the game
        this.setupEventListeners();
        this.showWelcomeScreen();
    }
    
    /* ==========================================
       WELCOME & LEVEL SELECTION
       ========================================== */
    
    // Show welcome screen first
    showWelcomeScreen() {
        this.showModal('welcome-modal');
    }
    
    // Show the level selection screen
    showLevelSelection() {
        this.hideModal('welcome-modal');
        this.showModal('level-select-modal');
        this.updateLevelSelector();
    }
    
    // Create level selection buttons - clicking starts game immediately
    updateLevelSelector() {
        const container = document.getElementById('level-selector');
        if (!container) return;
        
        container.innerHTML = '';
        
        // Create a button for each level
        LEVEL_CONFIG.forEach((config) => {
            const btn = document.createElement('button');
            btn.className = 'level-btn';
            btn.innerHTML = `
                <div class="level-number">Level ${config.level}</div>
                <div class="level-name">${config.name}</div>
                <div class="level-info">${config.timeLimit}s | ${config.targetScore} pts | ${config.hintsAllowed} hints</div>
            `;
            
            // Click level button = Start game immediately!
            this.addTouchClickEvent(btn, () => {
                this.currentLevel = config.level;
                this.startGameWithLevel(config.level);
            });
            
            container.appendChild(btn);
        });
    }
    
    // Start the game with selected level (called directly from level button)
    startGameWithLevel(level) {
        this.currentLevel = level;
        this.hideModal('level-select-modal');
        this.gameStarted = true;
        this.gameEnded = false;
        this.initializeGame();
    }
    
    /* ==========================================
       GAME INITIALIZATION
       ========================================== */
    
    // Set up the game board and all components
    initializeGame() {
        // Reset game state
        this.gameEnded = false;
        this.gameStarted = true;
        
        const levelConfig = LEVEL_CONFIG[this.currentLevel - 1];
        
        // Stop any existing timer
        this.stopTimer();
        
        // Generate word grid with level config
        this.wordGrid = generateWordGrid(levelConfig);
        renderGrid(this.wordGrid);
        
        // Initialize validator
        this.validator = new WordValidator(this.wordGrid);
        
        // Initialize canvas drawer
        this.canvasDrawer = new SelectionCanvas('selection-canvas');
        
        // Initialize input handler
        const gridElement = document.getElementById('word-grid');
        this.inputHandler = new InputHandler(
            gridElement,
            this.canvasDrawer,
            (word, positions) => this.handleWordSelection(word, positions)
        );
        
        // Ensure input is enabled
        this.inputHandler.enable();
        
        // Reset UI
        this.score = 0;
        this.updateScore();
        this.updateFoundWordsDisplay();
        this.updateProgressDisplay();
        this.updateLevelDisplay();
        
        // Initialize hint system for this level
        this.hintsAllowed = levelConfig.hintsAllowed;
        this.hintsRemaining = levelConfig.hintsAllowed;
        this.updateHintDisplay();
        
        // Start timer fresh
        this.timeRemaining = levelConfig.timeLimit;
        this.updateTimerDisplay();
        this.startTimer();
    }
    
    // Setup all event listeners
    // Helper function to add both click and touchend events for mobile support
    addTouchClickEvent(element, handler) {
        if (!element) return;
        
        // Add click event for desktop
        element.addEventListener('click', handler);
        
        // Add touchend event for mobile with ghost click prevention
        element.addEventListener('touchend', (e) => {
            e.preventDefault(); // Prevent ghost clicks
            handler(e);
        }, { passive: false });
    }

    setupEventListeners() {
        // Welcome screen button
        this.addTouchClickEvent(document.getElementById('welcome-start-btn'), () => {
            this.showLevelSelection();
        });
        
        // Instructions button from level select
        this.addTouchClickEvent(document.getElementById('level-instructions-btn'), () => {
            this.hideModal('level-select-modal');
            this.showInstructions();
        });
        
        // In-game buttons
        this.addTouchClickEvent(document.getElementById('hint-btn'), () => {
            this.showHint();
        });
        
        this.addTouchClickEvent(document.getElementById('share-btn'), () => {
            this.shareScore();
        });
        
        // Modal close buttons
        const closeButtons = document.querySelectorAll('.close-btn, .close-modal-btn');
        closeButtons.forEach(btn => {
            this.addTouchClickEvent(btn, (e) => {
                // Check if this is the stats modal close button
                const statsModal = document.getElementById('stats-modal');
                if (statsModal && statsModal.classList.contains('active') && 
                    (btn.parentElement.closest('#stats-modal') || btn.closest('.stats-content'))) {
                    this.hideModal('stats-modal');
                    // If game ended in failure, show the failed modal again
                    if (this.gameEnded) {
                        this.showModal('level-failed-modal');
                    }
                } else if (btn.closest('#instructions-modal')) {
                    // Closing instructions - return to level selection
                    this.hideModal('instructions-modal');
                    if (!this.gameStarted) {
                        this.showLevelSelection();
                    }
                } else {
                    this.hideAllModals();
                    if (!this.gameStarted) {
                        this.showWelcomeScreen();
                    }
                }
            });
        });
        
        // Dictionary close button - RESUME TIMER when closing!
        const dictCloseBtn = document.querySelector('#dictionary-modal .close-btn');
        if (dictCloseBtn) {
            this.addTouchClickEvent(dictCloseBtn, () => {
                this.hideModal('dictionary-modal');
                this.resumeTimer();
            });
        }
        
        // Click outside modal to close
        document.querySelectorAll('.modal').forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    // Special handling for stats modal
                    if (modal.id === 'stats-modal') {
                        this.hideModal('stats-modal');
                        if (this.gameEnded) {
                            this.showModal('level-failed-modal');
                        }
                    } else if (modal.id === 'dictionary-modal') {
                        // RESUME TIMER when closing dictionary!
                        this.hideModal('dictionary-modal');
                        this.resumeTimer();
                    } else if (modal.id === 'welcome-modal' || modal.id === 'level-select-modal') {
                        // Don't close welcome or level select by clicking outside
                        return;
                    } else {
                        this.hideModal(modal.id);
                        if (!this.gameStarted) {
                            this.showWelcomeScreen();
                        }
                    }
                }
            });
        });
        
        // Level complete buttons
        this.addTouchClickEvent(document.getElementById('next-level-btn'), () => {
            this.hideModal('level-complete-modal');
            if (this.currentLevel < 8) {
                this.currentLevel++;
                this.initializeGame();
            } else {
                this.showLevelSelection();
            }
        });
        
        // Stats button (replaced Try Again)
        this.addTouchClickEvent(document.getElementById('show-stats-btn'), () => {
            this.hideModal('level-failed-modal');
            this.showStats();
        });
        
        // Back to menu buttons (multiple) - Go back to level selection
        document.querySelectorAll('.back-to-menu-btn').forEach(btn => {
            this.addTouchClickEvent(btn, () => {
                this.hideAllModals();
                this.stopTimer();
                this.gameStarted = false;
                this.gameEnded = false;
                if (this.inputHandler) {
                    this.inputHandler.enable();
                }
                this.showLevelSelection();
            });
        });
        
        // Dictionary buttons
        this.addTouchClickEvent(document.getElementById('ask-dobby-btn'), () => {
            this.askDobbyAboutWord();
        });
        
        // Stats modal close button - return to level failed modal
        this.addTouchClickEvent(document.getElementById('close-stats-btn'), () => {
            this.hideModal('stats-modal');
            // If game ended in failure, show the failed modal again
            if (this.gameEnded) {
                this.showModal('level-failed-modal');
            }
        });
    }
    
    /* ==========================================
       TIMER MANAGEMENT
       ========================================== */
    
    // Start the countdown timer for current level
    startTimer() {
        this.stopTimer(); // Clear any existing timer first
        this.timerPaused = false; // Ensure timer is not paused
        
        this.timerInterval = setInterval(() => {
            // Don't continue if game has ended
            if (this.gameEnded) {
                this.stopTimer();
                return;
            }
            
            // Don't count down if timer is paused (dictionary open)
            if (this.timerPaused) {
                return;
            }
            
            // Count down
            this.timeRemaining--;
            this.updateTimerDisplay();
            
            // Show warning when time is running out
            if (this.timeRemaining === 10) {
                this.showFeedback('⏰ 10 seconds left!', 'warning');
            }
            
            // Time's up - game over!
            if (this.timeRemaining <= 0) {
                this.stopTimer();
                this.endGame(false);
            }
        }, 1000);
    }
    
    // Stop the timer
    stopTimer() {
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
        }
        this.timerPaused = false;
    }
    
    // Pause the timer (for dictionary view)
    pauseTimer() {
        if (this.timerInterval && !this.gameEnded) {
            this.timerPaused = true;
        }
    }
    
    // Resume the timer (return from dictionary)
    resumeTimer() {
        if (this.timerInterval && !this.gameEnded) {
            this.timerPaused = false;
        }
    }
    
    // Update timer display
    updateTimerDisplay() {
        const timerEl = document.getElementById('time-remaining');
        if (!timerEl) return;
        
        const minutes = Math.floor(this.timeRemaining / 60);
        const seconds = this.timeRemaining % 60;
        const timeText = `${minutes}:${seconds.toString().padStart(2, '0')}`;
        
        // Show PAUSED indicator if timer is paused
        if (this.timerPaused) {
            timerEl.textContent = `⏸️ ${timeText}`;
        } else {
            timerEl.textContent = timeText;
        }
        
        // Add warning class when low on time
        if (this.timeRemaining <= 10) {
            timerEl.classList.add('time-warning');
        } else {
            timerEl.classList.remove('time-warning');
        }
    }
    
    // Update level display
    updateLevelDisplay() {
        const levelConfig = LEVEL_CONFIG[this.currentLevel - 1];
        const levelEl = document.getElementById('current-level');
        const targetEl = document.getElementById('target-score');
        
        if (levelEl) {
            levelEl.textContent = `Level ${this.currentLevel}: ${levelConfig.name}`;
        }
        if (targetEl) {
            targetEl.textContent = `Target: ${levelConfig.targetScore} pts`;
        }
    }
    
    // Handle word selection
    handleWordSelection(word, positions) {
        if (this.gameEnded) return;
        
        const result = this.validator.validateWord(word, positions);
        
        if (result.valid) {
            // Update score
            this.score += result.wordData.points;
            this.updateScore();
            
            // Mark cells as found
            positions.forEach(pos => {
                const cell = document.querySelector(
                    `[data-row="${pos.row}"][data-col="${pos.col}"]`
                );
                if (cell) {
                    const className = result.wordData.isSentient ? 'found-sentient' : 'found';
                    cell.classList.add(className);
                }
            });
            
            // Update displays
            this.updateFoundWordsDisplay();
            this.updateProgressDisplay();
            
            // Show success feedback
            this.showFeedback(result.message, 'success');
            
            // Check if level is complete (all Sentient words found OR target score reached)
            const levelConfig = LEVEL_CONFIG[this.currentLevel - 1];
            const stats = this.validator.getStats();
            
            if (stats.sentientFound >= levelConfig.minWords && this.score >= levelConfig.targetScore) {
                this.stopTimer();
                this.endGame(true);
            }
        } else {
            // Show error message (but not for "already found")
            if (result.reason !== 'already_found') {
                this.showFeedback(result.message, 'error');
            }
        }
    }
    
    // End game (pass or fail)
    endGame(passed) {
        this.gameEnded = true;
        this.stopTimer();
        this.inputHandler.disable();
        
        setTimeout(() => {
            if (passed) {
                this.showLevelComplete();
            } else {
                this.showLevelFailed();
            }
        }, 500);
    }
    
    // Show level complete modal
    showLevelComplete() {
        const modal = document.getElementById('level-complete-modal');
        const levelConfig = LEVEL_CONFIG[this.currentLevel - 1];
        const stats = this.validator.getStats();
        
        document.getElementById('complete-level-num').textContent = this.currentLevel;
        document.getElementById('complete-score').textContent = this.score;
        document.getElementById('complete-words').textContent = stats.sentientFound;
        document.getElementById('complete-time').textContent = `${levelConfig.timeLimit - this.timeRemaining}s`;
        
        // Hide next level button if on last level
        const nextBtn = document.getElementById('next-level-btn');
            if (this.currentLevel >= 8) {
            nextBtn.textContent = '🏆 You Beat All Levels!';
            this.addTouchClickEvent(nextBtn, () => {
                this.hideModal('level-complete-modal');
                this.showLevelSelection();
            });
        } else {
            nextBtn.textContent = `🎮 Next: Level ${this.currentLevel + 1}`;
        }
        
        this.showModal('level-complete-modal');
    }
    
    // Show level failed modal
    showLevelFailed() {
        const modal = document.getElementById('level-failed-modal');
        const levelConfig = LEVEL_CONFIG[this.currentLevel - 1];
        const stats = this.validator.getStats();
        
        document.getElementById('failed-level-num').textContent = this.currentLevel;
        document.getElementById('failed-score').textContent = this.score;
        document.getElementById('failed-target').textContent = levelConfig.targetScore;
        document.getElementById('failed-words').textContent = stats.sentientFound;
        document.getElementById('failed-required').textContent = levelConfig.minWords;
        
        this.showModal('level-failed-modal');
    }
    
    // Update score display
    updateScore() {
        document.getElementById('score').textContent = this.score;
    }
    
    // Update progress display
    updateProgressDisplay() {
        const stats = this.validator.getStats();
        const wordsFoundElement = document.getElementById('words-found');
        
        if (wordsFoundElement) {
            wordsFoundElement.textContent = stats.sentientFound;
        }
    }
    
    // Update found words lists
    updateFoundWordsDisplay() {
        // Update Sentient words
        const sentientWords = this.validator.getAllFoundWords().filter(w => w.isSentient);
        const sentientList = document.getElementById('sentient-list');
        sentientList.innerHTML = '';
        
        let sentientScore = 0;
        sentientWords.forEach(wordData => {
            const li = document.createElement('li');
            li.textContent = wordData.word;
            li.title = `${wordData.points} points - Click for definition`;
            li.style.cursor = 'pointer';
            this.addTouchClickEvent(li, () => this.showWordDefinition(wordData.word));
            sentientList.appendChild(li);
            sentientScore += wordData.points;
        });
        
        if (sentientWords.length === 0) {
            const li = document.createElement('li');
            li.textContent = 'None yet...';
            li.style.opacity = '0.5';
            li.style.fontStyle = 'italic';
            sentientList.appendChild(li);
        }
        
        document.getElementById('sentient-score').textContent = sentientScore;
        
        // Update Bonus words
        const bonusWords = this.validator.getAllFoundWords().filter(w => !w.isSentient);
        const bonusList = document.getElementById('bonus-list');
        bonusList.innerHTML = '';
        
        let bonusScore = 0;
        bonusWords.forEach(wordData => {
            const li = document.createElement('li');
            li.textContent = wordData.word;
            li.title = `${wordData.points} points`;
            bonusList.appendChild(li);
            bonusScore += wordData.points;
        });
        
        if (bonusWords.length === 0) {
            const li = document.createElement('li');
            li.textContent = 'None yet...';
            li.style.opacity = '0.5';
            li.style.fontStyle = 'italic';
            bonusList.appendChild(li);
        }
        
        document.getElementById('bonus-score').textContent = bonusScore;
    }
    
    /* ==========================================
       HINT SYSTEM WITH LIMITS
       ========================================== */
    
    // Show hint for unfound word (with limits per level)
    showHint() {
        if (!this.validator || !this.wordGrid) {
            this.showFeedback('⚠️ No game in progress', 'warning');
            return;
        }
        
        // Check if hints are available
        if (this.hintsRemaining <= 0) {
            this.showFeedback('❌ No hints remaining!', 'error');
            return;
        }
        
        const unfoundWords = this.validator.getUnfoundSentientWords();
        
        if (unfoundWords.length === 0) {
            this.showFeedback('🎉 All Sentient words found!', 'info');
            return;
        }
        
        // Filter out words that have ANY found cells in their positions
        const validUnfoundWords = unfoundWords.filter(wordData => {
            // Verify wordData has positions
            if (!wordData.positions || wordData.positions.length === 0) {
                console.warn('Word without positions:', wordData.word);
                return false;
            }
            
            // Check that all positions are valid and not marked as found
            return wordData.positions.every(pos => {
                const cell = document.querySelector(
                    `[data-row="${pos.row}"][data-col="${pos.col}"]`
                );
                // Cell must exist and not be found or found-sentient
                return cell && !cell.classList.contains('found') && !cell.classList.contains('found-sentient');
            });
        });
        
        if (validUnfoundWords.length === 0) {
            this.showFeedback('💡 All remaining words share letters with found words. Keep searching!', 'info');
            return;
        }
        
        // Get random unfound word with no found cells
        const randomWord = validUnfoundWords[Math.floor(Math.random() * validUnfoundWords.length)];
        
        // Verify the word exists in the grid
        if (!randomWord.positions || randomWord.positions.length === 0) {
            console.error('Selected word has no positions:', randomWord);
            this.showFeedback('⚠️ Hint error. Try again!', 'warning');
            return;
        }
        
        // Reveal first letter position with animation
        const firstPos = randomWord.positions[0];
        const cell = document.querySelector(
            `[data-row="${firstPos.row}"][data-col="${firstPos.col}"]`
        );
        
        if (cell) {
            // Flash the cell with a distinct hint style
            cell.classList.add('selected');
            setTimeout(() => {
                cell.classList.remove('selected');
            }, 1500);
            
            // Verify the letter matches
            const expectedLetter = randomWord.word[0];
            const actualLetter = cell.textContent;
            
            if (expectedLetter !== actualLetter) {
                console.error('Hint mismatch:', {
                    word: randomWord.word,
                    expected: expectedLetter,
                    actual: actualLetter,
                    position: firstPos
                });
            }
            
            // Hint used successfully - decrease count
            this.hintsRemaining--;
            this.updateHintDisplay();
            
            this.showFeedback(`💡 Look for "${expectedLetter}..." (${randomWord.word.length} letters) | ${this.hintsRemaining} hints left`, 'info');
        } else {
            console.error('Cell not found for hint:', firstPos);
            this.showFeedback('⚠️ Hint error. Try again!', 'warning');
        }
    }
    
    // Update hint button display
    updateHintDisplay() {
        const hintBtn = document.getElementById('hint-btn');
        if (!hintBtn) return;
        
        // Update button text to show remaining hints
        hintBtn.innerHTML = `<span class="btn-icon">💡</span> Hint (${this.hintsRemaining}/${this.hintsAllowed})`;
        
        // Disable button if no hints left
        if (this.hintsRemaining <= 0) {
            hintBtn.disabled = true;
            hintBtn.style.opacity = '0.5';
            hintBtn.style.cursor = 'not-allowed';
        } else {
            hintBtn.disabled = false;
            hintBtn.style.opacity = '1';
            hintBtn.style.cursor = 'pointer';
        }
    }
    
    // Show word definition using Dobby AI
    showWordDefinition(word) {
        // PAUSE TIMER while viewing dictionary!
        this.pauseTimer();
        
        this.showModal('dictionary-modal');
        document.getElementById('dict-word').textContent = word;
        document.getElementById('dict-definition').innerHTML = '<p style="opacity:0.7">Click "Ask Dobby" to get AI-powered definition...</p>';
        this.currentDictionaryWord = word;
    }
    
    // Ask Dobby AI for word definition
    async askDobbyAboutWord() {
        const word = this.currentDictionaryWord || document.getElementById('dict-word').textContent;
        const definitionEl = document.getElementById('dict-definition');
        
        definitionEl.innerHTML = '<p style="opacity:0.7">🤖 Dobby is thinking...</p>';
        
        try {
            const definition = await this.callDobbyAI(word);
            definitionEl.innerHTML = `<p>${definition}</p>`;
        } catch (error) {
            console.error('Dobby AI Error:', error);
            definitionEl.innerHTML = `
                <p style="color:#ef4444;">Unable to reach Dobby AI. Please check your API key.</p>
                <p style="opacity:0.7;margin-top:10px;font-size:0.9em;">
                    To use this feature, set your FIREWORKS_API_KEY in the code.
                </p>
            `;
        }
    }
    
    // Call Dobby AI via secure backend proxy (Vercel serverless function)
    async callDobbyAI(word) {
        try {
            // Call our secure backend proxy instead of Fireworks directly
            // This keeps the API key private on the server
            const response = await fetch('/api/dobby', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ word })
            });
            
            if (!response.ok) {
                console.error('Dobby AI Proxy Error:', response.status);
                throw new Error(`API Error: ${response.status}`);
            }
            
            const data = await response.json();
            
            // Check for error in response
            if (data.error) {
                throw new Error(data.error);
            }
            
            // Validate response structure
            if (!data.success || !data.definition) {
                throw new Error('Invalid response from Dobby AI');
            }
            
            return data.definition;
        } catch (error) {
            console.error('Dobby AI Error:', error);
            throw error; // Re-throw to be handled by askDobbyAboutWord
        }
    }
    
    // Show feedback message
    showFeedback(message, type) {
        const feedback = document.createElement('div');
        feedback.className = `feedback feedback-${type}`;
        feedback.textContent = message;
        
        const colors = {
            success: '#10b981',
            error: '#ef4444',
            info: '#a855f7',
            warning: '#fbbf24'
        };
        
        feedback.style.cssText = `
            position: fixed;
            top: 120px;
            left: 50%;
            transform: translateX(-50%);
            background: ${colors[type] || colors.info};
            color: white;
            padding: 16px 32px;
            border-radius: 12px;
            font-weight: 700;
            font-size: 1.125rem;
            z-index: 2000;
            animation: feedbackSlide 0.3s ease;
            box-shadow: 0 8px 30px rgba(0, 0, 0, 0.4);
            border: 2px solid rgba(255, 255, 255, 0.2);
        `;
        
        document.body.appendChild(feedback);
        
        setTimeout(() => {
            feedback.style.animation = 'feedbackSlideOut 0.3s ease';
            setTimeout(() => {
                if (feedback.parentNode) {
                    document.body.removeChild(feedback);
                }
            }, 300);
        }, 2000);
    }
    
    // Show instructions modal
    showInstructions() {
        this.showModal('instructions-modal');
    }
    
    // Show stats modal with all words (found words slashed)
    showStats() {
        if (!this.validator) {
            this.showFeedback('⚠️ No game in progress', 'warning');
            return;
        }
        
        this.showModal('stats-modal');
        
        // Get all words from the grid
        const sentientWords = this.validator.getAllSentientWords();
        const bonusWords = this.validator.getAllBonusWords();
        
        // Populate Sentient words
        const sentientList = document.getElementById('stats-sentient-list');
        sentientList.innerHTML = '';
        sentientWords.forEach(wordData => {
            const div = document.createElement('div');
            div.className = 'stats-word-item' + (wordData.found ? ' found' : '');
            div.textContent = wordData.word;
            if (!wordData.found) {
                div.title = `${wordData.points} points`;
            } else {
                div.title = 'Already found!';
            }
            sentientList.appendChild(div);
        });
        
        // Populate Bonus words
        const bonusList = document.getElementById('stats-bonus-list');
        bonusList.innerHTML = '';
        bonusWords.forEach(wordData => {
            const div = document.createElement('div');
            div.className = 'stats-word-item' + (wordData.found ? ' found' : '');
            div.textContent = wordData.word;
            if (!wordData.found) {
                div.title = `${wordData.points} points`;
            } else {
                div.title = 'Already found!';
            }
            bonusList.appendChild(div);
        });
    }
    
    // Share score on Twitter/X
    shareScore() {
        const stats = this.validator.getStats();
        const levelConfig = LEVEL_CONFIG[this.currentLevel - 1];
        
        const tweetText = encodeURIComponent(
            `I scored ${this.score} points on Sentient Word Hunt! 🧠\n\n` +
            `📊 Level ${this.currentLevel}: ${levelConfig.name}\n` +
            `🌟 Words Found: ${stats.sentientFound}\n` +
            `⏱️ Time Used: ${levelConfig.timeLimit - this.timeRemaining}s\n\n` +
            `Can you beat my score?\n` +
            `#SentientWordHunt #AI #Blockchain`
        );
        
        const twitterUrl = `https://twitter.com/intent/tweet?text=${tweetText}&url=https://sentient.xyz`;
        window.open(twitterUrl, '_blank', 'width=550,height=420');
    }
    
    // Show modal
    showModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    }
    
    // Hide modal
    hideModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    }
    
    // Hide all modals
    hideAllModals() {
        document.querySelectorAll('.modal').forEach(modal => {
            modal.classList.remove('active');
        });
        document.body.style.overflow = 'auto';
    }
}

// ===== FEEDBACK ANIMATIONS =====
const style = document.createElement('style');
style.textContent = `
    @keyframes feedbackSlide {
        from {
            opacity: 0;
            transform: translateX(-50%) translateY(-20px);
        }
        to {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
        }
    }
    
    @keyframes feedbackSlideOut {
        from {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
        }
        to {
            opacity: 0;
            transform: translateX(-50%) translateY(-20px);
        }
    }
`;
document.head.appendChild(style);

// ===== INITIALIZE GAME ON PAGE LOAD =====
let game;

document.addEventListener('DOMContentLoaded', () => {
    game = new SentientWordHunt();
});

// ===== EXPOSE GAME TO WINDOW FOR DEBUGGING =====
window.SentientGame = game;
