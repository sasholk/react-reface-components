export interface ScrollPickerProps {
  onSubmit?: (dateTime: Date) => void;
  className?: string;
}

export interface PickerColumn {
  id: string;
  items: string[];
  selectedIndex: number;
}

export interface PickerColumnProps {
  column: PickerColumn;
  columnIndex: number;
  columnRef: (el: HTMLDivElement | null) => void;
  onScroll: (index: number) => void;
  onClick: (columnIndex: number, itemIndex: number) => void;
}
