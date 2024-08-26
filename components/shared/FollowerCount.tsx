"use client";

import { useFollowerInfoquery } from "@/lib/hooks/queries";
import { FollowerInfo } from "@/lib/type";

type FollowerCountProps = {
  userId: string;
  initialState: FollowerInfo;
};

const FollowerCount = ({ userId, initialState }: FollowerCountProps) => {
  const { data } = useFollowerInfoquery(userId, initialState);

  return (
    <span>
      Followers: <span className="font-semibold">{data.followers}</span>
    </span>
  );
};

export default FollowerCount;
