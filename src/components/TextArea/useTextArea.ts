import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

interface UseTextAreaOptions {
  paramName?: string;
  defaultValue?: string;
  shouldUseUrlParams?: boolean;
}
export const useTextArea = (options: UseTextAreaOptions = {}) => {
  const {
    paramName = "text",
    defaultValue = "",
    shouldUseUrlParams = true,
  } = options;

  const [searchParams, setSearchParams] = useSearchParams();

  const getInitialValue = () => {
    if (shouldUseUrlParams) {
      return searchParams.get(paramName) || defaultValue;
    }
    return defaultValue;
  };

  const [text, setText] = useState(getInitialValue());
  const [nonLatinText, setNonLatinText] = useState("");

  useEffect(() => {
    const extractNonLatinChars = (input: string) => {
      const nonLatinRegex = /[^a-zA-Z0-9\s\p{P}]/gu;
      const matches = input.match(nonLatinRegex);
      return matches ? matches.join("") : "";
    };

    setNonLatinText(extractNonLatinChars(text));
  }, [text]);

  useEffect(() => {
    const current = searchParams.get(paramName) ?? "";
    if (text !== current) {
      const nextParams = new URLSearchParams(searchParams);
      if (text === "") {
        nextParams.delete(paramName);
      }
      nextParams.set(paramName, text);
      setSearchParams(nextParams, { replace: true });
    }
  }, [text, searchParams, setSearchParams, paramName]);

  const hasNonLatinChars = nonLatinText.length > 0;

  return {
    text,
    setText,
    nonLatinText,
    hasNonLatinChars,
  };
};
