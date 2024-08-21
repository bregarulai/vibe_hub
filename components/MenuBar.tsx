import { Bell, Bookmark, HomeIcon, Mail } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";

type MenuBarProps = {
  className?: string;
};

const MenuBar = ({ className }: MenuBarProps) => {
  return (
    <nav className={className}>
      <Button
        asChild
        variant="ghost"
        title="Home"
        className="flex items-center justify-start gap-3"
      >
        <Link href="/">
          <HomeIcon />
          <span className="hidden lg:block">Home</span>
        </Link>
      </Button>
      <Button
        asChild
        variant="ghost"
        title="Notifications"
        className="flex items-center justify-start gap-3"
      >
        <Link href="/notifications">
          <Bell />
          <span className="hidden lg:block">Notifications</span>
        </Link>
      </Button>
      <Button
        asChild
        variant="ghost"
        title="Messages"
        className="flex items-center justify-start gap-3"
      >
        <Link href="/messages">
          <Mail />
          <span className="hidden lg:block">Messages</span>
        </Link>
      </Button>
      <Button
        asChild
        variant="ghost"
        title="Bookmarks"
        className="flex items-center justify-start gap-3"
      >
        <Link href="/bookmarks">
          <Bookmark />
          <span className="hidden lg:block">Bookmarks</span>
        </Link>
      </Button>
    </nav>
  );
};

export default MenuBar;
