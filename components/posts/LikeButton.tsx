"use client";

import { LikeInfo } from "@/lib/type";

type LikeButtonProps = {
  postId: string;
  initialState: LikeInfo;
};

const LikeButton = ({ postId, initialState }: LikeButtonProps) => {
  return <div>LikeButton</div>;
};

export default LikeButton;
