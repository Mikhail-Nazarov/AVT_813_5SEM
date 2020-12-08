#include "Product.h"


Product::Product()
{
	this->name = "";
	this->next = NULL;
}

Product::Product(string name)
{
	this->name = name;
	this->next = NULL;
}

Product::~Product()
{
	if (this->next != NULL)
	{
		delete this->next;
	}
}
