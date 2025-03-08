'use client';

import { useState } from 'react';
import { FiPlus, FiMinus } from 'react-icons/fi';

interface HelpTopicProps {
  title: string;
  content: string;
}

const HelpTopic: React.FC<HelpTopicProps> = ({ title, content }) => {
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
        <span className="text-lg font-medium">{title}</span>
        <span className="ml-2">
          {isOpen ? <FiMinus size={20} /> : <FiPlus size={20} />}
        </span>
      </button>
      {isOpen && <p className="mt-2 text-gray-600">{content}</p>}
    </div>
  );
};

export default HelpTopic;
