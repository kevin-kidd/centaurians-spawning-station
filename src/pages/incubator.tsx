import { useChain } from "@cosmos-kit/react";
import type { NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { Footer } from "../components/Footer";
import { SpawningCard } from "../components/SpawningCard";

const Incubator: NextPage = () => {
  const { isWalletConnected, openView } = useChain("stargaze");
  return (
    <>
      <Head>
        <title>Centaurians Incubator</title>
        <meta
          name="description"
          content="The Alpha Centaurians spawning incubator!"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="bg-image" />
      <main className="flex relative min-h-[92vh] flex-col items-center pt-[10%]">
        <div className="flex container flex-col items-center gap-12 px-4 py-16">
          <Link
            className="absolute top-8 left-8 text-lg font-semibold text-white"
            href="/"
          >
            ← Spawning Station
          </Link>
          <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-[4rem]">
            Incubator
          </h1>
          <div className="flex relative mt-4 w-full max-w-lg flex-col items-center gap-5 rounded-xl bg-white/20 p-8 text-white">
            {isWalletConnected ? (
              <SpawningCard />
            ) : (
              <>
                <h3 className="text-lg font-semibold">
                  Please connect your wallet to start spawning.
                </h3>
                <button
                  onClick={openView}
                  className="rounded-lg bg-white/30 px-3 py-2 text-lg font-semibold hover:bg-white/40"
                >
                  Connect Wallet
                </button>
              </>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default Incubator;
