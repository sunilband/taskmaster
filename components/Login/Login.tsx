"use client";
import React from "react";
import Waves from "../Waves/Waves";
import { Input } from "@nextui-org/react";
import { Button } from "@nextui-org/react";
import { useState } from "react";

type Props = {};

const Login = (props: Props) => {
  const [loggingIn, setLoggingIn] = useState(false);
  return (
    <div className="relative flex justify-center items-center h-screen w-screen border spacemono">
      <Waves />
      <div className="h-[400px] w-[330px] md:h-[500px] md:w-[400px] flex justify-center items-center border rounded-md z-50 glass shadow-2xl">
        <div className="flex flex-col gap-6 md:h-[450px] md:w-[350px] w-[310px] h-[380px] p-2">
          <Input
            type="email"
            variant="underlined"
            labelPlacement="outside"
            label="Email"
            className="text-white"
            style={{ width: "300px" }}
          />
          <Input
            type="password"
            variant="underlined"
            labelPlacement="outside"
            label="Password"
            className="text-white"
            style={{ width: "300px" }}
          />
          <div className="flex flex-col gap-4">
            <Button color="primary" isLoading={loggingIn}>
              Login
            </Button>
            <p className="text-medium">OR</p>
            <p className="text-medium tracking-wider transition-all delay-100 duration-200 ease-in-out  hover:underline ">
              Already have an account?
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
