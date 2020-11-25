class Stack {
    constructor() {
        this.array = []
    }

    push( x ) {
        let result = new Array( this.array.length + 1 )
        for ( let i = 0; i < this.array.length; i++ ) {
            result[ i ] = this.array[ i ]
        }
        result[ this.array.length ] = x
        this.array = result
    }

    pop() {
        let result = this.array[ this.array.length - 1 ]
        let popped = new Array( this.array.length - 1 )
        for ( let i = 0; i < this.array.length - 1; i++ ) {
            popped[ i ] = this.array[ i ]
        }
        this.array = popped
        return result
    }

    top() {
        return this.array[ this.array.length - 1 ]
    }

    clear() {
        this.array = []
    }

    isEmpty() {
        return !this.array.length
    }
}

module.exports = Stack