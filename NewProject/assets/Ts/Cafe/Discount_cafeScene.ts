// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator;

@ccclass
export default class DiscountCafeScene extends cc.Component {
    // "주문하기" 버튼을 Inspector에서 연결합니다.
    @property(cc.Button)
    orderButton: cc.Button = null;

    onLoad() {
        // Inspector에서 orderButton이 연결되어 있다면 터치 이벤트를 등록합니다.
        if (this.orderButton) {
            this.orderButton.node.on(cc.Node.EventType.TOUCH_END, this.onOrderButtonClick, this);
        }
    }

    onOrderButtonClick() {
        cc.log("주문하기 버튼 클릭, Order_CafeScene으로 전환합니다.");
        // order_CafeScene으로 씬 전환
        cc.director.loadScene("Order_CafeScene");
    }
}
