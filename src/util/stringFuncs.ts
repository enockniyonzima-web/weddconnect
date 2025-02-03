export function stringToBoolean(value: string | null): boolean {
    const trueValues = ["true", "yes", "1", "on"];
    const falseValues = ["false", "no", "0", "off"];
    if(!value) return false;
    
    const normalizedValue = value.trim().toLowerCase();

    if (trueValues.includes(normalizedValue)) {
        return true;
    } else if (falseValues.includes(normalizedValue)) {
        return false;
    } else {
        throw new Error(`Invalid boolean string: "${value}"`);
    }
}

export const shortenPrice = (price:number) => {
     if (price < 1000) {
       return price.toString(); 
     } else {
       if (price >= 1000 && price < 100000) {
         return (price / 1000).toFixed(1) + 'K'; 
       } else if (price >= 100000 && price < 1000000) {
         return (price / 1000).toFixed(0) + 'K'; 
       } else if (price >= 1000000 && price < 1000000000) {
         return (price / 1000000).toFixed(1) + 'M'; 
       } else if (price >= 1000000000) {
         return (price / 1000000000).toFixed(1) + 'B'; 
       }
     }
   };


export const formatPrice = (price:number) => {
  if(price){
    const priceString = price.toString();

     const [integerPart, decimalPart] = priceString.split('.');

     const formattedIntegerPart = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');

     const formattedPrice = decimalPart ? `${formattedIntegerPart}.${decimalPart}` : formattedIntegerPart;

     return formattedPrice;
  }else {
    return 0;
  }
     
}