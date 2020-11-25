#include <iostream>
#include "Stack.h"
#include "List.h"

int main()
{
	Stack st(20);
	std::cout <<"\nisempty "<< st.isempty();
	st.push(10);
	std::cout << "\nisempty " << st.isempty();
	std::cout << "\ntop " << st.top();
	std::cout << "\npop " << st.pop();
	std::cout << "\nisempty " << st.isempty();
	
	List ls;
	char s = 'а';
	ls.search(s);
}