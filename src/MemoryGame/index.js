import React            from 'react'
import { EventEmitter } from 'fbemitter'
import _                from 'lodash'
import Grid             from './Grid'
import faNames          from './fa-names'
import './index.css'

const IDS = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15] // Cell ids

window._ = _ // To play with lodash in console

class MemoryGame extends React.Component {
  constructor(props) {
    super(props)

    // An array of pairs (the answer)
    // This must be performed before initializing the state.
    this.pairs = _.chain(IDS).shuffle().chunk(2).value()

    // TODO - this can be simplified.
    // Pick 8 icons randomly and map cell id to icon name.
    const iconNameHash = _.chain(faNames).shuffle().take(8).value()
    const iconNames = this.pairs.reduce((accObj, pair, index) => {
      pair.forEach(part => {
        accObj[ part ] = iconNameHash[ index ]
      })
      return accObj
    }, {})

    const cells = IDS.map(id => {
      return {
        id,
        iconName:  iconNames[ id ],
        isFlipped: false,
        isFound:   false,
      }
    })

    this.state = {
      firstChoice: null, // The id of the first selected card of each turn
      cells,
    }
  }

  componentWillMount() {
    this.emitter = new EventEmitter()
    this.subscribeEvents()
  }

  componentWillUnmount() {
    this.emitter.removeAllListeners()
  }

  render() {
    const { cells } = this.state

    console.log(this.state)

    return (
      <div className="MemoryGame">
        <Grid cells={cells} emitter={this.emitter} />
      </div>
    )
  }

  //---
  // event handlers
  //---

  // Handle events from other components.
  subscribeEvents() {
    this.emitter.addListener('Cell:clicked', ({ id }) => {

      console.log(`Cell:clicked:${id}`)

      const { firstChoice } = this.state

      // Ignore a click on the same item.
      if (firstChoice === id) {
        return
      }

      // Flip the cell.
      this.setState((prevState, props) => {
        const cells = prevState.cells.slice()       // Clone the previous state
        cells[id].isFlipped = !cells[id].isFlipped  // Update it
        return { cells }                            // Set it
      })

      if (firstChoice) {
        if (this.judgePair(firstChoice, id)) {

          console.info('matched')

          // TODO: Ignore already found pairs (maybe not needed)

          // TODO: Set the cells as found.

          // Clear first choice
          this.setState((prevState, props) => {
            return {
              firstChoice: null,
            }
          })
        } else {

          // TODO: Flip the cells back face down.

          this.setState({ firstChoice: null })
        }
      } else {
        this.setState({ firstChoice: id })
      }
    })
  }

  //---
  // game control
  //---

  /**
   * @param  {integer} first  - an id
   * @param  {integer} second - an id
   * @return {boolean} true if two ids are the same.
   */
  judgePair(first, second) {
    // Reject the same ids.
    if (first === second) {
      return false
    }

    const { cells } = this.state
    return cells[first].iconName === cells[second].iconName
  }
}

export default MemoryGame
