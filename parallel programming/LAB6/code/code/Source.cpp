#include <mpi.h>
#include <cmath>
#include <iostream>
#include <ctime>

void insert(int* matrixA, int* matrixB, size_t A, size_t B, size_t C);
void show(int* matrix, size_t A, size_t B);
void MultiMatrixParallel(int* , int AHeght, int AWidth, int* B, int BHeght, int BWidth, int* C, int rank, int numProcesses);

void main(int argc, char** argv)
{
    MPI_Init(&argc, &argv);

    int rank;
    int numProcesses;

    MPI_Comm_rank(MPI_COMM_WORLD, &rank);
    MPI_Comm_size(MPI_COMM_WORLD, &numProcesses);

    size_t A = 1000;
    size_t B = 1000;
    size_t C = 1000;

    MPI_Status stat;

    int* matrixA = new int[A * B];
    int* matrixB = new int[B * C];
    int* matrixC = new int[A * C];

    insert(matrixA, matrixB, A, B, C);

    clock_t time = clock();
    MultiMatrixParallel(matrixA, A, A, matrixB, B, B, matrixC, rank, numProcesses);
    time = clock() - time;

    if (rank == 0)
    {
        std::cout << "Time : (" << numProcesses << " proccesses) :" << time << " ms" << std::endl;
        /*
        std::cout << "Matrix A : " << std::endl;
        show(matrixA, A, B);

        std::cout << "Matrix B : " << std::endl;
        show(matrixB, B, C);

        std::cout << "Matrix A x B ( " << numProcesses << " processes) :" << std::endl;
        show(matrixC, A, C);
        */
    }



    delete matrixA;
    delete matrixB;
    delete matrixC;

    MPI_Finalize();
}

void insert(int* matrixA, int* matrixB, size_t A, size_t B, size_t C)
{
    for (size_t i = 0; i < A * B; i++)
    {
        matrixA[i] = i;
    }

    for (size_t i = 0; i < B * C; i++)
    {
        matrixB[i] = i;
    }
}

void show(int* matrix, size_t A, size_t B)
{
    for (size_t i = 0; i < A * B; i += B) 
    {
        for (size_t j = 0; j < B; j++) 
        {
            std::cout << '\t' << matrix[j + i];
        }
        std::cout << '\n';
    }

    std::cout << "\n\n";
}

void MultiMatrixParallel(int* A, int AHeght, int AWidth, int* B, int BHeght, int BWidth, int* C, int rank, int numProcesses)
{
    int i = 0, j = 0;
    int *bufferA, *bufferB, *bufferC;

    int rowA = AHeght / numProcesses;
    int rowB = BHeght / numProcesses;
    int rowC = rowA;

    int PartA = rowA * AWidth;
    int PartB = rowB * BWidth;
    int partC = rowC * BWidth;

    bufferA = new int[PartA];
    bufferB = new int[PartB];
    bufferC = new int[partC];

    for (i = 0; i < partC; i++)
    {
        bufferC[i] = 0;
    }

    MPI_Scatter(A, PartA, MPI_INT, bufferA, PartA, MPI_INT, 0, MPI_COMM_WORLD);
    MPI_Scatter(B, PartB, MPI_INT, bufferB, PartB, MPI_INT, 0, MPI_COMM_WORLD);
    
    int k = 0, temp = 0;
    int NextProcesses = rank + 1;
    if (rank == numProcesses - 1)
    {
        NextProcesses = 0;
    }
    int PrevProcesses = rank - 1;
    if (rank == 0)
    {
        PrevProcesses = numProcesses - 1;
    }
   
    MPI_Status Status;
    
    int PrevDataNum = rank;
    for (int p = 0; p < numProcesses; p++)
    {
        for (i = 0; i < rowA; i++)
        {
            for (j = 0; j < BWidth; j++)
            {
                temp = 0;
                for (k = 0; k < rowB; k++)
                {
                    temp += bufferA[PrevDataNum * rowB + i * AWidth + k] * bufferB[k * BWidth + j];
                }
                bufferC[i * BWidth + j] += temp;
            }
        }
        PrevDataNum -= 1;
        if (PrevDataNum < 0)
        {
            PrevDataNum = numProcesses - 1;
        }
        
        MPI_Sendrecv_replace(bufferB, PartB, MPI_INT, NextProcesses, 0, PrevProcesses, 0, MPI_COMM_WORLD, &Status);
    
    }
   
    MPI_Gather(bufferC, partC, MPI_INT, C, partC, MPI_INT, 0, MPI_COMM_WORLD);

}