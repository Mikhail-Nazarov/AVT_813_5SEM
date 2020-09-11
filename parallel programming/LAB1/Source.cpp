#include <iostream>
#include <stdio.h>
#include <stdlib.h>
#include "pthread.h"
#include <conio.h>
using namespace std;
#pragma comment(lib, "pthreadVCE2.lib")
void* square(void* num);
void threadSquaredGenerator(int number);

int main() 
{
	for (int i = 0; i < 4; i++) {
		int number = i;
		threadSquaredGenerator(number);
	}
	_getch();
}

void threadSquaredGenerator(int number) {
	int* numberPtr = &number;
	pthread_t thread;
	pthread_create(&thread, NULL, square, numberPtr);
	pthread_join(thread, (void**)&numberPtr);
	cout << *numberPtr << endl;
}

void* square(void* number)
{
	int* num = (int*)number;
	int* square = new int( (*num) * (*num) );
	return square;
}