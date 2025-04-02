// titlescene

const {ccclass, property} = cc._decorator;
// 타이틀 씬에서 start버튼 클릭 시 두더지 게임 씬으로 이동 
@ccclass
export default class TitleScene extends cc.Component {
    start () {
        cc.director.preloadScene("GameScene");
    }
}
