import { useState } from "react";
import { formatDistanceToNow } from "date-fns";

const HISTORY_KEY = "convertly_history";
const MAX_HISTORY = 10;

export function useHistory() {
  const [history, setHistory] = useState(() => {
    const stored = localStorage.getItem(HISTORY_KEY);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (e) {
        console.error("Failed to parse history", e);
      }
    }
    return [];
  });
  const addHistoryItem = (item) => {
    setHistory((prev) => {
      const newItem = {
        ...item,
        id: Date.now().toString(),
        timestamp: new Date().toISOString(),
      };
      const updated = [newItem, ...prev].slice(0, MAX_HISTORY);
      localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
      return updated;
    });
  };

  const clearHistory = () => {
    localStorage.removeItem(HISTORY_KEY);
    setHistory([]);
  };

  const getFormattedHistory = () => {
    return history.map((item) => ({
      ...item,
      timeAgo: formatDistanceToNow(new Date(item.timestamp), { addSuffix: true }),
    }));
  };

  return { history: getFormattedHistory(), addHistoryItem, clearHistory };
}
