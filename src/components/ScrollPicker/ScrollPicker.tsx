import { cn } from "../../lib/utils";
import { PickerColumn } from "./PickerColumn";
import type { ScrollPickerProps } from "./types";
import { useScrollPicker } from "./useScrollPicker";

export const ScrollPicker = ({ onSubmit, className }: ScrollPickerProps) => {
  const { columns, columnRefs, handleScroll, handleItemClick, handleConfirm } = useScrollPicker(onSubmit);

  return (
    <div className={cn("flex items-center justify-center p-4", className)}>
      <div className="bg-card rounded shadow border p-6 w-full max-w-md">
        <h2 className="text-xl font-semibold text-center mb-6">Select Date & Time</h2>

        <div className="relative">
          <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-12 bg-gray-100 backdrop-blur-3xl rounded-lg border-y border-gray-200 pointer-events-none z-10" />
          <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-white to-transparent pointer-events-none z-20" />
          <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-white to-transparent pointer-events-none z-20" />

          <div className="flex">
            {columns.map((column, columnIndex) => (
              <PickerColumn
                key={column.id}
                column={column}
                columnIndex={columnIndex}
                columnRef={el => (columnRefs.current[columnIndex] = el)}
                onScroll={handleScroll}
                onClick={handleItemClick}
              />
            ))}
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button
            onClick={handleConfirm}
            className="flex-1 px-4 py-2 bg-primary text-white hover:shadow rounded hover:bg-primary/80 transition"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};
