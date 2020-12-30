import React, { Component } from "react"
import {
  Text,
  View,
  Vibration,
  TextInput,
  StyleSheet,
  Button
} from "react-native"

class GenerateTime extends Component {
  generateTime(time) {
    if (time <= 9) {
      return <Text>0{time}</Text>
    } else {
      return <Text>{time}</Text>
    }
  }
  render() {
    const { minutes, seconds } = this.props
    return (
      <View style={styles.flexStyle}>
        <Text style={{ fontSize: 50 }}>{this.generateTime(minutes)}</Text>
        <Text style={{ fontSize: 50 }}>:</Text>
        <Text style={{ fontSize: 50 }}>{this.generateTime(seconds)}</Text>
      </View>
    )
  }
}

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      minutes: 0,
      seconds: 5,
      staticWorkMinutes: 0,
      staticWorkSeconds: 5,
      staticBreakSeconds: 5,
      staticBreakMinutes: 0,
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
  vibrateDevice = () => Vibration.vibrate()

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
    if (!this.state.seconds && !this.state.minutes) {
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
      if (!this.state.minutes && !this.state.seconds) {
        this.vibrateDevice()
      }
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
      <View style={styles.appContainer}>
        <Text style={{ fontSize: 60, fontWeight: 700 }}>{title}</Text>
        <GenerateTime
          style={{ display: "flex", flexDirection: "row" }}
          minutes={minutes}
          seconds={seconds}
        />
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            padding: "10px",
            width: "50%",
            justifyContent: "space-between"
          }}
        >
          <Button
            style={{}}
            title={started ? "Pause" : "Start"}
            onPress={() => this.toggleCounter()}
          />
          <Button title="reset" onPress={() => this.handleReset()} />
        </View>
        <View>
          <View
            style={{
              padding: "10px"
            }}
          >
            <View>
              <Text style={{ fontSize: 40 }}>Work time:</Text>
            </View>
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between"
              }}
            >
              <View style={styles.flexStyle}>
                <Text style={{ fontSize: 20 }}>Mins:</Text>
                <TextInput
                  style={{ border: "1px solid blue", width: 30, fontSize: 20 }}
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
              </View>
              <View style={styles.flexStyle}>
                <Text style={{ fontSize: 20 }}>Secs:</Text>
                <TextInput
                  style={styles.input}
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
              </View>
            </View>
          </View>
          <View
            style={{
              padding: "10px"
            }}
          >
            <View>
              <Text style={{ fontSize: 40 }}>Break time:</Text>
            </View>
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between"
              }}
            >
              <View style={styles.flexStyle}>
                <Text style={{ fontSize: 20 }}>Mins:</Text>
                <TextInput
                  style={styles.input}
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
              </View>
              <View style={styles.flexStyle}>
                <Text style={{ fontSize: 20 }}>Secs:</Text>
                <TextInput
                  style={styles.input}
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
              </View>
            </View>
          </View>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  appContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
    marginTop: "20%"
  },
  flexStyle: {
    display: "flex",
    flexDirection: "row",
    paddingTop: "10px"
  },
  input: {
    border: "1px solid blue",
    width: 30,
    fontSize: 20
  },
  button: {
    paddingRight: "5px"
  },
  paddingStyle: {
    paddingTop: "10px"
  }
})
export default App
