"use client";

import { useState } from "react";

import { useToast } from "@/components/ui/use-toast";
import { useUploadThing } from "@/lib/uploadthing";

type Attachment = {
  file: File;
  mediaId?: string;
  isUploading: boolean;
};

export const useMediaUpload = () => {
  const { toast } = useToast();

  const [attachments, setAttachments] = useState<Attachment[]>([]);

  const [uploadProgress, setUploadProgress] = useState<number>();

  const { startUpload, isUploading } = useUploadThing("attachment", {
    onBeforeUploadBegin: (files) => {
      const renamedFiles = files.map((file) => {
        const extension = file.name.split(".").pop();

        return new File(
          [file],
          `attachment_${crypto.randomUUID()}.${extension}`,
          { type: file.type },
        );
      });

      setAttachments((prev) => [
        ...prev,
        ...renamedFiles.map((file) => ({
          file,
          isUploading: true,
        })),
      ]);

      return renamedFiles;
    },
    onUploadProgress: setUploadProgress,
    onClientUploadComplete: (res) => {
      setAttachments((prev) =>
        prev.map((attachemt) => {
          const uploadResult = res.find(
            (result) => result.name === attachemt.file.name,
          );

          if (!uploadResult) return attachemt;

          return {
            ...attachemt,
            mediaId: uploadResult.serverData.mediaId,
            isUploading: false,
          };
        }),
      );
    },
    onUploadError: (error) => {
      setAttachments((prev) =>
        prev.filter((attachment) => !attachment.isUploading),
      );

      console.error(`Error while uploading attachment: ${error}`);

      toast({
        variant: "destructive",
        description:
          error.message ||
          "Something went wrong while uploading your attachment. Please try again later.",
      });
    },
  });

  function handleStartUpload(files: File[]) {
    if (isUploading) {
      toast({
        variant: "destructive",
        description: "Please wait until the current upload is finished.",
      });
      return;
    }

    if (attachments.length + files.length > 5) {
      toast({
        variant: "destructive",
        description: "You can only upload up to 5 attachments per post.",
      });
      return;
    }

    startUpload(files);
  }

  function removeAttachment(fileName: string) {
    setAttachments((prev) =>
      prev.filter((attachment) => attachment.file.name !== fileName),
    );
  }

  function reset() {
    setAttachments([]);
    setUploadProgress(undefined);
  }

  return {
    startUpload: handleStartUpload,
    attachments,
    isUploading,
    uploadProgress,
    removeAttachment,
    reset,
  };
};
