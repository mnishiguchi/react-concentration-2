import React from 'react'
import logo from '../assets/logo.svg'
import './index.css'

const AppLayout = (props) => {
  return (
    <div className="App">
      <div className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <h2>React Concentration 2</h2>
      </div>
      <p className="App-intro">
        To get started, edit <code>src/App.js</code> and save to reload.
      </p>

      {props.children}
    </div>
  )
}

export default AppLayout
