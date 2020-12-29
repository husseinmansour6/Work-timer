import React, { Component } from "react"
import "./App.css"

class GenerateTime extends Component {
  generateTime(time) {
    if (time <= 9) {
      return <span>0{time}</span>
    } else {
      return <span>{time}</span>
    }
  }
  render() {
    const { minutes, seconds } = this.props
    return (
      <div>
        {this.generateTime(minutes)}
        <span>:</span>
        {this.generateTime(seconds)}
      </div>
    )
  }
}

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      minutes: 1,
      seconds: 58,
      staticWorkMinutes: 1,
      staticWorkSeconds: 58,
      staticBreakSeconds: 0,
      staticBreakMinutes: 1,
      title: "Work Timer",
      started: false,
      stateChange: false
    }
  }

  componentDidUpdate(prevState, prevProps) {
    // change back the value of `stateChange`
    if (this.state.stateChange !== prevProps.stateChange) {
      return this.setState({ stateChange: false })
    }
  }

  convertSecsToMins(secs) {
    const numOfMin = secs / 60
    const minsToAdd = Math.floor(numOfMin)
    const secsToAdd = secs - minsToAdd * 60
    return { secsToAdd, minsToAdd }
  }

  cleanValue(value) {
    const shouldRemoveZero =
      value && value.indexOf("0") === 0 && value.split("").length > 1
    const cleanValue = shouldRemoveZero
      ? value
          .split("")
          .slice(1)
          .join()
      : value

    return cleanValue
  }

  handleTimeChange({ changedTime, event, condition, staticChangedTime }) {
    // prevent updating state when we first load the app or if the value is not a number
    const value = event.target.value
    const updatingCurrentTime = this.state.title
      .toLowerCase()
      .includes(condition)

    const zerosInTheEnteredTime =
      value && value.split("").filter(x => x === "0")
    if (
      (this.state.started && updatingCurrentTime) ||
      zerosInTheEnteredTime.length > 1
    )
      return null

    const cleanedValue = this.cleanValue(value)
    let enteredTime = cleanedValue && cleanedValue.replace(/\D/g, "")
    const parsedChangedTime = parseInt(enteredTime)
    let convertedTime
    if (
      !isNaN(parsedChangedTime) &&
      parsedChangedTime >= 60 &&
      changedTime === "seconds"
    ) {
      convertedTime = this.convertSecsToMins(parsedChangedTime)
    }

    if (updatingCurrentTime) {
      // update the minutes only on work timer
      if (convertedTime) {
        if (condition === "work") {
          return this.setState({
            seconds: convertedTime.secsToAdd,
            staticWorkMinutes: convertedTime.minsToAdd,
            staticWorkSeconds: convertedTime.secsToAdd,
            minutes: convertedTime.minsToAdd,
            stateChange: true
          })
        } else {
          return this.setState({
            seconds: convertedTime.secsToAdd,
            staticBreakMinutes: convertedTime.minsToAdd,
            staticBreakSeconds: convertedTime.secsToAdd,
            minutes: convertedTime.minsToAdd,
            stateChange: true
          })
        }
      } else {
        return this.setState({
          [staticChangedTime]: enteredTime,
          [changedTime]: enteredTime,
          stateChange: true
        })
      }
    } else {
      if (convertedTime) {
        if (condition === "work") {
          return this.setState({
            staticWorkMinutes: convertedTime.minsToAdd,
            staticWorkSeconds: convertedTime.secsToAdd,
            stateChange: true
          })
        } else {
          return this.setState({
            staticBreakMinutes: convertedTime.minsToAdd,
            staticBreakSeconds: convertedTime.secsToAdd,
            stateChange: true
          })
        }
      } else {
        return this.setState({
          [staticChangedTime]: enteredTime,
          stateChange: true
        })
      }
    }
  }

  toggleCounter() {
    clearInterval(this.secondsInterval)
    if (!this.state.minutes && !this.state.seconds) return
    this.setState(prevProps => ({
      started: !prevProps.started
    }))
    if (!this.state.started) {
      this.secondsInterval = setInterval(this.countDownSec, 1000)
    } else {
      clearInterval(this.secondsInterval)
    }
  }

  countDownSec = () => {
    if (this.state.seconds <= 1 && this.state.minutes >= 1) {
      this.setState({
        minutes: this.state.minutes - 1,
        seconds: 60
      })
    }

    if (this.state.seconds === 0 && parseInt(this.state.minutes) === 0) {
      if (this.state.title === "Work Timer") {
        this.setState({
          minutes: this.state.staticBreakMinutes,
          seconds: this.state.staticBreakSeconds,
          title: "Break Timer"
        })
      } else {
        this.setState({
          minutes: this.state.staticWorkMinutes,
          seconds: this.state.staticWorkSeconds,
          title: "Work Timer"
        })
      }
    } else {
      this.setState(prevProps => ({
        seconds: prevProps.seconds - 1
      }))
    }
  }

  handleReset() {
    clearInterval(this.secondsInterval)
    if (this.state.title === "Work Timer") {
      return this.setState({
        minutes: this.state.staticWorkMinutes,
        seconds: this.state.staticWorkSeconds,
        started: false
      })
    } else {
      return this.setState({
        minutes: this.state.staticBreakMinutes,
        seconds: this.state.staticBreakSeconds,
        started: false
      })
    }
  }

  render() {
    const {
      title,
      minutes,
      seconds,
      started,
      staticWorkSeconds,
      staticWorkMinutes,
      staticBreakMinutes,
      staticBreakSeconds
    } = this.state

    return (
      <div className="App">
        <span>{title}</span>
        <GenerateTime minutes={minutes} seconds={seconds} />
        <div>
          <button title="countingDown" onClick={() => this.toggleCounter()}>
            {started ? "Pause" : "Start"}
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
                value={staticWorkMinutes}
                onChange={e =>
                  this.handleTimeChange({
                    event: e,
                    changedTime: "minutes",
                    staticChangedTime: "staticWorkMinutes",
                    condition: "work"
                  })
                }
              />
            </div>
            <div>
              <span>Secs:</span>
              <input
                type="text"
                value={staticWorkSeconds}
                onChange={e =>
                  this.handleTimeChange({
                    event: e,
                    changedTime: "seconds",
                    staticChangedTime: "staticWorkSeconds",
                    condition: "work"
                  })
                }
              />
            </div>
          </div>
          <div>
            <div>
              <span>Break time:</span>
            </div>
            <div>
              <span>Mins:</span>
              <input
                type="text"
                value={staticBreakMinutes}
                onChange={e =>
                  this.handleTimeChange({
                    event: e,
                    changedTime: "minutes",
                    staticChangedTime: "staticBreakMinutes",
                    condition: "break"
                  })
                }
              />
            </div>
            <div>
              <span>Secs:</span>
              <input
                type="text"
                value={staticBreakSeconds}
                onChange={e =>
                  this.handleTimeChange({
                    event: e,
                    changedTime: "seconds",
                    staticChangedTime: "staticBreakSeconds",
                    condition: "break"
                  })
                }
              />
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default App
