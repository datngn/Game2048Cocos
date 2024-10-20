import { _decorator, Component, Node, Vec3, EventTouch, Label, Button } from 'cc'; 
import { GridManager } from './GridManager';
const { ccclass, property } = _decorator;

@ccclass('GameManager')
export class GameManager extends Component {
    @property(GridManager)
    public gridManager: GridManager = null;

    @property(Node)
    public popup: Node = null; // Node cho pop-up

    @property(Label)
    public messageLabel: Label = null; // Label cho thông điệp

    private startTouch: Vec3 = new Vec3();
    private endTouch: Vec3 = new Vec3();
    private isGameOver: boolean = false; // Biến kiểm tra trạng thái trò chơi

    start() {
        this.node.on(Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.node.on(Node.EventType.TOUCH_END, this.onTouchEnd, this);
        console.log("Popup node:", this.popup); // Kiểm tra giá trị của popup
        console.log("test 2");
        console.log("Label: ", this.messageLabel);

        this.popup.active = false; // Ẩn pop-up khi bắt đầu

        const restartButton = this.popup.getChildByName('RestartButton');
        restartButton.on(Button.EventType.CLICK, this.onRestartGame, this);
    }

    onTouchStart(event: EventTouch) {
        const location = event.getLocation();
        this.startTouch = new Vec3(location.x, location.y, 0); // Thêm z = 0
        console.log("touchStart");
    }

    onTouchEnd(event: EventTouch) {
        const location = event.getLocation();
        this.endTouch = new Vec3(location.x, location.y, 0); // Thêm z = 0
        console.log("touchEnd");
        
        this.handleSwipe();
    }

    handleSwipe() {
        const deltaX = this.endTouch.x - this.startTouch.x;
        const deltaY = this.endTouch.y - this.startTouch.y;

        const absDeltaX = Math.abs(deltaX);
        const absDeltaY = Math.abs(deltaY);

        // Kiểm tra nếu vuốt chéo 45 độ
        if (absDeltaX > 10 && absDeltaY > 10) { // 10 là ngưỡng tối thiểu để phát hiện vuốt
            if (absDeltaX > absDeltaY) {
                // Vuốt theo chiều ngang
                if (deltaX > 0) {
                    this.gridManager.moveRight();
                } else {
                    this.gridManager.moveLeft();
                }
            } else {
                // Vuốt theo chiều dọc
                if (deltaY < 0) {
                    this.gridManager.moveUp();
                } else {
                    this.gridManager.moveDown();
                }
            }
        }

        this.checkGameStatus();
    }

    checkGameStatus() {
        if (this.gridManager.isWinConditionMet()) {
            this.isGameOver = true;
            this.displayWinMessage();
        } else if (this.gridManager.isLoseConditionMet()) {
            this.isGameOver = true;
            this.displayLoseMessage();
        }
    }

    displayWinMessage() {
        this.showPopup("Bạn đã thắng!");
        // Thêm logic hiển thị thông báo thắng (ví dụ: popup, chuyển cảnh)
    }

    displayLoseMessage() {
        this.showPopup("Bạn đã thua!");
        // Thêm logic hiển thị thông báo thua (ví dụ: popup, chuyển cảnh)
    }

    showPopup(message) {
        this.messageLabel.string = message; // Cập nhật thông điệp
        this.popup.active = true; // Hiện pop-up
    }

    onRestartGame() {
        this.popup.active = false; // Đóng pop-up
        this.gridManager.resetGame(); // Thêm logic để khởi động lại trò chơi
        this.isGameOver = false; // Đặt lại trạng thái trò chơi
    }
}
