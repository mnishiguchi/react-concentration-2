import React            from 'react'
import { EventEmitter } from 'fbemitter'
import _                from 'lodash'
import Grid             from './Grid'

const CARDS = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15]

window._ = _

class MemoryGame extends React.Component {
  constructor( props ) {
    super( props )

    this.state = {
      selectedId: null,
      foundPairs: [],
    }

    this.deck  = _.shuffle(CARDS)
    this.pairs = _.chain(CARDS).shuffle().chunk(2).value()
    this.icons = this.mapIconsToIds()
  }

  componentWillMount() {
    this.emitter = new EventEmitter()
    this.listenForChildren()
  }

  componentWillUnmount() {
    this.emitter.removeAllListeners();
  }

  render() {
    // console.debug(_.pick(this, 'deck', 'pairs', 'icons', 'state'))
    console.debug(this.state)

    return (
      <section className="MemoryGame">
        {
          this.deck.map(id => <Grid id={id} icon={this.icons[ id ]} isFlipped={this.isFaceUp(id)} emitter={this.emitter} key={id} />)
        }
      </section>
    )
  }

  listenForChildren() {
    this.emitter.addListener('Grid:clicked', ({ id }) => {
      console.debug(`Grid:clicked:${id}`)
      const { selectedId } = this.state

      // Ignore a click on the same item.
      if (selectedId === id) { return }

      if (selectedId) {
        console.info(this.judgePair([ selectedId, id ]) ? 'matched' : 'not matched')

        const pair = [ selectedId, id ]
        if (this.judgePair(pair)) {
          this.setState((prevState, props) => {
            return { selectedId: null, foundPairs: prevState.foundPairs.concat([ pair ]) }
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
    return _.chain(this.deck).difference(_.flatten(this.state.foundPairs)).difference([ this.state.selectedId ]).value()
  }

  isFaceUp(id) {
    return !this.isFaceDown(id)
  }

  mapIconsToIds() {
    return this.pairs.reduce((accObj, pair, index) => {
      pair.forEach(icon => accObj[ icon ] = index)
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
