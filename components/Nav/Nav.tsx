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
  NavbarMenuItem,
  NavbarMenu,
  NavbarMenuToggle,
  Avatar,
  Tooltip,
} from "@nextui-org/react";
import AcmeLogo from "./Logo";
import { usePathname, useRouter } from "next/navigation";
const cookieCutter = require("cookie-cutter");

type Props = {};

const Nav = (props: Props) => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const { user, setUser } = useUserContext();
  const path = usePathname();
  const router = useRouter();

  const menuItems = [
    "Profile",
    "Dashboard",
    "Activity",
    "Analytics",
    "System",
    "Deployments",
    "My Settings",
    "Team Settings",
    "Help & Feedback",
    "Log Out",
  ];
  const name = user.name
    ? user.name
        .split(" ")
        .map((x) => x[0])
        .join(" ")
        .toUpperCase()
    : "";
  const handleSignout = () => {
    cookieCutter.set("taskmastertoken", "", { expires: new Date(0) });
    setUser({ token: null, name: null, email: null });
    router.push("/login");
  };
  return (
    <Navbar
      onMenuOpenChange={setIsMenuOpen}
      shouldHideOnScroll
      className="fixed h-20 bg-white  bg-opacity-70 "
    >
      <NavbarContent>
        
        {/* <NavbarMenuToggle
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          className="sm:hidden"
        /> */}
        <NavbarBrand >
          <AcmeLogo />
          <p className="font-bold text-inherit">TASKMASTER</p>
        </NavbarBrand>
      </NavbarContent>

      {/* <NavbarContent className="hidden sm:flex gap-4" justify="center">
        <NavbarItem>
          <Link color="foreground" href="#">
            Features
          </Link>
        </NavbarItem>
        <NavbarItem isActive>
          <Link href="#" aria-current="page">
            Customers
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link color="foreground" href="#">
            Integrations
          </Link>
        </NavbarItem>
      </NavbarContent> */}
      <NavbarContent justify="end">
      {path=="/"?<Tooltip
          content={user.name}
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
        </Tooltip>:null}
        {(path == "/signup" || path == "/") && !user.token  ? (
          <NavbarItem >
            <Button as={Link} color="primary" href="/login" variant="flat">
              Login
            </Button>
          </NavbarItem>
        ) : null}
        {path == "/login" ? (
          <NavbarItem>
            <Button as={Link} color="primary" href="/signup" variant="flat">
              Sign Up
            </Button>
          </NavbarItem>
        ) : null}
        {user.token ? (
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
        
      </NavbarContent>
      {/* <NavbarMenu>
        {menuItems.map((item, index) => (
          <NavbarMenuItem key={`${item}-${index}`}>
            <Link
              color={
                index === 2
                  ? "primary"
                  : index === menuItems.length - 1
                  ? "danger"
                  : "foreground"
              }
              className="w-full"
              href="#"
              size="lg"
            >
              {item}
            </Link>
          </NavbarMenuItem>
        ))}
      </NavbarMenu> */}
    </Navbar>
  );
};

export default Nav;
