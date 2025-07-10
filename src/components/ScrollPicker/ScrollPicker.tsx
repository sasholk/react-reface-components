import { useState, useRef, useEffect, useCallback } from "react";
import { cn } from "../../lib/utils";
import { generateDateItems } from "../../utils";

interface ScrollPickerProps {
  onSubmit?: (dateTime: Date) => void;
  className?: string;
}

interface PickerColumn {
  id: string;
  items: string[];
  selectedIndex: number;
}

export const ScrollPicker = ({ onSubmit, className }: ScrollPickerProps) => {
  const [columns, setColumns] = useState<PickerColumn[]>([
    {
      id: "date",
      items: generateDateItems(),
      selectedIndex: 0,
    },
    {
      id: "hour",
      items: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"],
      selectedIndex: 4,
    },
    {
      id: "minute",
      items: ["00", "05", "10", "15", "20", "25", "30", "35", "40", "45", "50", "55"],
      selectedIndex: 0,
    },
    {
      id: "period",
      items: ["AM", "PM"],
      selectedIndex: 1,
    },
  ]);

  const columnRefs = useRef<(HTMLDivElement | null)[]>([]);
  const scrollTimeouts = useRef<(ReturnType<typeof setTimeout> | null)[]>([]);
  const isScrolling = useRef<boolean[]>([]);

  const ITEM_HEIGHT = 48;

  useEffect(() => {
    columns.forEach((column, columnIndex) => {
      const element = columnRefs.current[columnIndex];
      if (element) {
        const scrollTop = column.selectedIndex * ITEM_HEIGHT;
        element.scrollTop = scrollTop;
      }
    });
  }, []);

  const updateSelectedIndex = useCallback((columnIndex: number, newIndex: number) => {
    setColumns(prev =>
      prev.map((col, idx) =>
        idx === columnIndex ? { ...col, selectedIndex: Math.max(0, Math.min(newIndex, col.items.length - 1)) } : col,
      ),
    );
  }, []);

  const handleScroll = useCallback(
    (columnIndex: number) => {
      const element = columnRefs.current[columnIndex];
      if (!element || isScrolling.current[columnIndex]) return;

      const scrollTop = element.scrollTop;
      const newIndex = Math.round(scrollTop / ITEM_HEIGHT);

      updateSelectedIndex(columnIndex, newIndex);

      if (scrollTimeouts.current[columnIndex]) {
        clearTimeout(scrollTimeouts.current[columnIndex]!);
      }
      scrollTimeouts.current[columnIndex] = setTimeout(() => {
        if (element) {
          isScrolling.current[columnIndex] = true;
          element.scrollTo({
            top: newIndex * ITEM_HEIGHT,
            behavior: "smooth",
          });

          setTimeout(() => {
            isScrolling.current[columnIndex] = false;
          }, 300);
        }
      }, 150);
    },
    [updateSelectedIndex],
  );

  const handleItemClick = useCallback(
    (columnIndex: number, itemIndex: number) => {
      const element = columnRefs.current[columnIndex];
      if (!element) return;

      updateSelectedIndex(columnIndex, itemIndex);
      isScrolling.current[columnIndex] = true;

      element.scrollTo({
        top: itemIndex * ITEM_HEIGHT,
        behavior: "smooth",
      });

      setTimeout(() => {
        isScrolling.current[columnIndex] = false;
      }, 300);
    },
    [updateSelectedIndex],
  );

  const getSelectedValues = () => {
    return columns.reduce((acc, column) => {
      acc[column.id] = column.items[column.selectedIndex];
      return acc;
    }, {} as Record<string, string>);
  };

  const handleConfirm = () => {
    const values = getSelectedValues();
    console.log("Selected values:", values);

    const today = new Date();
    const [hour, minute] = [parseInt(values.hour), parseInt(values.minute)];

    const hour24 = values.period === "PM" && hour !== 12 ? hour + 12 : values.period === "AM" && hour === 12 ? 0 : hour;

    today.setHours(hour24, minute, 0);

    console.log("Selected Date and Time:", today.toLocaleString());

    if (onSubmit) {
      onSubmit(today);
    }
  };

  return (
    <div className={cn("flex items-center justify-center p-4", className)}>
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-semibold text-center mb-6">Select Date & Time</h2>

        <div className="relative">
          <div className="absolute inset-x-0 top-1/2 transform -translate-y-1/2 h-12 bg-gray-100 backdrop-blur-3xl rounded-lg border-t border-b border-gray-200 pointer-events-none z-10"></div>

          <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-white to-transparent pointer-events-none z-20"></div>
          <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-white to-transparent pointer-events-none z-20"></div>

          <div className="flex">
            {columns.map((column, columnIndex) => (
              <div key={column.id} className={`flex-1 ${columnIndex === 0 ? "flex-[2]" : ""}`}>
                <div
                  ref={el => {
                    columnRefs.current[columnIndex] = el;
                  }}
                  className="h-48 overflow-y-scroll scrollbar-hide relative"
                  style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
                  onScroll={() => handleScroll(columnIndex)}
                >
                  <div className="flex flex-col">
                    <div className="h-18"></div>

                    {column.items.map((item, itemIndex) => (
                      <div
                        key={itemIndex}
                        className={cn(
                          "h-12 flex items-center justify-center text-lg transition-all duration-200 cursor-pointer select-none relative z-10",
                          {
                            "text-black font-semibold": itemIndex === column.selectedIndex,
                            "text-gray-400 hover:text-gray-600": itemIndex !== column.selectedIndex,
                          },
                        )}
                        onClick={() => handleItemClick(columnIndex, itemIndex)}
                      >
                        {item}
                      </div>
                    ))}

                    <div className="h-18"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button
            onClick={handleConfirm}
            className="flex-1 px-4 py-2 bg-primary text-white hover:shadow rounded hover:bg-primary/80 transition-colors transition-shadow"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};
