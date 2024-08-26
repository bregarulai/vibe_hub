import FollowingFeed from "@/components/FollowingFeed";
import ForYouFeed from "@/components/ForYouFeed";
import PostEditor from "@/components/posts/editor/PostEditor";
import TrendsSidebar from "@/components/shared/TrendsSidebar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { tabs } from "@/lib/constants";

export default function Home() {
  return (
    <main className="flex w-full min-w-0 gap-5">
      <div className="w-full min-w-0 space-y-5">
        <PostEditor />
        <Tabs defaultValue={tabs.FOR_YOU}>
          <TabsList>
            <TabsTrigger value={tabs.FOR_YOU}>For You</TabsTrigger>
            <TabsTrigger value={tabs.FOLLOWING}>Following</TabsTrigger>
          </TabsList>
          <TabsContent value={tabs.FOR_YOU}>
            <ForYouFeed />
          </TabsContent>
          <TabsContent value={tabs.FOLLOWING}>
            <FollowingFeed />
          </TabsContent>
        </Tabs>
      </div>
      <TrendsSidebar />
    </main>
  );
}
