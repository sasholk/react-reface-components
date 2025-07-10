import { cn } from "../../lib/utils";
import type { PickerColumnProps } from "./types";

export const PickerColumn = ({ column, columnIndex, columnRef, onScroll, onClick }: PickerColumnProps) => (
  <div className={`flex-1 ${columnIndex === 0 ? "flex-[2]" : ""}`}>
    <div
      ref={columnRef}
      className="h-48 overflow-y-scroll scrollbar-hide relative"
      style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      onScroll={() => onScroll(columnIndex)}
    >
      <div className="flex flex-col">
        <div className="h-18" />
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
            onClick={() => onClick(columnIndex, itemIndex)}
          >
            {item}
          </div>
        ))}
        <div className="h-18" />
      </div>
    </div>
  </div>
);
