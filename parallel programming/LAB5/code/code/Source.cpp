#include <mpi.h>
#include <cmath>
#include <iostream>
#include <ctime>

double Fx(double x)
{
	return (sqrt(x) * x) / log(x);
}

double trapesIntegr(double a, double b, double shift)
{
	std::cout << "-a = " << a << " -b = " << b << " -s = " << shift << std::endl;

	double C0 = 3. / 8.;

	double h = (b - a) / shift;
	double result = 0;
	double x1 = a;
	double S = C0 * shift * result;

	for (int i = 0; i < h / 3; ++i)
	{
		result += (Fx(x1) + 3 * Fx(x1 + shift) + 3 * Fx(x1 + shift * 2) + Fx(x1 + shift * 3));
		x1 = x1 + shift * 3;
	}

	S = C0 * shift * result;

	return S;

}

void main(int argc, char** argv)
{
	MPI_Init(&argc, &argv);

	double a = 2, b = 6;

	int rank;
	int numTasks;

	MPI_Comm_rank(MPI_COMM_WORLD, &rank);
	MPI_Comm_size(MPI_COMM_WORLD, &numTasks);

	const int numArgs = 3;
	double* sendBuf = new double[numArgs * numTasks];


	double recvBuffer[numArgs];

	double step = (b - a) / numTasks;

	double shift = (b - a) / 10000000.;


	clock_t time = clock();

	if (rank == 0) {
		for (size_t i = 0; i < numTasks * 3; i += 3) {
			sendBuf[i] = a + i / 3 * step;
			sendBuf[i + 1] = sendBuf[i] + step;
			sendBuf[i + 2] = shift;
		}
	}

	MPI_Scatter(sendBuf, 3, MPI_DOUBLE, recvBuffer, 3, MPI_DOUBLE, 0, MPI_COMM_WORLD);

	double res = trapesIntegr(recvBuffer[0], recvBuffer[1], recvBuffer[2]);

	std::cout << rank << "- Trapes : " << res << std::endl;

	double *curRes = new double[numTasks + 1];

	 MPI_Gather(&res, 1, MPI_DOUBLE, curRes, 1, MPI_DOUBLE, 0, MPI_COMM_WORLD);

	 if (rank == 0) 
	 {
	
		 time = clock() - time;
		 res = 0;

		 for (int i = 0; i < numTasks; i++)
			 res += curRes[i];

		  std::cout << "Trapes : " << res << std::endl;
		  std::cout << "Time : " << time << " ms" << std::endl;
	  }

	  delete[] curRes;

	MPI_Finalize();
}
