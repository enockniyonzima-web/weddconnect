'use client';
import { useState } from 'react';
import { FiPlus, FiMinus } from 'react-icons/fi';

interface FAQItemProps {
  question: string;
  answer: string;
}

const FAQItem: React.FC<FAQItemProps> = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleOpen = () => {
    setIsOpen(!isOpen);
  };

  return (
     <div className="border-b border-gray-200 py-4">
          <button
          onClick={toggleOpen}
          className="flex justify-between items-center w-full text-left"
          >
          <span className="text-lg font-medium">{question}</span>
          <span className="ml-2">
               {isOpen ? <FiMinus size={20} /> : <FiPlus size={20} />}
          </span>
          </button>
          {isOpen && <p className="mt-2 text-gray-600">{answer}</p>}
     </div>
  );
};

export default FAQItem;
