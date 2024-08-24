"use client";

import { useDeletePostMutation } from "@/lib/hooks/mutations";
import { PostData } from "@/lib/type";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import LoadingButton from "@/components/shared/LoadingButton";
import { Button } from "@/components/ui/button";

type DeletePostDialogProps = {
  post: PostData;
  open: boolean;
  onClose: () => void;
};

const DeletePostDialog = ({ post, open, onClose }: DeletePostDialogProps) => {
  const deletePostMutation = useDeletePostMutation();

  const handleOpenChange = (open: boolean) => {
    if (!open || !deletePostMutation.isPending) {
      onClose();
    }
  };
  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete post?</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this post? This action cannot be
            undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <LoadingButton
            variant="destructive"
            onClick={() =>
              deletePostMutation.mutate(post.id, { onSuccess: onClose })
            }
            loading={deletePostMutation.isPending}
          >
            Delete
          </LoadingButton>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeletePostDialog;
