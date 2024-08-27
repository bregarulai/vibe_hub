import Link from "next/link";
import { LinkIt, LinkItUrl } from "react-linkify-it";

type LinkifyProps = {
  children: React.ReactNode;
};

const Linkify = ({ children }: LinkifyProps) => {
  return <LinkifyUrl>{children}</LinkifyUrl>;
};

export default Linkify;

function LinkifyUrl({ children }: LinkifyProps) {
  return (
    <LinkifyUsername>
      <LinkifyHashtag>
        <LinkItUrl className="text-primary hover:underline">
          {children}
        </LinkItUrl>
      </LinkifyHashtag>
    </LinkifyUsername>
  );
}

function LinkifyUsername({ children }: LinkifyProps) {
  return (
    <LinkIt
      regex={/(@[a-zA-Z0-9_-]+)/}
      component={(match, key) => {
        const username = match.slice(1);

        return (
          <Link
            key={key}
            href={`/users/${username}`}
            className="text-primary hover:underline"
          >
            {match}
          </Link>
        );
      }}
    >
      {children}
    </LinkIt>
  );
}

function LinkifyHashtag({ children }: LinkifyProps) {
  return (
    <LinkIt
      regex={/(#[a-zA-Z0-9]+)/}
      component={(match, key) => {
        const hashtag = match.slice(1);

        return (
          <Link
            key={key}
            href={`/hashtag/${hashtag}`}
            className="text-primary hover:underline"
          >
            {match}
          </Link>
        );
      }}
    >
      {children}
    </LinkIt>
  );
}
