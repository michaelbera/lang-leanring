import React, { useEffect, useRef, useState } from "react";
import { useVocabStore } from "../services/vocabularyService";

type Props = {
  open: boolean;
  onClose: () => void;
};

export default function CreateWordModal({ open, onClose }: Props) {
  const { addVocab, vocabList } = useVocabStore();
  const [word, setWord] = useState("");
  const [phonetic, setPhonetic] = useState("");
  const [meaning, setMeaning] = useState("");
  const [error, setError] = useState<string | null>(null);

  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  const resetForm = () => {
    setWord("");
    setPhonetic("");
    setMeaning("");
    setError(null);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!word.trim() || !meaning.trim()) {
      setError("Word và Meaning là bắt buộc.");
      return;
    }
    const dup = vocabList.some(
      (v) => v.word.toLowerCase() === word.trim().toLowerCase()
    );
    if (dup) {
      setError("Từ này đã tồn tại.");
      return;
    }

    addVocab({
      word: word.trim(),
      phonetic: phonetic.trim(),
      meaning: meaning.trim(),
    });
    handleClose();
  };

  return (
    <dialog ref={dialogRef} className="modal">
      <div className="modal-box max-w-md">
        <form method="dialog">
          <button
            type="button"
            className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
            onClick={handleClose}
          >
            ✕
          </button>
        </form>

        <h3 className="font-bold text-lg mb-4">Create Word</h3>

        {error && (
          <div className="alert alert-error mb-3">
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <fieldset className="fieldset">
            <label className="fieldset-label">Word *</label>
            <input
              type="text"
              placeholder="e.g., resilient"
              className="input input-bordered w-full"
              value={word}
              onChange={(e) => setWord(e.target.value)}
            />
          </fieldset>

          <fieldset className="fieldset">
            <label className="fieldset-label">Phonetic</label>
            <input
              type="text"
              placeholder="e.g., /rɪˈzɪliənt/"
              className="input input-bordered w-full"
              value={phonetic}
              onChange={(e) => setPhonetic(e.target.value)}
            />
          </fieldset>

          <fieldset className="fieldset">
            <label className="fieldset-label">Meaning *</label>
            <textarea
              className="textarea textarea-bordered w-full"
              placeholder="e.g., able to withstand or recover quickly from difficult conditions"
              value={meaning}
              onChange={(e) => setMeaning(e.target.value)}
              rows={3}
            />
          </fieldset>

          <div className="modal-action">
            <button type="button" className="btn" onClick={handleClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Save
            </button>
          </div>
        </form>
      </div>
      <form method="dialog" className="modal-backdrop" onClick={handleClose}>
        <button>close</button>
      </form>
    </dialog>
  );
}
