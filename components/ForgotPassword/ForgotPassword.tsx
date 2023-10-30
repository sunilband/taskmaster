"use client";
import React, { useEffect } from "react";
import Waves from "../Waves/Waves";
import { Input } from "@nextui-org/react";
import { Button } from "@nextui-org/react";
import { useState } from "react";
import Link from "next/link";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { updatepassword } from "@/utils/apiCalls/UpdatePassword";
import { useUserContext } from "@/context/userContexts";
import { getuser } from "@/utils/apiCalls/GetUser";
import { sendrecovery } from "@/utils/apiCalls/SendRecovery";
import { useSearchParams } from "next/navigation";

import { motion } from "framer-motion";
import "./ForgotPassword.css";
const cookieCutter = require("cookie-cutter");

type Props = {};

const ForgotPassword = (props: Props) => {
  const searchParams = useSearchParams();
  const verifyToken = searchParams.get("verifyToken");
  const { user, setUser } = useUserContext();
  const [loggingIn, setLoggingIn] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] =
    useState("");
  const router = useRouter();

  useEffect(() => {
    const taskmastertoken = cookieCutter.get("taskmastertoken");
    if (taskmastertoken) {
      getuser(taskmastertoken).then((res) => {
        setUser(res.user);
      });
      router.push("/");
      // window.location.href = "/";
    }
  }, []);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoggingIn(true);
    if (!email) {
      setLoggingIn(false);
      return toast.error("Please fill all the fields");
    }
    try {
      const data = await sendrecovery({ email });
      if (data.success) {
        toast.success(data.message);
      } else {
        toast.error(data.error);
      }
    } catch (error: any) {
      console.log(error);
    }
    setLoggingIn(false);
  };


  // reset password
  const resetPassword =async (e:any)=>{
    e.preventDefault();
    setLoggingIn(true);
    if (!password || !confirmPassword) {
      setLoggingIn(false);
      return toast.error("Please fill all the fields");
    }

    if(password !== confirmPassword){
      setLoggingIn(false);
      return toast.error("Passwords do not match");
    }

    try {
      const data = await updatepassword({ verifyToken, password });
      if (data.success) {
        toast.success(data.message);
      } else {
        toast.error(data.error);
      }
    } catch (error: any) {
      console.log(error);
    }
    setLoggingIn(false);
  }
  return (
    <div className="relative flex justify-center items-center h-screen w-screen  spacemono">
      <Waves />
      <motion.div
        initial={{
          scale: 0,
          y: 300,
        }}
        animate={{
          scale: 1,
          y: 0,
        }}
        transition={{
          type: "spring",
          duration: 1,
        }}
        viewport={{ once: true }}
        className="h-[400px] w-[330px] md:h-[500px] md:w-[400px] flex justify-center items-center  rounded-md z-50 glass shadow-2xl border relative"
      >
        <form
          className="flex flex-col gap-8 md:h-[450px] md:w-[350px] w-[310px] h-[380px] p-2"
          onSubmit={handleSubmit}
        >
          <motion.p
            initial={{
              scale: 0,
              z: -300,
            }}
            animate={{
              scale: 1,
              z: 0,
            }}
            transition={{
              type: "spring",
              duration: 1,
              delay: 0.5,
            }}
            className="text-md absolute -top-3 bg-white text-[#9C2CF3] px-2 rounded-md tracking-[7px] font-thin border border-[#9C2CF3] uppercase "
          >
            Recover Account
          </motion.p>

          {!verifyToken && (
            <>
              <p className="text-white text-xl mb-10">
                A verification mail will be sent to your email with the recovery
                link.
              </p>
              <Input
                type="email"
                variant="underlined"
                labelPlacement="outside"
                label="Email"
                className="text-white"
                style={{ width: "300px" }}
                onChange={(e) => setEmail(e.target.value)}
                value={email}
              />

              <div className="flex flex-col gap-4">
                <Button color="primary" isLoading={loggingIn} type="submit">
                  Verify
                </Button>
              </div>
            </>
          )}

          {verifyToken && (
            <>
              <p className="text-white text-xl mb-10">Enter new password</p>
              <Input
                type="password"
                variant="underlined"
                labelPlacement="outside"
                label="Password"
                className="text-white"
                style={{ width: "300px" }}
                onChange={(e) => setPassword(e.target.value)}
                value={password}
              />

              <Input
                type="password"
                variant="underlined"
                labelPlacement="outside"
                label="Confirm Password"
                className="text-white"
                style={{ width: "300px" }}
                onChange={(e) => setConfirmPassword(e.target.value)}
                value={confirmPassword}
              />

              <div className="flex flex-col gap-4">
                <Button color="primary" isLoading={loggingIn} type="button" onClick={resetPassword}>
                  Reset
                </Button>
              </div>
            </>
          )}
        </form>
      </motion.div>
    </div>
  );
};

export default ForgotPassword;
