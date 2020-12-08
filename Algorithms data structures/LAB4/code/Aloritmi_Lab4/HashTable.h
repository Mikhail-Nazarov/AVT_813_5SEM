#pragma once
#define HashTableSize 1000
#include "Product.h"

class HashTable
{
	Product* table;
	int countCollisions;

	static int hash(string str);

public:
	HashTable();
	~HashTable();
	void add(string name);
	Product* find(string name);
	void print();
};

