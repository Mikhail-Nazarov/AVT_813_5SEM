#include <iostream>
#include <stdio.h>
#include <stdlib.h>
#include "pthread.h"
#include <conio.h>
#include <string>
#include <chrono>
#include <vector>
#include <fstream> 
#include <cstring> 

using namespace std;
#pragma comment(lib, "pthreadVCE2.lib")
void driver();

bool isPrimeNumber(int);
void processNumbersInFiles(vector<string>);
vector<string> fillInputFiles();
string checkFiles(vector<string>);
ifstream getReadStream(string);
ofstream getWriteStream(string);
void* processInput(void*);
void* processOutput(void*);
void clearFile(string);

struct bufferArg {
	bool isReadingFinish = false;
	vector<bool> results = {};
	vector<int> numbers = {};
	string inputFileName = "";
	string outputFileName = "";
	pthread_mutex_t vectorMutext;
	pthread_cond_t vectorCond;
};

pthread_mutex_t fileMutext;
const int numbersAmount = 200000;
const string outputName = "output.txt";

int main() 
{	
	do {
		driver();
	} while (_getch() != EOF);
	
}

void driver() {
	vector<string> files = fillInputFiles();
	auto start = std::chrono::system_clock::now();
	processNumbersInFiles(files);
	auto end = std::chrono::system_clock::now();
	cout << "Done\nTime: " << std::chrono::duration_cast<std::chrono::milliseconds>(end - start).count() << endl;
}

void processNumbersInFiles(vector<string> files) {
	string checkResult = checkFiles(files);
	vector<pthread_t*> outputThreads = {};
	vector<pthread_t*> inputThreads = {};

	pthread_mutex_init(&fileMutext, NULL);
	clearFile(outputName);
	if (checkResult == "") {
		for (int i = 0; i < files.size();i++) {

			struct bufferArg* args = new bufferArg();
			args->inputFileName = files[i];
			args->outputFileName = outputName;
			pthread_mutex_init(&args->vectorMutext, NULL);
			pthread_cond_init(&args->vectorCond, NULL);

			pthread_t inputThread = pthread_t();
			pthread_t outputThread = pthread_t();
			outputThreads.push_back(&outputThread);
			inputThreads.push_back(&inputThread);

			pthread_create(&inputThread, NULL, processInput, (void*)args);
			pthread_create(&outputThread, NULL, processOutput, (void*)args);
		}

		for (int i = 0; i < outputThreads.size(); i++) {
			pthread_join(*(inputThreads[i]), NULL);
			pthread_join(*(outputThreads[i]), NULL);
		}
	}
	else
	{
		cout << "Error when open file: " << checkResult << endl;
	}
}

ifstream getReadStream(string inputFileName) {
	ifstream fileInput(inputFileName);
	return fileInput;
}

ofstream getWriteStream(string outputFileName) {
	ofstream fileOutput(outputFileName, ios_base::app);
	return fileOutput;
}

void* processInput(void* arguments) {
	struct bufferArg* args = (struct bufferArg*)arguments;
	int a = 0;
	ifstream input;

	while (!input.is_open()) {
		input = getReadStream(args->inputFileName);
	}

	while (input >> a) {
		bool result = isPrimeNumber(a);
		pthread_mutex_lock(&args->vectorMutext);
		args->numbers.push_back(a);
		args->results.push_back(result);
		pthread_cond_signal(&args->vectorCond);
		pthread_mutex_unlock(&args->vectorMutext);
	}
	args->isReadingFinish = true;

	return NULL;
}

void* processOutput(void* arguments) {
	struct bufferArg* args = (struct bufferArg*)arguments;
	ofstream output;
	while (!args->isReadingFinish || !args->results.empty()) {

		pthread_mutex_lock(&args->vectorMutext);

		if (args->results.empty()) {
			pthread_cond_wait(&args->vectorCond, &args->vectorMutext);
		}

		bool result = args->results.back();
		int number = args->numbers.back();
		args->numbers.pop_back();
		args->results.pop_back();
		pthread_mutex_unlock(&args->vectorMutext);

		pthread_mutex_lock(&fileMutext);
		while (!output.is_open()) {
			output = getWriteStream(args->outputFileName);
		}

		if (result) {
			output << "Number " << number << " is prime\n";
		}
		else {
			output << "Number " << number << " is not prime\n";
		}
		output.close();
		pthread_mutex_unlock(&fileMutext);
	}

	return NULL;
}

string checkFiles(vector<string> files) {
	if (files.size() <= 0) {
		return "No files";
	}

	for (int i = 0; i < files.size(); i++) {
		ifstream finput(files[i]);
		if (!finput.is_open()) {
			return files[i];
		}
	}
	return "";
}

vector<string> fillInputFiles() {
	vector<string> files = {};
	int filesNumber = 0;
	cout << "Enter number of input files or -1 to continue ( 1 file will use 2 threads )" << endl;
	cin >> filesNumber;
	for (int i = 0; i < filesNumber; i++) {
		string fileName = "input" + to_string(i) + ".txt";
		files.push_back(fileName);
		ofstream writeStream(fileName);
		for (int j = 0; j < numbersAmount; j++) {
			writeStream << j << '\n';
		}
	}
	return files;
}

void clearFile(string fileName) {
	ofstream writeStream;
	writeStream.open(fileName);
	writeStream.close();
}

bool isPrimeNumber(int x) {
	for (int i = 2; i <= sqrt(x); i++)
		if (x % i == 0)
			return false;
	return true;
}

