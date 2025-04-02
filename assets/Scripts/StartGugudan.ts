const { ccclass, property } = cc._decorator;

// 구구단 게임 씬
@ccclass
export default class MultiplicationGame extends cc.Component {
    @property(cc.Label) questionLabel: cc.Label = null;  // 문제 
    @property(cc.Label) timerLabel: cc.Label = null;     // 타이머 
    @property(cc.Label) scoreLabel: cc.Label = null;     // 점수 
    @property(cc.Label) answerLabel: cc.Label = null;    // 정답/오답 확인 라벨 

    @property([cc.Button]) optionButtons: cc.Button[] = []; // 4개의 보기 버튼
    @property(cc.Button) startButton: cc.Button = null; // 시작 버튼

    private currentAnswer: number = 0;  // 현재 문제의 정답
    private currentQuestionIndex: number = 0;  // 현재 문제 인덱스
    private score: number = 0;   // 맞춘 개수
    private timer: number = 5;   // 제한 시간

   // 게임 시작 버튼 누르면 게임이 실행되도록 
    start() {
        this.resetUI();
        this.startButton.node.active = true;

        // 시작 버튼 이벤트 
        this.startButton.node.on('click', this.onStartGame, this);

        // 옵션 버튼 이벤트 한 번만 등록
        for (let i = 0; i < this.optionButtons.length; i++) {
            this.optionButtons[i].node.on('click', this.onOptionClicked, this);
        }
    }

    // 게임 시작
    onStartGame() {
        this.startButton.node.active = false;
        this.score = 0;
        this.currentQuestionIndex = 1;
        this.loadNextQuestion();
    }

    loadNextQuestion() {
        const [question, answer] = this.generateRandomQuestion();
        this.currentAnswer = answer;
        this.questionLabel.string = `${question}`;

        // 타이머 설정 (문제가 넘어갈수록 1초씩 줄어들게 설정정)
        this.timer = 8 - this.currentQuestionIndex;
        this.updateTimerLabel();

        // 보기에 정답,오답 랜덤 배치
        const randomOptions = this.generateRandomOptions(answer);

        // 각 버튼에 대한 설정
        for (let i = 0; i < this.optionButtons.length; i++) {
            const optionButton = this.optionButtons[i];
            const optionLabelNode = optionButton.node.getChildByName("Label");

            // Optin1~4노드(보기1-4) 하위에 Label이란 이름의 하위 노드가 있어야 함 
            if (!optionLabelNode) {
                console.error(`Option ${i + 1}의 Label 노드를 찾을 수 없습니다!`);
                continue;
            }

            const optionLabel = optionLabelNode.getComponent(cc.Label);
            if (!optionLabel) {
                console.error(`Option ${i + 1}의 Label에 cc.Label 컴포넌트가 없습니다!`);
                continue;
            }

            // 보기에 정답과 오답 설정
            optionLabel.string = randomOptions[i].toString();

            // ⚠️ 기존 이벤트 리스너를 제거하고 새로 등록
            optionButton.node.off("click"); // 기존 클릭 이벤트 삭제
            optionButton.node.on("click", () => this.checkAnswer(randomOptions[i]), this);
        }

        // 타이머 시작
        this.schedule(this.decreaseTimer, 1);
    }

    // 옵션 버튼 클릭 시 실행되는 메서드
    onOptionClicked(event: cc.Event) {
        const button = event.target;
        const optionLabel = button.getChildByName('Label').getComponent(cc.Label);
        const selectedAnswer = parseInt(optionLabel.string);
        this.checkAnswer(selectedAnswer);
    }

    // 정답 선택 이벤트 설정 
    checkAnswer(selectedAnswer: number) {
        // 정답 여부 확인 후 메시지 표시
        if (selectedAnswer === this.currentAnswer) {
            this.score++;  // 정답이면 점수 증가
            this.answerLabel.string = "정답입니다!"; // 정답 메시지 파란색으로 출력
            this.answerLabel.node.color = cc.Color.BLUE; 
        } else {
            this.answerLabel.string = "오답입니다!"; // 오답 메시지는 빨간색 출력
            this.answerLabel.node.color = cc.Color.RED; 
        }

        // 다음 문제로 이동
        this.currentQuestionIndex++;
        if (this.currentQuestionIndex <= 5) {
            this.loadNextQuestion();  // 5문제까지 진행
        } else {
            this.endGame();  // 게임 끝
        }

        // 맞춘 정답 수 업데이트 
        this.updateScoreLabel();
    }

    // 맞춘 정답 수로 점수 업데이트 
    updateScoreLabel() {
        this.scoreLabel.string = `맞춘 정답 수 : ${this.score}`;
    }

    // 랜덤 구구단 문제 생성
    generateRandomQuestion(): [string, number] {
        const multiplier = Math.floor(Math.random() * 9) + 1;
        const multiplicand = Math.floor(Math.random() * 9) + 1;
        const answer = multiplier * multiplicand;
        return [`${multiplier} x ${multiplicand} = ?`, answer];
    }

    // 랜덤 보기를 생성 (정답 포함)
    generateRandomOptions(answer: number): number[] {
        const options = new Set<number>();
        options.add(answer);
        while (options.size < 4) {
            const randomOption = Math.floor(Math.random() * 81) + 1;
            options.add(randomOption);
        }
        return Array.from(options).sort(() => Math.random() - 0.5);
    }

    // 타이머 감소
    decreaseTimer() {
        if (this.timer > 0) {
            this.timer--;
            this.updateTimerLabel();
        }

        if (this.timer <= 0) {
            this.unschedule(this.decreaseTimer);
            this.checkAnswer(-1);  // 시간 초과로 오답 처리
        }
    }

    // 타이머  업데이트
    updateTimerLabel() {
        this.timerLabel.string = `Time: ${this.timer}`;
    }

    // 게임 종료 처리
    endGame() {
        this.unschedule(this.decreaseTimer);
        this.scoreLabel.string = `Score: ${this.score}`;
        cc.director.loadScene("GameOverScene");
    }

    // UI 초기화
    resetUI() {
        this.questionLabel.string = "";
        this.timerLabel.string = "";
        this.scoreLabel.string = `맞춘 정답 수 : ${this.score}`;
        this.answerLabel.string = ""; // 정답/오답 메시지 초기화
    }
}
