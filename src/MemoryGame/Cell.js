import React      from 'react'
import classNames from 'classnames'

class Cell extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      isFlipped: props.isFlipped,
    }
  }

  render() {
    const { iconName } = this.props
    const { isFlipped } = this.state

    const CellClassNames = classNames('Cell', {
      'flipped': isFlipped
    })

    return (
      <div className={CellClassNames} onClick={e => this.handleClick()}>
        <i className={`fa fa-${iconName} fa-2x`} aria-hidden="true"></i>
      </div>
    )
  }

  handleClick() {
    const { id, emitter } = this.props

    this.setState((prevState, props) => {
      return { isFlipped: !prevState.isFlipped }
    })

    emitter.emit('Cell:clicked', { id })
  }
}

export default Cell
