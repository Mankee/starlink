from typing import List

import math


def factor(x: int) -> List[int]:
    """Return the sorted prime factorization of x."""

    for c in range(2, int(math.sqrt(x)) + 1):
        if x % c == 0:
            return [c] + factor(x // c)

    return [x]
