import Image from "next/image";
import Header from "./components/Header";
import { InfinitePostList } from "./components/InfinitePostList";

export default function Home() {
  return (
    <>
      <Header />
      <InfinitePostList />
    </>
  );
}
