import BookmarkFeed from "@/components/bookmarks/FollowingFeed";
import TrendsSidebar from "@/components/shared/TrendsSidebar";

export const metadata = {
  title: "Bookmarks",
};

const BookmarksPage = () => {
  return (
    <main className="flex w-full min-w-0 gap-5">
      <div className="w-full min-w-0 space-y-5">
        <div className="rounded-2xl bg-card p-5 shadow-sm">
          <h1 className="text-center text-2xl font-bold">Bookmarks</h1>
        </div>
        <BookmarkFeed />
      </div>
      <TrendsSidebar />
    </main>
  );
};

export default BookmarksPage;
