import { getCurrentAccessor } from "@/lib/getCurrentAccessor";
import Image from "next/image";
import AgentVerificationAlert from "../components/AgentVerificationAlert"
export default async function Home() {
  const user = await getCurrentAccessor();
  return (
    <div className={`min-h-screen p-6`}>
      {/* Agent verification alert (client) — only render when user exists and is NOT verified */}
      {user && user.isVerifiedAgent === true && (
        <AgentVerificationAlert userName={user?.name || user?.userName || ''} />
      )}
    </div>
  );
}
