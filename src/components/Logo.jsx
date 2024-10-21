import React from 'react';
import {Link} from 'react-router-dom';
export default function Logo() {
  return (
    <Link
      to='/'
      style={{
        color: 'white',
        position: 'fixed',
        top: 20,
        left: 20,
        fontSize: 28,
      }}
    >
      Chess game online
    </Link>
  );
}
