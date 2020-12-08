<template>
    <div class="col main">
        <div class="col options" >
            <div class="raw">
            <div class="col">
                <label for="">Имя файла деталей</label>
                <input type="text" v-model="listFileName">
            </div>
            <div class="col">
                <label for="">Имя файла вхождений</label>
                <input type="text" v-model="connectionFileName">
            </div>
            <div class="col">
                <label for="">Размер данных в списке</label>
                <input type="number" v-model="dataSize">
            </div>
            </div>
            <div class="raw">
                <button :disabled="block" @click="createList" >Создать список</button>
            </div>

            <div class="raw">
                <div class="col">
                    <label for="">Имя детали</label>
                    <input type="text" v-model="name">
                </div>
                <div class="col">
                    <label for="">Деталь присоединения/отсоединения</label>
                    <input type="text" v-model="nameToFrom">
                </div>
                <div class="col">
                    <label for="">Количество деталей</label>
                    <input type="number" v-model="number">
                </div>
            </div>
            <div class="raw">
                <button :disabled="block" @click="add" >Добавить деталь</button>
                <button :disabled="block" @click="include" >Включить деталь</button>
                <button :disabled="block" @click="exclude" >Исключить деталь</button>
            </div>

            <div class="raw">
                <div class="col">
                    <label for="">Имя детали</label>
                    <input type="text" v-model="name">
                </div>
            </div>
            <div class="raw">
                <button :disabled="block" @click="deleteNode" >Удалить деталь</button>
                <button :disabled="block" @click="getNodeString" >Вывести деталь</button>
            </div>
            <div class="raw">
                <button :disabled="block" @click="getListString" >Вывод списка</button>
            </div>
        </div>
        <div class="result">
            <pre>{{ result }}</pre>
        </div>
    </div>
</template>

<script>
const { ipcRenderer } = window.require('electron')

export default {
    name:"app",
    data(){
        return {
            result: '',
            block: false,
            listFileName: 'list.bin',
            connectionFileName: 'connection.bin',
            dataSize: 10,
            nameToFrom: '',
            name: '',
            number: 1,
        }
    },
    mounted() {
        ipcRenderer.on('createList', (event, args) => {
            this.block = false
            this.getListString()
        })

        ipcRenderer.on('add', async (event, args) => {
            this.block = false
            this.getListString()
        })

        ipcRenderer.on('include', async (event, args) => {
            this.block = false
            this.getListString()
        })

        ipcRenderer.on('exclude', async (event, args) => {
            this.block = false
            this.getListString()
        })

        ipcRenderer.on('deleteNode', async (event, args) => {
            this.block = false
            this.getListString()
        })

        ipcRenderer.on('getNodeString', async (event, args) => {
            this.result = args
            this.block = false
        })

        ipcRenderer.on('getListString', async (event, args) => {
            this.result = args
            this.block = false
        })
    },
    methods: {
        createList() {
            this.block = true
            ipcRenderer.send( 'createList', { dataSize: this.dataSize, listFileName: this.listFileName, connectionFileName: this.connectionFileName } )
        },

        add() {
            this.block = true
            ipcRenderer.send( 'add', { name: this.name, nameTo: this.nameToFrom, number: this.number } )
        },

        include() {
            this.block = true
            ipcRenderer.send( 'include', { name: this.name, nameTo: this.nameToFrom, number: this.number } )
        },

        exclude() {
            this.block = true
            ipcRenderer.send( 'exclude', { name: this.name, nameFrom: this.nameToFrom, number: this.number } )
        },

        deleteNode() {
            this.block = true
            ipcRenderer.send( 'deleteNode', { name: this.name } )
        },

        getNodeString() {
            this.block = true
            ipcRenderer.send( 'getNodeString', { name: this.name } )
        },

        getListString() {
            this.block = true
            ipcRenderer.send( 'getListString', this.result )
        }
    },
}
</script>

<style>
body {
    margin: 0;
}

.raw {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 10px;
    margin-bottom: 10px;
}

.col {
    display: flex;
    height: auto;
    flex-direction: column;
    justify-content: start;
    align-items: center;
}

.main {
    height: 100vh;
}

.result {
    overflow: scroll;
    width: 80%;
    height: 40%;
    text-align: left;
}

</style>