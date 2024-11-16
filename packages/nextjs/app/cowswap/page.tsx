import SwapSection from "~~/components/SwapSection";
import { RainbowKitCustomConnectButton } from "~~/components/scaffold-eth";

export default function CowSwap() {
  return (
    <main className="p-4 max-w-lg flex flex-col gap-4 items-center justify-center mx-auto">
      <div className="flex gap-2">
        <RainbowKitCustomConnectButton />
      </div>
      <SwapSection />
    </main>
  );
}
