"use client";
import React from "react";
import { useUserContext } from "@/context/userContexts";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Link,
  Button,
  Avatar,
  Tooltip,
} from "@nextui-org/react";
import AcmeLogo from "./Logo";
import { usePathname, useRouter } from "next/navigation";
import { logoutAction } from "@/app/actions/auth";

type Props = {};

const Nav = (props: Props) => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const { user, setUser } = useUserContext();
  const path = usePathname();
  const router = useRouter();

  const name = user?.name
    ? user?.name
        .split(" ")
        .map((x: string) => x[0])
        .join(" ")
        .toUpperCase()
    : "";

  const handleSignout = async () => {
    try {
      const res = await logoutAction();
      if (res.success) {
        setUser({ token: null, name: null, email: null });
        setTimeout(() => {
          router.push("/login");
        }, 100);
      }
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  const handleLoginRoute = () => {
    router.push("/login");
  };

  const handleSignupRoute = () => {
    router.push("/signup");
  };

  return (
    <Navbar
      onMenuOpenChange={setIsMenuOpen}
      shouldHideOnScroll
      maxWidth="full"
      className="fixed h-20 bg-white bg-opacity-70 w-full"
    >
      <NavbarContent justify="start">
        <NavbarBrand style={{ justifyContent: "flex-start" }}>
          <AcmeLogo />
          <p className="font-bold text-inherit">TASKMASTER</p>
        </NavbarBrand>
      </NavbarContent>

      <NavbarContent justify="end">
        {path == "/" ? (
          <Tooltip
            content={user?.name}
            className="p-2 mt-1 border bg-[#7828C8] text-white tracking-widest rounded-full px-3"
            motionProps={{
              variants: {
                exit: {
                  opacity: 0,
                  transition: {
                    duration: 0.1,
                    ease: "easeIn",
                  },
                },
                enter: {
                  opacity: 1,
                  transition: {
                    duration: 0.15,
                    ease: "easeOut",
                  },
                },
              },
            }}
          >
            <Avatar
              isBordered
              as="button"
              className="transition-transform"
              color="secondary"
              name={name}
              size="md"
            />
          </Tooltip>
        ) : null}
        {(path == "/signup" || path == "/") && !user?.token ? (
          <NavbarItem>
            <Button
              as={Link}
              color="primary"
              onClick={handleLoginRoute}
              variant="flat"
            >
              Login
            </Button>
          </NavbarItem>
        ) : null}
        {path == "/login" ? (
          <NavbarItem>
            <Button
              as={Link}
              color="primary"
              onClick={handleSignupRoute}
              variant="flat"
            >
              Sign Up
            </Button>
          </NavbarItem>
        ) : null}
        {user?.token ? (
          <NavbarItem>
            <Button
              as={Link}
              color="danger"
              onClick={handleSignout}
              variant="flat"
            >
              Logout
            </Button>
          </NavbarItem>
        ) : null}

        {path == "/recover" ? (
          <NavbarItem>
            <Button
              as={Link}
              color="primary"
              onClick={handleLoginRoute}
              variant="flat"
            >
              Login
            </Button>
          </NavbarItem>
        ) : null}
      </NavbarContent>
    </Navbar>
  );
};

export default Nav;
