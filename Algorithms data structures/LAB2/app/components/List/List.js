const NodeManager = require( './NodeManager' )
const ConnectionManager = require( './ConnectionManager' )
const { ipcMain } = require('electron')

class List {
    constructor( nodeManager, connectionManager ) {
        this.nodeManager = nodeManager
        this.connectionManager = connectionManager
    }

    async add( name, nameNodeTo = '', number = 1 ) {
        let node = {
            name: name,
            connection: -1,
            next: -1
        }
        
        await this.addListElement( this.nodeManager, node, this.nodeManager.activeInformation )
        if ( nameNodeTo !== '' ) {
            await this.include( name, nameNodeTo, number )
        }
        
    }

    async findNode( name, pointer = -1 ) {
      if ( pointer === -1) {
        await this.nodeManager.readInformation()
        pointer = this.nodeManager.activeInformation.head
      }
      let node = await this.nodeManager.get( pointer )
      if ( node.name !== name ) {
          return await this.findNode( name, node.next )
      } else {
          return pointer
      }
    }

    async addListElement( manager, element, information ) {
        let pointer = -1
        if( information.head === -1 ) {
            information.head = manager.informationSize
            information.tail = manager.informationSize
            await manager.writeInformation()
            pointer = await manager.put( element )
        } else {
            pointer = await manager.put( element )
            element = await manager.get( information.tail )
            element.next = pointer
            await manager.put( element, information.tail)
            information.tail = pointer
            await manager.writeInformation()
            
        }
        return pointer
    }

    async include( name, nameNodeTo, number ) {

        let connection = {
                node: await this.findNode( name ),
                amount: number,
                nextNodeConnection: -1,
                next: -1,
        }

        let pointer = await this.addListElement( this.connectionManager, connection, this.connectionManager.activeInformation )
        await this.attachConnection( pointer, nameNodeTo )
    }

    async attachConnection( connectionPointer, name ) {
        let nodePointer = await this.findNode( name )
        let node = await this.nodeManager.get( nodePointer )
        if ( node.connection === -1 ) {
            node.connection = connectionPointer
            await this.nodeManager.put( node, nodePointer )
        } else {
            let pointer = node.connection
            let connection  = await this.connectionManager.get( node.connection )
            while ( connection.nextNodeConnection !== -1 )
            {    
                pointer = connection.nextNodeConnection
                connection = await this.connectionManager.get( connection.nextNodeConnection )
            }
            connection.nextNodeConnection = connectionPointer
            await this.connectionManager.put( connection, pointer )
        }
    }

    async exclude( name, nameFrom, number = 0 ) {
        let pointer = await this.findNode( name ) 
        let pointerFrom = await this.findNode( nameFrom )
        let node = await this.nodeManager.get( pointerFrom )
        if ( node.connection === -1 ) {
            return 
        }
        let connection = await this.connectionManager.get( node.connection )
        let currentConnectionPointer = node.connection
        let prevConnectionPointer = node.connection

        while ( connection.node !== pointer ) {
            prevConnectionPointer = currentConnectionPointer
            currentConnectionPointer = connection.nextNodeConnection
            if ( connection.nextNodeConnection === -1) {
                return
            }
            connection = await this.connectionManager.get( connection.nextNodeConnection )
        }
        
        if ( number >= connection.amount || !number ) {
            if ( node.connection === currentConnectionPointer ) {
                node.connection = connection.nextNodeConnection
                await this.nodeManager.put( node, pointerFrom )
            } else {
                let nextConnectionPointer = connection.nextNodeConnection
                connection = await this.connectionManager.get( prevConnectionPointer )
                connection.nextNodeConnection = nextConnectionPointer  
                await this.connectionManager.put( connection, prevConnectionPointer )
            }
            await this.delete( currentConnectionPointer, this.connectionManager )
        } else {
            connection.amount -= number
            await this.connectionManager.put( connection, currentConnectionPointer )
        }
    }

    async excludeFromAll( pointer ) {
        await this.nodeManager.readInformation()
        let node = await this.nodeManager.get( pointer )
        let fromPointer = this.nodeManager.activeInformation.head
        let nodeFrom = await this.nodeManager.get( fromPointer )

        await this.exclude( node.name, nodeFrom.name )
        while ( nodeFrom.next !== -1 ) {
            nodeFrom = await this.nodeManager.get( nodeFrom.next )
            await this.exclude( node.name, nodeFrom.name )
        }
    }

    async deleteNode( name, pointer = -1 ) {
        await this.nodeManager.readInformation()
        if ( pointer === -1 ) {
            pointer = await this.findNode( name )
            await this.excludeFromAll( pointer )
            if ( pointer === this.nodeManager.activeInformation.head ) {
                await this.cleanList()
                return
            }
        }
        let node = await this.nodeManager.get( pointer )
        let connectionPointer = node.connection
    
        while( connectionPointer !== -1 ) {
            let connection = await this.connectionManager.get( connectionPointer )
            let prevConnectionPointer = connectionPointer
            if( !( await this.isNodeNeeded( connection.node ) ) ) {
                await this.deleteNode( '', connection.node )
            }
            connectionPointer = connection.nextNodeConnection
            await this.delete( prevConnectionPointer , this.connectionManager )
            
        }
        await this.delete( pointer, this.nodeManager )
    }

    async isNodeNeeded( pointer ) {
        await this.connectionManager.readInformation()
        let connection = await this.connectionManager.get( this.connectionManager.activeInformation.head )

        while ( connection.next !== -1 ) {
            if ( connection.node === pointer ) {
                return true
            } else {
                connection = await this.connectionManager.get( connection.next )
            }
        }

        return false
    }

    async delete( pointer, manager ) {
        await manager.readInformation()
   
        let currentPointer = manager.activeInformation.head
        let prevPointer = currentPointer
        let element = await manager.get( currentPointer )
       
        while ( currentPointer !== pointer ) {
            prevPointer = currentPointer
            currentPointer = element.next
            element = await manager.get( currentPointer )
        }
        
        if ( currentPointer === manager.activeInformation.tail ) {
            manager.activeInformation.tail = prevPointer
            await manager.writeInformation()
        }

        let nextPointer = element.next

        await this.addListElement( manager, element, manager.deletedInformation )
        element = await manager.get( prevPointer )
        element.next = nextPointer
        await manager.put( element, prevPointer )

    }

    async cleanList() {
        await this.nodeManager.resetFile()
        await this.connectionManager.resetFile()
    }

    async getNodeString( name ) {
        let nodePointer = await this.findNode( name )
        let node = await this.nodeManager.get( nodePointer )
        let connectionPointer = node.connection
        let result = `Node : ${ node.name } \nContains : `

        if ( connectionPointer === -1 ) {
            result += `empty, `
        }

        while ( connectionPointer !== -1 ) {        
            let connection = await this.connectionManager.get( connectionPointer )
            node = await this.nodeManager.get( connection.node )
            result += `${ node.name } ${ connection.amount }, `
            connectionPointer = connection.nextNodeConnection
        }

        return result.replace( /, $/g, '\n' )
    }

    async getListString() {
        await this.nodeManager.readInformation()
        if ( this.nodeManager.activeInformation.head === -1 ) {
            return 'empty\n'
        }
        let node = await this.nodeManager.get( this.nodeManager.activeInformation.head )
        let result = ``

        result += await this.getNodeString( node.name )
        while ( node.next !== -1 ) {
            node = await this.nodeManager.get( node.next )
            result += await this.getNodeString( node.name )
        }

        return result
    }
}

let list = {}

ipcMain.on('createList', (event, args) => {
    list = new List( new NodeManager( args.dataSize, args.listFileName ), new ConnectionManager( args.connectionFileName ) )
    event.reply('createList', 1)
})

ipcMain.on('add', async (event, args) => {
    Object.keys( list ).length === 0 ? event.reply( 'add', 1 ) : ''
    await list.add( args.name, args.nameTo, args.number )
    event.reply( 'add', 1 )
})

ipcMain.on('include', async (event, args) => {
    Object.keys( list ).length === 0 ? event.reply( 'include', 1 ) : ''
    await list.include( args.name, args.nameTo, args.number )
    event.reply( 'include', 1 )
})

ipcMain.on('exclude', async (event, args) => {
    Object.keys( list ).length === 0 ? event.reply( 'exclude', 1 ) : ''
    await list.exclude( args.name, args.nameFrom, args.number )
    event.reply( 'exclude', 1 )
})

ipcMain.on('deleteNode', async (event, args) => {
    Object.keys( list ).length === 0 ? event.reply( 'deleteNode', 1 ) : ''
    await list.deleteNode( args.name )
    event.reply( 'deleteNode', 1 )
})

ipcMain.on('getNodeString', async (event, args) => {
    Object.keys( list ).length === 0 ? event.reply( 'getNodeString', '' ) :
    event.reply( 'getNodeString', await list.getNodeString( args.name ) )
})

ipcMain.on('getListString', async (event, args) => {
    Object.keys( list ).length === 0 ? event.reply( 'getListString', '' ) : 
    event.reply( 'getListString', await list.getListString() )
    
})

module.exports = List