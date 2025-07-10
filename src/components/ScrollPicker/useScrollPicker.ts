import { useRef, useMemo, useCallback, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { generateDateItems } from "./utils";
import type { PickerColumn, ScrollPickerProps } from "./types";

const ITEM_HEIGHT = 48;

export const useScrollPicker = (onSubmit?: ScrollPickerProps["onSubmit"]) => {
  const [searchParams, setSearchParams] = useSearchParams();

  const columnData = useMemo(
    () => [
      { id: "date", items: generateDateItems(6, 7) },
      { id: "hour", items: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"] },
      { id: "minute", items: ["00", "05", "10", "15", "20", "25", "30", "35", "40", "45", "50", "55"] },
      { id: "period", items: ["AM", "PM"] },
    ],
    [],
  );

  const columnKeys = ["date", "hour", "minute", "period"];
  const defaultIndices = [6, 4, 0, 1];

  const selectedIndices = useMemo(
    () =>
      columnKeys.map((key, index) => {
        const value = searchParams.get(key);
        const parsed = parseInt(value ?? "", 10);
        return isNaN(parsed) ? defaultIndices[index] : parsed;
      }),
    [searchParams],
  );

  const columns: PickerColumn[] = useMemo(
    () =>
      columnData.map((col, index) => ({
        ...col,
        selectedIndex: selectedIndices[index] || 0,
      })),
    [columnData, selectedIndices],
  );

  const columnRefs = useRef<(HTMLDivElement | null)[]>([]);
  const scrollTimeouts = useRef<(ReturnType<typeof setTimeout> | null)[]>([]);
  const isScrolling = useRef<boolean[]>([]);

  useEffect(() => {
    columns.forEach((column, columnIndex) => {
      const el = columnRefs.current[columnIndex];
      if (el) {
        el.scrollTop = column.selectedIndex * ITEM_HEIGHT;
      }
    });
  }, []);

  const updateSelectedIndex = useCallback(
    (columnIndex: number, newIndex: number) => {
      const maxIndex = columnData[columnIndex].items.length - 1;
      const safeIndex = Math.max(0, Math.min(newIndex, maxIndex));
      const key = columnKeys[columnIndex];
      const newParams = new URLSearchParams(searchParams);
      newParams.set(key, safeIndex.toString());
      setSearchParams(newParams);
    },
    [columnData, searchParams, setSearchParams],
  );

  const handleScroll = useCallback(
    (columnIndex: number) => {
      const el = columnRefs.current[columnIndex];
      if (!el || isScrolling.current[columnIndex]) return;

      const scrollTop = el.scrollTop;
      const newIndex = Math.round(scrollTop / ITEM_HEIGHT);

      updateSelectedIndex(columnIndex, newIndex);

      if (scrollTimeouts.current[columnIndex]) {
        clearTimeout(scrollTimeouts.current[columnIndex]!);
      }

      scrollTimeouts.current[columnIndex] = setTimeout(() => {
        if (el) {
          isScrolling.current[columnIndex] = true;
          el.scrollTo({ top: newIndex * ITEM_HEIGHT, behavior: "smooth" });
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
      const el = columnRefs.current[columnIndex];
      if (!el) return;

      updateSelectedIndex(columnIndex, itemIndex);
      isScrolling.current[columnIndex] = true;

      el.scrollTo({ top: itemIndex * ITEM_HEIGHT, behavior: "smooth" });
      setTimeout(() => {
        isScrolling.current[columnIndex] = false;
      }, 300);
    },
    [updateSelectedIndex],
  );

  const getSelectedValues = () => {
    return columns.reduce((acc, col) => {
      acc[col.id] = col.items[col.selectedIndex];
      return acc;
    }, {} as Record<string, string>);
  };

  const handleConfirm = () => {
    const values = getSelectedValues();
    const now = new Date();
    let selectedDate = new Date(now);

    if (values.date !== "Today") {
      selectedDate = new Date(`${values.date} ${now.getFullYear()}`);
    }

    const hour = parseInt(values.hour);
    const minute = parseInt(values.minute);
    const hour24 = values.period === "PM" && hour !== 12 ? hour + 12 : values.period === "AM" && hour === 12 ? 0 : hour;

    selectedDate.setHours(hour24, minute, 0);

    console.log("Selected Date and Time:", selectedDate.toLocaleString());

    onSubmit?.(selectedDate);
  };

  return {
    columns,
    columnRefs,
    handleScroll,
    handleItemClick,
    handleConfirm,
  };
};
