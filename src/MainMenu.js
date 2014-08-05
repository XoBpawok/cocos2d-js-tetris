var MainMenuLayer = cc.Layer.extend({
	ctor: function() {
		this._super();
		var startSprite1 = cc.Sprite.create(res.buttonStart_png, cc.rect(0, 0, 96, 96));
		var startSprite2 = cc.Sprite.create(res.buttonStart_png, cc.rect(-1, -1, 96, 96));
		var menuItem = cc.MenuItemSprite.create(startSprite1, startSprite2, this.play, this);
		var menu = cc.Menu.create(menuItem);
		menu.setEnabled(true)
		menu.alignItemsVerticallyWithPadding(10);
		this.addChild(menu);
	},

	play: function() {
		cc.director.runScene(new GameScene());
	}
});


var MainMenuScene = cc.Scene.extend({
    onEnter: function() {
        this._super();
        this.addChild(new MainMenuLayer());
    }
});