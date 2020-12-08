class RedBlackTree {
  constructor() {
    this.root = null
    this.counter = 0
  }

  getGrandParent( node ) {
    if ( node !== null && node.parent !== null ) {
      return node.parent.parent
    } else {
      return null
    }
  }

  getUncle( node ) {
    let grandParent = this.getGrandParent( node )
    this.counter++
    if ( grandParent == null ) {
      return null
    }
    else if ( node.parent === grandParent.left ) {
      return grandParent.right
    } else {
      return grandParent.left
    }
  }

  rotateLeft( node ) {
    let pivot = node.right
    pivot.parent = node.parent
    this.counter += 2
    if ( node.parent !== null ) {
      if ( node.parent.left === node ) {
        node.parent.left = pivot
        this.counter++
      } else {
        node.parent.right = pivot
        this.counter++
      }
    } else {
      this.root = pivot
      this.counter++
    }

    node.right = pivot.left
    if ( pivot.left !== null ) {
      pivot.left.parent = node
      this.counter++
    }

    node.parent = pivot
    pivot.left = node
    this.counter += 3
  }

  rotateRight( node ) {
    let pivot = node.left
    pivot.parent = node.parent
    this.counter += 2
    if ( node.parent !== null ) {
      if ( node.parent.left === node ) {
        node.parent.left = pivot
        this.counter++
      } else {
        node.parent.right = pivot
        this.counter++
      }
    } else {
      this.root = pivot
      this.counter++
    }

    node.left = pivot.right
    if ( pivot.right !== null ) {
      pivot.right.parent = node
      this.counter++
    }

    node.parent = pivot
    pivot.right = node
    this.counter += 3
  }

  resetCounter() {
    this.counter = 0
  }

  insert( value, node = this.root ) {
    if ( this.root === null ) {
      this.root = {
        value,
        left: null,
        right: null,
        parent: null,
        colorRed: true
      }
      this.insertCase1( this.root )
      this.counter++
      return this.counter
    } else if ( node.value < value ) {
        if ( node.right !== null ) {
          this.insert( value, node.right )
          this.counter++
        } else {
          node.right = {
            value,
            left: null,
            right: null,
            parent: node,
            colorRed: true
          }
          this.insertCase1( node.right )
          this.counter++
        }
        return this.counter
    } else if ( node.value > value ) {
      if ( node.left !== null ) {
        this.insert( value, node.left )
        this.counter++
      } else {
        node.left = {
          value,
          left: null,
          right: null,
          parent: node,
          colorRed: true
        }
        this.insertCase1( node.left )
        this.counter++
      }
      return this.counter
    } else {
        return this.counter
    }
  }

  insertCase1( node ) {
    if ( node.parent === null ) {
      node.colorRed = false
      this.counter++
    } else {
      this.insertCase2( node )
      this.counter++
    }
  }

  insertCase2( node ) {
    
    if ( !node.parent.colorRed ) {
      return
    } else {
      this.insertCase3( node )
      this.counter++
    }
    
  }

  insertCase3( node ) {
    let uncle = this.getUncle( node )
    let grandParent = this.getGrandParent( node )
    this.counter += 2
    if ( uncle !== null && uncle.colorRed ) {
      node.parent.colorRed = false
      uncle.colorRed = false
      grandParent.colorRed = true
      this.insertCase1( grandParent )
      this.counter += 4
    } else {
      this.insertCase4( node )
      this.counter++
    }
  }

  insertCase4( node ) {
    let grandParent = this.getGrandParent( node )
    this.counter++
    if ( node === node.parent.right && node.parent === grandParent.left ) {
      this.rotateLeft( node.parent )
      node = node.left
      this.counter += 2
    } else if ( node === node.parent.left && node.parent === grandParent.right ) {
      this.rotateRight( node.parent )
      node = node.right
      this.counter += 2
    }
    this.insertCase5( node )
    this.counter++
  } 
  
  insertCase5( node ) {
    let grandParent = this.getGrandParent( node )
    node.parent.colorRed = false
    grandParent.colorRed = true
    this.counter += 3
    if ( node === node.parent.left && node.parent === grandParent.left ) {
      this.rotateRight( grandParent )
      this.counter++
    } else {
      this.rotateLeft( grandParent )
      this.counter++
    }
  }

}
let N = 10000
let results = new Array( N ).fill( 0 )

for( let j = 0; j < 100; j++ ) {
  
  let tree = new RedBlackTree()

  for( let i = 0; i < N; i++ ) {
    tree.insert( Math.random() * 100 )
    results[ i ] += tree.counter
    tree.resetCounter()
  }
}


for( let i = 0; i < N; i++ ) {
  results[ i ] /= 100
}

console.log( results[ 0 ], results[ 50 ], results[ 200 ], results[ 500 ], results[ 999 ], results[ 2000 ], results[ 4000 ], results[ 6000 ], results[ 8000 ], results[ 9999 ] );