"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import {
  BadgeCheckIcon,
  BellIcon,
  LogOutIcon,
} from "lucide-react";
import { signOut } from "@/app/server-actions/auth-actions";

export function UserAvatarClient({ session }: { session: any }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="
            h-12 w-12 rounded-full
            hover:bg-transparent
            focus-visible:ring-0
            focus-visible:ring-offset-0
          "
        >
          <Avatar className="h-10 w-10 shadow-md
            transition-all duration-200 ease-out
            hover:shadow-lg hover:scale-105
            active:scale-105">
            <AvatarImage src={session?.user?.image || ""} />
            <AvatarFallback>
              {session?.user?.name?.[0] ?? "U"}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        sideOffset={8}
        className="z-2000 w-52 rounded-xl p-0 shadow-lg border-none"
      >
        <DropdownMenuLabel className="px-3 py-3 text-sm font-semibold">
          {session?.user?.name || "User"}
        </DropdownMenuLabel>

        <DropdownMenuSeparator className="my-0"/>

        <DropdownMenuGroup>
          <DropdownMenuItem className="px-3 py-2 flex gap-2">
            <BadgeCheckIcon className="h-4 w-4 opacity-70" />
            Profile
          </DropdownMenuItem>

          <DropdownMenuItem className="px-3 py-2 flex gap-2">
            <BellIcon className="h-4 w-4 opacity-70" />
            Added Pins
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator className="my-0" />

        <DropdownMenuItem
          onSelect={() => signOut()}
          className="
            flex gap-2 items-center
            rounded-b-xl
            rounded-t-none
            bg-blue-600 text-white
            px-3 py-3
            hover:bg-blue-700
          "
        >
          <LogOutIcon className="text-white h-4 w-4" />
          Sign Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
