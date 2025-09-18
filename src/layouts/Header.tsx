import { useState } from "react";
import CreateWordModal from "../Page/CreateWord";
import { Link } from "react-router-dom";

const Header = () => {
  const [open, setOpen] = useState(false);

  return (
    <div className="navbar bg-base-200 shadow-sm">
      <div className="flex-1">
        <Link to={"/"}>
          <a className="btn btn-ghost text-xl">Michael</a>
        </Link>
      </div>
      <div className="flex gap-2">
        <button className="btn btn-primary" onClick={() => setOpen(true)}>
          + Create Word
        </button>
        <CreateWordModal open={open} onClose={() => setOpen(false)} />
        <Link to={"quiz"}>
          <button className="btn btn-secondary">Start</button>
        </Link>
      </div>
    </div>
  );
};

export default Header;
