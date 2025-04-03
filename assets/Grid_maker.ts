const { ccclass, property } = cc._decorator;

@ccclass
export default class Grid_maker extends cc.Component {
    @property
    rows: number = 10;

    @property
    cols: number = 10;

    @property
    cellSize: number = 100;

    @property(cc.Color)
    lineColor: cc.Color = cc.Color.WHITE;

    onLoad() {
        const g = this.getComponent(cc.Graphics);
        cc.log("🎯 Grid_maker 실행됨, Graphics =", g);

        // 노드 사이즈 자동 설정
        const width = this.cols * this.cellSize;
        const height = this.rows * this.cellSize;
        this.node.setContentSize(width, height);
    

        g.clear();
        g.lineWidth = 2;
        g.strokeColor = this.lineColor;

        // 세로선 그리기
        for (let i = 0; i <= this.cols; i++) {
            const x = i * this.cellSize;
            g.moveTo(x, 0);
            g.lineTo(x, height);
        }

        // 가로선 그리기
        for (let j = 0; j <= this.rows; j++) {
            const y = j * this.cellSize;
            g.moveTo(0, y);
            g.lineTo(width, y);
        }

        g.stroke();
    }
}
