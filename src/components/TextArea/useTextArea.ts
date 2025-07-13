import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

interface UseTextAreaOptions {
  paramName?: string;
  defaultValue?: string;
  shouldUseUrlParams?: boolean;
}

type HighlightedChar = {
  char: string;
  isNonLatin: boolean;
};

export const useTextArea = (options: UseTextAreaOptions = {}) => {
  const {
    paramName = "text",
    defaultValue = "",
    shouldUseUrlParams = true,
  } = options;

  const [searchParams, setSearchParams] = useSearchParams();
  const [text, setText] = useState(defaultValue);
  const [nonLatinText, setNonLatinText] = useState("");
  const [highlightedText, setHighlightedText] = useState<HighlightedChar[]>([]);

  const isNonLatinChar = (char: string): boolean => {
    const nonLatinRegex = /[^a-zA-Z0-9\s\p{P}]/u;
    return nonLatinRegex.test(char);
  };

  useEffect(() => {
    if (shouldUseUrlParams) {
      const param = searchParams.get(paramName);
      if (param !== null && param !== text) {
        setText(param);
      }
    }
  }, [paramName, searchParams, shouldUseUrlParams]);

  useEffect(() => {
    let nonLatin = "";
    const highlighted = text.split("").map((char) => {
      const isNonLatin = isNonLatinChar(char);
      if (isNonLatin) nonLatin += char;
      return { char, isNonLatin };
    });

    setHighlightedText(highlighted);
    setNonLatinText(nonLatin);
  }, [text]);

  useEffect(() => {
    const current = searchParams.get(paramName) ?? "";
    if (text !== current) {
      const nextParams = new URLSearchParams(searchParams.toString());

      if (text === "") {
        nextParams.delete(paramName);
      } else {
        nextParams.set(paramName, text);
      }

      setSearchParams(nextParams, { replace: true });
    }
  }, [text, paramName, setSearchParams]);

  return {
    text,
    setText,
    nonLatinText,
    highlightedText,
  };
};
