#include "HashTable.h"
#include <iostream>

using namespace std;

HashTable::HashTable()
{
	table = new Product[HashTableSize];
	countCollisions = 0;
}

HashTable::~HashTable()
{
	delete [] table;
}

int HashTable::hash(string str)
{
	int asciiSum = 0;
	for (int i = 0; i < str.length(); i++)
	{
		asciiSum += str[i];
	}
	return (asciiSum % HashTableSize);
}

/*int HashTable::hash(string str)
{
	const int p = 128;
	long long hash = 0, p_pow = 1;
	for (size_t i = 0; i < str.length(); ++i)
	{
		hash += str[i] * p_pow;
		p_pow *= p;
	}
	return hash % HashTableSize;
}*/


void HashTable::add(string name)
{
	int hashNumber = hash(name);
	Product* prod = new Product(name);
	Product* place = &table[hashNumber];
	if (place->name == "")
	{
		table[hashNumber] = *prod;
		return;
	}

	while (place->next != NULL)
	{
		place = place->next;
	}
	place->next = prod;
	countCollisions++;
}

Product* HashTable::find(string name)
{
	int hashNumber = hash(name);
	Product* result = &table[hashNumber];
	if (!result)
	{
		cout << "Element not found" << endl;
		return NULL;
	}
	while (result->name != name)
	{
		if (!result->next)
		{
			cout << "Element '" << name << "' not found" << endl;
			return NULL;
		}
		result = result->next;
	}
	return result;
}

void HashTable::print()
{
	cout << "Hash-Table: \n";
	for (int i = 0; i < HashTableSize; i++)
	{
		cout << i << ": ";
		Product* prod = &table[i];
		while (prod->next != NULL)
		{
			cout << prod->name << "; ";
			prod = prod->next;
		}
		cout << prod->name << " ";
		cout << "\n";
	}
	cout << "\nCollisioins: " << countCollisions << "\n\n";
}