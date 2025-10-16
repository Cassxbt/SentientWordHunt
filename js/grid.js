// =====================================================
//  WORD GRID GENERATOR
//  Creates the game board and places words
//  Built with 💜 by Cassxbt
// =====================================================

class WordGrid {
    constructor(size) {
        this.size = size;
        this.grid = [];
        this.placedWords = [];
        
        // Word placement directions (forward only, no backwards)
        // This makes the game easier and more intuitive
        this.directions = [
            { dx: 0, dy: 1 },     // Right →
            { dx: 1, dy: 0 },     // Down ↓
            { dx: 1, dy: 1 }      // Diagonal down-right ↘
        ];
        
        this.initializeGrid();
    }
    
    // Initialize empty grid with cell objects
    initializeGrid() {
        this.grid = Array(this.size).fill(null).map(() =>
            Array(this.size).fill(null).map(() => ({
                letter: '',
                words: []
            }))
        );
    }
    
    // Check if word can be placed at given position and direction
    // IMPORTANT: Words cannot overlap to prevent unfindable words
    canPlaceWord(word, row, col, direction) {
        const { dx, dy } = direction;
        
        for (let i = 0; i < word.length; i++) {
            const newRow = row + (i * dx);
            const newCol = col + (i * dy);
            
            // Check bounds
            if (newRow < 0 || newRow >= this.size || newCol < 0 || newCol >= this.size) {
                return false;
            }
            
            // CRITICAL FIX: Cell must be completely empty (no letter sharing)
            // This prevents words from crossing each other and becoming unfindable
            const cell = this.grid[newRow][newCol];
            if (cell.letter !== '') {
                return false; // Cell must be empty
            }
        }
        
        return true;
    }
    
    // Place word in grid at specified position and direction
    placeWord(word, row, col, direction, wordData) {
        const { dx, dy } = direction;
        const positions = [];
        
        for (let i = 0; i < word.length; i++) {
            const newRow = row + (i * dx);
            const newCol = col + (i * dy);
            
            // Set letter and track word placement
            this.grid[newRow][newCol].letter = word[i];
            this.grid[newRow][newCol].words.push(word);
            
            positions.push({ row: newRow, col: newCol });
        }
        
        // Store word metadata
        this.placedWords.push({
            word: word,
            positions: positions,
            found: false,
            isSentient: wordData.isSentient || false,
            multiplier: wordData.multiplier || 1,
            points: wordData.points || SCORING.bonusWord
        });
        
        return true;
    }
    
    // Attempt to place word randomly in grid
    tryPlaceWord(word, wordData, maxAttempts = 100) {
        for (let attempt = 0; attempt < maxAttempts; attempt++) {
            const row = Math.floor(Math.random() * this.size);
            const col = Math.floor(Math.random() * this.size);
            const direction = this.directions[Math.floor(Math.random() * this.directions.length)];
            
            if (this.canPlaceWord(word, row, col, direction)) {
                this.placeWord(word, row, col, direction, wordData);
                return true;
            }
        }
        
        return false;
    }
    
    // Fill empty cells with random letters
    fillEmptyCells() {
        const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        const vowels = 'AEIOU';
        const consonants = 'BCDFGHJKLMNPQRSTVWXYZ';
        
        for (let row = 0; row < this.size; row++) {
            for (let col = 0; col < this.size; col++) {
                if (this.grid[row][col].letter === '') {
                    // 40% chance of vowel, 60% chance of consonant for better playability
                    const useVowel = Math.random() < 0.4;
                    const letterSet = useVowel ? vowels : consonants;
                    this.grid[row][col].letter = letterSet[Math.floor(Math.random() * letterSet.length)];
                }
            }
        }
    }
    
    // Get letter at specific position
    getLetterAt(row, col) {
        if (row < 0 || row >= this.size || col < 0 || col >= this.size) {
            return null;
        }
        return this.grid[row][col].letter;
    }
    
    // Get all placed words
    getPlacedWords() {
        return this.placedWords;
    }
    
    // Mark word as found
    markWordFound(word) {
        const wordData = this.placedWords.find(w => w.word === word);
        if (wordData) {
            wordData.found = true;
            return wordData;
        }
        return null;
    }
    
    // Get grid statistics
    getStats() {
        const sentientWords = this.placedWords.filter(w => w.isSentient);
        const bonusWords = this.placedWords.filter(w => !w.isSentient);
        
        return {
            totalWords: this.placedWords.length,
            sentientWords: sentientWords.length,
            bonusWords: bonusWords.length,
            totalPossiblePoints: this.placedWords.reduce((sum, w) => sum + w.points, 0)
        };
    }
}

// ===== GRID GENERATION FUNCTION =====
function generateWordGrid(levelConfig = null) {
    // Use level config if provided, otherwise use default
    const gridSize = levelConfig ? levelConfig.gridSize : GRID_CONFIG.size;
    const grid = new WordGrid(gridSize);
    
    // Filter words by max length for this level (easier levels = shorter words)
    const maxLength = levelConfig && levelConfig.maxWordLength ? levelConfig.maxWordLength : 999;
    const filteredSentient = SENTIENT_WORDS.filter(w => (w.length || w.word.length) <= maxLength);
    
    // Shuffle and select Sentient words based on level or default config
    const shuffledSentient = [...filteredSentient].sort(() => Math.random() - 0.5);
    
    const minSentient = levelConfig ? levelConfig.sentientWords.min : GRID_CONFIG.minSentientWords;
    const maxSentient = levelConfig ? levelConfig.sentientWords.max : GRID_CONFIG.maxSentientWords;
    
    const numSentient = Math.floor(
        Math.random() * (maxSentient - minSentient + 1)
    ) + minSentient;
    
    const selectedSentient = shuffledSentient.slice(0, numSentient);
    
    // Place Sentient words (these are required to win)
    let placedSentientCount = 0;
    for (const wordData of selectedSentient) {
        const points = SCORING.sentientBase * wordData.multiplier;
        if (grid.tryPlaceWord(wordData.word, {
            isSentient: true,
            multiplier: wordData.multiplier,
            points: points
        })) {
            placedSentientCount++;
        }
    }
    
    // Shuffle and select bonus words based on level or default config
    const shuffledBonus = [...BONUS_WORDS].sort(() => Math.random() - 0.5);
    
    const minBonus = levelConfig ? levelConfig.bonusWords.min : GRID_CONFIG.minBonusWords;
    const maxBonus = levelConfig ? levelConfig.bonusWords.max : GRID_CONFIG.maxBonusWords;
    
    const numBonus = Math.floor(
        Math.random() * (maxBonus - minBonus + 1)
    ) + minBonus;
    
    const selectedBonus = shuffledBonus.slice(0, numBonus);
    
    // Place bonus words (optional extra points)
    let placedBonusCount = 0;
    for (const word of selectedBonus) {
        if (grid.tryPlaceWord(word, {
            isSentient: false,
            multiplier: 1,
            points: SCORING.bonusWord
        })) {
            placedBonusCount++;
        }
    }
    
    // Fill remaining empty cells with random letters
    grid.fillEmptyCells();
    
    return grid;
}

// ===== RENDER GRID TO DOM =====
function renderGrid(grid) {
    const gridElement = document.getElementById('word-grid');
    gridElement.innerHTML = '';
    
    // Set grid columns based on grid size (dynamic sizing for different levels)
    gridElement.style.gridTemplateColumns = `repeat(${grid.size}, 1fr)`;
    
    // Set CSS variable for responsive mobile sizing
    gridElement.style.setProperty('--grid-size', grid.size);
    
    // Create grid cells
    for (let row = 0; row < grid.size; row++) {
        for (let col = 0; col < grid.size; col++) {
            const letter = grid.getLetterAt(row, col);
            const cell = document.createElement('div');
            cell.className = 'letter-cell';
            cell.textContent = letter;
            cell.dataset.row = row;
            cell.dataset.col = col;
            gridElement.appendChild(cell);
        }
    }
    
    // Update total words count
    const stats = grid.getStats();
    const totalWordsElement = document.getElementById('total-words');
    if (totalWordsElement) {
        totalWordsElement.textContent = stats.sentientWords;
    }
}
