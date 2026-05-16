enum EContactDomain {
     TECHNICAL = "Technical Support",
     SALES = "Sales Inquiries",
     GENERAL = "General Questions",
}

interface IContactInfo {
     id: number;
     domain: EContactDomain;
     description: string;
     phone: string;
     autoMessage: string;
}

export const ContactInfo:IContactInfo[] = [
     {id:1, domain: EContactDomain.GENERAL, description: "Pricing, vendor questions", phone: "+250790860446", autoMessage: "👋 Hi WeddConnect! I'd like to learn more about your services. Could you help me with pricing and vendor options?"},
     {id:2, domain: EContactDomain.TECHNICAL, description: "Issues accessing the app", phone: "+250780795232", autoMessage: "👋 Hi WeddConnect Support! I'm experiencing a technical issue with the platform and would appreciate some help. Here's what's happening: "},
]