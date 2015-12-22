#!/usr/bin/env python3

import sys

from solution import factor
from test_util import check


def main():
    check(len(sys.argv) == 3, "USAGE: %s OUT_PATH TEST_CASE" % sys.argv[0])

    out_path = sys.argv[1]
    test_case = sys.argv[2]

    for line in open(test_case):
        line = [int(p) for p in line.split()]
        x, expected = line[0], line[1:]
        factors = factor(x)
        print("%-12d -> %r" % (x, factors))
        check(tuple(factors) == tuple(expected), " Expected %r" % expected)


if __name__ == '__main__':
    main()
