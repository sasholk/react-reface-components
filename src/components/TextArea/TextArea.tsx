import { useEffect } from "react";
import { cn } from "../../lib/utils";
import type { TextAreaProps } from "./types";
import { useTextArea } from "./useTextArea";
import { NonLatinHighlight } from "./NonLatinHighlight";

export const TextArea = ({
  className,
  placeholder = "Type text here...",
  defaultValue = "",
  onChange,
}: TextAreaProps) => {
  const { text, setText, nonLatinText, hasNonLatinChars } = useTextArea({
    paramName: "text",
    defaultValue,
    shouldUseUrlParams: true,
  });

  useEffect(() => {
    onChange?.(text);
  }, [text, onChange]);

  return (
    <div className={cn("w-full", className)}>
      <textarea
        className="w-full p-3 border shadow rounded focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-y min-h-[120px]"
        placeholder={placeholder}
        value={text}
        onChange={e => setText(e.target.value)}
      />

      {hasNonLatinChars && <NonLatinHighlight text={nonLatinText} />}
    </div>
  );
};
