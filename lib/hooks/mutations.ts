"use client";

import {
  InfiniteData,
  QueryFilters,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { usePathname, useRouter } from "next/navigation";

import { useToast } from "@/components/ui/use-toast";
import { createPostAction } from "@/server/actions/editor.action";
import { FOR_YOU, POST_FEED } from "@/lib/constants";
import { PostData, PostsPage } from "@/lib/type";
import { deletePostAction } from "@/server/actions/post.action";

export const useSubmitPostMutation = () => {
  const { toast } = useToast();

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: createPostAction,
    onSuccess: async (newPost) => {
      const queryFilter: QueryFilters = { queryKey: [POST_FEED, FOR_YOU] };

      await queryClient.cancelQueries(queryFilter);

      queryClient.setQueriesData<InfiniteData<PostsPage, string | null>>(
        queryFilter,
        (oldData) => {
          const firstPage = oldData?.pages[0];

          if (firstPage) {
            return {
              pageParams: oldData.pageParams,
              pages: [
                {
                  posts: [newPost, ...firstPage.posts],
                  nextCursor: firstPage.nextCursor,
                },
                ...oldData.pages.slice(1),
              ],
            };
          }
        },
      );

      queryClient.invalidateQueries({
        queryKey: queryFilter.queryKey,
        predicate(query) {
          return !query.state.data;
        },
      });

      toast({
        description: "Your post has been successfully created!",
      });
    },
    onError: (error) => {
      console.error(`Error while creating post: ${error}`);
      toast({
        variant: "destructive",
        description:
          "Something went wrong while creating your post. Please try again later.",
      });
    },
  });

  return mutation;
};

export const useDeletePostMutation = () => {
  const { toast } = useToast();

  const queryClient = useQueryClient();

  const router = useRouter();
  const pathname = usePathname();

  const mutation = useMutation({
    mutationFn: deletePostAction,
    onSuccess: async (deletedPost) => {
      const queryFilter: QueryFilters = { queryKey: [POST_FEED] };

      await queryClient.cancelQueries(queryFilter);

      queryClient.setQueriesData<InfiniteData<PostsPage, string | null>>(
        queryFilter,
        (oldData) => {
          if (!oldData) return;

          return {
            pageParams: oldData.pageParams,
            pages: oldData.pages.map((page) => ({
              nextCursor: page.nextCursor,
              posts: page.posts.filter((post) => post.id !== deletedPost?.id),
            })),
          };
        },
      );

      toast({
        description: "Your post has been successfully deleted!",
      });

      if (pathname === `/posts/${deletedPost?.id}`) {
        router.push(`/users/${deletedPost?.user.username}`);
      }
    },
    onError: (error) => {
      console.error(`Error while deleting post: ${error}`);
      toast({
        variant: "destructive",
        description:
          "Something went wrong while deleting your post. Please try again later.",
      });
    },
  });

  return mutation;
};
