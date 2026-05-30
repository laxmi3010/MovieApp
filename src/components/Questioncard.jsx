import { useState } from 'react';

const QuestionCard = ({ question, options, correctAnswer, onAnswerSelect }) => {
  const [selectedOption, setSelectedOption] = useState(null);

  const handleOptionClick = (optionKey) => {
    if (selectedOption) return; // Prevent multiple selections

    setSelectedOption(optionKey);
    onAnswerSelect(optionKey, correctAnswer);
  };

  const getOptionClasses = (optionKey) => {
    const baseClasses = "bg-white/5 border-2 rounded-xl p-5 flex items-center gap-4 cursor-pointer transition-all duration-300 text-white";
    
    if (!selectedOption) {
      return `${baseClasses} border-gray-700 hover:bg-cyan-400/10 hover:border-cyan-400 hover:translate-x-2 hover:shadow-[0_4px_15px_rgba(0,255,255,0.2)]`;
    }

    if (optionKey === correctAnswer) {
      return `${baseClasses} bg-green-500/20 border-green-500 animate-pulse`;
    }

    if (optionKey === selectedOption && optionKey !== correctAnswer) {
      return `${baseClasses} bg-red-500/20 border-red-500 animate-pulse`;
    }

    return `${baseClasses} border-gray-700`;
  };

  const getOptionKeyClasses = (optionKey) => {
    const baseClasses = "w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg flex-shrink-0";
    
    if (!selectedOption) {
      return `${baseClasses} bg-gradient-to-r from-cyan-400 to-cyan-600 text-black`;
    }

    if (optionKey === correctAnswer) {
      return `${baseClasses} bg-gradient-to-r from-green-400 to-green-600 text-black`;
    }

    if (optionKey === selectedOption && optionKey !== correctAnswer) {
      return `${baseClasses} bg-gradient-to-r from-red-400 to-red-600 text-black`;
    }

    return `${baseClasses} bg-gradient-to-r from-cyan-400 to-cyan-600 text-black`;
  };

  return (
    <div className="bg-cyan-400/5 border-2 border-cyan-400 rounded-2xl p-10 max-w-3xl w-full shadow-[0_8px_32px_rgba(0,255,255,0.2)]">
      <h2 className="text-white text-2xl mb-8 leading-relaxed text-center font-semibold">
        {question}
      </h2>
      <div className="flex flex-col gap-4">
        {Object.entries(options).map(([key, value]) => (
          <div
            key={key}
            className={getOptionClasses(key)}
            onClick={() => handleOptionClick(key)}
          >
            <span className={getOptionKeyClasses(key)}>
              {key}
            </span>
            <span className="text-lg leading-normal">
              {value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default QuestionCard;