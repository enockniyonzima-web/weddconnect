// components/ServiceCard.tsx
import { ReactNode } from 'react';

interface ServiceCardProps {
  icon: ReactNode;
  title: string;
  description: string;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ icon, title, description }) => {
  return (
    <div className="flex flex-col items-center text-center p-6 border rounded-lg shadow-md">
          <div className="text-4xl mb-4 bg-blue-100 text-blue-600 p-[20px] rounded-full"><i>{icon}</i></div>
          <h2 className="text-2xl font-semibold mb-2">{title}</h2>
          <p className="text-gray-600">{description}</p>
    </div>
  );
};

export default ServiceCard;
