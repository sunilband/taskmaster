import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Providers } from "./providers";
import Nav from "@/components/Nav/Nav";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { UserProvider } from "@/context/userContexts";
import { cookies } from "next/headers";
import { getUser } from "@/app/actions/auth";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Task Master",
  description:
    "Task Master is a task management and notes taking app built with Next.js and NextUI. It uses MongoDB for database and JWT for authentication.",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const token = cookies().get("taskmastertoken")?.value || "";
  const user = await getUser(token);

  return (
    <html lang="en" className="light">
      <body>
        <UserProvider user={user}>
          <Providers>
            <>
              <Nav />
              {children}
            </>
            <ToastContainer />
          </Providers>
        </UserProvider>
      </body>
    </html>
  );
}
