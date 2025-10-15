// =====================================================
//  INPUT HANDLER
//  Handles mouse and touch interactions for smooth word selection
//  Built with 💜 by Cassxbt
// =====================================================

class InputHandler {
    constructor(gridElement, canvasDrawer, onSelectionComplete) {
        this.gridElement = gridElement;
        this.canvasDrawer = canvasDrawer;
        this.onSelectionComplete = onSelectionComplete;
        
        // Selection state
        this.isSelecting = false;
        this.selectedCells = [];
        this.currentCell = null;
        
        this.initializeEventListeners();
    }
    
    // Setup event listeners for mouse and touch
    initializeEventListeners() {
        // Mouse events
        this.gridElement.addEventListener('mousedown', (e) => this.handleStart(e));
        document.addEventListener('mousemove', (e) => this.handleMove(e));
        document.addEventListener('mouseup', (e) => this.handleEnd(e));
        
        // Touch events (with preventDefault to avoid scrolling)
        this.gridElement.addEventListener('touchstart', (e) => {
            e.preventDefault();
            this.handleStart(e.touches[0]);
        }, { passive: false });
        
        document.addEventListener('touchmove', (e) => {
            if (this.isSelecting) {
                e.preventDefault();
                this.handleMove(e.touches[0]);
            }
        }, { passive: false });
        
        document.addEventListener('touchend', (e) => {
            e.preventDefault();
            this.handleEnd(e);
        }, { passive: false });
        
        // Prevent context menu on long press
        this.gridElement.addEventListener('contextmenu', (e) => {
            e.preventDefault();
        });
    }
    
    // Handle selection start
    handleStart(event) {
        const cell = this.getCellFromEvent(event);
        if (!cell) return;
        
        // Don't allow selecting already found cells
        if (cell.classList.contains('found') || cell.classList.contains('found-sentient')) {
            return;
        }
        
        this.isSelecting = true;
        this.selectedCells = [cell];
        this.currentCell = cell;
        cell.classList.add('selected');
        
        this.canvasDrawer.startDrawing(
            event.clientX || event.pageX,
            event.clientY || event.pageY
        );
    }
    
    // Handle selection move
    handleMove(event) {
        if (!this.isSelecting) return;
        
        const cell = this.getCellFromEvent(event);
        if (!cell) return;
        
        // Don't allow selecting already found cells
        if (cell.classList.contains('found') || cell.classList.contains('found-sentient')) {
            return;
        }
        
        // If it's the same cell, no need to do anything
        if (cell === this.currentCell) return;
        
        // Check if cell is adjacent to last selected cell
        if (this.isAdjacent(this.currentCell, cell)) {
            // Check if cell is already selected (allow backtracking)
            const index = this.selectedCells.indexOf(cell);
            
            if (index !== -1) {
                // Backtracking - remove cells after this one
                for (let i = this.selectedCells.length - 1; i > index; i--) {
                    this.selectedCells[i].classList.remove('selected');
                    this.selectedCells.pop();
                }
            } else {
                // Prevent selecting same cell twice in a row (but allow backtracking)
                if (!this.selectedCells.includes(cell)) {
                    // New cell - add to selection
                    this.selectedCells.push(cell);
                    cell.classList.add('selected');
                }
            }
            
            this.currentCell = cell;
            this.canvasDrawer.drawSelectedCells(this.selectedCells);
        }
    }
    
    // Handle selection end
    handleEnd(event) {
        if (!this.isSelecting) return;
        
        this.isSelecting = false;
        this.canvasDrawer.stopDrawing();
        this.canvasDrawer.clear();
        
        // Get selected word
        const word = this.selectedCells.map(cell => cell.textContent).join('');
        const positions = this.selectedCells.map(cell => ({
            row: parseInt(cell.dataset.row),
            col: parseInt(cell.dataset.col)
        }));
        
        // Clear selection visuals
        this.selectedCells.forEach(cell => cell.classList.remove('selected'));
        
        // Callback with selected word (minimum 3 letters)
        if (this.onSelectionComplete && word.length >= 3) {
            this.onSelectionComplete(word, positions);
        }
        
        // Reset state
        this.selectedCells = [];
        this.currentCell = null;
    }
    
    // Get cell element from event coordinates
    getCellFromEvent(event) {
        const x = event.clientX || event.pageX;
        const y = event.clientY || event.pageY;
        const element = document.elementFromPoint(x, y);
        
        if (element && element.classList.contains('letter-cell')) {
            return element;
        }
        return null;
    }
    
    // Check if two cells are adjacent (horizontal, vertical, and diagonal - smooth selection)
    isAdjacent(cell1, cell2) {
        if (!cell1 || !cell2) return false;
        
        const row1 = parseInt(cell1.dataset.row);
        const col1 = parseInt(cell1.dataset.col);
        const row2 = parseInt(cell2.dataset.row);
        const col2 = parseInt(cell2.dataset.col);
        
        const rowDiff = row2 - row1;  // Signed difference
        const colDiff = col2 - col1;  // Signed difference
        
        const absRowDiff = Math.abs(rowDiff);
        const absColDiff = Math.abs(colDiff);
        
        // Allow only forward/downward directions for smooth, non-confusing selection:
        // 1. Right: same row, one column to the right (0, +1)
        // 2. Down: same column, one row down (+1, 0)
        // 3. Diagonal down-right: one row down, one column right (+1, +1)
        // Also allow same movements in reverse for backtracking
        
        // Must be adjacent (within 1 cell in both directions)
        if (absRowDiff > 1 || absColDiff > 1) return false;
        
        // Can't be the same cell
        if (absRowDiff === 0 && absColDiff === 0) return false;
        
        // Allowed directions (and their reverse for backtracking):
        // Right: rowDiff = 0, colDiff = ±1
        // Down: rowDiff = ±1, colDiff = 0
        // Diagonal: rowDiff = ±1, colDiff = ±1 (but must be same sign for smooth diagonal)
        
        return true; // Allow all adjacent cells for smooth selection
    }
    
    // Reset input handler state
    reset() {
        this.isSelecting = false;
        this.selectedCells.forEach(cell => cell.classList.remove('selected'));
        this.selectedCells = [];
        this.currentCell = null;
        this.canvasDrawer.clear();
    }
    
    // Disable input temporarily
    disable() {
        this.isSelecting = false;
        this.gridElement.style.pointerEvents = 'none';
    }
    
    // Re-enable input
    enable() {
        this.gridElement.style.pointerEvents = 'auto';
    }
}
