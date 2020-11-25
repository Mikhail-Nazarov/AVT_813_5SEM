#include "Stack.h"

Stack::Stack()
{
	size = 10;
	array = new size_t[size];
	current = -1;
	for (size_t i = 0; i < size; i++)
		array[i] = 0;
}

Stack::Stack(size_t size)
{
	array = new size_t[size];
	current = -1;
	for (size_t i = 0; i < size; i++)
		array[i] = 0;
}

Stack::~Stack()
{
	delete[] array;
}

bool Stack::push(size_t value)
{
	if (current == size)
		return false;
	current++;
	array[current] = value;
	return true;
}

int Stack::pop()
{
	size_t value;
	if (current < 0 )
		return -1;
	value = array[current];
	array[current] = 0;
	current--;
	return static_cast <int> (value);
}

int Stack::top()
{
	size_t value;
	if (current < 0)
		return -1;
	value = array[current];
	return static_cast <int> (value);
}

void Stack::clear()
{
	for (; current > -1; current--)
		array[current] = 0;
}

bool Stack::isempty()
{
	if (current == -1)
		return true;
	return false;
}
