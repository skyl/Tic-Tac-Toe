// Generated by CoffeeScript 1.3.3
(function() {
  var CanvasGrid, Cell, TicTacToe, divmod, random_color,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  divmod = function(num, div) {
    return [Math.floor(num / div), num % div];
  };

  random_color = function(format) {
    var rint;
    rint = Math.round(0xffffff * Math.random());
    switch (format) {
      case 'hex':
        return ('#0' + rint.toString(16)).replace(/^#0([0-9a-f]{6})$/i, '#$1');
      case 'rgb':
        return "rgb(" + (rint >> 16) + "," + (rint >> 8 & 255) + "," + (rint & 255) + ")";
      default:
        return rint;
    }
  };

  Cell = (function() {

    function Cell(row, col) {
      this.row = row;
      this.col = col;
    }

    return Cell;

  })();

  CanvasGrid = (function() {

    function CanvasGrid(selector, options) {
      var settings;
      this.selector = selector;
      if (options == null) {
        options = {};
      }
      settings = {
        "BoardWidth": 3,
        "BoardHeight": 3,
        "PieceWidth": 100,
        "PieceHeight": 100,
        "player": "X"
      };
      this.options = {};
      $.extend(this.options, settings, options);
      this.canvas = $(this.selector)[0];
      this.ctx = this.canvas.getContext('2d');
      this.ctx.strokeStyle = this.options["strokeStyle"];
      this.BoardWidth = this.options["BoardWidth"];
      this.BoardHeight = this.options["BoardHeight"];
      this.PieceWidth = this.options["PieceWidth"];
      this.PieceHeight = this.options["PieceHeight"];
      this.PixelWidth = this.PieceWidth * this.BoardWidth + 1;
      this.PixelHeight = this.PieceHeight * this.BoardHeight + 1;
      this.canvas.width = this.PixelWidth;
      this.canvas.height = this.PixelHeight;
    }

    CanvasGrid.prototype.getCursorPosition = function(e) {
      var cell, x, y;
      if (e.pageX !== void 0 && e.pageY !== void 0) {
        x = e.pageX;
        y = e.pageY;
      } else {
        x = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
        y = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
      }
      x -= e.currentTarget.offsetLeft;
      y -= e.currentTarget.offsetTop;
      x = Math.min(x, this.BoardWidth * this.PieceWidth);
      y = Math.min(y, this.BoardHeight * this.PieceHeight);
      cell = new Cell(Math.floor(y / this.PieceHeight), Math.floor(x / this.PieceWidth));
      return cell;
    };

    return CanvasGrid;

  })();

  TicTacToe = (function(_super) {

    __extends(TicTacToe, _super);

    function TicTacToe(selector, options) {
      var self;
      this.selector = selector;
      this.click = __bind(this.click, this);

      TicTacToe.__super__.constructor.call(this, this.selector, options);
      self = this;
      this.$gofirst = $('<button id="youGo" value="You Go First">You Go First</button>');
      $('body').append(this.$gofirst);
      this.$gofirst.click(function(e) {
        $(e.currentTarget).hide();
        self.move();
        return false;
      });
      this.$restart = $('<button id="restart" value="Restart">Restart</button>');
      $('body').append(this.$restart);
      this.$restart.click(function(e) {
        return self.restart();
      });
      $(this.canvas).click(this.click);
      this.player = this.options.player;
      this.computer = this.player === "X" ? "O" : "X";
      this.restart();
    }

    TicTacToe.prototype.restart = function() {
      this.pieces = ["", "", "", "", "", "", "", "", ""];
      this.$restart.hide();
      this.$gofirst.show();
      this.draw();
      this.thinking = false;
      return this.game_over = false;
    };

    TicTacToe.prototype.draw = function() {
      var cell, dm, i, _i, _results;
      this.ctx.clearRect(0, 0, this.PixelWidth, this.PixelHeight);
      this.ctx.beginPath();
      this.ctx.strokeStyle = random_color('hex');
      this.ctx.lineWidth = 2;
      this.ctx.moveTo(this.PieceWidth, 0);
      this.ctx.lineTo(this.PieceWidth, this.PixelHeight);
      this.ctx.moveTo(this.PieceWidth * 2, 0);
      this.ctx.lineTo(this.PieceWidth * 2, this.PixelHeight);
      this.ctx.moveTo(0, this.PieceHeight);
      this.ctx.lineTo(this.PixelWidth, this.PieceHeight);
      this.ctx.moveTo(0, this.PieceHeight * 2);
      this.ctx.lineTo(this.PixelWidth, this.PieceHeight * 2);
      this.ctx.stroke();
      this.ctx.closePath();
      _results = [];
      for (i = _i = 0; _i <= 8; i = ++_i) {
        dm = divmod(i, 3);
        cell = new Cell(dm[0], dm[1]);
        if (this.pieces[i] === 'X') {
          this.putX(cell);
        }
        if (this.pieces[i] === 'O') {
          _results.push(this.putO(cell));
        } else {
          _results.push(void 0);
        }
      }
      return _results;
    };

    TicTacToe.prototype.putX = function(cell) {
      var beginX, beginY, endX, endY, offsetX, offsetY;
      this.pieces[cell.col + cell.row * 3] = "X";
      this.ctx.beginPath();
      this.ctx.strokeStyle = random_color('hex');
      this.ctx.lineWidth = 4;
      offsetX = this.PieceWidth * 0.1;
      offsetY = this.PieceHeight * 0.1;
      beginX = cell.col * this.PieceWidth + offsetX;
      beginY = cell.row * this.PieceHeight + offsetY;
      endX = (cell.col + 1) * this.PieceWidth - offsetX * 2;
      endY = (cell.row + 1) * this.PieceHeight - offsetY * 2;
      this.ctx.moveTo(beginX, beginY);
      this.ctx.lineTo(endX, endY);
      this.ctx.moveTo(beginX, endY);
      this.ctx.lineTo(endX, beginY);
      this.ctx.stroke();
      return this.ctx.closePath();
    };

    TicTacToe.prototype.putO = function(cell) {
      var beginX, beginY, endX, endY, offsetX, offsetY;
      this.pieces[cell.col + cell.row * 3] = "O";
      this.ctx.beginPath();
      this.ctx.strokeStyle = random_color('hex');
      this.ctx.lineWidth = 4;
      offsetX = this.PieceWidth * 0.1;
      offsetY = this.PieceHeight * 0.1;
      beginX = cell.col * this.PieceWidth + offsetX;
      beginY = cell.row * this.PieceHeight + offsetY;
      endX = (cell.col + 1) * this.PieceWidth - offsetX * 2;
      endY = (cell.row + 1) * this.PieceHeight - offsetY * 2;
      this.ctx.arc(beginX + ((endX - beginX) / 2), beginY + ((endY - beginY) / 2), (endX - beginX) / 2, 0, Math.PI * 2, true);
      this.ctx.stroke();
      return this.ctx.closePath();
    };

    TicTacToe.prototype.put = function(index, player) {
      var cell, dm;
      dm = divmod(index, 3);
      cell = new Cell(dm[0], dm[1]);
      if (player === "O") {
        return this.putO(cell);
      } else {
        return this.putX(cell);
      }
    };

    TicTacToe.prototype.click = function(e) {
      var cell, idx, valid_moves;
      if (this.thinking) {
        if (this.get_valid_moves().length > 0) {
          alert("This might take a while, I just can't decide.");
          return;
        } else {
          alert("I'm pretty sure THAT's not legal.  How about we just start again?");
        }
      }
      if (this.game_over) {
        alert('oh, should I have told you that I won?');
        this.restart();
        return;
      }
      cell = this.getCursorPosition(e);
      idx = cell.row * 3 + cell.col;
      valid_moves = this.get_valid_moves();
      if ($.inArray(idx, valid_moves) !== -1) {
        this.putX(cell);
        return this.move();
      }
    };

    TicTacToe.prototype.get_valid_moves = function() {
      var i, ret, _i;
      ret = [];
      for (i = _i = 0; _i <= 8; i = ++_i) {
        if (this.pieces[i] === "") {
          ret.push(i);
        }
      }
      return ret;
    };

    TicTacToe.prototype.make_move = function(idx, player) {
      return this.pieces[idx] = player;
    };

    TicTacToe.prototype.undo_move = function(idx) {
      return this.pieces[idx] = "";
    };

    TicTacToe.prototype.row_wins = function(arr) {
      var p, t, _i, _len;
      t = arr[0];
      if (t === "") {
        return false;
      }
      for (_i = 0, _len = arr.length; _i < _len; _i++) {
        p = arr[_i];
        if (p === "") {
          return false;
        }
        if (t !== p) {
          return false;
        }
      }
      return true;
    };

    TicTacToe.prototype.get_winner = function() {
      var arr, row, winning_rows, _i, _len;
      winning_rows = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]];
      for (_i = 0, _len = winning_rows.length; _i < _len; _i++) {
        row = winning_rows[_i];
        arr = [this.pieces[row[0]], this.pieces[row[1]], this.pieces[row[2]]];
        if (this.row_wins(arr)) {
          return arr[0];
        }
      }
      return "";
    };

    TicTacToe.prototype.playerindxs = function() {
      var i, p, ret, _i, _ref;
      ret = [];
      for (i = _i = 0, _ref = this.pieces.length - 1; 0 <= _ref ? _i <= _ref : _i >= _ref; i = 0 <= _ref ? ++_i : --_i) {
        p = this.pieces[i];
        if (p === this.player) {
          ret.push(i);
        }
      }
      return ret;
    };

    TicTacToe.prototype.move = function() {
      var corners, i, idx, sides, valid_moves, _i, _j, _k, _l, _len, _len1, _ref, _ref1;
      this.thinking = true;
      this.$gofirst.hide();
      this.$restart.show();
      valid_moves = this.get_valid_moves();
      for (_i = 0, _len = valid_moves.length; _i < _len; _i++) {
        idx = valid_moves[_i];
        this.make_move(idx, this.computer);
        if (this.get_winner() === this.computer) {
          this.undo_move(idx);
          this.put(idx, this.computer);
          this.game_over = true;
          this.thinking = false;
          return;
        }
        this.undo_move(idx);
      }
      for (_j = 0, _len1 = valid_moves.length; _j < _len1; _j++) {
        idx = valid_moves[_j];
        this.make_move(idx, this.player);
        if (this.get_winner() === this.player) {
          this.undo_move(idx);
          this.put(idx, this.computer);
          this.thinking = false;
          return;
        }
        this.undo_move(idx);
      }
      if ($.inArray(4, valid_moves) !== -1) {
        this.put(4, this.computer);
        this.thinking = false;
        return;
      }
      sides = [1, 3, 5, 7];
      if (this.pieces[4] === this.computer) {
        for (i = _k = 0, _ref = sides.length - 1; 0 <= _ref ? _k <= _ref : _k >= _ref; i = 0 <= _ref ? ++_k : --_k) {
          if ($.inArray(sides[i], valid_moves) !== -1) {
            if ($.inArray(8 - sides[i], this.playerindxs()) === -1) {
              this.put(sides[i], this.computer);
              this.thinking = false;
              return;
            }
          }
        }
      }
      corners = [0, 2, 6, 8];
      for (_l = i, _ref1 = corners.length - 1; i <= _ref1 ? _l <= _ref1 : _l >= _ref1; i <= _ref1 ? _l++ : _l--) {
        if ($.inArray(corners[i], valid_moves) !== -1) {
          this.put(corners[i], this.computer);
          this.thinking = false;
          return;
        }
      }
      if (valid_moves.length > 1) {
        this.put(valid_moves[0], this.computer);
        this.thinking = false;
      }
    };

    return TicTacToe;

  })(CanvasGrid);

  window.TicTacToe = TicTacToe;

}).call(this);