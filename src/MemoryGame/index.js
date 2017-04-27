import React            from 'react'
import { EventEmitter } from 'fbemitter'
import _                from 'lodash'
import Grid             from './Grid'
import faNames          from './fa-names'
import './index.css'

const CARDS = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15] // Card ids

window._ = _ // To play with lodash in console

class MemoryGame extends React.Component {
  constructor( props ) {
    super( props )

    this.state = {
      selectedId: null, // The id of the first selected card of each turn
      foundPairs: [],   // Remember all the found pairs
    }
  }

  componentWillMount() {
    this.emitter = new EventEmitter()
    this.subscribeEvents()

    this.pairs     = _.chain(CARDS).shuffle().chunk(2).value() // An array of pairs
    this.iconNames = this.mapIdToIconName()                    // A hash map of id => icon
  }

  componentWillUnmount() {
    this.emitter.removeAllListeners()
  }

  render() {
    // console.debug(_.pick(this, 'deck', 'pairs', 'iconNames', 'state'))
    console.debug(this.state)

    return (
      <section className="MemoryGame">
        <Grid
          cards={CARDS}
          iconNames={this.iconNames}
          isFaceUp={this.isFaceUp.bind(this)}
          emitter={this.emitter}
        />
      </section>
    )
  }

  //---
  // game control
  //---

  subscribeEvents() {
    this.emitter.addListener('Cell:clicked', ({ id }) => {
      console.debug(`Cell:clicked:${id}`)
      const { selectedId } = this.state

      // Ignore a click on the same item.
      if (selectedId === id) { return }

      if (selectedId) {
        const pair = [ selectedId, id ]

        if (this.judgePair(pair)) {

          console.info('matched')

          // TODO: Ignore already found pairs

          this.setState((prevState, props) => {
            return {
              selectedId: null,
              foundPairs: prevState.foundPairs.concat([ pair ])
            }
          })
        } else {
          this.setState({ selectedId: null })
        }
      } else {
        this.setState({ selectedId: id })
      }
    })
  }

  judgePair(selectedIds) {
    const result = this.pairs.map(pair => {
      return _.isEqual(pair.sort(), selectedIds.sort())
    })

    return _.some(result)
  }

  //---
  // cells
  //---

  isFaceDown(id) {
    return _.chain(CARDS).difference(_.flatten(this.state.foundPairs)).difference([ this.state.selectedId ]).value()
  }

  isFaceUp(id) {
    return !this.isFaceDown(id)
  }

  //---
  // icons
  //---

  // Give each pair a matching icon.
  mapIdToIconName() {
    const icons = this.randomIconNames()
    return this.pairs.reduce((accObj, pair, iconIndex) => {
      pair.forEach(part => {
        accObj[ part ] = icons[ iconIndex ]
      })
      return accObj
    }, {})
  }

  randomIconNames() {
    return _.chain(faNames).shuffle().take(8).value()
  }
}

export default MemoryGame
