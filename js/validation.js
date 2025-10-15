// =====================================================
//  WORD VALIDATOR
//  Checks if selected words are valid and tracks progress
//  Built with 💜 by Cassxbt
// =====================================================

class WordValidator {
    constructor(wordGrid) {
        this.wordGrid = wordGrid;
        this.foundWords = new Set(); // Tracks words already found
    }
    
    // Validate if selected word is in the grid
    validateWord(word, positions) {
        // Check minimum length
        if (word.length < 3) {
            return {
                valid: false,
                reason: 'too_short',
                message: 'Word must be at least 3 letters'
            };
        }
        
        // Check if word has already been found
        if (this.foundWords.has(word)) {
            return {
                valid: false,
                reason: 'already_found',
                message: 'Already found!'
            };
        }
        
        // Check if word is in placed words
        const placedWord = this.wordGrid.placedWords.find(w => w.word === word);
        
        if (placedWord && !placedWord.found) {
            // Verify positions match the placed word
            if (this.verifyPositions(placedWord.positions, positions)) {
                this.foundWords.add(word);
                this.wordGrid.markWordFound(word);
                
                return {
                    valid: true,
                    wordData: placedWord,
                    message: this.getSuccessMessage(placedWord)
                };
            }
        }
        
        return {
            valid: false,
            reason: 'not_found',
            message: 'Not in word list'
        };
    }
    
    // Get appropriate success message based on word type
    getSuccessMessage(wordData) {
        if (wordData.isSentient) {
            const messages = [
                `🧠 Sentient word! +${wordData.points} points`,
                `⚡ Amazing! +${wordData.points} points`,
                `🎯 Perfect! +${wordData.points} points`,
                `✨ Brilliant! +${wordData.points} points`
            ];
            return messages[Math.floor(Math.random() * messages.length)];
        } else {
            const messages = [
                `💎 Nice! +${wordData.points} points`,
                `👍 Good find! +${wordData.points} points`,
                `✓ Bonus word! +${wordData.points} points`
            ];
            return messages[Math.floor(Math.random() * messages.length)];
        }
    }
    
    // Verify that selected positions match placed word positions
    verifyPositions(placedPositions, selectedPositions) {
        if (placedPositions.length !== selectedPositions.length) {
            return false;
        }
        
        // Check if all positions match (forward or backward)
        const forwardMatch = placedPositions.every((pos, i) => 
            pos.row === selectedPositions[i].row && 
            pos.col === selectedPositions[i].col
        );
        
        const backwardMatch = placedPositions.every((pos, i) => 
            pos.row === selectedPositions[selectedPositions.length - 1 - i].row && 
            pos.col === selectedPositions[selectedPositions.length - 1 - i].col
        );
        
        return forwardMatch || backwardMatch;
    }
    
    // Get count of found Sentient words
    getSentientWordsFound() {
        const sentientWords = this.wordGrid.placedWords.filter(w => 
            w.isSentient && w.found
        );
        return sentientWords.length;
    }
    
    // Get total count of Sentient words in grid
    getTotalSentientWords() {
        return this.wordGrid.placedWords.filter(w => w.isSentient).length;
    }
    
    // Get count of found bonus words
    getBonusWordsFound() {
        const bonusWords = this.wordGrid.placedWords.filter(w => 
            !w.isSentient && w.found
        );
        return bonusWords.length;
    }
    
    // Get total count of bonus words in grid
    getTotalBonusWords() {
        return this.wordGrid.placedWords.filter(w => !w.isSentient).length;
    }
    
    // Get all found words
    getAllFoundWords() {
        return this.wordGrid.placedWords.filter(w => w.found);
    }
    
    // Get all Sentient words (found and unfound)
    getAllSentientWords() {
        return this.wordGrid.placedWords.filter(w => w.isSentient);
    }
    
    // Get all bonus words (found and unfound)
    getAllBonusWords() {
        return this.wordGrid.placedWords.filter(w => !w.isSentient);
    }
    
    // Get unfound Sentient words
    getUnfoundSentientWords() {
        return this.wordGrid.placedWords.filter(w => w.isSentient && !w.found);
    }
    
    // Get unfound bonus words
    getUnfoundBonusWords() {
        return this.wordGrid.placedWords.filter(w => !w.isSentient && !w.found);
    }
    
    // Check if game is complete (all Sentient words found)
    isGameComplete() {
        const sentientWords = this.wordGrid.placedWords.filter(w => w.isSentient);
        return sentientWords.length > 0 && sentientWords.every(w => w.found);
    }
    
    // Get completion percentage
    getCompletionPercentage() {
        const total = this.getTotalSentientWords();
        const found = this.getSentientWordsFound();
        return total > 0 ? Math.round((found / total) * 100) : 0;
    }
    
    // Get game statistics
    getStats() {
        return {
            totalWords: this.wordGrid.placedWords.length,
            foundWords: this.getAllFoundWords().length,
            sentientFound: this.getSentientWordsFound(),
            sentientTotal: this.getTotalSentientWords(),
            bonusFound: this.getBonusWordsFound(),
            bonusTotal: this.getTotalBonusWords(),
            completion: this.getCompletionPercentage()
        };
    }
    
    // Reset validator state
    reset() {
        this.foundWords.clear();
    }
}
