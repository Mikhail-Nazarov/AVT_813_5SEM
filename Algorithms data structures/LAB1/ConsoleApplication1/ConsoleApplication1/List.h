#pragma once
struct data {
	data* p;
	char symbol;
};

class List
{
public:
	List();
	List(char symbol);
	~List();
	void push(char value, size_t position);
	int search();
	void clear(char value);
	void clearAll();

private:
	data element;
	data* current;
	data* begin;
	char symbol;
};


