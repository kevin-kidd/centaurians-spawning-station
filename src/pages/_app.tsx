import { type AppType } from "next/dist/shared/lib/utils";
import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import { ChainProvider } from "@cosmos-kit/react";
import { chains, assets } from "chain-registry";
import { wallets as cosmostationWallets } from "@cosmos-kit/cosmostation";
import { wallets as keplrWallets } from "@cosmos-kit/keplr";
import { wallets as leapWallets } from "@cosmos-kit/leap";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "../styles/globals.css";

const queryClient = new QueryClient();

export const theme = extendTheme({
  config: {
    initialColorMode: "dark",
    useSystemColorMode: false,
  },
});

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <QueryClientProvider client={queryClient}>
      <ChakraProvider theme={theme}>
        <ChainProvider
          chains={chains}
          assetLists={assets}
          wallets={[...cosmostationWallets, ...keplrWallets, ...leapWallets]}
        >
          <Component {...pageProps} />
        </ChainProvider>
      </ChakraProvider>
    </QueryClientProvider>
  );
};

export default MyApp;
