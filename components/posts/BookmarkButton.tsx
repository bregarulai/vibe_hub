"use client";

import {
  QueryKey,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { Bookmark } from "lucide-react";

import { BookmarkInfo } from "@/lib/type";
import { useToast } from "@/components/ui/use-toast";
import { BOOKMARK_INFO } from "@/lib/constants";
import kyInstance from "@/lib/ky";
import { cn } from "@/lib/utils";

type BookmarkButtonProps = {
  postId: string;
  initialState: BookmarkInfo;
};

const BookmarkButton = ({ postId, initialState }: BookmarkButtonProps) => {
  const { toast } = useToast();

  const queryClient = useQueryClient();

  const queryKey: QueryKey = [BOOKMARK_INFO, postId];

  const { data } = useQuery({
    queryKey,
    queryFn: () =>
      kyInstance.get(`/api/posts/${postId}/bookmark`).json<BookmarkInfo>(),
    initialData: initialState,
    staleTime: Infinity,
  });

  const { mutate } = useMutation({
    mutationFn: () =>
      data.isBookmarkedByUser
        ? kyInstance.delete(`/api/posts/${postId}/bookmark`)
        : kyInstance.post(`/api/posts/${postId}/bookmark`),
    onMutate: async () => {
      toast({
        description: `Post ${data.isBookmarkedByUser ? "un" : ""}bookmarked`,
      });
      await queryClient.cancelQueries({ queryKey });
      const previousState = queryClient.getQueryData<BookmarkInfo>(queryKey);
      queryClient.setQueryData<BookmarkInfo>(queryKey, () => ({
        isBookmarkedByUser: !previousState?.isBookmarkedByUser,
      }));

      return { previousState };
    },
    onError: (error, _, context) => {
      if (context?.previousState) {
        queryClient.setQueryData(queryKey, context.previousState);
      }
      console.error(`Error while liking post: ${error}`);
      toast({
        variant: "destructive",
        description: "Something went wrong. Please try again later.",
      });
    },
  });

  return (
    <button onClick={() => mutate()} className="flex items-center gap-2">
      <Bookmark
        className={cn(
          "size-5",
          data.isBookmarkedByUser && "fill-primary text-primary",
        )}
      />
    </button>
  );
};

export default BookmarkButton;
