import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

// Display AI replies as Markdown and reveal new replies at a comfortable pace.
const AssistantMessage = ({ content, animate = false, scrollContainerRef }) => {
  const [visibleContent, setVisibleContent] = useState(animate ? "" : content);
  const [isRevealing, setIsRevealing] = useState(animate);

  useEffect(() => {
    if (!animate || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setVisibleContent(content);
      setIsRevealing(false);
      return undefined;
    }

    const words = content.match(/\S+\s*/g) || [];
    let visibleWordCount = 0;
    let timeoutId;

    setVisibleContent("");
    setIsRevealing(true);

    const revealNextWords = () => {
      visibleWordCount = Math.min(visibleWordCount + 2, words.length);
      setVisibleContent(words.slice(0, visibleWordCount).join(""));

      if (visibleWordCount < words.length) {
        const lastWord = words[visibleWordCount - 1]?.trim() || "";
        const pauseAfterSentence = /[.!?]["')\]]?$/.test(lastWord) ? 110 : 0;
        timeoutId = window.setTimeout(revealNextWords, 65 + pauseAfterSentence);
      } else {
        setIsRevealing(false);
      }
    };

    timeoutId = window.setTimeout(revealNextWords, 65);
    return () => window.clearTimeout(timeoutId);
  }, [animate, content]);

  useEffect(() => {
    const conversation = scrollContainerRef?.current;
    if (conversation && isRevealing) {
      conversation.scrollTop = conversation.scrollHeight;
    }
  }, [isRevealing, scrollContainerRef, visibleContent]);

  return (
    <div className="dashboard-markdown">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{visibleContent}</ReactMarkdown>
      {isRevealing && <span className="dashboard-markdown__cursor" aria-hidden="true" />}
    </div>
  );
};

export default AssistantMessage;
