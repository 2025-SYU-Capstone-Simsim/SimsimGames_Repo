const {ccclass, property} = cc._decorator;

@ccclass
export default class GameScene extends cc.Component {

    // 구멍 노드 설정 
    @property(cc.Node) moleHole1: cc.Node = null;
    @property(cc.Node) moleHole2: cc.Node = null;
    @property(cc.Node) moleHole3: cc.Node = null;
    @property(cc.Node) moleHole4: cc.Node = null;
    @property(cc.Node) moleHole5: cc.Node = null;
    @property(cc.Node) moleHole6: cc.Node = null;

    // 두더지 프리팹 설정정
    @property(cc.Prefab) molePrefab: cc.Prefab = null;

    // 점수 및 타이머 
    @property(cc.Label) scoreLabel: cc.Label = null;
    @property(cc.Label) timerLabel: cc.Label = null;

    private moleHoles: cc.Node[] = [];  // 구멍을 저장할 배열
    private score: number = 0;  // 점수
    private timer: number = 30;  // 타이머 30초

    // 게임 시작
    start() {
        // 구멍 노드 배열에 추가
        this.moleHoles = [
            this.moleHole1, this.moleHole2, this.moleHole3, 
            this.moleHole4, this.moleHole5, this.moleHole6
        ];

        // 게임 시작 시, 타이머와 점수 초기화
        this.score = 0;
        this.timer = 30;
        this.updateScoreLabel();
        this.updateTimerLabel();

        // 타이머 감소 (1초씩)
        this.schedule(this.decreaseTimer, 1);

        // 첫 번째 두더지 젠 
        this.spawnMoles();
    }

    // 타이머 감소
    decreaseTimer() {
        this.timer--;
        this.updateTimerLabel();

        if (this.timer <= 0) {
            this.gameOver();
        }
    }

    // 타이머  업데이트
    updateTimerLabel() {
        this.timerLabel.string = `Time: ${this.timer}`;
    }

    // 점수 업데이트
    updateScoreLabel() {
        this.scoreLabel.string = `Score: ${this.score}`;
    }

    // 두더지 랜덤 젠 
    spawnMoles() {
        // 일정 시간마다 두더지 생성 
        this.schedule(() => {
            const randomHoleIndex = Math.floor(Math.random() * this.moleHoles.length);  // 랜덤 인덱스
            const selectedHole = this.moleHoles[randomHoleIndex];  // 랜덤으로 선택된 구멍

            // 두더지 생성
            const mole = cc.instantiate(this.molePrefab);
            mole.name = "Mole";  
            mole.active = true;  // 두더지 활성화
            selectedHole.addChild(mole);  // 구멍에 두더지 추가

            // 두더지 잡기 클릭 이벤트 처리
            mole.on(cc.Node.EventType.TOUCH_END, this.onMoleClick, this);

            // 두더지 숨기기 (1초 후)
            this.scheduleOnce(() => {
                mole.active = false;
            }, 1);  // 1초 후 두더지 숨기기
        }, 0.5, cc.macro.REPEAT_FOREVER);  // 0.5초마다 두더지 하나씩 추가
    }

    // 두더지 잡기 클릭 이벤트 정의
    onMoleClick(event: cc.Event.EventTouch) {
        const mole = event.target;  // 클릭된 두더지

        // 이미 클릭된 두더지는 다시 클릭할 수 없도록 처리
        if (!mole.active) return;

        // 두더지 클릭 시 점수 증가
        this.score += 1;
        this.updateScoreLabel();

        // 두더지 활성화 끄기(숨기기)
        mole.active = false;
    }

    // 게임 종료
    gameOver() {
        cc.director.loadScene("GameOverScene");  // 게임 오버 후 게임 오버 씬으로 전환
    }
}
