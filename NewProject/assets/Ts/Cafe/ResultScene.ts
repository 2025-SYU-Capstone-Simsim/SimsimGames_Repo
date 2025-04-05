// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator;
import GlobalData_Cafe from './GlobalData_Cafe';

@ccclass
export default class ResultScene extends cc.Component {
    @property(cc.Label)
    resultLabel: cc.Label = null;

    onLoad() {
        // 퀴즈 데이터 가져오기
        const quizPayment = GlobalData_Cafe.quizPayment;
        const quizQuantity = GlobalData_Cafe.quizQuantity;
        const orderQuantities = GlobalData_Cafe.orderQuantities;
        const userPayment = GlobalData_Cafe.userPaymentAnswer;

        // 정답 여부를 판단
        let quantityCorrect = false;
        if (orderQuantities[quizQuantity.productName] !== undefined) {
            quantityCorrect = (orderQuantities[quizQuantity.productName] === quizQuantity.targetQuantity);
        }
        const paymentCorrect = (userPayment === quizPayment.correctAnswer);

        // 결과 로그 출력
        cc.log(`결제 방식: ${userPayment} (${paymentCorrect ? "정답" : "오답"}), ` +
            `${quizQuantity.productName}: ${orderQuantities[quizQuantity.productName]} (${quantityCorrect ? "정답" : "오답"})`);

        // 결과 처리
        if (paymentCorrect && quantityCorrect) {
            // 정답 처리: MainScene으로 이동
            if (this.resultLabel) {
                this.resultLabel.string = "정답입니다! 메인화면으로 이동합니다.";
            }
            // 퀴즈 데이터 초기화
            GlobalData_Cafe.resetQuizData();

            // 2초 후 MainScene으로 이동
            this.scheduleOnce(() => {
                cc.director.loadScene("MainScene");
            }, 2);
        } else {
            // 오답 처리: CafeScene으로 돌아감
            if (this.resultLabel) {
                this.resultLabel.string = "오답입니다. 다시 시도해주세요.";
            }

            // 2초 후 CafeScene으로 돌아감
            this.scheduleOnce(() => {
                cc.director.loadScene("CafeScene");
            }, 2);
        }
    }
}