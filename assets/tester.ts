const { ccclass, property } = cc._decorator;

import Box from "./box";

@ccclass
export default class Tester extends cc.Component {
    @property({ type: cc.Integer })
    rows: number = 10;

    @property({ type: cc.Integer })
    cols: number = 10;

    @property({ type: [cc.Node] })
    boxNodes: cc.Node[] = [];

    private grid: number[][] = [];

    onLoad() {
        this.grid = Array.from({ length: this.rows }, () => Array(this.cols).fill(0));

        for (const boxNode of this.boxNodes) {
            const box = boxNode.getComponent(Box);
            box.tester = this;
            box.setGridPosition(box.row, box.col);
            this.markBoxOnGrid(box, 1);
        }
    }

    markBoxOnGrid(box: Box, value: number) {
        for (let r = 0; r < box.heightInCells; r++) {
            for (let c = 0; c < box.widthInCells; c++) {
                const row = box.row + r;
                const col = box.col + c;
                if (row >= 0 && row < this.rows && col >= 0 && col < this.cols) {
                    this.grid[row][col] = value;
                }
            }
        }
    }

    canMoveTo(newRow: number, newCol: number, box: Box): boolean {
        // 새 위치가 격자를 벗어나는지 먼저 검사
        if (
            newRow < 0 ||
            newCol < 0 ||
            newRow + box.heightInCells > this.rows ||
            newCol + box.widthInCells > this.cols
        ) {
            return false;
        }

        for (let r = 0; r < box.heightInCells; r++) {
            for (let c = 0; c < box.widthInCells; c++) {
                const row = newRow + r;
                const col = newCol + c;
                if (
                    row < 0 || row >= this.rows ||
                    col < 0 || col >= this.cols ||
                    this.grid[row][col] !== 0
                ) {
                    return false;
                }
            }
        }

        return true;
    }
}