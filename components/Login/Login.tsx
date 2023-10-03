"use client";
import React, { useEffect } from "react";
import Waves from "../Waves/Waves";
import { Input } from "@nextui-org/react";
import { Button } from "@nextui-org/react";
import { useState } from "react";
import Link from "next/link";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { login } from "@/utils/apiCalls/Login";
import { useUserContext } from "@/context/userContexts";
import { getuser } from "@/utils/apiCalls/GetUser";
import "./Login.css"
const cookieCutter = require('cookie-cutter');


type Props = {};

const Login = (props: Props) => {

  
  const { user,setUser } = useUserContext();
  const [loggingIn, setLoggingIn] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  useEffect(() => {
    const taskmastertoken = cookieCutter.get('taskmastertoken');
    if (taskmastertoken) {
      getuser(taskmastertoken).then((res) => {
        setUser(res.user);
      });
      // router.push("/")
      window.location.href = "/";
    }
  }, []);


  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoggingIn(true);
    if (!email || !password) {
      setLoggingIn(false);
      return toast.error("Please fill all the fields");
    }
    try {
      const data = await login({email, password });
      if (data.success) {
        toast.success(data.message);
        setUser(data.user);
        // router.push("/");
        window.location.href = "/";
      } else {
        toast.error(data.error);
      }
    } catch (error: any) {
      console.log(error);
    }
    setLoggingIn(false);
  };
  return (
    <div className="relative flex justify-center items-center h-screen w-screen  spacemono">
      <Waves />
      <div className="h-[400px] w-[330px] md:h-[500px] md:w-[400px] flex justify-center items-center  rounded-md z-50 glass shadow-2xl border">
        <form className="flex flex-col gap-8 md:h-[450px] md:w-[350px] w-[310px] h-[380px] p-2" onSubmit={handleSubmit}>
          {/* <label className="text-white font-semibold text-lg">Login</label> */}
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
          <Input
            type="password"
            variant="underlined"
            labelPlacement="outside"
            label="Password"
            className="text-white bg-transparent"
            style={{ width: "300px" }}
            onChange={(e) => setPassword(e.target.value)}
            value={password}
          />
          <div className="flex flex-col gap-4">
            <Button color="primary" isLoading={loggingIn} type="submit">
              Login
            </Button>
            <p className="text-medium">OR</p>
            <Link href="/signup">
            <p className="text-medium tracking-wider transition-all delay-100 duration-200 ease-in-out  hover:underline font-semibold ">
              Don&rsquo;t have an account?
            </p>
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
