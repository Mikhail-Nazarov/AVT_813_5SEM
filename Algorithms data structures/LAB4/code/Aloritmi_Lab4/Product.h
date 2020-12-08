#pragma once
#include <string>
using namespace std;


class Product
{
public:
	Product* next;
	string name;

	Product();
	Product(string name);
	~Product();
};

