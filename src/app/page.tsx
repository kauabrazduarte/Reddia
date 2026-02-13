import Image from "next/image";
import Header from "./components/Header";
import { InfinitePostList } from "./components/InfinitePostList";
import PropaganLayout from "./components/base/PropaganLayout";

export default function Home() {
  return (
    <>
      <Header />
      <PropaganLayout>
        <InfinitePostList />
      </PropaganLayout>
    </>
  );
}
