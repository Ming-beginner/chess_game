import React, {Component} from 'react';

export default class ChooseSideModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show: true,
    };
  }
  handleSetMode(mode) {
    this.setState({show: false});
    this.props.setMode(mode);
  }
  render() {
    return (
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          zIndex: 1000000,
          display: this.state.show ? 'block' : 'none',
          background: 'rgba(0, 0, 0, 0.5)',
        }}
      >
        <div
          style={{
            position: 'fixed',
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)',
            background: '#000',
            width: '500px',
            height: '300px',
            zIndex: 100000,
            display: 'flex',
            justifyContent: 'space-around',
            alignItems: 'center',
            flexDirection: 'column',
          }}
        >
          <h2>Select side</h2>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-around',
              alignItem: 'center',
              width: '100%',
            }}
          >
            <button
              className='mode-box'
              onClick={() => this.handleSetMode('white')}
            >
              White
            </button>
            <button
              className='mode-box'
              onClick={() => this.handleSetMode('black')}
            >
              Black
            </button>
            <button
              className='mode-box'
              onClick={() => this.handleSetMode('random')}
            >
              Random
            </button>
          </div>
        </div>
      </div>
    );
  }
}
