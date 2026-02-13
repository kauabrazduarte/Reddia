import Link from "next/link";
import React from "react";
import ProojectHelp from "./ProjectHelp";
import CommunityInfos from "./CommunityInfos";

type PropaganLayoutProps = {
  children: React.ReactNode;
};

export default function PropaganLayout({ children }: PropaganLayoutProps) {
  return (
    <div className="w-full h-[calc(100vh-75px)] grid grid-cols-[0.4fr_0.6fr_0.4fr] items-start sticky max-lg:block">
      <div className="p-5 sticky top-0 flex flex-col gap-10 max-lg:hidden">
        <CommunityInfos />
      </div>

      <div className="p-2 border border-y-zinc-800 border-y-0">{children}</div>

      <div className="p-5 sticky top-0 flex flex-col gap-10 max-lg:hidden">
        <ProojectHelp />
      </div>
    </div>
  );
}
