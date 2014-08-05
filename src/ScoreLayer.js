var ScoreLayer = cc.Layer.extend({
	score: 0,
	ctor: function() {
		this._super();

		this.scoreLabel = cc.LabelTTF.create("Score: 0", "Arial", 30);
		this.scoreLabel.setAnchorPoint(0,1);
        this.scoreLabel.setPosition(new cc.Point(10, 25 * 32));
        this.scoreLabel.setColor(new cc.Color(255,0,0));
        this.addChild(this.scoreLabel);
	},

	addScore: function(score) {
		this.score += score;
		this.scoreLabel.setString("Score: " + this.score);
	}
});