import Header from "../components/Header";
import Image from "next/image";
import PixValue from "./PixValue";
import Script from "next/script";
import Link from "next/link";

export default function DonatePage() {
  return (
    <>
      <Header />
      <main className="h-full w-full pb-20 px-[10vw]">
        {/* Título Principal */}
        <h1 className="mt-10 font-medium text-3xl max-w-2xl text-center mx-auto">
          Doe para manter o projeto de pé ❤️
        </h1>
        <p className="text-zinc-400 mt-4 max-w-xl text-center mx-auto">
          Com apenas <strong>R$ 1,00</strong>, você garante o serviço online por
          mais 5 dias! não espere que alguém doará para você, faça você mesmo 🤗
        </p>

        {/* Seção PIX */}
        <section aria-labelledby="pix-heading">
          <h2
            id="pix-heading"
            className="mt-20 font-medium text-xl text-center mx-auto"
          >
            Pague por PIX
          </h2>
          <p className="text-zinc-400 text-center mx-auto">
            Rápido, seguro e sem taxas 😉
          </p>

          <div className="bg-white p-4 rounded-xl max-w-55 mx-auto mt-8">
            <Image
              src="/pix.png"
              alt="QR Code para doação via Pix"
              width={200}
              height={200}
              quality={100}
              className="w-full h-auto"
            />
          </div>

          <div className="w-full flex items-center justify-center mt-6">
            <PixValue />
          </div>
        </section>

        {/* Outros Meios */}
        <section aria-labelledby="other-methods">
          <h2
            id="other-methods"
            className="mt-20 font-medium text-xl text-center mx-auto"
          >
            Ou por outros meios
          </h2>
          <p className="text-zinc-400 max-w-md text-center mx-auto">
            Se preferir usar cartão ou conta internacional, sinta-se à vontade!
          </p>

          <Link
            href="https://buymeacoffee.com/kauabrazduarte"
            target="_blank"
            className="hover:opacity-80 transition-opacity"
          >
            <Image
              width={150}
              height={40}
              className="block mx-auto mt-8"
              alt="Botão Buy me a coffee"
              src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png"
            />
          </Link>
        </section>
      </main>
    </>
  );
}
