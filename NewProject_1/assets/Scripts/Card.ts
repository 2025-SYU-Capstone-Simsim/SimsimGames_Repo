// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator;

@ccclass
export default class Card extends cc.Component {
    // 카드 앞면 이미지를 보여줄 Sprite 컴포넌트
    @property(cc.Sprite)
    frontSprite: cc.Sprite = null;

    // 파일 이름에서 추출한 카드 숫자 (A:1, 02:2, …, J:11, Q:12, K:13)
    cardNumber: number = 0;

    /**
     * 전달받은 SpriteFrame을 할당하고, 파일 이름을 파싱하여 카드 숫자를 설정합니다.
     * @param spriteFrame - 카드 이미지 SpriteFrame
     */
    setCardInfo(spriteFrame: cc.SpriteFrame): void {
        if (!this.frontSprite) {
            cc.error("frontSprite가 연결되지 않았습니다.");
            return;
        }
        this.frontSprite.spriteFrame = spriteFrame;
        this.cardNumber = this.getCardRankFromSpriteName(spriteFrame.name);
        cc.log("카드 설정 완료:", spriteFrame.name, "=>", this.cardNumber);
    }

    /**
     * SpriteFrame 이름(예: "card_hearts_A", "card_spades_K")를 분석하여 카드 숫자를 반환합니다.
     * @param spriteName - SpriteFrame의 이름
     * @returns 카드 숫자 (1 ~ 13)
     */
    getCardRankFromSpriteName(spriteName: string): number {
        const parts = spriteName.split('_');
        const rankStr = parts[parts.length - 1]; // 마지막 토큰이 카드 랭크
        const rankMapping: { [key: string]: number } = {
            'A': 1,
            '02': 2,
            '03': 3,
            '04': 4,
            '05': 5,
            '06': 6,
            '07': 7,
            '08': 8,
            '09': 9,
            '10': 10,
            'J': 11,
            'Q': 12,
            'K': 13
        };
        return rankMapping[rankStr] || 0;
    }
}