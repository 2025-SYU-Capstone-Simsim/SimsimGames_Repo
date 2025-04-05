// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html





const { ccclass, property } = cc._decorator;
import GlobalData_Cafe from './GlobalData_Cafe';

@ccclass
export default class CafeScene extends cc.Component {
    @property(cc.Node)
    menuListNode: cc.Node = null;

    @property(cc.Prefab)
    cafeMenuPrefab: cc.Prefab = null;

    @property(cc.Label)
    priceLabel: cc.Label = null;

    @property(cc.Label)
    orderSummaryLabel: cc.Label = null;

    @property(cc.Button)
    payButton: cc.Button = null;

    @property(cc.Label)
    quizQuestionLabel: cc.Label = null;

    menuPrices: { [key: string]: number } = {
        "아메리카노": 3000,
        "카페라떼": 4000,
        "바닐라라떼": 3500
    };

    private orderQuantities: { [key: string]: number } = {};

    private quizPayment: { correctAnswer: string } = null;
    private quizQuantity: { productName: string; targetQuantity: number } = null;

    onLoad() {
        // 주문 수량 초기화
        GlobalData_Cafe.resetOrderData();
        for (let menu in this.menuPrices) {
            this.orderQuantities[menu] = 0;
            GlobalData_Cafe.orderQuantities[menu] = 0;
        }

        this.updatePriceLabel();
        this.addMenuItems();
        this.updateOrderSummary();

        // 퀴즈 설정: 기존 퀴즈 유지 또는 새로운 퀴즈 생성
        if (!GlobalData_Cafe.quizPayment || !GlobalData_Cafe.quizQuantity) {
            this.generateQuiz();
        } else if (this.quizQuestionLabel) {
            this.quizQuestionLabel.string =
                `퀴즈: 결제 방식을 "${GlobalData_Cafe.quizPayment.correctAnswer}"로 선택하고,\n` +
                `${GlobalData_Cafe.quizQuantity.productName}의 주문 수량을 ${GlobalData_Cafe.quizQuantity.targetQuantity}개로 맞추세요.`;
        }

        if (this.payButton) {
            this.payButton.node.on(cc.Node.EventType.TOUCH_END, this.onPayButtonClick, this);
        }
    }

    addMenuItems() {
        this.menuListNode.removeAllChildren();
        let menuInstance = cc.instantiate(this.cafeMenuPrefab);

        for (let menu in this.menuPrices) {
            let menuNode = menuInstance.getChildByName(menu);
            if (menuNode) {
                let label = menuNode.getChildByName("Label");
                if (label) {
                    let labelComp = label.getComponent(cc.Label);
                    if (labelComp) { labelComp.string = menu; }
                }
                let plusButton = menuNode.getChildByName("PlusButton");
                let minusButton = menuNode.getChildByName("MinusButton");
                if (plusButton) {
                    plusButton.on(cc.Node.EventType.TOUCH_END, () => {
                        this.orderQuantities[menu]++;
                        GlobalData_Cafe.totalPrice += this.menuPrices[menu];
                        this.updatePriceLabel();
                        this.updateOrderSummary();
                    }, this);
                }
                if (minusButton) {
                    minusButton.on(cc.Node.EventType.TOUCH_END, () => {
                        if (this.orderQuantities[menu] > 0) {
                            this.orderQuantities[menu]--;
                            GlobalData_Cafe.totalPrice -= this.menuPrices[menu];
                            this.updatePriceLabel();
                            this.updateOrderSummary();
                        }
                    }, this);
                }
            }
        }

        this.menuListNode.addChild(menuInstance);
    }

    updatePriceLabel() {
        if (this.priceLabel) {
            this.priceLabel.string = "총 금액: " + GlobalData_Cafe.totalPrice + "원";
        }
    }

    updateOrderSummary() {
        if (this.orderSummaryLabel) {
            let summary = "";
            for (let menu in this.orderQuantities) {
                if (this.orderQuantities[menu] > 0) {
                    summary += `${menu} x ${this.orderQuantities[menu]}개  `;
                }
            }
            this.orderSummaryLabel.string = summary || "주문 항목 없음";
        }
    }

    generateQuiz() {
        let paymentOptions = ["카드", "현금"];
        let randomIndex = Math.floor(Math.random() * paymentOptions.length);
        this.quizPayment = { correctAnswer: paymentOptions[randomIndex] };

        let products = Object.keys(this.menuPrices);
        let productIndex = Math.floor(Math.random() * products.length);
        let selectedProduct = products[productIndex];
        let targetQuantity = Math.floor(Math.random() * 5) + 1;
        this.quizQuantity = { productName: selectedProduct, targetQuantity: targetQuantity };

        if (this.quizQuestionLabel) {
            this.quizQuestionLabel.string =
                `퀴즈: 결제 방식을 "${this.quizPayment.correctAnswer}"로 선택하고,\n` +
                `${this.quizQuantity.productName}의 주문 수량을 ${this.quizQuantity.targetQuantity}개로 맞추세요.`;
        }

        GlobalData_Cafe.quizPayment = this.quizPayment;
        GlobalData_Cafe.quizQuantity = this.quizQuantity;
    }

    onPayButtonClick() {
        GlobalData_Cafe.orderQuantities = this.orderQuantities;
        cc.director.loadScene("Order_CafeScene");
    }
}