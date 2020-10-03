import React from "react"
import "./App.css"

function App() {
  return (
    <div className="App">
      <span>Work timer</span>
      <div>
        <span>00</span>
        <span>:</span>
        <span>00</span>
      </div>
      <div>
        <button title="pause">pause</button>
        <button title="reset">reset</button>
      </div>
      <div>
        <div>
          <div>
            <span>Work time:</span>
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

export default App
