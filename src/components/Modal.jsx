import React from 'react';
import {Link} from 'react-router-dom';
class Modal extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div
        style={{
          display: this.props.show ? 'block' : 'none',
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          background: '#242424',
          zIndex: '100000',
          padding: '10px 20px',
          color: '#fff',
          width: '300px',
          height: '200px',
        }}
      >
        <h2 style={{color: '#fff', margin: '40px 0'}}>{this.props.text}</h2>
        <div style={{display: 'flex', justifyContent: 'space-around'}}>
          <button
            style={{
              display: this.props.showPlayAgain ? 'block' : 'none',
            }}
            onClick={() => {
              this.props.playAgain();
            }}
          >
            Play Again
          </button>
          <button>
            <Link to='/' style={{color: '#fff'}}>
              Home
            </Link>
          </button>
        </div>
      </div>
    );
  }
}

export default Modal;
