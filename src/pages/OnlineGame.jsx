import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {getAuth, onAuthStateChanged} from 'firebase/auth';
import {doc, getDoc, onSnapshot, updateDoc} from 'firebase/firestore';
import Chessboard from 'chessboardjsx';
import {Chess} from 'chess.js';
import {db} from '../firebase';
import Modal from '../components/Modal';
import Logo from '../components/Logo';
const auth = getAuth();

class OnlineHumanVsHuman extends Component {
  static propTypes = {children: PropTypes.func};
  constructor(props) {
    super(props);
    this.state = {
      id: window.location.href.split('/')[
        window.location.href.split('/').length - 1
      ],
      piece: 'white',
      fen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
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
  }
  gameId =
    window.location.href.split('/')[window.location.href.split('/').length - 1];
  playMusic() {
    const audio = new Audio('/move-sound.mp3');
    audio.volume = 1;
    audio.play();
  }
  componentDidMount() {
    this.game = new Chess();
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        const uid = user.uid;
        const docSnap = await getDoc(doc(db, 'chess_game', this.gameId));
        if (docSnap.exists()) {
          if (docSnap.data().authorId != user.uid) {
            this.state.piece = 'black';
          }
        }
      } else {
        window.location.href = 'http://localhost:5173/';
      }
    });
  }
  componentDidUpdate() {
    onSnapshot(doc(db, 'chess_game', this.gameId), (doc) => {
      //console.log(doc.data().gameData);
      this.setState({
        fen: doc.data().gameData,
      });
      this.checkResult();
    });
    //this.game.load(this.state.fen);
    //console.log(this.state.fen);
    this.game.load(this.state.fen);
    //console.log(this.game.turn());
  }
  checkResult() {
    if (this.game.isGameOver()) {
      this.setState({isEnded: true});
      if (this.game.isCheckmate()) {
        let currentTurn = this.game.turn() == 'w' ? 'white' : 'black';
        this.setState(({piece}) => ({
          result: currentTurn == piece ? 'YOU LOST !!!' : 'YOU WIN !!!',
        }));
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
  onDrop = async ({sourceSquare, targetSquare}) => {
    if (this.game.get(sourceSquare).color != this.state.piece[0]) return false;
    // see if the move is legal
    let move = null;
    try {
      move = this.game.move({
        from: sourceSquare,
        to: targetSquare,
        promotion: 'q', // always promote to a queen for example simplicity
      });
      await updateDoc(doc(db, 'chess_game', this.gameId), {
        gameData: this.game.fen(),
        lastMove: move,
      });
    } catch (error) {
      return;
    }

    // illegal move
    if (move === null) return;
    this.checkResult();
    this.setState(({history, pieceSquare}) => ({
      fen: this.game.fen(),
      history: this.game.history({verbose: true}),
      squareStyles: squareStyling({pieceSquare, history}),
    }));
    this.playMusic();
  };

  onMouseOverSquare = (square) => {
    if (this.game.get(square).color != this.state.piece[0]) return false;
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
    if (this.game.get(square).color != this.state.piece[0]) return false;
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
      orientation: this.state.piece,
      result: this.state.result,
      playAgain: this.playAgain,
      gameId: this.gameId,
    });
  }
}

export default function OnlineGame() {
  return (
    <div>
      <Logo />
      <OnlineHumanVsHuman>
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
          gameId,
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
            <h3>Game code: {gameId}</h3>
            <Modal
              text={result != 'Draw' ? result : 'DRAW !!!'}
              show={result != null}
              playAgain={playAgain}
              showPlayAgain={false}
            >
              <h2>
                {result} {result != 'Draw' ? 'Win!!!' : ''}
              </h2>
            </Modal>
          </>
        )}
      </OnlineHumanVsHuman>
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
