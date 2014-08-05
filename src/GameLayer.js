var GameLayer = cc.Layer.extend({
	grid: [],
	block: {},
	w: 15,
	h: 25,
	menu: null,
	status: gameStatus.pause,

	onEnter: function() {
		this._super();
	},

	ctor: function() {
		this._super();
		this.init();
	},

	init: function() {
		this._super();
		this.initGrid();
		this.status = gameStatus.play;
		var that = this;
		

		this.createBlock();

		this.createInterval();

		cc.eventManager.addListener({
            event: cc.EventListener.KEYBOARD,
            onKeyPressed:function (key, event) {
            	if (key === cc.KEY.left || key === cc.KEY.right || key === cc.KEY.down)
                	that.blockGoToDirection(key, event);
                if (key === cc.KEY.up)
                	that.blockRotate(key, event);
                if (key === cc.KEY.escape) {
                	if (this.status !== gameStatus.play) {
						that.gamePause();
						if(that.menu === null){
							that.menu = that.getParent().getChildByTag(TagOfLayer.inGameMenu);
						}
						that.menu.show();
                	}
                }
            }
        }, this);
	},

	createInterval: function() {
		var that = this;
		this.interval = setInterval(function() {
			that.autoTurn();
		}, 500);
	},

	gameRestart: function() {
		this.init();
	},

	gamePause: function() {
		this.status = gameStatus.pause;
		window.clearInterval(this.interval);
	},

	gameResume: function() {
		this.status = gameStatus.play;
		this.createInterval();
	},

	initGrid: function() {
		this.grid = [];
		var row;
		for (var i = 0; i < 25; i++) {
			row = []
			for (var j = 0; j < 15; j++) {
				row.push(cellType.empty);
			};
			this.grid.push(row);
		}
	},

	autoTurn: function() {
		if (this.block === null) {
			this.createBlock();
		}
		if(this.canGoDown()) {
			this.blockGoDown();
		} else {
			this.addBlockOnGround();
			this.removeRows();



			this.createBlock();
		}
	},

	createBlock: function() {
		this.block = (new Block()).generate(3,3);
/*		this.block = (new Block()).create([[1,1,1],
										   [1,1,1],
										   [1,1,1],
										  ]);*/
		var bricks = this.block.getBricks();

		this.renderBlock({y: this.h - 1, x: Math.floor((this.w - 1) / 2)});
	},

	renderBlock: function(centerPos) {
		var top,
			left,
			sprite;
		var block = this.block;

		if (typeof centerPos === 'undefined' || typeof centerPos.x === 'undefined' || typeof centerPos.y === 'undefined') {
			cc.log("didn't set position for rendering");
		} else {
			top = centerPos.y;
			left = centerPos.x;
		}

		for (var i = 0; i < block.sprites.length; i++) {
			sprite = block.sprites[i];
			sprite.setPosition((left - 1 + sprite.posInBlock.x) * 32, (top + 1 - sprite.posInBlock.y) * 32);
			this.addChild(sprite, 1);
		};

		block.centerPosition = {
			x: left,
			y: top
		};
	},

	addBlockOnGround: function() {
		var sprite,
			pos;
		for (var i = 0; i < this.block.sprites.length; i++) {
			sprite = this.block.sprites[i];
			pos = sprite.getPosition();
			this.grid[pos.y/32][pos.x/32] = new Object(sprite);
		};
		this.block = null;
		cc.log('sprite was added to the ground./nNow ground looks like:' + this.grid);
	},

	removeRows: function() {
		var grid = this.grid;
		var destroy = true;
		var i = 0,
			j = 0,
			m = 0,
			n = 0;
		for (i = 0; i < grid.length; i++) {
			destroy = true;
			for (j = 0; j < grid[i].length; j++) {
				if (grid[i][j] === cellType.empty) {
					destroy = false;
					break;
				}
			}
			if (destroy) {
				for (j = 0; j < grid[i].length; j++) {
					this.removeChild(grid[i][j]);
					grid[i][j] = cellType.empty;
				}
				for (var m = i; m < grid.length; m++) {
					for (var n = 0; n < grid[m].length; n++) {
						if (grid[m][n] !== cellType.empty) {
							grid[m][n].setPositionY(grid[m][n].getPositionY() - 1 * 32);
							grid[m - 1][n] = grid[m][n];
							grid[m][n] = cellType.empty;
						}
					};
				};
				var scoreLayer = this.getParent().getChildByTag(TagOfLayer.score);
				scoreLayer.addScore(1);
				i--;
			}
		}
	},

	canGoDown: function() {
		var sprite, pos;
		var block = this.block;

		for (var i = 0; i < block.sprites.length; i++) {
			sprite = block.sprites[i];
			pos = sprite.getPosition();

			//check if border is the next cell
			if (pos.y === 0) {
				return false;
			}

			//check if next cell is brick
			if (this.grid[pos.y/32 - 1][pos.x/32] !== cellType.empty) {
				return false;
			}
		}

		return true;
	},

	canGoSide: function(direction) {
		var sprite, pos;
		var block = this.block;
		var borderPos = direction === cc.KEY.left ? 0 : (this.w - 1) ;
		var posDiff = (direction === cc.KEY.left ? -1 : 1);

		for (var i = 0; i < block.sprites.length; i++) {
			sprite = block.sprites[i];
			pos = sprite.getPosition();

			//check if border is the next cell
			if (pos.x === borderPos) {
				return false;
			}

			//check if the next cell is brick
			if (this.grid[pos.y/32][pos.x/32 + posDiff] !== cellType.empty) {
				return false;
			}
		}

		return true;
	},

	blockGoDown: function() {
		var sprite;
		var block = this.block;
		for (var i = 0; i < block.sprites.length; i++) {
			sprite = block.sprites[i];
			sprite.setPositionY(sprite.getPositionY() - 1 * 32);
		};

		block.centerPosition = {
			x: block.centerPosition.x,
			y: block.centerPosition .y - 1
		}

		cc.log('block moved down');
	},

	bockGoSide: function(direction) {
		var sprite, pos;
		var block = this.block;
		var posDiff = (direction === cc.KEY.left ? -1 : 1) * 32;

		for (var i = 0; i < block.sprites.length; i++) {
			sprite = block.sprites[i];
			sprite.setPositionX(sprite.getPositionX() + posDiff);
		};

		block.centerPosition = {
			x: block.centerPosition.x + posDiff / 32,
			y: block.centerPosition.y
		}
	},

	blockGoToDirection: function(direction) {
		switch(direction) {
			case cc.KEY.left:
			case cc.KEY.right:
				if (this.canGoSide(direction)) {
					this.bockGoSide(direction);
					cc.log('block moved left');
				};
				break;
			case cc.KEY.down:
				if (this.canGoDown()) {
					this.blockGoDown();
				};
				break;
		}
	},

	blockRotate: function() {
		var resultBlock = [];
		var block = this.block;
		var sprite, spritePos;
		var that = this;


		var newBlock = getRotatedBlock();
		
		if (canRotate()) {
			for (var i = 0; i < block.sprites.length; i++) {
				this.removeChild(block.sprites[i]);
			};
			this.block = newBlock;
			this.renderBlock(block.centerPosition);
		}

		function canRotate() {
			if (block.centerPosition.x - 1 > 0 && block.centerPosition.x < that.w - 1 && block.centerPosition.y - 1 >= 0 && block.centerPosition.y <= that.h - 1) {
				return true;
			}
			return false;
		}

		function getRotatedBlock() {
			var newBricks;
			var bricks = block.getBricks();
			var m, n;

			m = bricks.length;
			n = bricks[0].length;
			newBricks = new Array(m);
			for (var i = 0; i < newBricks.length; i++) {
				newBricks[i] = [];
			};

			for (i = m - 1; i >= 0; i--) {
				for (var j = 0; j < n; j++) {
					newBricks[i].push(bricks[n - 1 - j][i]);
				};
			}

			return (new Block()).create(newBricks);
		}

	}
});

var Block = function() {
	var _bricks = [];
	this.sprites = [];
	this.centerPosition;
	var that = this;

	this.generate = function(m,n) {
		var row = [];
		var blockIsEmpty = true;
		var brick;
		for (var i = 0; i < m; i++) {
			row = [];
			for (var j = 0; j < n; j++) {
				brick = rand();
				if (brick === cellType.brick) {
					blockIsEmpty = false;
				}
				row.push(brick);
			};
			_bricks.push(row);
		}

		cc.log(_bricks);

		createSprites();

		if (!blockIsEmpty) {
			return this;
		} else {
			return this.generate(m,n);
		}

		function rand() {
			return Math.round(Math.random());
		}
	}

	this.create = function(bricks) {
		_bricks = bricks;
		createSprites();
		return this;
	}

	this.getBricks = function() {
		return _bricks;
	}

	function createSprites() {
		var guiBrick;
		for (var i = 0; i < _bricks.length; i++) {
			for (var j = 0; j < _bricks[i].length; j++) {
				if (_bricks[i][j] === cellType.brick) {
					guiBrick = cc.Sprite.create(res.brick_png);
					guiBrick.setAnchorPoint(0,0);
					guiBrick.posInBlock = {
						x: i,
						y: j
					};
					that.sprites.push(guiBrick);
				}
			}
		}
	}
};

var GameScene = cc.Scene.extend({
    onEnter: function() {
        this._super();

        this.addChild(new BGLayer(), 0, TagOfLayer.bg);
        this.addChild(new GameLayer(), 0, TagOfLayer.game);
        this.addChild(new ScoreLayer(), 0, TagOfLayer.score);
        this.addChild(new InGameMenuLayer(), 0, TagOfLayer.inGameMenu);
    }
});