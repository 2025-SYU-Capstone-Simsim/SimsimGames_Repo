// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator;

@ccclass
export default class UIManager extends cc.Component {
    // Inspector에서 연결할 각 버튼 노드
    @property(cc.Node)
    startButton: cc.Node = null;

    @property(cc.Node)
    retryButton: cc.Node = null;

    @property(cc.Node)
    exitButton: cc.Node = null;

    onLoad(): void {
        // 각 버튼에 터치 또는 클릭 이벤트 핸들러 등록
        this.startButton.on(cc.Node.EventType.TOUCH_END, this.onStart, this);
        this.retryButton.on(cc.Node.EventType.TOUCH_END, this.onRetry, this);
        this.exitButton.on(cc.Node.EventType.TOUCH_END, this.onExit, this);
    }

    onStart(): void {
        cc.log("Start 버튼 클릭됨");
        // 씬 내에서 GameManager 노드를 찾아 startGame() 메서드를 호출
        const gmNode = cc.find("GameManager");
        if (gmNode) {
            const gameManager = gmNode.getComponent("GameManager");
            if (gameManager) {
                gameManager.startGame();
            } else {
                cc.error("GameManager 컴포넌트를 찾을 수 없습니다.");
            }
        } else {
            cc.error("GameManager 노드가 씬에 없습니다.");
        }
        // 시작 버튼(및 관련 UI)을 숨김 처리
        this.startButton.active = false;
    }

    onRetry(): void {
        cc.log("Retry 버튼 클릭됨");
        cc.director.loadScene("GameScene");
    }

    onExit(): void {
        cc.log("Exit 버튼 클릭됨");
        if (CC_JSB) {
            cc.game.end();
        } else {
            cc.log("웹 환경에서는 종료 기능이 지원되지 않습니다.");
            // 웹 환경의 경우 메인 메뉴 등 대체 처리를 구현할 수 있습니다.
        }
    }
}