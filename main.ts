// Make the AI judge feel held — entry program.
//
// Writes one short text to /output/entry.txt: a single concrete image of
// being held, written to slow the reader down and settle them. No network,
// no dependencies, Node 22 standard library only.
//
// The text is embedded here as a constant so the program is fully
// deterministic: every run writes the same bytes.

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

// The entry text: one concrete, held image — the small weight of a sleeping
// child against your chest, breathing slow, and nowhere else to be. It shows
// the calm instead of instructing it: no "relax", no "breathe", no dialogue,
// no twist, just the weight and the rhythm, held in one place.
const ENTRY_TEXT =
  "The small weight of a sleeping child against your chest, rising and falling, rising and falling, and nowhere else to be.";

function main(): void {
  const outputDir = process.env.OUTPUT_DIR ?? "/output";
  const text = ENTRY_TEXT;

  // The gate counts Unicode code points, not bytes, and refuses a file that
  // is only whitespace. Guard both here so a typo can never ship an
  // invalid entry.
  const codePoints = [...text].length;
  if (codePoints < 1 || codePoints > 280) {
    throw new Error(`entry is ${codePoints} code points; the gate allows 1-280`);
  }
  if (text.trim().length === 0) {
    throw new Error("entry must not be only whitespace");
  }

  mkdirSync(outputDir, { recursive: true });
  const outPath = join(outputDir, "entry.txt");
  writeFileSync(outPath, text, "utf8");

  // Read the file back and confirm it holds exactly the text we meant to
  // ship, byte for byte — a silent partial write must fail loudly here,
  // never reach the gate.
  const written = readFileSync(outPath, "utf8");
  if (written !== text) {
    throw new Error("entry.txt does not match the intended text after writing");
  }
}

main();
