import React, { Component } from "react"
import "./App.css"

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      staticWorkMinute: 25,
      workMinutes: 25,
      staticWorkSeconds: 0,
      workSeconds: 0,
      staticBreakSeconds: 0,
      breakSeconds: 5,
      staticBreakMinute: 25,
      breakMinutes: 0,
      countingDown: true,
      title: "Work Timer"
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
      alert("buzzzzzzz")
      if (this.state.title === "Break Timer") {
        this.setState({
          workMinutes: this.state.staticBreakMinute,
          workSeconds: this.state.staticBreakkSeconds + 1,
          title: "Work Timer"
        })
      } else {
        this.setState({
          workMinutes: this.state.breakMinutes,
          workSeconds: this.state.breakSeconds + 1,
          title: "Break Timer"
        })
      }
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
    if (this.state.title === "Work Timer") {
      this.setState({
        workMinutes: this.state.staticWorkMinute,
        workSeconds: this.state.staticWorkSeconds,
        countingDown: false
      })
    } else {
      this.setState({
        workMinutes: this.state.staticBreakMinute,
        workSeconds: this.state.staticBreakSeconds,
        countingDown: false
      })
    }
  }

  generateTime(time) {
    if (time <= 9) {
      return <span>0{time}</span>
    } else {
      return <span>{time}</span>
    }
  }

  handleWorkMinutesChange(e) {
    if (this.state.title === "Break Timer" || /[a-zA-Z]/.test(e.target.value)) {
      return null
    }
    this.setState({
      countingDown: false,
      staticWorkMinute: e.target.value,
      workMinutes: e.target.value,
      workSeconds: this.state.staticWorkSeconds
    })
  }

  convertSecsToMins(secs) {
    const numOfMin = secs / 60
    const minsToAdd = Math.floor(numOfMin)
    const secsToAdd = secs - minsToAdd * 60
    this.setState({
      countingDown: false,
      staticWorkSeconds: secsToAdd,
      workSeconds: secsToAdd,
      workMinutes: this.state.staticWorkMinute + minsToAdd
    })
  }

  handleWorkSecondsChange(e) {
    if (this.state.title === "Break Timer" || /[a-zA-Z]/.test(e.target.value)) {
      return null
    }
    const parsedWorkSecs = parseInt(e.target.value)
    if (!isNaN(parsedWorkSecs) && parsedWorkSecs > 60) {
      this.convertSecsToMins(parsedWorkSecs)
      return null
    }
    this.setState({
      countingDown: false,
      staticWorkSeconds: e.target.value,
      workSeconds: e.target.value,
      workMinutes: this.state.staticWorkMinute
    })
  }

  render() {
    const {
      title,
      workMinutes,
      workSeconds,
      breakMinutes,
      countingDown,
      breakSeconds,
      staticWorkSeconds,
      staticWorkMinute
    } = this.state

    return (
      <div className="App">
        <span>{title}</span>
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
                value={staticWorkSeconds}
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
              <input type="text" />
            </div>
            <div>
              <span>Secs:</span>
              <input type="text" />
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default App
