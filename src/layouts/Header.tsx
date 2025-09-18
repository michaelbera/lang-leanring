import { useEffect, useState } from "react";
import CreateWordModal from "../Page/CreateWord";
import { Link } from "react-router-dom";
import SaveButton from "../Page/SaveButotn";
import { useVocabStore } from "../services/vocabularyService";
import { loadFromBin } from "../services/jsonbinStorage";

const Header = () => {
  const [open, setOpen] = useState(false);
  const { setList } = useVocabStore();
  const [snapshot, setSnapshot] = useState("");

  useEffect(() => {
    loadFromBin().then((list) => {
      setList(list);
      setSnapshot(JSON.stringify(list));
    });
  }, [setList]);

  return (
    <div className="navbar bg-base-200 shadow-sm">
      <div className="flex-1">
        <Link to={"/"}>
          <a className="btn btn-ghost text-xl">Home</a>
        </Link>
      </div>
      <div className="flex gap-2">
        <SaveButton snapshot={snapshot} setSnapshot={setSnapshot} />
        <button className="btn btn-primary" onClick={() => setOpen(true)}>
          + New
        </button>
        <CreateWordModal open={open} onClose={() => setOpen(false)} />
        <Link to={"quiz"}>
          <button className="btn btn-secondary">Quiz</button>
        </Link>
      </div>
    </div>
  );
};

export default Header;
