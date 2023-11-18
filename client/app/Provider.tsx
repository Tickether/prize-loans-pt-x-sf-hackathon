"use client";
import { NextUIProvider } from "@nextui-org/react";
import React from "react";
import { ThemeProvider } from "./providers/next-theme";
import "@rainbow-me/rainbowkit/styles.css";
import "@rainbow-me/rainbowkit/styles.css";
import type { AppProps } from "next/app";
import { useRouter } from "next/router";
import {
  argentWallet,
  trustWallet,
  ledgerWallet,
} from "@rainbow-me/rainbowkit/wallets";
import {
  RainbowKitProvider,
  getDefaultWallets,
  connectorsForWallets,
  Locale,
} from "@rainbow-me/rainbowkit";
import { configureChains, createConfig, WagmiConfig } from "wagmi";
import { optimismGoerli } from "wagmi/chains";
import { publicProvider } from "wagmi/providers/public";
const { chains, publicClient, webSocketPublicClient } = configureChains(
  [
    optimismGoerli,

    ...(process.env.NEXT_PUBLIC_ENABLE_TESTNETS === "true"
      ? [optimismGoerli]
      : []),
  ],
  [publicProvider()]
);

const projectId = process.env.NEXT_PUBLIC_RAINBOW_PROJECT_ID || "none";

const { wallets } = getDefaultWallets({
  appName: "Prize Loans - PoolTogether x SuperFluid",
  projectId,
  chains,
});
const connectors = connectorsForWallets([
  ...wallets,
  {
    groupName: "Other",
    wallets: [
      argentWallet({ projectId, chains }),
      trustWallet({ projectId, chains }),
      ledgerWallet({ projectId, chains }),
    ],
  },
]);
const demoAppInfo = {
  appName: "Prize Loans - PoolTogether x SuperFluid",
};
const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
  webSocketPublicClient,
});

export default function Provider({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);
  return (
    <WagmiConfig config={wagmiConfig}>
      <RainbowKitProvider chains={chains} appInfo={demoAppInfo}>
        <NextUIProvider>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            {mounted && children}
          </ThemeProvider>
        </NextUIProvider>
      </RainbowKitProvider>
    </WagmiConfig>
  );
}
