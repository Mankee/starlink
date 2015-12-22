import fs from "fs";

export const BOLD = "\u001b[1m";
export const GRAY = "\u001b[38;5;248m";
export const CYAN = "\u001b[36m";
export const RED = "\u001b[31m";
export const GREEN = "\u001b[32m";
export const YELLOW = "\u001b[33m";
export const RESET = "\u001b[0m";

export function fail(message: string) {
  console.log(RED + BOLD + "FAIL: " + RESET + message);
  process.exit(1);
}

export function check(condition: any, message: string): asserts condition {
  if (!condition) {
    fail(message);
  }
}

export function readLines(path: string): string[] {
  return fs
    .readFileSync(path, "utf-8")
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);
}
