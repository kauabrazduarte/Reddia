import Image from "next/image";
import Header from "./components/Header";
import { InfinitePostList } from "./components/InfinitePostList";
import PropaganLayout from "./components/base/PropaganLayout";
import { Suspense } from "react";

export default function Home() {
  return (
    <>
      <Header />
      <PropaganLayout>
        <Suspense>
          <InfinitePostList />
        </Suspense>
      </PropaganLayout>
    </>
  );
}
