import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Chess} from 'chess.js'; // import Chess from  "chess.js"(default) if recieving an error about new Chess() not being a constructor
import Chessboard from 'chessboardjsx';
import Modal from '../components/Modal';
import ChooseSideModal from '../components/ChooseSideModal';
import {minimaxRoot} from '../utils/engine';
import Logo from '../components/Logo';

class HumanVsComputer extends Component {
  static propTypes = {children: PropTypes.func};
  state = {
    player: '',
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
    mode: null,
    currentTurn: 'white',
  };

  engineMove(playerMode) {
    let move = minimaxRoot(3, this.game, true, playerMode);
    this.game.move(move);
    this.setState(({pieceSquare, history, currentTurn}) => {
      this.playMusic();
      return {
        currentTurn: currentTurn == 'white' ? 'black' : 'white',
        fen: this.game.fen(),
        history: this.game.history({verbose: true}),
        squareStyles: squareStyling({pieceSquare, history}),
      };
    });
    this.checkResult();
  }
  componentDidMount() {
    this.game = new Chess();
  }
  componentDidUpdate() {
    setTimeout(() => {
      if (this.state.player != this.state.currentTurn) {
        this.engineMove(this.state.player);
      }
    }, 100);
  }
  checkResult() {
    if (this.game.isGameOver()) {
      this.setState({isEnded: true});
      if (this.game.isCheckmate()) {
        this.setState(({currentTurn}) => {
          return {winner: currentTurn == 'black' ? 'white' : 'black'};
        });
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
  setMode(mode) {
    let playerMode = mode;
    if (mode === 'random') {
      playerMode = Math.floor(Math.random(0, 1) * 2) ? 'black' : 'white';
      this.setState({
        player: playerMode,
      });
    } else this.setState({player: mode});
    if (playerMode == 'black') {
      this.engineMove(playerMode);
    }
  }
  playMusic() {
    const audio = new Audio('/move-sound.mp3');
    audio.volume = 1;
    audio.play();
  }
  onDrop = ({sourceSquare, targetSquare}) => {
    // see if the move is legal
    let move = null;
    if (this.state.currentTurn != this.state.player) return false;
    try {
      move = this.game.move({
        from: sourceSquare,
        to: targetSquare,
        promotion: 'q', // always promote to a queen for example simplicity
      });
    } catch (error) {
      return;
    }
    this.checkResult();
    this.setState(({history, pieceSquare}) => ({
      currentTurn: this.state.player == 'black' ? 'white' : 'black',
      fen: this.game.fen(),
      history: this.game.history({verbose: true}),
      squareStyles: squareStyling({pieceSquare, history}),
    }));
    this.playMusic();
  };

  onMouseOverSquare = (square) => {
    // get list of possible moves for this square
    if (
      this.game.get(square).color &&
      this.game.get(square).color != this.state.player[0]
    )
      return;
    let moves = this.game.moves({
      square: square,
      verbose: true,
    });

    // exit if there are no moves available for this square
    if (moves.length === 0) return;

    let squaresToHighlight = [];
    for (let i = 0; i < moves.length; i++) {
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
      orientation: this.state.player,
      result: this.state.isDraw ? 'Draw' : this.state.winner,
      playAgain: this.playAgain,
      setMode: this.setMode.bind(this),
      engineMove: this.engineMove.bind(this),
      player: this.state.player,
    });
  }
}

export default function Pvc() {
  return (
    <div>
      <Logo />
      <HumanVsComputer>
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
          setMode,
          engineMove,
          player,
        }) => (
          <>
            <Chessboard
              orientation={orientation}
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
              text={
                result != 'Draw'
                  ? result == player
                    ? 'You Won !!!'
                    : 'You Lost =(('
                  : 'Draw!!!'
              }
              show={result != null}
              playAgain={playAgain}
            ></Modal>
            <ChooseSideModal setMode={setMode} engineMove={engineMove} />
          </>
        )}
      </HumanVsComputer>
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
