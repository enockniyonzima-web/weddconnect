'use client';

import { useState } from 'react';
import { Plus, Minus } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface HelpTopicProps {
  title: string;
  content: string;
  icon?: React.ReactNode;
}

const HelpTopic: React.FC<HelpTopicProps> = ({ title, content, icon }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={`border border-gray-800 rounded-xl overflow-hidden transition-colors duration-200 ${isOpen ? 'bg-gray-900/60' : 'bg-gray-900/30 hover:bg-gray-900/50'}`}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex justify-between items-center w-full text-left px-5 py-4 gap-4"
      >
        <div className="flex items-center gap-3">
          {icon && <span className="text-blue-400 shrink-0">{icon}</span>}
          <span className="text-sm md:text-base font-medium text-white">{title}</span>
        </div>
        <span className={`shrink-0 w-7 h-7 rounded-full flex items-center justify-center border transition-colors duration-200 ${isOpen ? 'bg-blue-600 border-blue-500 text-white' : 'border-gray-700 text-gray-400'}`}>
          {isOpen ? <Minus size={14} /> : <Plus size={14} />}
        </span>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
          >
            <p className="px-5 pb-5 text-sm text-gray-400 leading-relaxed">{content}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default HelpTopic;
