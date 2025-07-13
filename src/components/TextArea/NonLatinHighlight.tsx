import { cn } from "../../lib/utils";
import type { NonLatinHighlightProps } from "./types";

export const NonLatinHighlight = ({
  highlightedChars,
}: NonLatinHighlightProps) => {
  if (!highlightedChars.length) {
    return null;
  }

  return (
    <div className="mt-2 p-2 rounded bg-secondary/5 border border-secondary-foreground shadow">
      <h3 className="text-sm font-medium mb-1">Non-Latin Characters is blue</h3>
      {highlightedChars.map((char, index) => (
        <span
          key={index}
          className={cn({
            "text-accent": char.isNonLatin,
          })}
        >
          {char.char}
        </span>
      ))}
    </div>
  );
};
