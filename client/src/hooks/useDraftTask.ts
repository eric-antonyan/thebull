import { useEffect, useState } from "react";

export interface DraftTask {
  title: string;
  description: string;
  images: string[];
  priority: string;
}

const STORAGE_KEY = "draft-task";

export const useDraftTask = () => {
  const [draft, setDraft] = useState<DraftTask>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved
      ? JSON.parse(saved)
      : { title: "", description: "", images: [], priority: "0" };
  });

  useEffect(() => {
    const timeout = setTimeout(() => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(draft));
    }, 400);
    return () => clearTimeout(timeout);
  }, [draft]);

  const updateDraft = (partial: Partial<DraftTask>) => {
    setDraft((prev) => ({ ...prev, ...partial }));
  };

  const clearDraft = () => localStorage.removeItem(STORAGE_KEY);

  return { draft, updateDraft, clearDraft };
};
