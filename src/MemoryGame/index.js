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
      selectedIds: [],
      foundPairs : [],
    }

    this._deck  = _.shuffle(CARDS)
    this._pairs = _.chain(CARDS).shuffle().chunk(2).value()
    this._icons = this.mapIconsToIds()
  }

  componentWillMount() {
    this._emitter = new EventEmitter()

    this._emitter.addListener('Grid:clicked', ({ id }) => {
      // TODO
      // 1. Push the passed-in id to selectedIds
      // 2. Judge the pair when selectedIds.length == 2
      console.debug(`Grid:clicked:${id}`)
    })
  }

  componentWillUnmount() {
    this._emitter.removeAllListeners();
  }

  render() {
    console.debug(this)

    return (
      <section className="MemoryGame">
        {
          this._deck.map(id => <Grid id={id} icon={this._icons[id]} emitter={this._emitter} key={id} />)
        }
      </section>
    )
  }

  mapIconsToIds() {
    return this._pairs.reduce((accObj, pair, index) => {
      pair.forEach(icon => accObj[icon] = index)
      return accObj
    }, {})
  }

  judgePair(selectedIds) {
    const result = this._pairs.map(pair => {
      return _.isEqual(pair.sort(), selectedIds.sort())
    })

    return _.any(result)
  }
}

export default MemoryGame
