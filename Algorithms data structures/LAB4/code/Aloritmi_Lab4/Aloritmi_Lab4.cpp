#include <iostream>
#include <string>
#include <fstream>
#include "HashTable.h"

int main()
{
	HashTable newTable;
	/*newTable.add("Chair");
	newTable.add("Table");
	newTable.add("Armchair");
	newTable.add("Shelf");
	newTable.add("Cupboard");
	newTable.add("Door");
	newTable.add("Bed");
	newTable.add("Carpet");
	newTable.add("Sofa");
	newTable.add("Accessories");
	
	newTable.print();

	Product* product = newTable.find("Shel");
	if(product != NULL)
		cout<< "Result: " << product->name;*/

	string line;
	ifstream in("E:\\input.txt");

	
	if (in.is_open())
	{
		while (getline(in, line))
		{
			newTable.add(line);
		}
	}
	in.close();

	newTable.print();
	
	return 0;
}