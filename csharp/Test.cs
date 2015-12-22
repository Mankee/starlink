using System;
using System.IO;
using System.Linq;

class Test
{
    static void Main(string[] args)
    {
        TestUtil.Check(args.Length == 2, $"USAGE: {AppDomain.CurrentDomain.FriendlyName} OUT_PATH TEST_CASE");

        string outPath = args[0];
        string testCase = args[1];

        foreach (string line in File.ReadAllLines(testCase))
        {
            List<int> numbers = line.Split().Select(int.Parse).ToList();
            var x = numbers.First();
            List<int> expected = numbers.Skip(1).ToList();

            List<int> factors = Solution.Factor(x);
            Console.WriteLine("{0,-12} -> {1}", x, string.Join(" ", factors));

            TestUtil.Check(factors.SequenceEqual(expected), $" Expected {string.Join(" ", expected)}");
        }
    }
}
