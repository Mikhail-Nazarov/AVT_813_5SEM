#include "List.h"

List::List()
{
	begin = new data;
	current = begin;
	current->p = nullptr;
	current->symbol = 'à';
}

List::List(char symbol)
{
	begin = new data;
	current = begin;
	current->p = nullptr;
	current->symbol = symbol;
}

List::~List()
{
}

void List::push(char value, size_t position)
{
	for (size_t i = 0; i < position; i++)
		current = current->p;
	data* temp;
	data* newElement = new data;
	newElement->symbol = value;

	if (position == 0) {
		begin = newElement;
		newElement->p = current;
		current = begin;
		return;
	}

	temp = current->p;
	current->p = newElement;
	newElement->p = temp;
	current = begin;
}

int List::search()
{
	return 0;
}

void List::clear(char value)
{
	data* temp;
	temp = current;
	current = current->p;
	while (current->symbol != value) {
		if (current->p == nullptr) {
			current = begin;
			return;
		}
		temp = current;
		current = current->p;
	}
	
	if (current == begin) {
		begin = current->p;
		delete current;
		current = begin;
		return;
	}
		
	data* tempP;
	tempP = current->p;
	temp->p = tempP;

	delete current;

	current = begin;
}

void List::clearAll()
{
	current = current->p;
	data* temp;
	while (current->p = nullptr) {
		temp = current->p;
		delete current;
		current = temp;
	}
	current = begin;
}
