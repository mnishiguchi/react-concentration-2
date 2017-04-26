import React      from 'react'
import classNames from 'classnames'

class Grid extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      isFlipped: props.isFlipped,
    }
  }

  render() {
    const { iconName } = this.props
    const { isFlipped } = this.state

    const GridClassNames = classNames('Grid', {
      'flipped': isFlipped
    })

    return (
      <div className={GridClassNames} onClick={e => this.handleClick(e)}>
        <i className={`fa fa-${iconName} fa-2x`} aria-hidden="true"></i>
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
