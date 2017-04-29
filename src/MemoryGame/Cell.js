import React      from 'react'
import classNames from 'classnames'

class Cell extends React.Component {
  render() {
    const { isFlipped, isFound, iconName } = this.props

    const cellClassNames = classNames('Cell', {
      'flipped': isFlipped,
      'found': isFound,
    })

    return (
      <div className={cellClassNames} onClick={e => this.handleClick()}>
        <i className={`fa fa-${iconName} fa-2x`} aria-hidden="true"></i>
      </div>
    )
  }

  handleClick() {
    const { id, emitter } = this.props
    emitter.emit('Cell:clicked', { id })
  }
}

export default Cell
