import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Chess} from 'chess.js'; // import Chess from  "chess.js"(default) if recieving an error about new Chess() not being a constructor
import Chessboard from 'chessboardjsx';
import Modal from '../components/Modal';
import Logo from '../components/Logo';

class HumanVsHuman extends Component {
  static propTypes = {children: PropTypes.func};

  state = {
    currentTurn: 'white',
    fen: 'start',
    // square styles for active drop square
    dropSquareStyle: {},
    // custom square styles
    squareStyles: {},
    // square with the currently clicked piece
    pieceSquare: '',
    // currently clicked square
    square: '',
    // array of past game moves
    history: [],
    isEnded: false,
    isDraw: false,
    winner: null,
  };
  playMusic() {
    const audio = new Audio('/move-sound.mp3');
    audio.volume = 1;
    audio.play();
  }
  componentDidMount() {
    this.game = new Chess();
  }
  checkResult() {
    if (this.game.isGameOver()) {
      this.setState({isEnded: true});
      if (this.game.isCheckmate()) {
        this.setState(({currentTurn}) => ({winner: currentTurn}));
      } else if (this.game.isDraw()) this.setState({isDraw: true});
    }
  }

  // keep clicked square style and remove hint squares
  removeHighlightSquare = () => {
    this.setState(({pieceSquare, history}) => ({
      squareStyles: squareStyling({pieceSquare, history}),
    }));
  };

  // show possible moves
  highlightSquare = (sourceSquare, squaresToHighlight) => {
    const highlightStyles = [sourceSquare, ...squaresToHighlight].reduce(
      (a, c) => {
        return {
          ...a,
          ...{
            [c]: {
              background:
                'radial-gradient(circle, #fffc00 36%, transparent 40%)',
              borderRadius: '50%',
            },
          },
          ...squareStyling({
            history: this.state.history,
            pieceSquare: this.state.pieceSquare,
          }),
        };
      },
      {}
    );

    this.setState(({squareStyles}) => ({
      squareStyles: {...squareStyles, ...highlightStyles},
    }));
  };

  onDrop = ({sourceSquare, targetSquare}) => {
    // see if the move is legal
    let move = null;
    try {
      move = this.game.move({
        from: sourceSquare,
        to: targetSquare,
        promotion: 'q', // always promote to a queen for example simplicity
      });
    } catch (error) {
      return;
    }

    // illegal move
    this.checkResult();
    this.setState(({history, pieceSquare, currentTurn}) => ({
      currentTurn: currentTurn == 'white' ? 'black' : 'white',
      fen: this.game.fen(),
      history: this.game.history({verbose: true}),
      squareStyles: squareStyling({pieceSquare, history}),
    }));
    this.playMusic();
  };

  onMouseOverSquare = (square) => {
    // get list of possible moves for this square
    let moves = this.game.moves({
      square: square,
      verbose: true,
    });

    // exit if there are no moves available for this square
    if (moves.length === 0) return;

    let squaresToHighlight = [];
    for (var i = 0; i < moves.length; i++) {
      squaresToHighlight.push(moves[i].to);
    }

    this.highlightSquare(square, squaresToHighlight);
  };

  onMouseOutSquare = (square) => this.removeHighlightSquare(square);

  // central squares get diff dropSquareStyles
  onDragOverSquare = (square) => {
    this.setState({
      dropSquareStyle:
        square === 'e4' || square === 'd4' || square === 'e5' || square === 'd5'
          ? {backgroundColor: 'cornFlowerBlue'}
          : {boxShadow: 'inset 0 0 1px 4px rgb(255, 255, 0)'},
    });
  };

  onSquareRightClick = (square) =>
    this.setState({
      squareStyles: {[square]: {backgroundColor: 'deepPink'}},
    });
  playAgain = () => {
    this.game = new Chess();
    this.setState({
      currentTurn: 'white',
      fen: 'start',
      // square styles for active drop square
      dropSquareStyle: {},
      // custom square styles
      squareStyles: {},
      // square with the currently clicked piece
      pieceSquare: '',
      // currently clicked square
      square: '',
      // array of past game moves
      history: [],
      isEnded: false,
      isDraw: false,
      winner: null,
    });
  };
  render() {
    const {fen, dropSquareStyle, squareStyles} = this.state;

    return this.props.children({
      squareStyles,
      position: fen,
      onMouseOverSquare: this.onMouseOverSquare,
      onMouseOutSquare: this.onMouseOutSquare,
      onDrop: this.onDrop,
      dropSquareStyle,
      onDragOverSquare: this.onDragOverSquare,
      onSquareClick: this.onSquareClick,
      onSquareRightClick: this.onSquareRightClick,
      orientation: this.state.currentTurn,
      result: this.state.isDraw ? 'Draw' : this.state.winner,
      playAgain: this.playAgain,
    });
  }
}

export default function Pvp() {
  return (
    <div>
      <Logo />
      <HumanVsHuman>
        {({
          position,
          onDrop,
          onMouseOverSquare,
          onMouseOutSquare,
          squareStyles,
          dropSquareStyle,
          onDragOverSquare,
          onSquareClick,
          onSquareRightClick,
          orientation,
          result,
          playAgain,
        }) => (
          <>
            <Chessboard
              orientation={orientation}
              id='humanVsHuman'
              position={position}
              onDrop={onDrop}
              onMouseOverSquare={onMouseOverSquare}
              onMouseOutSquare={onMouseOutSquare}
              boardStyle={{
                borderRadius: '5px',
                boxShadow: `0 5px 15px rgba(0, 0, 0, 0.5)`,
              }}
              squareStyles={squareStyles}
              dropSquareStyle={dropSquareStyle}
              onDragOverSquare={onDragOverSquare}
              onSquareClick={onSquareClick}
              onSquareRightClick={onSquareRightClick}
            />
            <Modal
              text={result != 'Draw' ? result + ' win!!!' : result}
              show={result != null}
              playAgain={playAgain}
              showPlayAgain={true}
            ></Modal>
          </>
        )}
      </HumanVsHuman>
    </div>
  );
}

const squareStyling = ({pieceSquare, history}) => {
  const sourceSquare = history.length && history[history.length - 1].from;
  const targetSquare = history.length && history[history.length - 1].to;
  return {
    [pieceSquare]: {backgroundColor: 'rgba(255, 255, 0, 0.4)'},
    ...(history.length && {
      [sourceSquare]: {
        backgroundColor: 'rgba(255, 255, 0, 0.4)',
      },
    }),
    ...(history.length && {
      [targetSquare]: {
        backgroundColor: 'rgba(255, 255, 0, 0.4)',
      },
    }),
  };
};
