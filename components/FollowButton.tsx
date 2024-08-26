"use client";

import { QueryKey, useMutation, useQueryClient } from "@tanstack/react-query";

import { useFollowerInfoquery } from "@/lib/hooks/queries";
import { FollowerInfo } from "@/lib/type";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import kyInstance from "@/lib/ky";
import { FOLLOWER_INFO } from "@/lib/constants";

type FollowButtonProps = {
  userId: string;
  initialState: FollowerInfo;
};

const FollowButton = ({ userId, initialState }: FollowButtonProps) => {
  const { toast } = useToast();

  const queryClient = useQueryClient();

  const { data } = useFollowerInfoquery(userId, initialState);

  const queryKey: QueryKey = [FOLLOWER_INFO, userId];

  const { mutate } = useMutation({
    mutationFn: () =>
      data.isFollowedByUser
        ? kyInstance.delete(`/api/users/${userId}/followers`)
        : kyInstance.post(`/api/users/${userId}/followers`),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey });

      const previousState = queryClient.getQueryData<FollowerInfo>(queryKey);

      queryClient.setQueryData<FollowerInfo>(queryKey, () => ({
        followers:
          (previousState?.followers || 0) +
          (previousState?.isFollowedByUser ? -1 : 1),
        isFollowedByUser: !previousState?.isFollowedByUser,
      }));

      return { previousState };
    },
    onError: (err, _, context) => {
      if (context?.previousState) {
        queryClient.setQueryData(queryKey, context.previousState);
      }

      console.error(`Error while following/unfollowing user: ${err}`);

      toast({
        variant: "destructive",
        description: "Something went wrong. Please try again later.",
      });
    },
  });

  return (
    <Button
      variant={data.isFollowedByUser ? "secondary" : "default"}
      onClick={() => mutate()}
    >
      {data.isFollowedByUser ? "Unfollow" : "Follow"}
    </Button>
  );
};

export default FollowButton;
