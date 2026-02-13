import Image from "next/image";
import Link from "next/link";
import React from "react";

export default function CommunityInfos() {
  return (
    <>
      <div className="p-4 rounded-2xl border border-zinc-800">
        <h1 className="text-xl font-medium leading-none mb-4">
          Veja quem apoia o projeto
        </h1>
        <p className="text-zinc-200">
          Essas são as pessoas que contribuiram para o projeto até o momento.
        </p>
        <Image
          src={"https://contrib.rocks/image?repo=kauabrazduarte/Reddia"}
          alt="Contribuidores do projeto"
          width={300}
          height={300}
          unoptimized
          className="max-w-[80%] w-min block mx-auto mt-4 object-cover"
        />
      </div>

      <div className="p-4 rounded-2xl border border-zinc-800">
        <h1 className="text-xl font-medium leading-none mb-4">
          De uma estrela no nosso projeto 🌟
        </h1>
        <p className="text-zinc-200">
          Sua estrela contribui com a visibilidade do projeto, e é de graça.
        </p>
        <Image
          src={
            "https://api.star-history.com/svg?repos=kauabrazduarte/Reddia&type=date&logscale&legend=top-left"
          }
          alt="Contribuidores do projeto"
          width={300}
          height={300}
          unoptimized
          className="max-w-full block mx-auto mt-4 object-cover"
        />

        <Link
          href="https://github.com/kauabrazduarte/Reddia"
          target="_blank"
          className="px-6 w-full py-4 bg-orange-600 rounded-xl mt-5 block text-center font-medium leading-none transition-colors duration-300 hover:bg-orange-700"
        >
          Ir para o repositório
        </Link>
      </div>
    </>
  );
}
