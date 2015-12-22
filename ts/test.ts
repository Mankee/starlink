#!/usr/bin/env ts-node

import { factor } from "./solution";
import { check, readLines } from "./test-util";

export function main(argv: string[]) {
  check(argv.length === 4, "USAGE: test.ts OUT_PATH TEST_CASE");

  const outPath = argv[2];
  const testCase = argv[3];

  for (const line of readLines(testCase)) {
    const [x, ...expected] = line.split(" ").map(Number);
    const factors = factor(x);
    console.log(`${x.toString().padEnd(12)} -> ${factors}`);
    check(
      JSON.stringify(factors) === JSON.stringify(expected),
      `Expected ${expected}`
    );
  }
}

if (require.main === module) {
  main(process.argv);
}
