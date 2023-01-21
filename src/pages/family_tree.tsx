import type { NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { FamilyTreeTable } from "../components/FamilyTreeTable";

const FamilyTree: NextPage = () => {
  return (
    <>
      <Head>
        <title>Centaurians Family Tree</title>
        <meta name="description" content="The Alpha Centaurians family tree!" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="bg-image" />
      <main className="flex relative min-h-screen flex-col items-center pt-[5%] sm:pt-0">
        <div className="flex container flex-col items-center gap-6 px-4 py-16 sm:gap-12">
          <Link
            className="absolute top-8 left-8 font-semibold text-white sm:text-lg"
            href="/"
          >
            ← Spawning Station
          </Link>
          <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-[4rem]">
            Family Tree
          </h1>
          <div className="flex relative w-full max-w-2xl flex-col items-center gap-3 rounded-xl bg-white/20 px-2 py-6 text-white sm:p-8">
            <FamilyTreeTable />
          </div>
        </div>
      </main>
    </>
  );
};

export default FamilyTree;
