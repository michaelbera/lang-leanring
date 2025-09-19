import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import localforage from "localforage";

export interface Vocab {
  word: string;
  phonetic: string;
  meaning: string;
  enabled: boolean;
}

export interface NewVocab {
  word: string;
  phonetic: string;
  meaning: string;
}

interface VocabState {
  vocabList: Vocab[];
  addVocab: (vocab: NewVocab) => void;
  removeVocab: (word: string) => void;
  toggleVocab: (word: string) => void;
  reset: () => void;
  setList: (list: Vocab[]) => void;
}

export const useVocabStore = create<VocabState>()(
  persist(
    (set) => ({
      vocabList: [],
      addVocab: (vocab) =>
        set((state) => ({
          vocabList: [...state.vocabList, { ...vocab, enabled: true }],
        })),
      removeVocab: (word) =>
        set((state) => ({
          vocabList: state.vocabList.filter((v) => v.word !== word),
        })),
      toggleVocab: (word) =>
        set((state) => ({
          vocabList: state.vocabList.map((v) =>
            v.word === word ? { ...v, enabled: !v.enabled } : v
          ),
        })),
      reset: () => set({ vocabList: [] }),
      setList: (list) => set({ 
        vocabList: list.map(item => ({ 
          ...item, 
          enabled: item.enabled ?? true 
        })) 
      }),
    }),
    {
      name: "vocab-storage",
      storage: createJSONStorage(() => localforage),
    }
  )
);
