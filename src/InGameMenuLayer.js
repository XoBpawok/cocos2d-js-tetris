var InGameMenuLayer = cc.Layer.extend({
	game: null,
	ctor: function() {
		this._super();
		this.init();
	},

	init: function() {
		this.cLayer = cc.LayerColor.create(new cc.Color(0, 0, 0, 128));

		var resumeSprite1 = cc.Sprite.create(res.buttonStart_png, cc.rect(0, 0, 96, 96));
		var resumeSprite2 = cc.Sprite.create(res.buttonStart_png, cc.rect(-1, -1, 96, 96));

		var restartSprite1 = cc.Sprite.create(res.buttonRefresh_png, cc.rect(0, 0, 96, 96));
		var restartSprite2 = cc.Sprite.create(res.buttonRefresh_png, cc.rect(-1, -1, 96, 96));

		var exitSprite1 = cc.Sprite.create(res.buttonClose_png, cc.rect(0, 0, 96, 96));
		var exitSprite2 = cc.Sprite.create(res.buttonClose_png, cc.rect(-1, -1, 96, 96));


		var resumeMenuItem = cc.MenuItemSprite.create(resumeSprite1, resumeSprite2, this.resume, this);
		var restartMenuItem = cc.MenuItemSprite.create(restartSprite1, restartSprite2, this.restart, this);
		var exitMenuItem = cc.MenuItemSprite.create(exitSprite1, exitSprite2, this.exit, this);

		var menu = cc.Menu.create(resumeMenuItem, restartMenuItem, exitMenuItem);
		menu.setEnabled(true)
		menu.alignItemsVerticallyWithPadding(10);
		this.cLayer.addChild(menu);

		this.addChild(this.cLayer);

		this.setVisible(false);
	},

	resume: function() {
		this.getGame();
		if (this.game.status === gameStatus.pause) {
			this.hide();
			this.game.gameResume();
		}
	},

	restart: function() {
		cc.director.runScene(new GameScene());
	},

	exit: function() {
		cc.director.runScene(new MainMenuScene());
	},

	hide: function() {
		this.setVisible(false);
	},

	show: function() {
		this.setVisible(true);
	},

	getGame: function() {
		if(this.game === null) {
			this.game = this.getParent().getChildByTag(TagOfLayer.game);
		}
	}
});