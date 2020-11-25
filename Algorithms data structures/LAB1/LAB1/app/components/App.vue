<template>
  <div class="wrap">
    <div id="stack">
      <div class="container">
        <div class="stack__row">
          <p>Работа со стеком</p>
          <input
            type="number"
            name="elementStack"
            id="elementStack"
            v-model="elementStack"
            placeholder="Введите элемент"
            class="stack__input"
          />
          <p :key="index" v-for="(element, index) in stack">
            Стек: {{ element }}.
          </p>
          <p>Результат: {{ stackResult }}.</p>
          <div>
            <input
              type="button"
              @click="stackAdd"
              value="Добавить элемент"
              class="btn"
            />
            <input
              type="button"
              @click="stackPop"
              value="Удалить последний элемент"
              class="btn"
            />
            <input
              type="button"
              @click="stackEmpty"
              value="Стек пустой?"
              class="btn"
            />
            <input
              type="button"
              @click="stackClear"
              value="Очистить стек"
              class="btn"
            />
            <input
              type="button"
              @click="stackShow"
              value="Вывести стек"
              class="btn"
            />
            <input
              type="button"
              @click="stackTop"
              value="Показать верхний элемент"
              class="btn"
            />
          </div>
        </div>
      </div>
    </div>
    <div id="list">
      <div class="container">
        <div class="stack__row">
          <p>Работа со списком</p>
          <input
            type="text"
            name="elementList"
            id="elementList"
            v-model="elementList"
            placeholder="Введите элемент"
            class="stack__input"
          />
          <p :key="index" v-for="(element, index) in list">
            Список: {{ element }}.
          </p>
          <p>Результат: {{ listResult }}.</p>
          <div>
            <input
              type="button"
              @click="listAdd"
              value="Добавить элемент"
              class="btn"
            />
            <input
              type="button"
              @click="listFind"
              value="Найти номер позиции"
              class="btn"
            />
            <input
              type="button"
              @click="listDelete"
              value="Удалить со значением"
              class="btn"
            />
            <input
              type="button"
              @click="listClear"
              value="Очистить список"
              class="btn"
            />
            <input
              type="button"
              @click="listShow"
              value="Вывести список"
              class="btn"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import driverStack from "./Code/driverStack.js";

import "./Code/Stack.js";
import "./Code/List.js";

const Stack = require("./Code/Stack");
const List = require("./Code/List");

export default {
  name: "app",
  data() {
    return {
      stackResult: "",
      listResult: "",
      elementStack: 0,
      elementList: 0,
      stackResult: 0,
      listResult: 0,
      list: new List(),
      stack: new Stack(),
    };
  },
  methods: {
    stackAdd: function () {
      // !
      this.stack.push(this.elementStack);
      console.log(this.stack);
    },
    stackPop: function () {
      this.stackResult = this.stack.pop();
      console.log(this.stack);
    },
    stackEmpty: function () {
      this.stackResult = this.stack.isEmpty();
      console.log(this.stackResult);
    },
    stackClear: function () {
      this.stack.clear();
      console.log(this.stack);
    },
    stackShow: function () {
      console.log(this.stack);
    },
    stackTop: function () {
      this.stackResult = this.stack.top();
      //console.log(this.stack);
      console.log(this.stackResult);
    },
    listAdd: function () {
      this.list.insert(this.elementList);
      console.log(this.list);
    },
    listFind: function () {
      this.listResult = this.list.find(this.elementList);
      console.log(this.list);
    },
    listDelete: function () {
      this.list.delete(this.elementList);
      console.log(this.list);
    },
    listClear: function () {
      this.list.clear();
      console.log(this.list);
    },
    listShow: function () {
      console.log(this.list);
    },
  },
};
</script>

<style>
.container {
  display: flex;
  justify-content: center;
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  padding: 10px;
}

.stack__input {
  margin: 5px;
  height: 30px;
  font-size: 18px;
}

.diffEq {
  flex-direction: column;
  max-height: 95vh;
  align-content: center;
}

.diffEq_graphs {
  overflow: auto;
}

.option {
  display: flex;
  flex-direction: column;
}

canvas {
  display: flex;
  width: 100%;
}

.option input {
  display: block;
  width: 100%;
  line-height: 20px;
  text-align: center;
  border-radius: 5px;
  border: 1px solid silver;
  box-sizing: border-box;
}

input:active,
input:focus {
  outline: none;
  border: 1px solid #0e0105;
}

.btn {
  margin: 5px;
  color: #000;
  border: 1px solid black;
  border-radius: 5px;
  font-size: 15px;
  padding: 5px;
  background-color: #f2f5f4;
}

.btn:hover {
  font-size: 15px;
  color: #fff;
  cursor: pointer;
  background-color: #000;
  font-family: Arial;
  border-color: #fff;
}

#start-button {
  color: #000;
  border: 1px solid black;
  border-radius: 5px;
  font-size: 15px;
  padding: 5px;
  background-color: #f2f5f4;
}

#start-button:hover {
  font-size: 15px;
  color: #fff;
  cursor: pointer;
  background-color: #000;
  font-family: Arial;
  border-color: #fff;
}

input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
  padding: 0;
}
</style>