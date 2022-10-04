import type { NextPage } from "next";
import Head from "next/head";
import ResultCarousel from "../components/ResultCarousel";
import { trpc } from "../utils/trpc";
import dynamic from 'next/dynamic'
import SolidButton from "../components/SolidButton";

const Header = dynamic(
  () => import('../components/Header'),
  { ssr: false }
)

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
        <div className="mt-4 relative ">
          <img src="/lab-top.png" alt="lab-top" className="w-full" />
          <div className="w-full absolute bg-black bottom-1/2 ">
            <p className="font-pixel font-bold text-3xl text-white text-center">Welcome to <span className="text-acid">Unstable</span>Labs!</p>
            <p className="font-pixel font-bold text-lg text-gray-400 text-center">a lab to brew AI-generated NFTs</p>
          </div>
        </div>
        <div className="flex mt-10 justify-center items-center ">
          <p className="font-pixel font-bold text-3xl text-white">Step into</p>
          <img src="/brewery-animated.gif" className="w-32" />
          <p className="font-pixel font-bold text-3xl text-white">the Brewery</p>
        </div>
        <div className="bg-gray-400 w-3/4 mx-auto mt-12 p-10">
          <div className="flex space-x-5">
            <input type="text" className="w-full p-4 placeholder:font-pixel text-black outline-none font-pixel" placeholder="Enter your description" />
            <SolidButton text="Brew" />
          </div>
          <div className="mt-4">
            <select name="options">
              <option value="1" className="font-pixel">Option 1</option>
              <option value="2">Option 1</option>
              <option value="3">Option 1</option>
            </select>
          </div>
        </div>
        <div className="flex justify-center mt-8">
          <img src="/flask-combining.gif" alt="loading" className="w-64" />
        </div>
        <div className="w-full mt-24">
          <ResultCarousel />
        </div>
        <div className="mt-24 flex space-x-4">
          <img src="/barrel-toxic.gif" alt="barrel" className="w-24" />
          <img src="/barrels.png" alt="barrels" className="w-56" />
          <img src="/pc-animated.gif" alt="barrels" className="w-48" />

        </div>
      </main>
    </>
  );
};

export default Home;

