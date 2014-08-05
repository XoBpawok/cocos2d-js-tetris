var GameScene = cc.Scene.extend({
    onEnter: function() {
        this._super();

        this.addChild(new BGLayer(), 0, TagOfLayer.bg);
        this.addChild(new GameLayer(), 0, TagOfLayer.game);
        this.addChild(new ScoreLayer(), 0, TagOfLayer.score);
        this.addChild(new InGameMenuLayer(), 0, TagOfLayer.inGameMenu);
    }
});

var MainMenuScene = cc.Scene.extend({
    onEnter: function() {
        this._super();
        this.addChild(new MainMenuLayer());
    }
});

var TagOfLayer = {
    bg: 0,
    game: 1,
    score: 2,
    inGameMenu: 3
};

var cellType = {
    empty: 0,
    brick: 1
}

var gameStatus = {
    play: 0,
    pause: 1
}