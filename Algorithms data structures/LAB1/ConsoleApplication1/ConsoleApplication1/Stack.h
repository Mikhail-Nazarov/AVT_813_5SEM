#pragma once
class Stack
{

public:
	Stack();
	Stack(size_t size);
	~Stack();
	bool push(size_t value);
	int pop();
	int top();
	void clear();
	bool isempty();

private:
	size_t size;
	int current;
	size_t* array;
};

