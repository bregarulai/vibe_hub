import React from "react";

import { PostData } from "@/lib/type";

type PostProps = {
  post: PostData;
};

const Post = ({ post }: PostProps) => {
  return <article>{post.content}</article>;
};

export default Post;
