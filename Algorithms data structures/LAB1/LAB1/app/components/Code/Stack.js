class Stack {
  constructor() {
    this.size = 10;
    this.array = new Array(this.size);
    this.current = -1;
  }

  push(x) {
    if (this.current === this.size) {
      return false;
    }
    this.current++;
    this.array[this.current] = x;
    return true;
  }

  pop() {
    if (this.current < 0) {
      return -1;
    }

    this.array[this.current] = 0;
    this.current--;
  }

  top() {
    return this.array[this.current];
  }

  clear() {
    for (; this.current > -1; this.current--) this.array[this.current] = 0;
  }

  isEmpty() {
    if (this.current === -1) return true;
    return false;
  }
}

module.exports = Stack;
