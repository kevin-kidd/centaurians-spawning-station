import { type AppType } from "next/dist/shared/lib/utils";
import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import { ChainProvider } from "@cosmos-kit/react";
import { chains, assets } from "chain-registry";
import { wallets as cosmostationWallets } from "@cosmos-kit/cosmostation";
import { wallets as keplrWallets } from "@cosmos-kit/keplr";
import { wallets as leapWallets } from "@cosmos-kit/leap";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "../styles/globals.css";
import type { MainWalletBase } from "@cosmos-kit/core";

const queryClient = new QueryClient();

export const theme = extendTheme({
  config: {
    initialColorMode: "dark",
    useSystemColorMode: false,
  },
});

const MyApp: AppType = ({ Component, pageProps }) => {
  const wallets = [
    ...cosmostationWallets,
    ...keplrWallets,
    ...leapWallets,
  ] as MainWalletBase[];
  return (
    <QueryClientProvider client={queryClient}>
      <ChakraProvider theme={theme}>
        <ChainProvider
          chains={chains}
          assetLists={assets}
          wrappedWithChakra={true}
          wallets={wallets}
          walletConnectOptions={{
            signClient: {
              projectId: "812d84e551776ec7b872133e3fd46b4b",
            },
          }}
        >
          <Component {...pageProps} />
        </ChainProvider>
      </ChakraProvider>
    </QueryClientProvider>
  );
};

export default MyApp;
