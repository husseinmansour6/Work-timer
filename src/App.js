import React, { Component } from "react"
import "./App.css"

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      workSeconds: 0,
      workMinutes: 25,
      breakSeconds: 0,
      breakMinutes: 5,
      countingDown: true,
      staticWorkMinute: 25,
      staticWorkSeconds: 0
    }
  }

  componentDidMount() {
    this.secondsInterval = setInterval(
      () => this.state.countingDown && this.decSeconds(),
      1000
    )
  }

  resetIntervals() {
    clearInterval(this.secondsInterval)
  }

  togglePlayPause() {
    if (this.state.workSeconds === "") {
      this.setState({
        workSeconds: 60
      })
    }
    this.setState({
      countingDown: !this.state.countingDown
    })
  }

  decSeconds() {
    const parsedWorkMins = parseInt(this.state.workMinutes)
    const parsedWorkSecs = parseInt(this.state.workSeconds)
    const zeroWorkMins = parsedWorkMins === 0 || isNaN(parsedWorkMins)
    const zeroWorkSecs = parsedWorkSecs === 0 || isNaN(parsedWorkSecs)
    const shouldResetInterval = zeroWorkMins && zeroWorkSecs

    if (shouldResetInterval) {
      this.resetIntervals()
      return null
    }

    if (this.state.workSeconds === 0) {
      this.setState({
        workSeconds: 60,
        workMinutes: this.state.workMinutes - 1
      })
    }
    this.setState({
      workSeconds: this.state.workSeconds - 1
    })
  }

  handleReset() {
    this.setState({
      workMinutes: this.state.staticWorkMinute,
      workSeconds: this.state.staticWorkSeconds,
      countingDown: false
    })
  }

  generateTime(time) {
    if (time <= 9) {
      return <span>0{time}</span>
    } else {
      return <span>{time}</span>
    }
  }

  handleWorkMinutesChange(e) {
    this.setState({
      countingDown: false,
      staticWorkMinute: e.target.value,
      workMinutes: e.target.value,
      workSeconds: this.state.staticWorkSeconds
    })
  }

  handleWorkSecondsChange(e) {
    this.setState({
      countingDown: false,
      staticWorkSeconds: e.target.value,
      workSeconds: e.target.value,
      workMinutes: this.state.staticWorkMinute
    })
  }

  render() {
    const {
      workMinutes,
      workSeconds,
      breakMinutes,
      countingDown,
      breakSeconds,
      staticWorkMinute
    } = this.state

    return (
      <div className="App">
        <span>Work timer</span>
        <div>
          {this.generateTime(workMinutes)}
          <span>:</span>
          {this.generateTime(workSeconds)}
        </div>
        <div>
          <button title="countingDown" onClick={() => this.togglePlayPause()}>
            {countingDown ? "Pause" : "Start"}
          </button>
          <button title="reset" onClick={() => this.handleReset()}>
            reset
          </button>
        </div>
        <div>
          <div>
            <div>
              <span>Work time:</span>
            </div>
            <div>
              <span>Mins:</span>
              <input
                type="text"
                value={staticWorkMinute}
                onChange={e => this.handleWorkMinutesChange(e)}
              />
            </div>
            <div>
              <span>Secs:</span>
              <input
                type="text"
                // value={staticWorkSeconds}
                onChange={e => this.handleWorkSecondsChange(e)}
              />
            </div>
          </div>
          <div>
            <div>
              <span>Break time:</span>
            </div>
            <div>
              <span>Mins:</span>
              <input type="text" value={breakMinutes} />
            </div>
            <div>
              <span>Secs:</span>
              <input type="text" value={breakSeconds} />
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default App
