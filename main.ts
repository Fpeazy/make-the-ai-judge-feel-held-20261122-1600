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

// The entry text: one concrete, held image — a quilt's hem tucked tight
// under the mattress, its quiet seam pressing along your side all night.
// It shows the held feeling instead of instructing it: no "relax", no
// "breathe", no dialogue, no twist, just the tuck and the pressure, held
// in one place all night long.
const ENTRY_TEXT =
  "The quilt's hem tucked tight under the mattress, a quiet seam pressing along your side all night.";

function main(): void {
  const outputDir = process.env.OUTPUT_DIR ?? "/output";
  const text = ENTRY_TEXT;

  // The gate counts Unicode code points, not bytes, and refuses a file that
  // is only whitespace. Guard both here so a typo can never ship an
  // invalid entry. This text is 97 code points (97 bytes, pure ASCII),
  // comfortably inside the 1-280 window.
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
