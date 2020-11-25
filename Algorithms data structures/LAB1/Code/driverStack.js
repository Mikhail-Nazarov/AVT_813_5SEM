const Stack = require('./Stack')
function driverStack() {
    let stack = new Stack()
    for ( let i = 0; i < 10; i++ ) {
        stack.push( i )
    }
    output( stack )

    console.log( 'Удаляем последний элемент стека', stack.pop() )
    output( stack )

    console.log( 'Верхний элемент стека', stack.top() )
    
    console.log( 'Очищает стек' )
    stack.clear() 
    
    console.log( 'Стек пустой?', stack.isEmpty() )
}

function output( stack ) {
    for ( let i = 0; i < stack.array.length; i++ ) {
        console.log( stack.array[ i ] )
    }
}

module.exports = driverStack