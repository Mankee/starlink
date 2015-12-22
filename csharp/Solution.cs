using System;
using System.Collections.Generic;

public static class Solution
{
    public static List<int> Factor(int x)
    {
        List<int> factors = new List<int>();

        for (int c = 2; c <= Math.Sqrt(x); c++)
        {
            if (x % c == 0)
            {
                factors.Add(c);
                factors.AddRange(Factor(x / c));
                return factors;
            }
        }

        factors.Add(x);
        return factors;
    }
}
