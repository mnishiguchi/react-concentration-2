import React            from 'react'
import _                from 'lodash'
import Cell             from './Cell'

class Grid extends React.Component {
  render() {
    const { cards, iconNames, isFaceUp, emitter } = this.props

    return (
      <div className="Grid">
        {
          _.chunk(cards, 4).map((row, i) => {
            return (
              <div className="row" key={i}>
                {
                  row.map(id => {
                    return (
                      <Cell
                        id={id}
                        iconName={iconNames[ id ]}
                        isFlipped={isFaceUp(id)}
                        emitter={emitter}
                        key={id}
                      />
                    )
                  })
                }
              </div>
            )
          })
        }
      </div>
    )
  }
}

export default Grid
