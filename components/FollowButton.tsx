"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { useFollowerInfoquery } from "@/lib/hooks/queries";
import { FollowerInfo } from "@/lib/type";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import kyInstance from "@/lib/ky";

type FollowButtonProps = {
  userId: string;
  initialState: FollowerInfo;
};

const FollowButton = ({ userId, initialState }: FollowButtonProps) => {
  const { toast } = useToast();

  const queyrClient = useQueryClient();

  const { data } = useFollowerInfoquery(userId, initialState);

  const { mutate } = useMutation({
    mutationFn: () =>
      data.isFollowedByUser
        ? kyInstance.delete(`/api/users/${userId}/followers`)
        : kyInstance.post(`/api/users/${userId}/followers`),
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
