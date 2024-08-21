"use client";

import { useRouter } from "next/navigation";

import { Input } from "@/components/ui/input";
import { SearchIcon } from "lucide-react";

const SearchField = () => {
  const rounter = useRouter();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {};
  return (
    <form onSubmit={handleSubmit}>
      <div className="relative">
        <Input name="q" placeholder="Search" className="pe-10" />
        <SearchIcon className="absolute right-3 top-1/2 size-5 -translate-y-1/2 transform text-muted-foreground" />
      </div>
    </form>
  );
};

export default SearchField;
