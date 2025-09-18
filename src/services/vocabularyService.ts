import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import localforage from "localforage";

export interface Vocab {
  word: string;
  phonetic: string;
  meaning: string;
}

interface VocabState {
  vocabList: Vocab[];
  addVocab: (vocab: Vocab) => void;
  removeVocab: (word: string) => void;
  reset: () => void;
}

export const useVocabStore = create<VocabState>()(
  persist(
    (set) => ({
      vocabList: [],
      addVocab: (vocab) =>
        set((state) => ({
          vocabList: [...state.vocabList, vocab],
        })),
      removeVocab: (word) =>
        set((state) => ({
          vocabList: state.vocabList.filter((v) => v.word !== word),
        })),
      reset: () => set({ vocabList: [] }),
    }),
    {
      name: "vocab-storage",
      storage: createJSONStorage(() => localforage),
    }
  )
);
