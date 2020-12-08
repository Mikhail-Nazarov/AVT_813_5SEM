const Manager = require( './Manager' )

class ConnectionManager extends Manager {
  constructor( fileName ) {
    super( fileName )
  }

  async read() {
    await this.openFile()
    let connection = {
      node: await this.file.readInt16(),
      amount: await this.file.readInt16(),
      nextNodeConnection: await this.file.readInt16(),
      next: await this.file.readInt16()
    }

    return connection
  }

  async write( connection ) {
    await this.openFile()
    await this.file.writeInt16( connection.node )
    await this.file.writeInt16( connection.amount )
    await this.file.writeInt16( connection.nextNodeConnection )
    await this.file.writeInt16( connection.next )
  }
}

module.exports = ConnectionManager