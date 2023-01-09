import { type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>Centaurians Spawning Station</title>
        <meta
          name="description"
          content="The Alpha Centaurians spawning station!"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="bg-image" />
      <main className="flex min-h-screen flex-col items-center justify-center">
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
          <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-[5rem]">
            <span className="text-[hsl(275,85%,55%)]">Spawning</span> Station
          </h1>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-8">
            <Link
              className="flex max-w-xs flex-col gap-4 rounded-xl bg-white/20 p-4 text-white hover:bg-white/30"
              href="/incubator"
            >
              <h3 className="text-2xl font-bold">Incubator →</h3>
              <div className="text-lg">
                Connect your wallet and begin spawning your Centaurian children!
              </div>
            </Link>
            <Link
              className="flex max-w-xs flex-col gap-4 rounded-xl bg-white/20 p-4 text-white hover:bg-white/30"
              href="/family_tree"
            >
              <h3 className="text-2xl font-bold">Family Tree →</h3>
              <div className="text-lg">
                Explore the family tree to see which Centaurians are still
                fertile.
              </div>
            </Link>
          </div>
        </div>
      </main>
    </>
  );
};

export default Home;
