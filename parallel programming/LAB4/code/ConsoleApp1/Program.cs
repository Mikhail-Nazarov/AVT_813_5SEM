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
        public List<int> arrayCells;
        public Mutex readMutex;
        public Mutex writeMutex;
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

            List<string> output = new List<string>();
            List<Thread> threads = new List<Thread>();

            for (int i = 0; i < numPair; i++)
                output.Add("output" + i + ".txt");

            BinaryWriter inputFileW = new BinaryWriter(File.Open("input.bin", FileMode.Create, FileAccess.Write));

            const int numberCount = 200000;

            for (int i = 2; i < numberCount; i++)
                inputFileW.Write(i);

            for (int i = 0; i < numPair; i++)
                inputFileW.Write(0);


            inputFileW.Close();

            BinaryReader inputFileR = new BinaryReader(File.Open("input.bin", FileMode.Open, FileAccess.Read), Encoding.ASCII);

            for (int i = 0; i < numPair; i++)
            {
                threads.Add(new Thread(read));
                threads.Add(new Thread(writeOut));
            }

            List<argument> list = new List<argument>();
            argument temp;

            temp.fileInput = inputFileR;
            temp.readMutex = new Mutex();
            for (int i = 0; i < numPair; i++)
            {
                temp.fileOutput = new StreamWriter(File.Open(output[i], FileMode.OpenOrCreate, FileAccess.Write));
                temp.arrayCells = new List<int>();
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

                info.writeMutex.WaitOne();
                info.arrayCells.Insert(0, number);
                info.writeMutex.ReleaseMutex();
                info.waitSem.Release();
            }
            info.arrayCells.Insert(0, 0);
            info.waitSem.Release();

            return;
        }

        public static void writeOut(Object obj)
        {
            int number;
            argument info = (argument)obj;
            int division;
            do
            {
                info.waitSem.WaitOne();
                info.writeMutex.WaitOne();

                number = info.arrayCells[0];
                info.arrayCells.RemoveAt(0);

                info.writeMutex.ReleaseMutex();

                division = 2;
                info.fileOutput.Write(number + " = ");
                while (number > 1)
                {
                    while (number % division == 0)
                    {
                        info.fileOutput.Write(division);

                        number = number / division;
                        if (number > 1)
                            info.fileOutput.Write(" * ");
                    }
                    if (division == 2) division++;
                    else division += 2;
                }
                info.fileOutput.Write("\n");

            } while (number != 0);

            while (info.arrayCells.Count != 0)
            {
                number = info.arrayCells[0];
                info.arrayCells.RemoveAt(0);
                division = 2;
                info.fileOutput.Write(number + " = ");

                while (number > 1)
                {
                    while (number % division == 0)
                    {
                        info.fileOutput.Write(division);

                        number = number / division;
                        if (number > 1)
                            info.fileOutput.Write(" * ");
                    }
                    if (division == 2) division++;
                    else division += 2;
                }
                info.fileOutput.Write("\n");
            }
            info.writeMutex.Close();
            info.fileOutput.Close();
            return;
        }
    }
}
