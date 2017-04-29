import React            from 'react'
import { EventEmitter } from 'fbemitter'
import _                from 'lodash'
import Grid             from './Grid'
import faNames          from './fa-names'
import './index.css'

window._ = _ // To play with lodash in console

class MemoryGame extends React.Component {
  constructor(props) {
    super(props)

    // Create an initial array of cell objects based on the icon-name array.
    const cells = this.generateIconPairs().map((iconName, index) => {
      return {
        id:        index,
        iconName:  iconName,
        isFlipped: false,
        isFound:   false,
      }
    })

    this.state = {
      firstChoice: null,
      cells,
    }
  }

  /**
   * @return {array<string>} 8 pairs of icon name strings (16 elements)
   */
  generateIconPairs() {
    let iconNames = _.chain(faNames).shuffle().take(8).value()
    return _.shuffle(iconNames.concat(iconNames.slice()))
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

  /**
   * Handle events from other components.
   */
  subscribeEvents() {
    this.emitter.addListener('Cell:clicked', ({ id }) => {
      // console.log(`Cell:clicked:${id}`)

      const { firstChoice } = this.state

      // Ignore a click on the same item.
      if (firstChoice === id) {
        console.log('The same item was clicked')
        return
      }

      this.flipCell(id)

      // NOTE: Delay the judgement so that user can see the second card being flipped.
      setTimeout(() => {
        if (typeof firstChoice === 'number' && firstChoice >= 0) {
          this.judgePair(firstChoice, id)
        } else {
          this.setFirstChoice(id)
        }
      }, 400)
    })
  }

  //---
  // actions
  //---

  flipCell(id) {
    this.setState((prevState, props) => {
      const cells = prevState.cells.slice() // Clone the previous state
      cells[id].isFlipped = true            // Mutate
      return { cells }
    })

  }

  setFirstChoice(id) {
    this.setState({ firstChoice: id })
  }

  judgePair(first, second) {
    if (this.isPair(first, second)) {

      console.info('matched')

      // Set the cells as found.
      this.setState((prevState, props) => {
        const cells = prevState.cells.slice() // Clone the previous state
        cells[second].isFound = true          // Mutate
        cells[first].isFound = true           // Mutate
        return {
          cells,             // Update the cells
          firstChoice: null, // Clear the choice
        }
      })
    } else {
      // Flip the both cells back face-down.
      this.setState((prevState, props) => {
        const cells = prevState.cells.slice() // Clone the previous state
        cells[second].isFlipped = false       // Mutate
        cells[first].isFlipped = false        // Mutate
        return {
          cells,             // Update the cells
          firstChoice: null, // Clear the choice
        }
      })
    }
  }

  //---
  // other private functions
  //---

  /**
   * @param  {integer} first  - an id
   * @param  {integer} second - an id
   * @return {boolean} true if two ids are the same.
   */
  isPair(first, second) {
    // Reject the same ids.
    if (first === second) {
      return false
    }

    const { cells } = this.state
    return cells[first].iconName === cells[second].iconName
  }
}

export default MemoryGame
