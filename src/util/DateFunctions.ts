export const getDate = (dateStr:Date) => {
     const date = new Date(dateStr);
     const day = date.getDate().toString().padStart(2, '0');
     const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Months are zero-indexed
     const year = date.getFullYear();

     return `${day}/${month}/${year}`;
}

export function isDateLaterThanToday(date: string | Date): boolean {
     const givenDate = new Date(date);
     const today = new Date();
     // Set time to 00:00:00 to compare only the date part
     today.setHours(0, 0, 0, 0);
     givenDate.setHours(0, 0, 0, 0);

     return givenDate > today;
}

export function getFutureDate(days: number): Date {
     const currentDate = new Date();
     currentDate.setDate(currentDate.getDate() + days);
     return currentDate;
   }