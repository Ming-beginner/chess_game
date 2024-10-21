var reverseArray = function (array) {
  return array.slice().reverse();
};

let pawnEvalWhite = [
  [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0],
  [5.0, 5.0, 5.0, 5.0, 5.0, 5.0, 5.0, 5.0],
  [1.0, 1.0, 2.0, 3.0, 3.0, 2.0, 1.0, 1.0],
  [0.5, 0.5, 1.0, 2.5, 2.5, 1.0, 0.5, 0.5],
  [0.0, 0.0, 0.0, 2.0, 2.0, 0.0, 0.0, 0.0],
  [0.5, -0.5, -1.0, 0.0, 0.0, -1.0, -0.5, 0.5],
  [0.5, 1.0, 1.0, -2.0, -2.0, 1.0, 1.0, 0.5],
  [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0],
];

let pawnEvalBlack = reverseArray(pawnEvalWhite);

let knightEval = [
  [-5.0, -4.0, -3.0, -3.0, -3.0, -3.0, -4.0, -5.0],
  [-4.0, -2.0, 0.0, 0.0, 0.0, 0.0, -2.0, -4.0],
  [-3.0, 0.0, 1.0, 1.5, 1.5, 1.0, 0.0, -3.0],
  [-3.0, 0.5, 1.5, 2.0, 2.0, 1.5, 0.5, -3.0],
  [-3.0, 0.0, 1.5, 2.0, 2.0, 1.5, 0.0, -3.0],
  [-3.0, 0.5, 1.0, 1.5, 1.5, 1.0, 0.5, -3.0],
  [-4.0, -2.0, 0.0, 0.5, 0.5, 0.0, -2.0, -4.0],
  [-5.0, -4.0, -3.0, -3.0, -3.0, -3.0, -4.0, -5.0],
];

let bishopEvalWhite = [
  [-2.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -2.0],
  [-1.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, -1.0],
  [-1.0, 0.0, 0.5, 1.0, 1.0, 0.5, 0.0, -1.0],
  [-1.0, 0.5, 0.5, 1.0, 1.0, 0.5, 0.5, -1.0],
  [-1.0, 0.0, 1.0, 1.0, 1.0, 1.0, 0.0, -1.0],
  [-1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, -1.0],
  [-1.0, 0.5, 0.0, 0.0, 0.0, 0.0, 0.5, -1.0],
  [-2.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -2.0],
];

let bishopEvalBlack = reverseArray(bishopEvalWhite);

let rookEvalWhite = [
  [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0],
  [0.5, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 0.5],
  [-0.5, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, -0.5],
  [-0.5, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, -0.5],
  [-0.5, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, -0.5],
  [-0.5, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, -0.5],
  [-0.5, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, -0.5],
  [0.0, 0.0, 0.0, 0.5, 0.5, 0.0, 0.0, 0.0],
];

let rookEvalBlack = reverseArray(rookEvalWhite);

let evalQueen = [
  [-2.0, -1.0, -1.0, -0.5, -0.5, -1.0, -1.0, -2.0],
  [-1.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, -1.0],
  [-1.0, 0.0, 0.5, 0.5, 0.5, 0.5, 0.0, -1.0],
  [-0.5, 0.0, 0.5, 0.5, 0.5, 0.5, 0.0, -0.5],
  [0.0, 0.0, 0.5, 0.5, 0.5, 0.5, 0.0, -0.5],
  [-1.0, 0.5, 0.5, 0.5, 0.5, 0.5, 0.0, -1.0],
  [-1.0, 0.0, 0.5, 0.0, 0.0, 0.0, 0.0, -1.0],
  [-2.0, -1.0, -1.0, -0.5, -0.5, -1.0, -1.0, -2.0],
];

let kingEvalWhite = [
  [-3.0, -4.0, -4.0, -5.0, -5.0, -4.0, -4.0, -3.0],
  [-3.0, -4.0, -4.0, -5.0, -5.0, -4.0, -4.0, -3.0],
  [-3.0, -4.0, -4.0, -5.0, -5.0, -4.0, -4.0, -3.0],
  [-3.0, -4.0, -4.0, -5.0, -5.0, -4.0, -4.0, -3.0],
  [-2.0, -3.0, -3.0, -4.0, -4.0, -3.0, -3.0, -2.0],
  [-1.0, -2.0, -2.0, -2.0, -2.0, -2.0, -2.0, -1.0],
  [2.0, 2.0, 0.0, 0.0, 0.0, 0.0, 2.0, 2.0],
  [2.0, 3.0, 1.0, 0.0, 0.0, 1.0, 3.0, 2.0],
];

let kingEvalBlack = reverseArray(kingEvalWhite);

export const evaluateBoard = (board) => {
  //console.log(board);
  let total = 0;
  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 8; j++) {
      total += getPieceValue(board[i][j], i, j);
    }
  }
  return total;
};

export const getPieceValue = function (piece, x, y) {
  if (piece === null) {
    return 0;
  }
  let getAbsoluteValue = function (piece, isWhite, x, y) {
    if (piece.type === 'p') {
      return 10 + (isWhite ? pawnEvalWhite[y][x] : pawnEvalBlack[y][x]);
    } else if (piece.type === 'r') {
      return 50 + (isWhite ? rookEvalWhite[y][x] : rookEvalBlack[y][x]);
    } else if (piece.type === 'n') {
      return 30 + knightEval[y][x];
    } else if (piece.type === 'b') {
      return 30 + (isWhite ? bishopEvalWhite[y][x] : bishopEvalBlack[y][x]);
    } else if (piece.type === 'q') {
      return 90 + evalQueen[y][x];
    } else if (piece.type === 'k') {
      return 900 + (isWhite ? kingEvalWhite[y][x] : kingEvalBlack[y][x]);
    }
    throw 'Unknown piece type: ' + piece.type;
  };

  let absoluteValue = getAbsoluteValue(piece, piece.color === 'w', x, y);
  return piece.color === 'w' ? absoluteValue : -absoluteValue;
};
export const calcBestMove = (game, player) => {
  let bestMove = null;
  let bestValue = -99999;
  let availableMoves = game.moves();
  for (let newMove of availableMoves) {
    game.move(newMove);
    let boardValue = evaluateBoard(game.board());
    boardValue = player == 'white' ? -boardValue : boardValue;
    console.log(boardValue);
    game.undo();
    if (boardValue > bestValue) {
      bestValue = boardValue;
      bestMove = newMove;
    }
  }
  return bestMove;
};

export const minimaxRoot = (depth, game, isMaximizing, player) => {
  let availableMoves = game.moves();
  let bestVal = -99999;
  let bestMove = null;

  for (let i = 0; i < availableMoves.length; i++) {
    game.move(availableMoves[i]);
    let value = minimax(depth - 1, game, -1000, 1000, !isMaximizing, player);
    game.undo();
    if (value >= bestVal) {
      bestVal = value;
      bestMove = availableMoves[i];
    }
  }
  return bestMove;
};

export const minimax = (depth, game, alpha, beta, isMaximizing, player) => {
  if (depth == 0) {
    let boardValue = evaluateBoard(game.board());
    return player !== 'black' ? -boardValue : boardValue;
  }
  let availableMoves = game.moves();
  if (isMaximizing) {
    let bestVal = -9999;
    for (let i = 0; i < availableMoves.length; i++) {
      game.move(availableMoves[i]);
      bestVal = Math.max(
        bestVal,
        minimax(depth - 1, game, alpha, beta, !isMaximizing, player)
      );
      alpha = Math.max(alpha, bestVal);
      game.undo();
      if (beta <= alpha) {
        return bestVal;
      }
    }
    return bestVal;
  } else {
    let bestVal = 9999;
    for (let i = 0; i < availableMoves.length; i++) {
      game.move(availableMoves[i]);
      bestVal = Math.min(
        bestVal,
        minimax(depth - 1, game, alpha, beta, !isMaximizing, player)
      );
      beta = Math.min(beta, bestVal);
      game.undo();
      if (beta <= alpha) {
        return bestVal;
      }
    }
    return bestVal;
  }
};
