import DateLinkItem from "@/components/date-link-item/component";
import Header from "@/components/header/component";

export default function Posts() {
  return (
    <main>
      <Header
        title='Posts.md'
        createdAt='13/12/2023 13:20'
      />
      <ul>
        <DateLinkItem
          href="/posts/hello"
          date={new Date(2023, 11, 15)}
          text="hello"
          showDay={true}
        />
      </ul>
    </main>
  );
}
