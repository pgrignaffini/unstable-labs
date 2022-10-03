import type { NextPage } from "next";
import Head from "next/head";
import Header from "../components/Header";
import ResultCarousel from "../components/ResultCarousel";
import { trpc } from "../utils/trpc";

const Home: NextPage = () => {


  return (
    <>
      <Head>
        <title>UnstableLabs</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/flask.png" />
      </Head>
      <main className="container mx-auto w-4/5 p-10">
        <Header />
        <div className="mt-24 w-1/2 mx-auto">
          <p className="font-pixel font-bold text-3xl text-white">Welcome to <span className="text-acid">Unstable</span>Labs!</p>
          <p className="font-pixel font-bold text-lg text-gray-400 text-center">a lab to brew AI-generated NFTs</p>
        </div>
        <div className="bg-gray-400 w-3/4 mx-auto mt-24 p-10">
          <div className="flex space-x-5">
            <input type="text" className="w-full p-4 placeholder:font-pixel text-black outline-none font-pixel" placeholder="Enter your description" />
            <button className="bg-acid text-white p-4 font-pixel hover:animate-tremble">Brew</button>
          </div>
        </div>
        <div className="w-full mt-24">
          <ResultCarousel />
        </div>
        <div className="mt-24">
          <img src="/pixel-lab.png" alt="flask" className="w-full" />
        </div>
      </main>
    </>
  );
};

export default Home;

