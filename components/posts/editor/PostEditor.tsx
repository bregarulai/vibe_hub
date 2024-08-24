"use client";

import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";

import "./style.css";

import { useSession } from "@/providers/SessionProvider";
import UserAvatar from "@/components/shared/UserAvatar";
import { useSubmitPostMutation } from "@/lib/hooks/mutations";
import LoadingButton from "@/components/shared/LoadingButton";

const PostEditor = () => {
  const { user } = useSession();

  const submitPostMutation = useSubmitPostMutation();

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        bold: false,
        italic: false,
      }),
      Placeholder.configure({
        placeholder: "What's on your mind?",
      }),
    ],
    immediatelyRender: false, // This prevents rendering during SSR
  });

  const input =
    editor?.getText({
      blockSeparator: "\n",
    }) || "";

  const onSubmit = () => {
    submitPostMutation.mutate(input, {
      onSuccess: () => {
        editor?.commands.clearContent();
      },
    });
  };

  return (
    <div className="flex flex-col gap-5 rounded-2xl bg-card p-5 shadow-sm">
      <div className="flex gap-5">
        <UserAvatar avatarUrl={user.avatarUrl} className="hidden sm:inline" />
        <EditorContent
          className="max-h-[20rem] w-full overflow-y-auto rounded-2xl bg-background px-5 py-3"
          editor={editor}
        />
      </div>
      <div className="flex justify-end">
        <LoadingButton
          onClick={onSubmit}
          loading={submitPostMutation.isPending}
          disabled={!input.trim()}
          className="min-w-20"
        >
          Post
        </LoadingButton>
      </div>
    </div>
  );
};

export default PostEditor;
