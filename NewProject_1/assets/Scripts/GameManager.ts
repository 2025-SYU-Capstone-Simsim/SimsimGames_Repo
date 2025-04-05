// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

// GameManager.ts (일부 발췌)
const { ccclass, property } = cc._decorator;

@ccclass
export default class GameManager extends cc.Component {
    @property(cc.Prefab)
    cardPrefab: cc.Prefab = null;

    @property(cc.Node)
    cardContainer: cc.Node = null;

    @property(cc.Label)
    scoreLabel: cc.Label = null;
    @property(cc.Label)
    levelLabel: cc.Label = null;

    // 모든 52장에 해당하는 카드 파일 이름 배열 (확장자 없이)
    private cardNames: string[] = [
        // Hearts
        "card_hearts_A", "card_hearts_02", "card_hearts_03", "card_hearts_04", "card_hearts_05",
        "card_hearts_06", "card_hearts_07", "card_hearts_08", "card_hearts_09", "card_hearts_10",
        "card_hearts_J", "card_hearts_Q", "card_hearts_K",
        // Clubs
        "card_clubs_A", "card_clubs_02", "card_clubs_03", "card_clubs_04", "card_clubs_05",
        "card_clubs_06", "card_clubs_07", "card_clubs_08", "card_clubs_09", "card_clubs_10",
        "card_clubs_J", "card_clubs_Q", "card_clubs_K",
        // Diamonds
        "card_diamonds_A", "card_diamonds_02", "card_diamonds_03", "card_diamonds_04", "card_diamonds_05",
        "card_diamonds_06", "card_diamonds_07", "card_diamonds_08", "card_diamonds_09", "card_diamonds_10",
        "card_diamonds_J", "card_diamonds_Q", "card_diamonds_K",
        // Spades
        "card_spades_A", "card_spades_02", "card_spades_03", "card_spades_04", "card_spades_05",
        "card_spades_06", "card_spades_07", "card_spades_08", "card_spades_09", "card_spades_10",
        "card_spades_J", "card_spades_Q", "card_spades_K"
    ];

    // 나머지 변수와 메서드들은 이전 코드와 동일...
    private cardSprites: cc.SpriteFrame[] = [];
    private score: number = 0;
    private level: number = 1;
    private targetNumber: number = 0;
    private correctCardIndex: number = 0;

    onLoad(): void {
        cc.log("GameManager onLoad 시작");
        this.loadAllCards(() => {
            cc.log("모든 카드 로드 완료, 로드된 카드 수:", this.cardSprites.length);
            // 여기서는 리소스 로드 완료 후 UI에서 Start 버튼을 누르면 startGame()이 호출되게 합니다.
        });
    }

    loadAllCards(callback: Function): void {
        this.cardSprites = [];
        let loadedCount = 0;
        const totalCards = this.cardNames.length;

        for (let i = 0; i < totalCards; i++) {
            const fileName = this.cardNames[i];
            const filePath = "Cards/" + fileName;  // 예: Assets/Resources/Cards/card_hearts_A
            // 우선 세팅된 새 에셋 관리자 API(cc.resources.load)가 있는지 체크,
            if (cc.resources && typeof cc.resources.load === "function") {
                cc.resources.load(filePath, cc.SpriteFrame, (err, spriteFrame) => {
                    if (err) {
                        cc.error("카드 로드 실패 (cc.resources):", fileName, err);
                    } else {
                        cc.log("카드 로드 (cc.resources):", fileName);
                        this.cardSprites.push(spriteFrame);
                    }
                    loadedCount++;
                    if (loadedCount === totalCards) { callback(); }
                });
            }
            // 아니면, legacy 로더(cc.loader.loadRes)를 사용
            else if (cc.loader && typeof cc.loader.loadRes === "function") {
                cc.loader.loadRes(filePath, cc.SpriteFrame, (err, spriteFrame) => {
                    if (err) {
                        cc.error("카드 로드 실패 (cc.loader):", fileName, err);
                    } else {
                        cc.log("카드 로드 (cc.loader):", fileName);
                        this.cardSprites.push(spriteFrame);
                    }
                    loadedCount++;
                    if (loadedCount === totalCards) { callback(); }
                });
            }
            else {
                cc.error("사용 가능한 리소스 로더가 없습니다.");
                callback();
                break;
            }
        }
    }

    // 나머지 startGame, startLevel, getCardRankFromName, onCardSelected, updateLabels 등은 그대로...
    public startGame(): void {
        cc.log("startGame() 호출됨");
        this.score = 0;
        this.level = 1;
        this.updateLabels();
        this.startLevel();
    }

    startLevel(): void {
        const numCards = this.level + 1;
        cc.log("startLevel() 실행, 생성할 카드 수:", numCards);
        if (this.cardSprites.length === 0) {
            cc.error("카드 스프라이트가 로드되지 않았습니다.");
            return;
        }
        const randomSpriteIndex = Math.floor(Math.random() * this.cardSprites.length);
        this.targetNumber = this.getCardRankFromName(this.cardSprites[randomSpriteIndex].name);
        cc.log("Target Number:", this.targetNumber);
        this.correctCardIndex = Math.floor(Math.random() * numCards);
        this.cardContainer.removeAllChildren();
        for (let i = 0; i < numCards; i++) {
            const cardNode = cc.instantiate(this.cardPrefab);
            const cardComponent = cardNode.getComponent("Card");
            if (i === this.correctCardIndex) {
                cardComponent.setCardInfo(this.cardSprites[randomSpriteIndex]);
            } else {
                let wrongIndex = randomSpriteIndex;
                while (this.getCardRankFromName(this.cardSprites[wrongIndex].name) === this.targetNumber) {
                    wrongIndex = Math.floor(Math.random() * this.cardSprites.length);
                }
                cardComponent.setCardInfo(this.cardSprites[wrongIndex]);
            }
            cardNode.on(cc.Node.EventType.TOUCH_END, () => {
                this.onCardSelected(cardComponent.cardNumber);
            }, this);
            this.cardContainer.addChild(cardNode);
        }
        this.levelLabel.string = "Level: " + this.level;
    }

    getCardRankFromName(spriteName: string): number {
        const parts = spriteName.split('_');
        const rankStr = parts[parts.length - 1];
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

    onCardSelected(selectedNumber: number): void {
        if (selectedNumber === this.targetNumber) {
            cc.log("정답!");
            this.score += 10;
            this.level += 1;
            this.updateLabels();
            this.scheduleOnce(() => this.startLevel(), 1);
        } else {
            cc.log("오답!");
        }
    }

    updateLabels(): void {
        this.scoreLabel.string = "Score: " + this.score;
        this.levelLabel.string = "Level: " + this.level;
    }
}