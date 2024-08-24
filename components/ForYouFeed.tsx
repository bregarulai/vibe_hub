"use client";

import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";

import { PostData } from "@/lib/type";
import { FOR_YOU, POST_FEED } from "@/lib/constants";
import Post from "@/components/posts/Post";

const ForYouFeed = () => {
  const query = useQuery<PostData[]>({
    queryKey: [POST_FEED, FOR_YOU],
    queryFn: async () => {
      const res = await fetch("/api/posts/for-you");
      if (!res.ok) {
        throw new Error(`Request faild with status ${res.status}`);
      }

      return res.json();
    },
  });

  if (query.status === "pending") {
    return <Loader2 className="mx-auto animate-spin" />;
  }

  if (query.status === "error") {
    return (
      <p className="text-center text-destructive">
        An error occurred while loading posts.
      </p>
    );
  }

  return (
    <>
      {query.data.map((post) => (
        <Post key={post.id} post={post} />
      ))}
    </>
  );
};

export default ForYouFeed;
