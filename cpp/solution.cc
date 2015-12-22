#include "util.h"

/**
 * Return the sorted prime factorization of x.
 */
std::vector<int> factor(int x)
{
    std::vector<int> factors;

    while (true)
    {
        for (int c = 2; c * c <= x; ++c)
        {
            if (x % c == 0)
            {
                factors.emplace_back(c);
                x /= c;
                goto repeat;
            }
        }
        factors.emplace_back(x);
        break;

    repeat:
        continue;
    }

    return factors;
}
