"use client";
import React, { useState } from "react";
import Waves from "../Waves/Waves";
import { Input, Button } from "@nextui-org/react";
import Link from "next/link";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { useUserContext } from "@/context/userContexts";
import "../Login/Login.css";
import { motion } from "framer-motion";
import { signupAction } from "@/app/actions/auth";

type Props = {};

const Signup = (props: Props) => {
  const { setUser } = useUserContext();
  const [loggingIn, setLoggingIn] = useState(false);
  const router = useRouter();

  const handleSubmit = async (formData: FormData) => {
    setLoggingIn(true);

    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirmPassword") as string;

    if (!name || !email || !password || !confirmPassword) {
      setLoggingIn(false);
      return toast.error("Please fill all the fields");
    }

    const checkMail = () => {
      const re = /\S+@\S+\.\S+/;
      return re.test(email);
    };

    if (!checkMail()) {
      setLoggingIn(false);
      return toast.error("Please enter a valid email");
    }

    if (password.length < 6) {
      setLoggingIn(false);
      return toast.error("Password must be at least 6 characters long");
    }

    if (password !== confirmPassword) {
      setLoggingIn(false);
      return toast.error("Passwords do not match");
    }

    try {
      const res = await signupAction(null, formData);
      if (res.success) {
        toast.success(res.message);
        router.push("/login");
      } else {
        toast.error(res.error);
      }
    } catch (error: any) {
      toast.error(error.toString());
    }
    setLoggingIn(false);
  };

  return (
    <div className="relative flex justify-center items-center h-screen w-screen  spacemono">
      <Waves />
      <motion.div
        initial={{
          scale: 0,
          y: -300,
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
        className="h-[500px] w-[330px] md:h-[500px] md:w-[400px] flex justify-center items-center  rounded-md z-50 glass shadow-2xl border relative"
      >
        <form
          className="flex flex-col gap-8 md:h-[450px] md:w-[350px] w-[310px] h-[380px] p-2"
          action={handleSubmit}
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
            Signup
          </motion.p>
          <Input
            type="text"
            name="name"
            variant="underlined"
            labelPlacement="outside"
            label="Name"
            className="text-white placeholder-white"
            style={{ width: "300px" }}
          />
          <Input
            type="email"
            name="email"
            variant="underlined"
            labelPlacement="outside"
            label="Email"
            className="text-white"
            style={{ width: "300px" }}
          />

          <Input
            type="password"
            name="password"
            variant="underlined"
            labelPlacement="outside"
            label="Password"
            className="text-white"
            style={{ width: "300px" }}
          />

          <Input
            type="password"
            name="confirmPassword"
            variant="underlined"
            labelPlacement="outside"
            label="Confirm Password"
            className="text-white"
            style={{ width: "300px" }}
          />
          <div className="flex flex-col gap-4">
            <Button color="primary" isLoading={loggingIn} type="submit">
              Sign up
            </Button>
            <div className="relative mt-3  w-full">
              <div className="border-b w-[100px] absolute -left-5" />
              <div className="border-b w-[100px] absolute -right-5" />
              <p className="text-medium absolute -top-3 left-0 right-0 text-white text-opacity-80">
                OR
              </p>
            </div>

            <Link href="/login">
              <p className="text-medium tracking-wider transition-all delay-100 duration-200 ease-in-out  hover:underline font-semibold text-white text-opacity-80">
                Already have an account?
              </p>
            </Link>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default Signup;
