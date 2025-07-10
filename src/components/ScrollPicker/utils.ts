export const generateDateItems = (pastDays: number = 0, futureDays: number = 7): string[] => {
  const dates: string[] = [];
  const today = new Date();

  for (let i = -pastDays; i <= futureDays; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);

    if (i === 0) {
      dates.push("Today");
    } else {
      const formatted = date.toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
      });
      dates.push(formatted);
    }
  }

  return dates;
};
