import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import ClientProviders from "../providers/ClientProviders";

export default async function Providers({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);

  return (
    <ClientProviders session={session}>
      {children}
    </ClientProviders>
  );
}