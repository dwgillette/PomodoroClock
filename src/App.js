import React from 'react';
import './App.scss';
import 'font-awesome/css/font-awesome.min.css';

class Pomodoro extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      session: 25,
      break: 5,
      timerIsActive: false,
      timerLabel: 'Session',
      interval: '',
      timer: 1500,
      color: {color: 'black'}
    }
    this.makeClock = this.makeClock.bind(this);
    this.toggleTimer = this.toggleTimer.bind(this);
    this.countdown = this.countdown.bind(this);
    this.reset = this.reset.bind(this);
    this.increment = this.increment.bind(this);
    this.switchMode = this.switchMode.bind(this);
    this.changeColor = this.changeColor.bind(this);
    this.playAlarm = this.playAlarm.bind(this);
    this.stopAlarm = this.stopAlarm.bind(this);
  }
  
  increment(value, type) {
    if (type === 'session' && !this.state.timerIsActive) {
      this.setState({
        session: value > 0 && this.state.session < 60 ?
          this.state.session + 1 :
          value < 0 && this.state.session > 1 ?
          this.state.session - 1 :
          this.state.session,
        timer: value > 0 && this.state.session < 60 && this.state.timerLabel === 'Session' ?
          (this.state.session + 1) * 60 :
          value < 0 && this.state.session > 1 && this.state.timerLabel === 'Session' ?
          (this.state.session - 1) * 60 :
          this.state.timer
      })
    } else if (type === 'break' && !this.state.timerIsActive) {
      this.setState({
        break: value > 0 && this.state.break < 60 ?
          this.state.break + 1 :
          value < 0 && this.state.break > 1 ?
          this.state.break - 1 :
          this.state.break,
        timer: value > 0 && this.state.break < 60 && this.state.timerLabel === 'Break' ?
          (this.state.break + 1) * 60 :
          value < 0 && this.state.break > 1 && this.state.timerLabel === 'Break' ?
          (this.state.break - 1) * 60 :
          this.state.timer 
      })
    }
  }
  
  toggleTimer() {
    this.setState ({
      timerIsActive: !this.state.timerIsActive,
      interval: this.state.timerIsActive ?
        clearInterval(this.state.interval) :
        setInterval(this.countdown, 1000)
    })
  }
  
  countdown() {
    this.switchMode();
    if (this.state.timerIsActive && this.state.timer > 0) {
      this.setState({
        timer: this.state.timer -1
      })
    }
    this.changeColor();
  }
  
  switchMode() {
    if (this.state.timer === 0 && this.state.timerLabel === 'Session') {
      this.playAlarm();
      this.setState({
        timerLabel: 'Break',
        timer: this.state.break * 60 +1
      })
    } else if (this.state.timer === 0 && this.state.timerLabel === 'Break') {
      this.playAlarm();
      this.setState({
        timerLabel: 'Session',
        timer: this.state.session * 60 +1
      })
    }
  }
  
  changeColor() {
    if (this.state.timer < 60) {
      this.setState({
        color: {color: '#E00000'}
      })
    } else {
      this.setState({
        color: {color: 'black'}
      })
    }
  }
  
  reset() {
    this.stopAlarm();
    this.setState({
      session: 25,
      break: 5,
      timerIsActive: false,
      timerLabel: 'Session',
      interval: clearInterval(this.state.interval),
      timer: 1500,
      color: {color: 'black'}
    })
  }
  
  makeClock() {
    let minutes = Math.floor(this.state.timer / 60);
    let seconds = this.state.timer - minutes * 60;
    seconds = seconds < 10 ? '0' + seconds : seconds;
    minutes = minutes < 10? '0' + minutes : minutes;
    return minutes + ':' + seconds;
  }
  
  playAlarm() {
    const sound = document.getElementById('beep');
    sound.currentTime = 0;
    sound.volume = 1;
    sound.play();
  }
  
  stopAlarm() {
    const sound = document.getElementById('beep');
    sound.pause();
    sound.currentTime = 0;
  }
  
  render() {
    return (
      <div id='clock'>
        <h1>Pomodoro Clock</h1>
        <div id='control-bar'>
          <BreakController break={this.state.break} onClick={this.increment} type='break' pos={1} neg={-1}/>
          <SessionController session={this.state.session} onClick={this.increment} type='session' pos={1} neg={-1}/>
        </div>
        <Timer label={this.state.timerLabel} timer={this.makeClock(this.state.timer)} color={this.state.color}/>
        <StartStopReset toggle={this.toggleTimer} reset={this.reset}/>
        <audio id='beep' preload='auto' src='https://goo.gl/65cBl1'></audio>
      </div>
    );
  }
}

const Timer = (props) => {
  return (
    <div id='timer'>
      <h2 id='timer-label' style={props.color}>{props.label}</h2>
      <div id='time-left' style={props.color}>{props.timer}</div>
    </div>
  )
}

const BreakController = (props) => {
  return (
    <div id='controller'>
      <h2 id='break-label'>Break Length</h2>
      <div id='controls'>
        <i className="fa fa-arrow-down" id='break-decrement' onClick={()=>props.onClick(props.neg, props.type)}></i>
        <h2 id='break-length'>{props.break}</h2>
        <i className="fa fa-arrow-up" id='break-increment' onClick={()=>props.onClick(props.pos, props.type)}></i>
      </div>
    </div>
  );
}

const SessionController = (props) => {
  return (
    <div id='controller'>
      <h2 id='session-label'>Session Length</h2>
      <div id='controls'>
        <i className="fa fa-arrow-down" id='session-decrement' onClick={()=>props.onClick(props.neg, props.type)}></i>
        <h2 id='session-length'>{props.session}</h2>
        <i className="fa fa-arrow-up" id='session-increment' onClick={()=>props.onClick(props.pos, props.type)}></i>
      </div>
    </div>
  );
}

const StartStopReset = (props) => {
  return (
    <div id='start-stop-reset'>
      <div id='start_stop' onClick={props.toggle}>
        <i className="fa fa-play fa-2x"/>
        <i className="fa fa-pause fa-2x"/>
      </div>
      <i className="fa fa-undo" id='reset' onClick={props.reset}/>
    </div>  
  )
}

export default Pomodoro;
