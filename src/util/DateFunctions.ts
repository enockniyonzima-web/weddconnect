import { TDurationUnit } from "@/types/common";

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

export function getDaysCount(duration:number, unit: TDurationUnit) {
     switch (unit) {
          case "day":
               return duration;
          case "week":
               return duration * 7;
          case "month":
               return duration * 30; // Approximation
          case "year":
               return duration * 365; // Approximation
          default:
               return duration;
     }
}

export function getFutureDate(days: number): Date {
     const currentDate = new Date();
     currentDate.setDate(currentDate.getDate() + days);
     return currentDate;
   }