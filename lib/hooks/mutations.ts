"use client";

import { useMutation } from "@tanstack/react-query";

import { useToast } from "@/components/ui/use-toast";
import { createPostAction } from "@/server/actions/editor.action";

export const useSubmitPostMutation = () => {
  const { toast } = useToast();

  const mutation = useMutation({
    mutationFn: createPostAction,
    onSuccess: () => {},
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
