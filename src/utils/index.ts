export const generateDateItems = (numDays: number = 7): string[] => {
  const dates: string[] = [];
  const today = new Date();

  for (let i = 0; i < numDays; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);

    if (i === 0) {
      dates.push("Today");
    } else {
      const day = date.toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
      });
      dates.push(day);
    }
  }

  return dates;
};
