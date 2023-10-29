"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { signup } from "@/utils/apiCalls/Signup";
import "./Spinner.css";

type Props = {};

const VerifyScreen = (props: Props) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const verifyToken = searchParams.get("verifyToken");
  const [verified, setVerified] = useState(false);
  const [failed, setFailed] = useState("");

  useEffect(() => {
    if (verified === false)
      signup({ verifyToken }).then((res) => {
        if (res.success) {
          return setVerified(true);
        } else {
          return setFailed(res.error);
        }
      });
  }, []);

  useEffect(() => {
    if (failed !== "")
      setTimeout(() => {
        return router.push("/login");
      }, 1000);

    if (verified) {
      setTimeout(() => {
        return router.push("/login");
      }, 1000);
    }
  }, [verified, failed]);

  return (
    <div className="h-screen w-screen flex flex-col justify-center items-center">
      {/* wait spinner */}
      {!verified && failed == "" && (
        <>
          <div className="lds-ring">
            <div></div>
            <div></div>
            <div></div>
            <div></div>
          </div>
        </>
      )}
      {failed === "" ? (
        <h2 className="text-xl tracking-wider font-bold text-black">
          {verified === false
            ? "Verifying Email"
            : "Email verified and account created!"}
        </h2>
      ) : (
        <h2 className="text-xl tracking-wider font-bold text-black">
          {failed}
        </h2>
      )}
    </div>
  );
};

export default VerifyScreen;
