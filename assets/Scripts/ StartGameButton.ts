// StartGameButton.ts

const {ccclass, property} = cc._decorator;

// 스타트 게임 버튼 클릭 시 두더지 게임 씬으로 이동하는 메서드 
@ccclass
export default class StartGameButton extends cc.Component {

    StartGame()
    {
        cc.director.loadScene("GameScene");
    }
}