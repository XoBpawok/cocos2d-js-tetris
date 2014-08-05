var BGLayer = cc.Layer.extend({
	ctor: function() {
		this._super();
		this.init();
	},

	init: function() {
		this._super();

		this.map_bg = cc.TMXTiledMap.create(res.bg_tmx);
		this.addChild(this.map_bg);
	}
});