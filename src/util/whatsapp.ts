export const buildWhatsAppUrl = (phone: string, message: string) => {
     const clean = phone.replace(/\D/g, "");
     return `https://wa.me/${clean}?text=${encodeURIComponent(message)}`;
};
