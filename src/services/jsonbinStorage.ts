// utils/jsonbinStorage.ts

import type { Vocab } from "./vocabularyService";

const BIN_ID = "68cc2a66ae596e708ff30bc2";
const API_KEY = "$2a$10$JsWIxWF7.bzaEkk3lmu5IewA2hZ2YZbWoDiFgzsJJD1Apz4w9scPu";
const BASE_URL = `https://api.jsonbin.io/v3/b/${BIN_ID}`;

export async function loadFromBin(): Promise<Vocab[]> {
  const res = await fetch(`${BASE_URL}/latest`, {
    headers: { "X-Master-Key": API_KEY },
  });
  const json = await res.json();
  return json.record?.vocabList || [];
}

export async function saveToBin(vocabList: Vocab[]): Promise<void> {
  await fetch(BASE_URL, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "X-Master-Key": API_KEY,
    },
    body: JSON.stringify({ vocabList }),
  });
}
