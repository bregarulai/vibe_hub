import { useQuery } from "@tanstack/react-query";

import { FollowerInfo } from "@/lib/type";
import { FOLLOWER_INFO } from "@/lib/constants";
import kyInstance from "../ky";

export const useFollowerInfoquery = (
  userId: string,
  initialState: FollowerInfo,
) => {
  const query = useQuery({
    queryKey: [FOLLOWER_INFO, userId],
    queryFn: () =>
      kyInstance.get(`/api/users/${userId}/followers`).json<FollowerInfo>(),
    initialData: initialState,
    staleTime: Infinity,
  });

  return query;
};
