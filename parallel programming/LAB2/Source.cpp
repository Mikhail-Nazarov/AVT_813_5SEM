#include <iostream>
#include <stdio.h>
#include <stdlib.h>
#include "pthread.h"
#include <conio.h>
#include <string>
#include <chrono>
#include <vector>
#include <omp.h>

using namespace std;
void scanDoubleWithMessage(double*, string);
void scanThreadsNumber(int*);
int getIntervalsNumber(double, double, double);
double getThirdOrderSum(double, double);
void* getSubIntervalResult(void*);
double integrationFunction(double);
double thirdOrderNewtonCotesIntegral(int, double, double, double);
void driver();

int main() 
{	
	do {
		driver();
	} while (_getch() != EOF);
	
}

void driver() {
	int threadsNumber = 1;
	double left = 0, right = 0, step = 0;

	scanDoubleWithMessage(&left, "Enter left integration limit: ");
	scanDoubleWithMessage(&right, "Enter right integration limit: ");
	scanDoubleWithMessage(&step, "Enter integration step: ");
	scanThreadsNumber(&threadsNumber);
	
	auto start = std::chrono::system_clock::now();
	cout << "Result: " << thirdOrderNewtonCotesIntegral(threadsNumber, left, right, step) << endl;
	auto end = std::chrono::system_clock::now();
	cout << "Time: " << std::chrono::duration_cast<std::chrono::milliseconds>(end - start).count() << endl;
}

double thirdOrderNewtonCotesIntegral(int threadsNumber, double left, double right, double step) {
	double result = 0;
	int intervalsNumber = 0, thirdOrderCn = 8, subIntervalSize = 0;
	vector<pthread_t> threads = {};
	intervalsNumber = getIntervalsNumber(left, right, step);

	#pragma omp parallel for num_threads(threadsNumber) reduction(+:result) 
	for (int i = 0; i < intervalsNumber; i++) {
		result += getThirdOrderSum(left + step * i, step / 3);
	}
	
	result *= step / thirdOrderCn;
	return result;
}

/*void* getSubIntervalResult(void* arguments) {
	struct arg_struct* args = (struct arg_struct*)arguments;
	double* subResult = new double(0);
	for (int i = 0; i < args->subIntervalSize; i++) {
		*subResult += getThirdOrderSum(args->left + (args->subIntervalNumber * args->subIntervalSize + i) * args->step, args->step / 3);
	}
	return subResult;
}*/

double getThirdOrderSum(double left, double step) {
	vector<int> thirdOrderTable = { 1, 3, 3, 1 };
	double sum = 0;
	for (int i = 0; i < thirdOrderTable.size(); i++) {
		sum += integrationFunction(left + i * step) * thirdOrderTable[i];
	}
	return sum;
}

int getIntervalsNumber(double left, double right, double step) {
	int intervalsNumber = ceil(abs(right - left) / step);
	return intervalsNumber;
}

double integrationFunction( double x ) {
	return 1 / (sqrt(pow(x, 3) + 1));
}

void scanDoubleWithMessage(double* number, string message) {
	cout << message;
	cin >> *number;
}

void scanThreadsNumber(int* threadsNumber) {
	cout << "Enter threads number from 1 to 8: ";
	cin >> *threadsNumber;
	if (*threadsNumber < 1 || *threadsNumber > 8) {
		*threadsNumber = 1;
	}
}