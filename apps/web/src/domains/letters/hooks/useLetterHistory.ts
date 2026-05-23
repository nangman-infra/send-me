import { useState, useCallback } from 'react';

const STORAGE_KEY = 'sendme_letters';

export interface StoredLetter {
  id: string;
  recipientName: string;
  email: string;
  sendAt: string;
  cancelToken: string;
  createdAt: string;
}

function readFromStorage(): StoredLetter[] {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]');
  } catch {
    return [];
  }
}

function writeToStorage(letters: StoredLetter[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(letters));
}

export function useLetterHistory() {
  const [letters, setLetters] = useState<StoredLetter[]>(readFromStorage);

  const addLetter = useCallback((letter: StoredLetter) => {
    setLetters((prev) => {
      const next = [letter, ...prev];
      writeToStorage(next);
      return next;
    });
  }, []);

  const removeLetter = useCallback((id: string) => {
    setLetters((prev) => {
      const next = prev.filter((l) => l.id !== id);
      writeToStorage(next);
      return next;
    });
  }, []);

  return { letters, addLetter, removeLetter };
}
