export interface TextAreaProps {
  className?: string;
  placeholder?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
}

export interface NonLatinHighlightProps {
  text: string;
}
