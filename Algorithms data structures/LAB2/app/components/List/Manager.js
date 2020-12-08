const BinaryFile = require("binary-file")

class Manager {
  constructor( fileName ) {
    this.fileName = fileName
    this.file = {}
    this.fileOpen = false
    this.informationSize = 8
    this.setDefault()
  }

  async openFile( ) {
    if ( !this.fileOpen ) {
      this.file = new BinaryFile( this.fileName, 'w+' )
      await this.file.open()
      this.fileOpen = true
    }
  }

  async closeFile() {
    if ( this.fileOpen ) {
      await this.file.close()
      this.fileOpen = false
    }
  }

  setDefault() {
    this.activeInformation = {
      head: -1,
      tail: -1
    }

    this.deletedInformation = {
      head: -1,
      tail: -1
    }
  }

  async resetFile() {
    this.setDefault()
    await this.closeFile()
    await this.openFile()
    await this.writeInformation()
  }

  async writeInformation() {
    await this.openFile()
    await this.setCursorPosition( 0 )
    await this.file.writeInt16( this.activeInformation.head )
    await this.file.writeInt16( this.deletedInformation.head )
    await this.file.writeInt16( this.activeInformation.tail )
    await this.file.writeInt16( this.deletedInformation.tail )
  }

  async readInformation() {
    await this.openFile()
    await this.setCursorPosition( 0 )
    this.activeInformation.head = await this.file.readInt16() || -1
    this.deletedInformation.head = await this.file.readInt16() || -1
    this.activeInformation.tail = await this.file.readInt16() || -1
    this.deletedInformation.tail = await this.file.readInt16() || -1
  }

  async setCursorPosition( position = -1 ) {
    await this.openFile()
    let size = await this.file.size()
    position = position === -1 ? size : position  
    this.file.seek( position )

    return position
  }

  async put( element, position = -1 ) {
    position = await this.setCursorPosition( position )
    await this.write( element )

    return position
  }

  async get( position = -1) {
    await this.setCursorPosition( position ) 
    return await this.read()
  }
}

module.exports = Manager