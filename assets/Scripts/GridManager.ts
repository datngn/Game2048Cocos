import { _decorator, Component, Node, Vec3, Prefab, instantiate } from 'cc';
import { Tile } from './Tile';
const { ccclass, property } = _decorator;

@ccclass('GridManager')
export class GridManager extends Component {
    @property(Node)
    public gridNode: Node = null; // Node chứa lưới
    @property(Prefab)
    public tilePrefab: Prefab = null; // Prefab ô vuông

    private gridSize = 4; // Kích thước lưới 4x4
    private tileSize = 100; // Kích thước mỗi ô vuông
    private startX = -180;
    private startY = -180;
    private spacing = 20; // Khoảng cách giữa các ô
    private gridData: number[][] = [];

    start() {
        this.initGrid();
        this.addRandomTile();
        this.addRandomTile();
        this.updateGridDisplay();
    }

    initGrid() {
        this.gridData = Array.from({ length: this.gridSize }, () => Array(this.gridSize).fill(0));
    }

    addRandomTile() {
        const emptyCells = [];
        for (let i = 0; i < this.gridSize; i++) {
            for (let j = 0; j < this.gridSize; j++) {
                if (this.gridData[i][j] === 0) {
                    emptyCells.push({ x: j, y: i });
                }
            }
        }
        if (emptyCells.length > 0) {
            const { x, y } = emptyCells[Math.floor(Math.random() * emptyCells.length)];
            this.gridData[y][x] = Math.random() < 0.5 ? 2 : 4;
            this.updateGridDisplay();
        }
    }

    updateGridDisplay() {
        this.gridNode.removeAllChildren();
        for (let i = 0; i < this.gridSize; i++) {
            for (let j = 0; j < this.gridSize; j++) {
                const tile = instantiate(this.tilePrefab).getComponent(Tile);
                const position = new Vec3(
                    this.startX + j * (this.tileSize + this.spacing),
                    this.startY + i * (this.tileSize + this.spacing),
                    0
                );
                tile.setValue(this.gridData[i][j]);
                tile.node.setPosition(position);
                this.gridNode.addChild(tile.node);
            }
        }
    }

    // Thêm các phương thức di chuyển (moveLeft, moveRight, moveUp, moveDown) ở đây

    moveLeft() {
        let moved = false; // Biến để kiểm tra có di chuyển hay không
    
        for (let row = 0; row < this.gridSize; row++) {
            let newRow = this.gridData[row].filter(value => value !== 0); // Lọc các ô không rỗng
            let mergedRow = [];
    
            for (let i = 0; i < newRow.length; i++) {
                // Kiểm tra có thể hợp nhất hai ô không
                if (i < newRow.length - 1 && newRow[i] === newRow[i + 1]) {
                    mergedRow.push(newRow[i] * 2);
                    moved = true; // Đánh dấu đã di chuyển
                    i++; // Bỏ qua ô đã hợp nhất
                } else {
                    mergedRow.push(newRow[i]);
                }
            }
    
            // Thêm các ô rỗng vào cuối
            while (mergedRow.length < this.gridSize) {
                mergedRow.push(0);
            }
    
            // Cập nhật mảng gridData và kiểm tra di chuyển
            if (JSON.stringify(this.gridData[row]) !== JSON.stringify(mergedRow)) {
                moved = true; // Đánh dấu đã di chuyển
            }
            this.gridData[row] = mergedRow; // Cập nhật hàng
        }
    
        if (moved) {
            this.addRandomTile(); // Thêm ô mới sau khi di chuyển
        }
        
        this.updateGridDisplay(); // Cập nhật hiển thị
    }
    
    
    moveRight() {
        let moved = false;
    
        for (let row = 0; row < this.gridSize; row++) {
            let newRow = this.gridData[row].filter(value => value !== 0).reverse(); // Lọc và đảo ngược
            let mergedRow = [];
    
            for (let i = 0; i < newRow.length; i++) {
                if (i < newRow.length - 1 && newRow[i] === newRow[i + 1]) {
                    mergedRow.push(newRow[i] * 2);
                    moved = true;
                    i++;
                } else {
                    mergedRow.push(newRow[i]);
                }
            }
    
            while (mergedRow.length < this.gridSize) {
                mergedRow.push(0);
            }
    
            mergedRow.reverse(); // Đảo ngược lại trước khi cập nhật
            if (JSON.stringify(this.gridData[row]) !== JSON.stringify(mergedRow)) {
                moved = true;
            }
            this.gridData[row] = mergedRow;
        }
    
        if (moved) {
            this.addRandomTile();
        }
    
        this.updateGridDisplay();
    }
    
    
    moveUp() {
        let moved = false;
    
        for (let col = 0; col < this.gridSize; col++) {
            let newCol = this.gridData.map(row => row[col]).filter(value => value !== 0); // Lấy cột và lọc
            let mergedCol = [];
    
            for (let i = 0; i < newCol.length; i++) {
                if (i < newCol.length - 1 && newCol[i] === newCol[i + 1]) {
                    mergedCol.push(newCol[i] * 2);
                    moved = true;
                    i++;
                } else {
                    mergedCol.push(newCol[i]);
                }
            }
    
            while (mergedCol.length < this.gridSize) {
                mergedCol.push(0);
            }
    
            for (let i = 0; i < this.gridSize; i++) {
                if (this.gridData[i][col] !== mergedCol[i]) {
                    moved = true;
                }
                this.gridData[i][col] = mergedCol[i]; // Cập nhật cột
            }
        }
    
        if (moved) {
            this.addRandomTile();
        }
    
        this.updateGridDisplay();
    }
    
    
    moveDown() {
        let moved = false;
    
        for (let col = 0; col < this.gridSize; col++) {
            let newCol = this.gridData.map(row => row[col]).filter(value => value !== 0).reverse(); // Lọc và đảo ngược
            let mergedCol = [];
    
            for (let i = 0; i < newCol.length; i++) {
                if (i < newCol.length - 1 && newCol[i] === newCol[i + 1]) {
                    mergedCol.push(newCol[i] * 2);
                    moved = true;
                    i++;
                } else {
                    mergedCol.push(newCol[i]);
                }
            }
    
            while (mergedCol.length < this.gridSize) {
                mergedCol.push(0);
            }
    
            mergedCol.reverse(); // Đảo ngược lại trước khi cập nhật
            for (let i = 0; i < this.gridSize; i++) {
                if (this.gridData[i][col] !== mergedCol[i]) {
                    moved = true;
                }
                this.gridData[i][col] = mergedCol[i]; // Cập nhật cột
            }
        }
    
        if (moved) {
            this.addRandomTile();
        }
    
        this.updateGridDisplay();
    }

    isWinConditionMet() {
        // Kiểm tra xem có ô nào có giá trị 2048 hay không
        for (let row of this.gridData) {
            for (let tile of row) {
                if (tile === 2048) {
                    return true; // Đã thắng
                }
            }
        }
        return false; // Chưa thắng
    }

    isLoseConditionMet() {
        // Kiểm tra xem có còn nước đi nào không
        if (this.hasEmptyCells() || this.canMerge()) {
            return false; // Còn nước đi
        }
        return true; // Không còn nước đi
    }

    hasEmptyCells() {
        // Kiểm tra nếu có ô trống
        for (let row of this.gridData) {
            for (let tile of row) {
                if (tile === 0) {
                    return true; // Có ô trống
                }
            }
        }
        return false; // Không có ô trống
    }

    canMerge() {
        // Kiểm tra nếu có ô nào có thể hợp nhất
        for (let row = 0; row < this.gridData.length; row++) {
            for (let col = 0; col < this.gridData[row].length; col++) {
                const tile = this.gridData[row][col];
                if (tile === 0) continue;

                // Kiểm tra ô bên phải
                if (col < this.gridData[row].length - 1 && tile === this.gridData[row][col + 1]) {
                    return true; // Có thể hợp nhất với ô bên phải
                }

                // Kiểm tra ô bên dưới
                if (row < this.gridData.length - 1 && tile === this.gridData[row + 1][col]) {
                    return true; // Có thể hợp nhất với ô bên dưới
                }
            }
        }
        return false; // Không thể hợp nhất
    }
    
    resetGame() {
        this.initGrid();
        this.addRandomTile();
        this.addRandomTile();
        this.updateGridDisplay();
        console.log("restart");
    }

    initializeGrid() {
        // Logic để khởi tạo lưới, đặt lại giá trị ô
        // Ví dụ: Tạo lưới mới và thêm hai ô đầu tiên
    }
}
