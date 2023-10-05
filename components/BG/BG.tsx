import React from "react";
import "./BG.css";

type Props = {};

const BG = (props: Props) => {
  return (
    <div className="bg relative h-screen w-screen">
      <svg
        width="871"
        height="458"
        viewBox="0 0 871 458"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="z-10 absolute  -right-60 -top-20 sm:scale-100 scale-50"
      >
        <ellipse
          opacity="0.1"
          cx="689.141"
          cy="-367.63"
          rx="689.141"
          ry="825.37"
          fill="#242736"
        />
      </svg>

      <svg
        width="887"
        height="375"
        viewBox="0 0 887 375"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="z-10 absolute sm:left-0 sm:bottom-0 -left-56 -bottom-36 sm:scale-100 scale-50"
      >
        <ellipse
          opacity="0.1"
          cx="259.102"
          cy="751.179"
          rx="627.102"
          ry="751.179"
          fill="#242736"
        />
      </svg>

      <svg
        width="213"
        height="213"
        viewBox="0 0 213 213"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="z-10 absolute -left-20 sm:top-40 top-60 "
      >
        <circle
          cx="106.294"
          cy="106.524"
          r="105.849"
          fill="url(#paint0_linear_2_249)"
          fill-opacity="0.15"
        />
        <defs>
          <linearGradient
            id="paint0_linear_2_249"
            x1="106.294"
            y1="-24.3578"
            x2="78.1626"
            y2="212.373"
            gradientUnits="userSpaceOnUse"
          >
            <stop stop-color="white" />
            <stop offset="1" stop-color="white" stop-opacity="0" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
};

export default BG;
