import React            from 'react'
import { EventEmitter } from 'fbemitter'
import _                from 'lodash'
import Grid             from './Grid'
import faNames          from './fa-names'
import './index.css'

const CARDS = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15]    // Card ids
const ICONS = _.chain(faNames).shuffle().take(8).value() // Randomly selected font-awesome icon names

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

    this.pairs     = _.chain(CARDS).shuffle().chunk(2).value()  // An array of pairs
    this.iconNames = this.mapCardIdToIconId()                   // A hash map of id => icon
  }

  componentWillUnmount() {
    this.emitter.removeAllListeners()
  }

  render() {
    // console.debug(_.pick(this, 'deck', 'pairs', 'iconNames', 'state'))
    console.debug(this.state)

    return (
      <section className="MemoryGame">
        <div className="left"></div>
        {
          _.chunk(CARDS, 4).map((row, i) => {
            return (
              <div className="row" key={i}>
                {
                  row.map(id => {
                    return (
                      <Grid
                        id={id}
                        iconName={this.iconNames[ id ]}
                        isFlipped={this.isFaceUp(id)}
                        emitter={this.emitter}
                        key={id}
                      />
                    )
                  })
                }
              </div>
            )
          })
        }
        <div className="right"></div>
      </section>
    )
  }

  subscribeEvents() {
    this.emitter.addListener('Grid:clicked', ({ id }) => {
      console.debug(`Grid:clicked:${id}`)
      const { selectedId } = this.state

      // Ignore a click on the same item.
      if (selectedId === id) { return }

      if (selectedId) {
        const pair = [ selectedId, id ]
        if (this.judgePair(pair)) {

          console.info('matched')
          
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

  isFaceDown(id) {
    return _.chain(CARDS).difference(_.flatten(this.state.foundPairs)).difference([ this.state.selectedId ]).value()
  }

  isFaceUp(id) {
    return !this.isFaceDown(id)
  }

  // Give each pair a matching icon.
  mapCardIdToIconId() {
    return this.pairs.reduce((accObj, pair, iconIndex) => {
      pair.forEach(part => {
        accObj[ part ] = ICONS[ iconIndex ]
      })
      return accObj
    }, {})
  }

  judgePair(selectedIds) {
    const result = this.pairs.map(pair => {
      return _.isEqual(pair.sort(), selectedIds.sort())
    })

    return _.some(result)
  }
}

export default MemoryGame
