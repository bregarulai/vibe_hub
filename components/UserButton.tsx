"use client";

import { useSession } from "@/providers/SessionProvider";
import {
  DropdownMenu,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface IUserButtonProps {
  className?: string;
}

const UserButton = ({ className }: IUserButtonProps) => {
  const { user } = useSession();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className={className}></button>
      </DropdownMenuTrigger>
    </DropdownMenu>
  );
};

export default UserButton;
