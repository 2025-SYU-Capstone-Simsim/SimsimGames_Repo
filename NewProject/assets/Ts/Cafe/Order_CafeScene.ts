// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator;
import GlobalData_Cafe from './GlobalData_Cafe';

@ccclass
export default class OrderCafeScene extends cc.Component {
    @property(cc.Button)
    cardButton: cc.Button = null; // 결제 방식 선택 버튼 (카드)

    @property(cc.Button)
    cashButton: cc.Button = null; // 결제 방식 선택 버튼 (현금)

    @property(cc.Label)
    quizDisplayLabel: cc.Label = null; // CafeScene에서 생성된 문제를 표시하는 Label

    onLoad() {
        // CafeScene에서 생성된 퀴즈 정보를 표시
        if (this.quizDisplayLabel && GlobalData_Cafe.quizPayment && GlobalData_Cafe.quizQuantity) {
            this.quizDisplayLabel.string =
                `퀴즈: 결제 방식을 "${GlobalData_Cafe.quizPayment.correctAnswer}"로 선택하고,\n` +
                `${GlobalData_Cafe.quizQuantity.productName}의 주문 수량을 ${GlobalData_Cafe.quizQuantity.targetQuantity}개로 맞추세요.`;
        }

        // 카드 결제 방식 선택 버튼 이벤트
        if (this.cardButton) {
            this.cardButton.node.on(cc.Node.EventType.TOUCH_END, () => {
                GlobalData_Cafe.userPaymentAnswer = "카드"; // 사용자가 선택한 결제 방식 저장
                cc.log("결제 방식 선택: 카드");
                cc.director.loadScene("ResultScene"); // ResultScene으로 이동
            }, this);
        }

        // 현금 결제 방식 선택 버튼 이벤트
        if (this.cashButton) {
            this.cashButton.node.on(cc.Node.EventType.TOUCH_END, () => {
                GlobalData_Cafe.userPaymentAnswer = "현금"; // 사용자가 선택한 결제 방식 저장
                cc.log("결제 방식 선택: 현금");
                cc.director.loadScene("ResultScene"); // ResultScene으로 이동
            }, this);
        }
    }
}