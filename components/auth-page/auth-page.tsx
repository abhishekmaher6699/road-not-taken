"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { SignInCard } from "./sign-in-card";
import { SignUpCard } from "./sign-up-card";
import { useBreakpoint } from "@/hooks/useBreakPoint";

const DESKTOP_BREAKPOINT = 1024;

const AuthPage = () => {
  const [authType, setAuthType] = useState<"sign-in" | "sign-up">("sign-in");
  const isDesktop = useBreakpoint(DESKTOP_BREAKPOINT);

  if (isDesktop === null) return null;

  return (
    <div
      className="relative min-h-screen grid"
      style={{
        gridTemplateColumns: isDesktop ? "70% 30%" : "100%",
      }}
    >
      {/* IMAGE SECTION */}
      <div
        className="relative overflow-hidden"
        style={{
          position: isDesktop ? "relative" : "absolute",
          inset: isDesktop ? "auto" : 0,
        }}
      >
        {/* BACKGROUND IMAGE (FIXED – NO GLITCH) */}
        <Image
          src="/map.jpg"
          alt="Background"
          fill
          priority
          sizes={isDesktop ? "70vw" : "100vw"}
          className="object-cover"
          style={{
            clipPath: isDesktop
              ? "polygon(0 0, 100% 0, 85% 100%, 0 100%)"
              : "polygon(0 0, 100% 0, 100% 100%, 0 100%)",
          }}
        />

        {/* OVERLAY */}
        <div
          className="absolute inset-0 bg-black/70"
          style={{
            clipPath: isDesktop
              ? "polygon(0 0, 100% 0, 85% 100%, 0 100%)"
              : "polygon(0 0, 100% 0, 100% 100%, 0 100%)",
          }}
        />

        {/* DESKTOP LOGO */}
        {isDesktop && (
          <div
            className="absolute z-10"
            style={{
              top: "50%",
              left: "50%",
              transform: "translate(-55%, -60%)",
            }}
          >
            <Image
              src="/logoo.png"
              alt="Logo"
              width={500}
              height={500}
              priority
            />
          </div>
        )}
      </div>

      {/* AUTH SECTION */}
      <div
        className="relative flex items-center justify-center px-8 md:px-4 pb-20 md:pb-0"
        style={{
          zIndex: 10,
          minHeight: "100vh",
          backgroundColor: isDesktop ? "#ffffff" : "transparent",
        }}
      >
        <div className="w-full max-w-md flex flex-col justify-between items-center gap-6">
          {/* MOBILE LOGO */}
          {!isDesktop && (
            <Image
              src="/logoo.png"
              alt="Logo"
              width={350}
              height={100}
              priority
            />
          )}

          {authType === "sign-in" ? (
            <SignInCard toggleAuthType={setAuthType} />
          ) : (
            <SignUpCard toggleAuthType={setAuthType} />
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
