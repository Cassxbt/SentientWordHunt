// =====================================================
//  CANVAS DRAWER
//  Creates beautiful gradient lines when selecting words
//  Built with 💜 by Cassxbt
// =====================================================

class SelectionCanvas {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) {
            console.error(`Canvas with id "${canvasId}" not found`);
            return;
        }
        
        this.ctx = this.canvas.getContext('2d');
        this.isDrawing = false;
        this.path = []; // Stores the selection path
        
        // Set up canvas size
        this.resizeCanvas();
        window.addEventListener('resize', () => this.resizeCanvas());
    }
    
    // Resize canvas to match parent container
    resizeCanvas() {
        if (!this.canvas) return;
        
        const gridWrapper = this.canvas.parentElement;
        const rect = gridWrapper.getBoundingClientRect();
        
        // Set canvas size to match container
        this.canvas.width = rect.width;
        this.canvas.height = rect.height;
    }
    
    // Clear entire canvas
    clear() {
        if (!this.ctx) return;
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.path = [];
    }
    
    // Start drawing path
    startDrawing(x, y) {
        this.isDrawing = true;
        this.path = [{ x, y }];
    }
    
    // Continue drawing path
    continueDraw(x, y) {
        if (!this.isDrawing) return;
        
        this.path.push({ x, y });
        this.draw();
    }
    
    // Stop drawing
    stopDrawing() {
        this.isDrawing = false;
        this.path = [];
    }
    
    // Draw the selection line with gradient
    draw() {
        if (!this.ctx) return;
        
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        if (this.path.length < 2) return;
        
        // Create gradient based on Sentient.xyz theme
        const gradient = this.ctx.createLinearGradient(
            this.path[0].x, this.path[0].y,
            this.path[this.path.length - 1].x, this.path[this.path.length - 1].y
        );
        gradient.addColorStop(0, '#a855f7');    // Purple
        gradient.addColorStop(0.5, '#d946ef');  // Magenta
        gradient.addColorStop(1, '#ec4899');    // Pink
        
        // Configure line style
        this.ctx.strokeStyle = gradient;
        this.ctx.lineWidth = 8;
        this.ctx.lineCap = 'round';
        this.ctx.lineJoin = 'round';
        this.ctx.shadowColor = '#a855f7';
        this.ctx.shadowBlur = 20;
        
        // Draw path
        this.ctx.beginPath();
        this.ctx.moveTo(this.path[0].x, this.path[0].y);
        
        for (let i = 1; i < this.path.length; i++) {
            this.ctx.lineTo(this.path[i].x, this.path[i].y);
        }
        
        this.ctx.stroke();
    }
    
    // Draw line between two specific cells
    drawConnectionLine(startCell, endCell) {
        if (!this.ctx || !startCell || !endCell) return;
        
        const startRect = startCell.getBoundingClientRect();
        const endRect = endCell.getBoundingClientRect();
        const canvasRect = this.canvas.getBoundingClientRect();
        
        // Calculate center points
        const startX = startRect.left - canvasRect.left + startRect.width / 2;
        const startY = startRect.top - canvasRect.top + startRect.height / 2;
        const endX = endRect.left - canvasRect.left + endRect.width / 2;
        const endY = endRect.top - canvasRect.top + endRect.height / 2;
        
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Create gradient
        const gradient = this.ctx.createLinearGradient(startX, startY, endX, endY);
        gradient.addColorStop(0, '#a855f7');
        gradient.addColorStop(1, '#d946ef');
        
        // Draw line
        this.ctx.strokeStyle = gradient;
        this.ctx.lineWidth = 8;
        this.ctx.lineCap = 'round';
        this.ctx.shadowColor = '#a855f7';
        this.ctx.shadowBlur = 20;
        
        this.ctx.beginPath();
        this.ctx.moveTo(startX, startY);
        this.ctx.lineTo(endX, endY);
        this.ctx.stroke();
    }
    
    // Draw connections through multiple selected cells
    drawSelectedCells(selectedCells) {
        if (!this.ctx) return;
        
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        if (selectedCells.length < 2) return;
        
        const canvasRect = this.canvas.getBoundingClientRect();
        const points = [];
        
        // Get center points of all selected cells
        for (const cell of selectedCells) {
            const rect = cell.getBoundingClientRect();
            points.push({
                x: rect.left - canvasRect.left + rect.width / 2,
                y: rect.top - canvasRect.top + rect.height / 2
            });
        }
        
        // Create multi-color gradient
        const gradient = this.ctx.createLinearGradient(
            points[0].x, points[0].y,
            points[points.length - 1].x, points[points.length - 1].y
        );
        gradient.addColorStop(0, '#a855f7');
        gradient.addColorStop(0.5, '#d946ef');
        gradient.addColorStop(1, '#ec4899');
        
        // Configure line style
        this.ctx.strokeStyle = gradient;
        this.ctx.lineWidth = 8;
        this.ctx.lineCap = 'round';
        this.ctx.lineJoin = 'round';
        this.ctx.shadowColor = '#a855f7';
        this.ctx.shadowBlur = 20;
        
        // Draw path through all points
        this.ctx.beginPath();
        this.ctx.moveTo(points[0].x, points[0].y);
        
        for (let i = 1; i < points.length; i++) {
            this.ctx.lineTo(points[i].x, points[i].y);
        }
        
        this.ctx.stroke();
        
        // Draw dots at each cell center for better visual feedback
        for (const point of points) {
            this.ctx.beginPath();
            this.ctx.arc(point.x, point.y, 4, 0, Math.PI * 2);
            this.ctx.fillStyle = '#ffffff';
            this.ctx.shadowBlur = 10;
            this.ctx.fill();
        }
    }
    
    // Reset canvas state
    reset() {
        this.clear();
        this.stopDrawing();
    }
}
