export const getDate = (dateStr:Date) => {
     const date = new Date(dateStr);
     const day = date.getDate().toString().padStart(2, '0');
     const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Months are zero-indexed
     const year = date.getFullYear();

     return `${day}/${month}/${year}`;
}