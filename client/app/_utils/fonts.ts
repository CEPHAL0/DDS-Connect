import { Cabin } from "next/font/google";
import { Satisfy } from "next/font/google";
import { Outfit } from "next/font/google";

const cabin = Cabin({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-cabin",
});

const satisfy = Satisfy({
  weight: ["400"],
  subsets: ["latin"],
  variable: "--font-satisfy",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
});

export { cabin, satisfy, outfit };
