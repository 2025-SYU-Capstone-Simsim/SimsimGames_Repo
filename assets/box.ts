import type Tester from './tester';
const { ccclass, property } = cc._decorator;
@ccclass
export default class Box extends cc.Component {
    tester: Tester = null;
    @property row: number = 0;
    @property col: number = 0;
    @property({ type: cc.Color })
    boxColor: cc.Color = cc.Color.RED;
    @property cellSize: number = 100;  

    @property maxRows: number = 10;
    @property maxCols: number = 10;
    @property({ type: cc.Integer })
    widthInCells: number = 1;

    @property({ type: cc.Integer })
    heightInCells: number = 1;
    private startPos: cc.Vec2 = null;

    onLoad() {
        if (!this.node.getComponent(cc.BlockInputEvents)) {
            this.node.addComponent(cc.BlockInputEvents); // 
        }
    
        this.node.anchorX = 0.5;
        this.node.anchorY = 0.5;
    
        this.drawBox(); //
        this.setGridPosition(this.row, this.col); 
    
        this.node.on(cc.Node.EventType.TOUCH_START, this.onTouchStart, this); // ✅ 드래그 시작
        this.node.on(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this);     // ✅ 드래그 끝
    }
    

    drawBox() {
        const g = this.node.addComponent(cc.Graphics);
        g.clear();
        g.fillColor = this.boxColor;
        g.rect(-this.cellSize / 2, -this.cellSize / 2, this.cellSize, this.cellSize);
        g.fill();
    }

    setGridPosition(row: number, col: number) {
        
        this.row = row;
        this.col = col;
    
        const x = (col + 0.5) * this.cellSize;
        const y = (row + 0.5) * this.cellSize;
        this.node.setPosition(x, y);
    }
    

    moveBy(dx: number, dy: number) {
        
        
        const newRow = this.row + dy;
        const newCol = this.col + dx;
    
        
        if (!this.tester) return;
    
        
        if (!this.tester.canMoveTo(newRow, newCol, this)) return;
    
        
        this.tester.markBoxOnGrid(this, 0);
    
        
        this.setGridPosition(newRow, newCol);
    
        
        this.tester.markBoxOnGrid(this, 1);
    }
    

    onTouchStart(event: cc.Event.EventTouch) {
        this.startPos = event.getLocation();
        this.node.zIndex = Date.now();  // 또는 무작위로 10000 넘게 설정해도 됩니다
    }
    

    onTouchEnd(event: cc.Event.EventTouch) {
        console.log("!!!!! 마우스는 인식함")
        const endPos = event.getLocation();
        const delta = endPos.sub(this.startPos);

        const threshold = 30; // 

        if (Math.abs(delta.x) > Math.abs(delta.y)) {
            // 좌우 방향
            if (delta.x > threshold) this.moveBy(1, 0);
            else if (delta.x < -threshold) this.moveBy(-1, 0);
        } else {
            // 상하 방향
            if (delta.y > threshold) this.moveBy(0, 1);  // 위로
            else if (delta.y < -threshold) this.moveBy(0, -1);  // 아래로
        }
        this.startPos = null;
    }
}