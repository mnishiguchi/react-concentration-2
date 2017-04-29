import React            from 'react'
import _                from 'lodash'
import Cell             from './Cell'

class Grid extends React.Component {
  render() {
    const { cells, emitter } = this.props
    
    return (
      <div className="Grid">
        {
          _.chunk(cells, 4).map((row, i) => {
            return (
              <div className="row" key={i}>
                {
                  row.map(cell => {
                    return (
                      <Cell
                        id={cell.id}
                        iconName={cell.iconName}
                        isFlipped={cell.isFlipped}
                        isFound={cell.isFound}
                        emitter={emitter}
                        key={cell.id}
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
