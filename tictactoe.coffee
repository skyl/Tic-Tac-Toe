divmod = (num, div) ->
  [Math.floor(num / div), num % div]

random_color = (format) ->
  rint = Math.round(0xffffff * Math.random())
  switch format
    when 'hex'
      return ('#0' + rint.toString(16)).replace(/^#0([0-9a-f]{6})$/i, '#$1')
  
    when 'rgb'
      return "rgb(#{rint >> 16},#{rint >> 8 & 255},#{rint & 255})"
  
    else
      return rint


class Cell

  constructor: (@row, @col) ->


class CanvasGrid

  constructor: (@selector, options={}) ->

    settings = {
      "BoardWidth": 3
      "BoardHeight": 3
      "PieceWidth": 100
      "PieceHeight": 100
      "player": "X"
    }

    @options = {}
    $.extend(@options, settings, options)

    @canvas = $(@selector)[0]
    @ctx = @canvas.getContext('2d')

    @ctx.strokeStyle = @options["strokeStyle"]
    @BoardWidth = @options["BoardWidth"]
    @BoardHeight = @options["BoardHeight"]
    @PieceWidth = @options["PieceWidth"]
    @PieceHeight = @options["PieceHeight"]
    @PixelWidth = @PieceWidth * @BoardWidth + 1
    @PixelHeight = @PieceHeight * @BoardHeight + 1
    @canvas.width = @PixelWidth;
    @canvas.height = @PixelHeight;

  getCursorPosition: (e) ->

    if (e.pageX isnt undefined && e.pageY isnt undefined)
      x = e.pageX
      y = e.pageY
    else
      x = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft
      y = e.clientY + document.body.scrollTop + document.documentElement.scrollTop

    x -= e.currentTarget.offsetLeft
    y -= e.currentTarget.offsetTop
    x = Math.min(x, @BoardWidth * @PieceWidth);
    y = Math.min(y, @BoardHeight * @PieceHeight);
    cell = new Cell(Math.floor(y/this.PieceHeight), Math.floor(x/this.PieceWidth));
    cell


class TicTacToe extends CanvasGrid

  constructor: (@selector, options) ->

    super(@selector, options)
    self = this

    @$gofirst = $('<button id="youGo" value="You Go First">You Go First</button>')
    $('body').append(@$gofirst)

    @$gofirst.click (e) ->
      $(e.currentTarget).hide()
      self.move()
      return false

    @$restart = $('<button id="restart" value="Restart">Restart</button>')
    $('body').append(@$restart)
    @$restart.click (e) ->
      self.restart()
    $(@canvas).click(@click)
  
    @player = @options.player
    @computer = if @player is "X" then "O" else "X"
    @restart()

  restart: () ->
    @pieces = ["", "", "", "", "", "", "", "", ""]
    @$restart.hide()
    @$gofirst.show()
    @draw()
    @thinking = false
    @game_over = false

  draw: () ->
    @ctx.clearRect(0, 0, @PixelWidth, @PixelHeight)
    @ctx.beginPath()
    @ctx.strokeStyle = random_color('hex')
    @ctx.lineWidth = 2
    @ctx.moveTo(@PieceWidth, 0)
    @ctx.lineTo(@PieceWidth, @PixelHeight)
    @ctx.moveTo(@PieceWidth * 2, 0)
    @ctx.lineTo(@PieceWidth * 2, @PixelHeight)
    @ctx.moveTo(0, @PieceHeight)
    @ctx.lineTo(@PixelWidth, @PieceHeight)
    @ctx.moveTo(0, @PieceHeight * 2)
    @ctx.lineTo(@PixelWidth, @PieceHeight * 2)
    @ctx.stroke()
    @ctx.closePath()

    for i in [0..8]
      dm = divmod(i, 3)
      cell = new Cell(dm[0], dm[1])
      if (@pieces[i] is 'X')
          @putX cell
      if (@pieces[i] is 'O')
          @putO cell

  putX: (cell) ->
      @pieces[cell.col + cell.row*3] = "X"
      @ctx.beginPath()
      @ctx.strokeStyle = random_color('hex')
      @ctx.lineWidth = 4
      offsetX = @PieceWidth * 0.1
      offsetY = @PieceHeight * 0.1
      beginX = cell.col * @PieceWidth + offsetX
      beginY = cell.row * @PieceHeight + offsetY
      endX = (cell.col + 1) * @PieceWidth - offsetX * 2
      endY = (cell.row + 1) * @PieceHeight - offsetY * 2
      @ctx.moveTo(beginX, beginY)
      @ctx.lineTo(endX, endY)
      @ctx.moveTo(beginX, endY)
      @ctx.lineTo(endX, beginY)
      @ctx.stroke()
      @ctx.closePath()

  putO: (cell) ->
      @pieces[cell.col + cell.row * 3] = "O"
      @ctx.beginPath()
      @ctx.strokeStyle = random_color('hex')
      @ctx.lineWidth = 4
      offsetX = @PieceWidth * 0.1
      offsetY = @PieceHeight * 0.1
      beginX = cell.col * @PieceWidth + offsetX
      beginY = cell.row * @PieceHeight + offsetY
      endX = (cell.col + 1) * @PieceWidth - offsetX * 2
      endY = (cell.row + 1) * @PieceHeight - offsetY * 2
      @ctx.arc(beginX + ((endX - beginX) / 2), beginY + ((endY - beginY) / 2), (endX - beginX) / 2 , 0, Math.PI * 2, true)
      @ctx.stroke()
      @ctx.closePath()

  put: (index, player) ->
    dm = divmod(index, 3)
    cell = new Cell(dm[0], dm[1])
    if (player is "O")
        @putO cell
    else
        @putX cell

  click: (e) =>
    if (@thinking)
      if (@get_valid_moves().length > 0)
          alert("This might take a while, I just can't decide.")
          return
      else
        alert("I'm pretty sure THAT's not legal.  How about we just start again?")

    if (@game_over)
      alert('oh, should I have told you that I won?')
      @restart()
      return

    cell = @getCursorPosition(e)
    idx = cell.row * 3 + cell.col
    valid_moves = @get_valid_moves()
    if ($.inArray(idx, valid_moves) isnt -1)
      @putX(cell)
      @move()

  get_valid_moves: () ->
    ret = []
    for i in [0..8]
      if (@pieces[i] is "")
        ret.push i
    return ret

  make_move: (idx, player) ->
    @pieces[idx] = player

  undo_move: (idx) ->
    @pieces[idx] = ""

  row_wins: (arr) ->
    t = arr[0]
    if t is ""
      return false
    for p in arr
      if p is ""
        return false
      if t isnt p
        return false
    return true

  get_winner: () ->
    winning_rows = [[0,1,2], [3,4,5], [6,7,8], [0,3,6], [1,4,7], [2,5,8], [0,4,8], [2,4,6]]
    for row in winning_rows
      arr = [@pieces[row[0]], @pieces[row[1]], @pieces[row[2]]]
      if (@row_wins(arr))
          return arr[0]
    return ""

  playerindxs: () ->
    ret = []
    for i in [0..@pieces.length - 1]
      p = @pieces[i]
      if p is @player
        ret.push i
    return ret

  move: () ->
    @thinking = true
    @$gofirst.hide()
    @$restart.show()
    valid_moves = @get_valid_moves()

    # win, if possible
    for idx in valid_moves

      @make_move(idx, @computer)
      if (@get_winner() is @computer)
        @undo_move(idx)
        @put(idx, @computer)
        @game_over = true
        @thinking = false
        return

      @undo_move idx

    # don't let them win
    for idx in valid_moves

      @make_move(idx, @player)
      if (@get_winner() is @player)
        @undo_move idx
        @put idx, @computer
        @thinking = false
        return

      @undo_move idx

    # take the center
    if ($.inArray(4, valid_moves) isnt -1)
      @put 4, @computer
      @thinking = false
      return

    # grab a side if we are center and side is not opposite opponent
    sides = [1, 3, 5, 7]
    if (@pieces[4] is @computer)
      for i in [0..sides.length - 1]
        if ($.inArray(sides[i], valid_moves) isnt -1)
          if ($.inArray(8 - sides[i], @playerindxs()) is -1)
            @put(sides[i], @computer)
            @thinking = false
            return

    # take a corner if not opposite
    corners = [0, 2, 6, 8]
    for [i..corners.length - 1]
      if ($.inArray(corners[i], valid_moves) isnt -1)
        @put(corners[i], @computer)
        @thinking = false
        return

    # just make a play, probably hopeless
    if (valid_moves.length > 1)
      @put(valid_moves[0], @computer)
      @thinking = false
      return



window.TicTacToe = TicTacToe

