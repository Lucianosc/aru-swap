"use client";

import React from "react";
import type { NextPage } from "next";
import { Header } from "~~/components/Header";
import SwapSection from "~~/components/SwapSection";

const Home: NextPage = () => {
  return (
    <>
      <Header />
      <main className="relative flex flex-col flex-1">
        <div className="text-white p-4">
          <div className="max-w-lg mx-auto mt-10">
            {/* <div>
          <CowHookDappComponent />
        </div> */}
            <div className="mb-8">
              <h1 className="text-5xl font-bold mb-2">Swap & bridge,</h1>
              <h2 className="text-4xl font-bold mb-2">the hell out of everything.</h2>
            </div>
            <SwapSection />
            <p className="text-gray-400 mt-8 text-lg mb-0">
              Swap your assets securely across chains with a bridgeless experience.
            </p>
          </div>
        </div>
      </main>
    </>
  );
};

export default Home;
