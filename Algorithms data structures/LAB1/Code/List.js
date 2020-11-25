class List {
    constructor() {
        this.root = {
            symbol: '',
            next: null
        }
    }
    insert(x, currentNode = this.root) {
      if (currentNode.next && currentNode.symbol < x ) {
          this.insert( x, currentNode.next )
      } else {
        let node = {
            symbol: x,
            next: currentNode.next
        }
        currentNode.next = node
      }  
    }

    delete(x, currentNode = this.root) {
        if ( currentNode && currentNode.symbol <= x ) {
            if ( currentNode.symbol === x ) {
                currentNode.symbol = currentNode.next.symbol
                currentNode.next = currentNode.next.next
                this.delete( x, currentNode ) 
            }
            this.delete( x, currentNode.next )
        }
    }

    find( x, currentNode = this.root ) {
        if ( currentNode ) {
            if ( currentNode.symbol === x ) {
                return 0;
            }
            let position = this.find(x, currentNode.next) + 1
            return position ? position : -1
        }
    }

    clear() {
        this.root.next = null
    }
}

module.exports = List