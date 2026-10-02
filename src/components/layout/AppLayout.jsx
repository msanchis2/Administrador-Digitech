import { Outlet } from "react-router-dom";
import Header from "./Header";
import MainNav from "./MainNav";

export default function AppLayout() {
  return (
    <>
      <Header />
      <main>
        <MainNav />
        <Outlet />
      </main>
    </>
  );
}
