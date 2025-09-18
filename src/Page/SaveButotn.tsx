// components/SaveButton.tsx
import { useState } from "react";
import { useVocabStore } from "../services/vocabularyService";
import { saveToBin } from "../services/jsonbinStorage";

export default function SaveButton({
  snapshot,
  setSnapshot,
}: {
  snapshot: string;
  setSnapshot: (s: string) => void;
}) {
  const vocabList = useVocabStore((s) => s.vocabList);
  const [saving, setSaving] = useState(false);

  const currentStr = JSON.stringify(vocabList);
  const dirty = currentStr !== snapshot;

  const handleSave = async () => {
    try {
      setSaving(true);
      await saveToBin(vocabList);
      setSnapshot(currentStr);
    } finally {
      setSaving(false);
    }
  };

  return (
    <button
      className={`btn ${dirty ? "btn-warning" : "btn-success"} ${
        saving ? "loading" : ""
      }`}
      onClick={handleSave}
      disabled={!dirty || saving}
    >
      {saving ? "Saving..." : dirty ? "Save (Unsaved)" : "Saved"}
    </button>
  );
}
