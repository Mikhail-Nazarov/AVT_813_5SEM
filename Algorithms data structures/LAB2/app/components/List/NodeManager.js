const Manager = require( './Manager' )

class NodeManager extends Manager {
  constructor( dataSize, fileName ) {
    super( fileName )
    this.dataSize = dataSize
  }

  async read() {
    await this.openFile()
    let node = {
        name: ( await this.file.readString( this.dataSize ) ).replace(/[\u0000-\u0009]/g, ''),
        connection: await this.file.readInt16(),
        next: await this.file.readInt16()
    }
     
    return node
  }

  async write( node ) {
    await this.openFile()
    let buffer = Buffer.alloc( this.dataSize )
    buffer.write( node.name )

    await this.file.write( buffer )
    await this.file.writeInt16( node.connection )
    await this.file.writeInt16( node.next )
  }
}

module.exports = NodeManager