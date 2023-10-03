export const dateParser = (date: string) => {
    const dateObj = new Date(date);
    return dateObj.toLocaleDateString();
  };
  export const timeParser = (date: string) => {
    const dateObj = new Date(date);
    return dateObj.toLocaleTimeString();
  };