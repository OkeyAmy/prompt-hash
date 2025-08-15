"use client";
import { useAccount, useConnect, useDisconnect, useChainId, useSwitchChain } from "wagmi";
import { Button } from "./ui/button";

export function CustomConnectButton() {
  const { address, isConnected } = useAccount();
  const { connectors, connect } = useConnect();
  const { disconnect } = useDisconnect();
  const chainId = useChainId();
  const { chains, switchChain } = useSwitchChain();

  if (!isConnected) {
    return (
      <Button
        onClick={() => connect({ connector: connectors[0] })}
        className="ml-auto font-bold border-deepblue-800 text-white bg-primary hover:bg-deepblue-700"
      >
        Connect Wallet
      </Button>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <div className="hidden md:block font-mono text-deepblue-200">
        {address?.slice(0, 6)}...{address?.slice(-4)}
      </div>
      <Button
        onClick={() => disconnect()}
        variant="outline"
        className="ml-auto font-bold border-deepblue-800 text-deepblue-50 hover:text-white hover:bg-deepblue-800"
      >
        Disconnect
      </Button>
    </div>
  );
}
