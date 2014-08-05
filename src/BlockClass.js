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

	this.rotate = function() {
		var newBricks;
		var bricks = _bricks;
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
		_bricks = newBricks;
		createSprites();

		return this;
	}

	function createSprites() {
		var guiBrick;
		that.sprites = [];
		
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