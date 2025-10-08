// /components/NavbarServerWrapper.jsx
import { getCurrentUser } from "@/lib/getCurrentUser";
import Navbar from "./Navbar";

export default async function NavbarServerWrapper() {
  const user = await getCurrentUser();
  return <Navbar user={user} />;
}
