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
import { FOR_YOU, POST_FEED, USER_POSTS } from "@/lib/constants";
import { PostData, PostsPage } from "@/lib/type";
import { deletePostAction } from "@/server/actions/post.action";
import { useSession } from "@/providers/SessionProvider";
import { useUploadThing } from "@/lib/uploadthing";
import { UpdateUserProfileValues } from "@/lib/validation";
import { updateUserProfileAction } from "@/server/actions/user.action";

export const useSubmitPostMutation = () => {
  const { toast } = useToast();

  const queryClient = useQueryClient();

  const { user } = useSession();

  const mutation = useMutation({
    mutationFn: createPostAction,
    onSuccess: async (newPost) => {
      const queryFilter = {
        queryKey: [POST_FEED],
        predicate(query) {
          return (
            query.queryKey.includes(FOR_YOU) ||
            (query.queryKey.includes(USER_POSTS) &&
              query.queryKey.includes(user.id))
          );
        },
      } satisfies QueryFilters;

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
          return queryFilter.predicate(query) && !query.state.data;
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

export const useUpdateUserProfileMutation = () => {
  const { toast } = useToast();

  const router = useRouter();

  const queryClient = useQueryClient();

  const { startUpload: startAvatarUpload } = useUploadThing("avatar");

  const mutation = useMutation({
    mutationFn: async ({
      values,
      avatar,
    }: {
      values: UpdateUserProfileValues;
      avatar?: File;
    }) => {
      return Promise.all([
        updateUserProfileAction(values),
        avatar && startAvatarUpload([avatar]),
      ]);
    },
    onSuccess: async ([updatedUser, uploadResult]) => {
      const newAvatarUrl = uploadResult?.[0].serverData.avatarUrl;

      const queryFilter: QueryFilters = {
        queryKey: [POST_FEED],
      };

      await queryClient.cancelQueries(queryFilter);

      queryClient.setQueriesData<InfiniteData<PostsPage, string | null>>(
        queryFilter,
        (oldData) => {
          if (!oldData) return;

          return {
            pageParams: oldData.pageParams,
            pages: oldData.pages.map((page) => ({
              nextCursor: page.nextCursor,
              posts: page.posts.map((post) => {
                if (post.user.id === updatedUser?.id) {
                  return {
                    ...post,
                    user: {
                      ...updatedUser,
                      avatarUrl: newAvatarUrl || updatedUser.avatarUrl,
                    },
                  };
                }
                return post;
              }),
            })),
          };
        },
      );

      router.refresh();

      toast({
        description: "Your profile has been successfully updated!",
      });
    },

    onError: (error) => {
      console.error(`Error while updating user profile: ${error}`);
      toast({
        variant: "destructive",
        description:
          "Something went wrong while updating your profile. Please try again later.",
      });
    },
  });

  return mutation;
};
