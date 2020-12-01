using System;
using System.Text;
using System.IO;
using System.Threading;
using System.Collections.Generic;
using System.Diagnostics;

namespace PP4
{

    struct argument
    {
        public BinaryReader fileInput;
        public StreamWriter fileOutput;
        public List<int> numbers;
        public List<bool> results;
        public Mutex readMutex;
        public Mutex writeMutex;
        public Mutex writeFileMutex;
        public Semaphore waitSem;
        /*mutex*/
    }
    class Program
    {

        static void Main(string[] args)
        {
            Stopwatch timer = new Stopwatch();
            timer.Start();

            int numPair = 8;

            List<Thread> threads = new List<Thread>();

            BinaryWriter inputFileW = new BinaryWriter(File.Open("input.bin", FileMode.Create, FileAccess.Write));

            const int numberCount = 200000;

            for (int i = 2; i < numberCount; i++)
                inputFileW.Write(i);

            for (int i = 0; i < numPair; i++)
                inputFileW.Write(0);


            inputFileW.Close();

            BinaryReader inputFileR = new BinaryReader(File.Open("input.bin", FileMode.Open, FileAccess.Read), Encoding.ASCII);
            StreamWriter outputFileR = new StreamWriter(File.Open("output.bin", FileMode.OpenOrCreate, FileAccess.Write));

            for (int i = 0; i < numPair; i++)
            {
                threads.Add(new Thread(read));
                threads.Add(new Thread(writeOut));
            }

            List<argument> list = new List<argument>();
            argument temp = new argument();

            temp.fileInput = inputFileR;
            temp.readMutex = new Mutex();
            temp.writeFileMutex = new Mutex();
            temp.fileOutput = outputFileR;

            for (int i = 0; i < numPair; i++)
            {
                temp.numbers = new List<int>();
                temp.results = new List<bool>();
                temp.writeMutex = new Mutex();
                temp.waitSem = new Semaphore(0, numberCount / numPair);

                list.Add(temp);
            }

            for (int i = 0; i < numPair * 2; i += 2)
            {
                threads[i].Start(@list[i / 2]);
                threads[i + 1].Start(@list[i / 2]);
            }

            for (int i = numPair; i < numPair * 2; i++)
                threads[i].Join();

            temp.readMutex.Close();
            inputFileR.Close();

            timer.Stop();
            Console.WriteLine(timer.ElapsedMilliseconds / (double)1000);
            return;
        }

        public static void read(Object obj)
        {
            argument info = (argument)obj;
            int number;

            while (true)
            {
                info.readMutex.WaitOne();
                number = info.fileInput.ReadInt32();
                info.readMutex.ReleaseMutex();

                if (number == 0) break;
                bool result = isPrimeNumber(number);
                info.writeMutex.WaitOne();
                info.numbers.Insert(0, number);
                info.results.Insert(0, result);
                info.writeMutex.ReleaseMutex();
                info.waitSem.Release();
            }
            info.numbers.Insert(0, 0);
            info.waitSem.Release();

            return;
        }


        public static bool isPrimeNumber(int x)
        {
            for (int i = 2; i <= Math.Sqrt(x); i++)
                if (x % i == 0)
                    return false;
            return true;
        }

        public static void writeOut(Object obj)
        {
            int number; 
            bool result;

            argument info = (argument)obj;

            do
            {
                info.waitSem.WaitOne();
                info.writeMutex.WaitOne();

                number = info.numbers[0];
                result = info.results[0];

                info.numbers.RemoveAt(0);
                info.results.RemoveAt(0);

                info.writeMutex.ReleaseMutex();

                info.writeFileMutex.WaitOne();
                if (result == true)
                {
                    info.fileOutput.Write(number);
                    info.fileOutput.Write(" - simple \n");
                }
                else
                {
                    info.fileOutput.Write(number);
                    info.fileOutput.Write(" - not simple \n");
                }

                info.writeFileMutex.ReleaseMutex();


            } while (number != 0);

            return;
        }
    }
}
