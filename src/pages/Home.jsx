/* eslint-disable no-unused-vars */
import React, {useEffect} from 'react';
import {Link} from 'react-router-dom';
import {signInAnonymously} from 'firebase/auth';
import {auth} from '../firebase';

export default function Home() {
  useEffect(() => {
    async function login() {
      signInAnonymously(auth);
    }
    login();
  }, []);
  return (
    <div>
      <h1>Chess game online</h1>
      <div>
        <Link to='pvp' className='home-button'>
          <button>2 Players</button>
        </Link>
        <Link to='/pvc' className='home-button'>
          <button to='/pvc'>Play with computer</button>
        </Link>
        <Link to='online' className='home-button'>
          <button>Play online</button>
        </Link>
      </div>
    </div>
  );
}
