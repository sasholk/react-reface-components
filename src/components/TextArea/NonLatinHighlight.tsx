import type { NonLatinHighlightProps } from "./types";

export const NonLatinHighlight = ({ text }: NonLatinHighlightProps) => {
  if (!text.length) {
    return null;
  }

  return (
    <div className="mt-2 p-2 rounded bg-secondary/5 border border-secondary-foreground shadow">
      <h3 className="text-sm font-medium mb-1">Non-Latin Characters</h3>
      <p className="text-accent break-words">{text}</p>
    </div>
  );
};
