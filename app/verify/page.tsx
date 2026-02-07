import { verifyEmailAction } from "@/app/actions/auth";
import Link from "next/link";
import React from "react";

type Props = {
  searchParams: { [key: string]: string | string[] | undefined };
};

const VerifyPage = async ({ searchParams }: Props) => {
  const verifyToken = searchParams.verifyToken;
  let verified = false;
  let error = "";

  if (typeof verifyToken === "string") {
    const res = await verifyEmailAction(verifyToken);
    if (res.success) {
      verified = true;
    } else {
      error = res.error as string;
    }
  } else {
    error = "Invalid token";
  }

  return (
    <div className="h-screen w-screen flex flex-col justify-center items-center gap-6">
      <div className="flex flex-col items-center gap-4 text-center">
        {verified ? (
          <>
            <h2 className="text-xl tracking-wider font-bold text-black">
              Email verified and account created!
            </h2>
            <Link
              href="/login"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
            >
              Go to Login
            </Link>
          </>
        ) : (
          <>
            <h2 className="text-xl tracking-wider font-bold text-red-500">
              {error || "Verification failed"}
            </h2>
            <Link href="/login" className="text-blue-500 hover:underline mt-2">
              Back to Login
            </Link>
          </>
        )}
      </div>
    </div>
  );
};

export default VerifyPage;
