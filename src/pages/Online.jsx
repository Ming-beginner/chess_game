import React, {useState} from 'react';
import {collection, addDoc, getDoc, doc} from 'firebase/firestore';
import {db, auth} from '../firebase';
import {onAuthStateChanged} from 'firebase/auth';
import {useNavigate} from 'react-router-dom';
import Logo from '../components/Logo';

export default function Online() {
  const [gameCode, setGameCode] = useState('');
  const navigate = useNavigate();
  const joinGame = async () => {
    if (gameCode) {
      const docRef = doc(db, 'chess_game', gameCode);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists) {
        //console.log(window.location.hostname);
        navigate('/online/' + gameCode);
      }
    }
  };
  const createGame = () => {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        const docRef = await addDoc(collection(db, 'chess_game'), {
          gameData: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1', //fen string
          authorId: user.uid,
          lastMove: {},
        });
        navigate('/online/' + docRef.id);
      }
    });
  };
  return (
    <div style={{display: 'flex', flexDirection: 'column', width: '500px'}}>
      <Logo />
      <div
        style={{
          width: '100%',
          margin: '20px 0',
          display: 'flex',
          justifyContent: 'space-between',
        }}
      >
        <input
          value={gameCode}
          onChange={(e) => setGameCode(e.target.value)}
          style={{width: '90%', height: '40px'}}
          placeholder='Enter game code'
        />
        <button onClick={joinGame}>Submit</button>
      </div>
      <button style={{width: '100%'}} onClick={createGame}>
        New game
      </button>
    </div>
  );
}
