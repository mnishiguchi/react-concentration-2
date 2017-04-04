import React      from 'react'
import ReactDOM   from 'react-dom'
import AppLayout  from './AppLayout'
import MemoryGame from './MemoryGame'
import './index.css'

const Root = () => {
  return (
    <AppLayout>
      <MemoryGame />
    </AppLayout>
  )
}

ReactDOM.render(
  <Root />,
  document.getElementById('root')
)
