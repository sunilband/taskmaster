"use client";
import React from "react";
import Waves from "../Waves/Waves";
import { Input } from "@nextui-org/react";
import { Button } from "@nextui-org/react";
import { useState } from "react";
import Link from "next/link";
import { toast } from "react-toastify";
import { signup } from "@/utils/apiCalls/Signup";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useUserContext } from "@/context/userContexts";
import { getuser } from "@/utils/apiCalls/GetUser";
import "../Login/Login.css"
const cookieCutter = require('cookie-cutter');

type Props = {};

const Signup = (props: Props) => {
  const { user,setUser } = useUserContext();
  const [loggingIn, setLoggingIn] = useState(false);
  const [name, setName] = useState<null | string>(null);
  const [email, setEmail] = useState<null | string>(null);
  const [password, setPassword] = useState<null | string>(null);
  const [confirmPassword, setConfirmPassword] = useState<null | string>(null);
  const router = useRouter();

  useEffect(() => {
    const taskmastertoken = cookieCutter.get('taskmastertoken');
    if (taskmastertoken) {
      const fetchuser = getuser(taskmastertoken).then((res) => {
        setUser(res.user);
      });
      router.push("/");
    }
  }, []);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoggingIn(true);
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
      return toast.error("Password must be atleast 8 characters long");
    }

    if (password !== confirmPassword) {
      setLoggingIn(false);
      return toast.error("Passwords do not match");
    }

    try {
      const data = await signup({ name, email, password });
      if (data.success) {
        toast.success(data.message);
        router.push("/login");
      } else {
        toast.error(data.error);
      }
    } catch (error: any) {
      toast.error(error.toString());
    }
    setLoggingIn(false);
  };
  return (
    <div className="relative flex justify-center items-center h-screen w-screen  spacemono">
      <Waves />
      <div className="h-[500px] w-[330px] md:h-[500px] md:w-[400px] flex justify-center items-center  rounded-md z-50 glass shadow-2xl border">
        <div className="flex flex-col gap-8 md:h-[450px] md:w-[350px] w-[310px] h-[380px] p-2">
          <Input
            type="text"
            variant="underlined"
            labelPlacement="outside"
            label="Name"
            className="text-white placeholder-white"
            style={{ width: "300px" }}
            onChange={(e) => setName(e.target.value)}
            value={name ? name : ""}
            
          />
          <Input
            type="email"
            variant="underlined"
            labelPlacement="outside"
            label="Email"
            className="text-white"
            style={{ width: "300px" }}
            onChange={(e) => setEmail(e.target.value)}
            value={email ? email : ""}
          />

          <Input
            type="password"
            variant="underlined"
            labelPlacement="outside"
            label="Password"
            className="text-white"
            style={{ width: "300px" }}
            onChange={(e) => setPassword(e.target.value)}
            value={password ? password : ""}
          />

          <Input
            type="password"
            variant="underlined"
            labelPlacement="outside"
            label="Confirm Password"
            className="text-white"
            style={{ width: "300px" }}
            onChange={(e) => setConfirmPassword(e.target.value)}
            value={confirmPassword ? confirmPassword : ""}
          />
          <div className="flex flex-col gap-4">
            <Button
              color="primary"
              isLoading={loggingIn}
              onClick={handleSubmit}
            >
              Sign up
            </Button>
            <p className="text-medium">OR</p>
            <Link href="/login">
              <p className="text-medium tracking-wider transition-all delay-100 duration-200 ease-in-out  hover:underline font-semibold">
                Already have an account?
              </p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
