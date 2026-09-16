import { useEffect, useState } from "react";

const AutoTypingText = ({ text, speed = 80, showCursor = true }) => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (index >= text.length) return;

    const timeout = setTimeout(() => {
      setIndex(i => i + 1);
    }, speed);

    return () => clearTimeout(timeout);
  }, [index, text, speed]);

  return (
    <span>
      {text.slice(0, index)}
      {showCursor && (
        <span className="cursor">|</span>
      )}
      <style jsx>{`
        .cursor {
          animation: blink 1s step-end infinite;
        }
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
      `}</style>
    </span>
  );
};

export default AutoTypingText;