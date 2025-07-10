import { useRef, useEffect } from "react";
import { cn } from "../../lib/utils";

export interface ScrollPickerProps {
  onSubmit?: (dateTime: Date) => void;
  className?: string;
}

const columns = [
  {
    id: "date",
    items: ["Sun Sep 4", "Mon Sep 5", "Tue Sep 6", "Today", "Thu Sep 8", "Fri Sep 9", "Sat Sep 10"],
    selectedIndex: 3,
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
];

export const ScrollPicker = ({ className }: ScrollPickerProps) => {
  const columnRefs = useRef<(HTMLDivElement | null)[]>([]);

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

  const getSelectedValues = () => {
    return columns.reduce((acc, column) => {
      acc[column.id] = column.items[column.selectedIndex];
      return acc;
    }, {} as Record<string, string>);
  };

  const handleConfirm = () => {
    const values = getSelectedValues();
    console.log("Selected values:", values);
  };

  const handleItemClick = (columnIndex: number, itemIndex: number) => {
    const column = columns[columnIndex];
    column.selectedIndex = itemIndex;
    columnRefs.current[columnIndex]!.scrollTop = itemIndex * ITEM_HEIGHT;
  };

  const handleScroll = (columnIndex: number) => {
    const element = columnRefs.current[columnIndex];
    if (element) {
      const scrollTop = element.scrollTop;
      const selectedIndex = Math.round(scrollTop / ITEM_HEIGHT);
      columns[columnIndex].selectedIndex = selectedIndex;
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
                      <button
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
                      </button>
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
            className="flex-1 px-4 py-2 bg-primary text-white hover:shadow rounded hover:bg-primary/80 transition-colors"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};
