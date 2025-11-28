import { useState } from "react";

export const useMentions = (workers: { _id: string; fullName: string }[]) => {
  const [mentionQuery, setMentionQuery] = useState("");
  const [mentionOpen, setMentionOpen] = useState(false);

  const handleInput = (value: string) => {
    const lastWord = value.split(" ").pop();

    if (lastWord?.startsWith("@")) {
      setMentionOpen(true);
      setMentionQuery(lastWord.slice(1).toLowerCase());
    } else {
      setMentionOpen(false);
      setMentionQuery("");
    }
  };

  const filteredWorkers = mentionOpen
    ? workers.filter((w) =>
        w.fullName.toLowerCase().includes(mentionQuery)
      )
    : [];

  const insertMention = (
    text: string,
    fullName: string
  ): string => {
    const words = text.split(" ");
    words[words.length - 1] = `@${fullName}`;
    return words.join(" ") + " ";
  };

  return {
    mentionOpen,
    filteredWorkers,
    insertMention,
    handleInput,
  };
};
