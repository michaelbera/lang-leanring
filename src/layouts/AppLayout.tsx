import type { ReactNode } from "react";
import Header from "./Header";

const AppLayout = (props: { children: ReactNode }) => {
  return (
    <div className="h-screen flex flex-col">
      <Header />
      <main>{props.children}</main>
    </div>
  );
};

export default AppLayout;
