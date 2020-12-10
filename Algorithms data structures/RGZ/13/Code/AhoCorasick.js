class BorNode {
  constructor( failNode = null ) {
    this.links = new Map()
    this.fail = failNode
    this.term = null
    this.out = -1
  }

  getLink( char ) {
    let node = this.links.get( char )
    if ( node ) {
      return node
    } else {
      return null
    }
  }

  isTerminal() {
    return this.out >= 0
  }
}

class AhoCorasick {
  constructor() {
      this.root = new  BorNode()
      this.currentState = null
      this.words = new Array()
  }

  init() {
    let queue = new Array()
    queue.push( this.root )

    while( queue.length ) {
      let currentNode = queue.shift()

      for( const [ char, child ] of currentNode.links ) {
        let tempNode = currentNode.fail

        while( tempNode ) {
          let failCandidate = tempNode.getLink( char )
          if ( failCandidate ) {
            child.fail = failCandidate
            break
          }
          tempNode = tempNode.fail
        }

        if ( child.fail.isTerminal() ) {
          child.term = child.fail
        } else {
          child.term = child.fail.term
        }
        queue.push( child )
      }
    }
  }

  


  addString( string ) {
    let currentNode = this.root

    for( const char of string ) {
      let childNode = currentNode.getLink( char )
      if ( !childNode ) {
        childNode = new BorNode( this.root )
        currentNode.links.set( char, childNode )
      }
      currentNode = childNode
    }
    currentNode.out = this.words.length
    this.words.push( string )
  }


 


  step( char ) {
    while ( this.currentState ) {
      let candidate = this.currentState.getLink( char )
      if ( candidate ) {
        this.currentState = candidate
        return
      }
      this.currentState = this.currentState.fail
    }
    this.currentState = this.root
  }

  search( string ) {
    this.currentState = this.root
    for ( const char of string ) {
      this.step( char )
      this.print( char )
    }
  }

  print() {
    if ( this.currentState.isTerminal() ) {
      console.log( this.words[ this.currentState.out ] )
    }
    let tempNode = this.currentState.term
    while ( tempNode ) {
      console.log( this.words[ tempNode.out ] )
      tempNode = tempNode.term
    }
  }

}

let ak = new AhoCorasick()
ak.addString("test")
ak.addString("rok")
ak.addString("roka")
ak.addString("strok")
ak.addString("t")

ak.init()

ak.search("testovaya_stroka!")