import React      from 'react'

class Grid extends React.Component {
  constructor( props ) {
    super( props )

    this.state = {
      isFlipped: false,
    }
  }

  render() {
    const { icon } = this.props
    const { isFlipped } = this.state

    return (
      <div className="Grid" onClick={e => this.handleClick(e)} style={{ background: isFlipped ? '#ccc' : '#666' }}>
        {icon}
      </div>
    )
  }

  handleClick(e) {
    const { id, emitter } = this.props

    this.setState((prevState, props) => {
      return { isFlipped: !prevState.isFlipped }
    })

    emitter.emit('Grid:clicked', { id })
  }
}

export default Grid
