"use client";

import { useWindowWidth } from "./useWindowWidth";

export function useBreakpoint(breakpoint: number) {
  const width = useWindowWidth();

  if (width === null) return null;

  return width >= breakpoint;
}
