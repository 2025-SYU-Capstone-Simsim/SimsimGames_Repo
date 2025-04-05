// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

// GlobalData.ts
// GlobalQuizData.ts
export default class GlobalData_Cafe {
    public static totalPrice: number = 0;

    // 퀴즈 관련 데이터
    public static quizPayment: { correctAnswer: string } = null;
    public static quizQuantity: { productName: string; targetQuantity: number } = null;

    // 사용자가 선택한 결제 방식 답안
    public static userPaymentAnswer: string = "";

    // 사용자의 주문 수량 데이터
    public static orderQuantities: { [key: string]: number } = {};

    // 주문 수량 및 금액 초기화 메서드
    public static resetOrderData(): void {
        this.totalPrice = 0;
        this.orderQuantities = {};
    }

    // 퀴즈 데이터 초기화 메서드 (정답 후 호출)
    public static resetQuizData(): void {
        this.quizPayment = null;
        this.quizQuantity = null;
        this.userPaymentAnswer = "";
    }
}