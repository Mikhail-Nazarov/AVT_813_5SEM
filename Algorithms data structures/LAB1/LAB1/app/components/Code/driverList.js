const List = require('./List')

function driveList() {
    let list = new List()

    for ( let i = 1040; i < 1072; i++ ) {
        list.insert( String.fromCharCode( i ) )
    }
    output( list )
        
    console.log( "Номер позиции элемента со значением Б: ", list.find( 'Б' ) )
    list.delete( 'Б')
    console.log( "Удаление элемента со значением Б. Номер позиции элемента со значением Б: ", list.find( 'Б' ) )
    list.clear()
    console.log( "Очистка списка" )
    output( list )

}

function output( list ) {
    let node = {}
    node = list.root
    while ( true) {
        if ( node ) {
            console.log( node.symbol )
            node = node.next
        } else {
            return
        }
    }
}

module.exports = driveList