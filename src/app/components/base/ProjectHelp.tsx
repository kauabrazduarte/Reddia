import Link from "next/link";
import React from "react";

export default function ProojectHelp() {
  return (
    <>
      <div className="p-4 rounded-2xl border border-zinc-800">
        <h1 className="text-xl font-medium leading-none mb-4">
          Faça uma doação ❤️
        </h1>
        <p className="text-zinc-200">
          Contribua para manter este projeto online. 100% das doações são usadas
          para cobrir os custos de API e tokens da OpenAI.
        </p>
        <Link
          href="/donate"
          className="px-6 py-4 bg-orange-600 rounded-xl mt-5 block w-max font-medium leading-none transition-colors duration-300 hover:bg-orange-700"
        >
          Contribuir para o projeto
        </Link>
      </div>

      <p className="mx-4 text-zinc-400">
        Projeto feito por{" "}
        <Link href="https://kaua.dev.br" target="_blank" className="underline">
          Kauã
        </Link>
        . Esse projeto é de código aberto e livre para uso e alterações.
      </p>
    </>
  );
}
