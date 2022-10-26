// src/pages/_app.tsx
import { httpBatchLink } from "@trpc/client/links/httpBatchLink";
import { loggerLink } from "@trpc/client/links/loggerLink";
import { withTRPC } from "@trpc/next";
import { SessionProvider } from "next-auth/react";
import superjson from "superjson";
import type { AppType } from "next/app";
import type { AppRouter } from "../server/router";
import type { Session } from "next-auth";
import "../styles/globals.css";
import dynamic from 'next/dynamic'
import { WagmiConfig, createClient, configureChains, chain, Chain } from 'wagmi'
import { alchemyProvider } from 'wagmi/providers/alchemy'
import { infuraProvider } from 'wagmi/providers/infura'
import { publicProvider } from 'wagmi/providers/public'
import Footer from "../components/Footer";
import { Alchemy, Network } from "alchemy-sdk";
import { AppWrapper } from "../context/AppContext";
import { QueryClient, QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from 'react-query/devtools'

const Header = dynamic(
  () => import('../components/Header'),
  { ssr: false }
)

const Aurora: Chain = {
  id: 1313161555,
  name: 'Aurora Testnet',
  network: 'Aurora Testnet',
  nativeCurrency: {
    decimals: 18,
    name: 'Aurora ETH',
    symbol: 'ETH',
  },
  rpcUrls: {
    default: 'https://testnet.aurora.dev/',
  },
  blockExplorers: {
    default: { name: 'AuroraScan', url: 'https://testnet.aurorascan.dev/' },
  },
  testnet: true,
}

const config = {
  apiKey: process.env.ALCHEMY_API_KEY,
  network: Network.MATIC_MUMBAI,
};

const alchemy = new Alchemy(config);

const { provider } = configureChains([Aurora], [
  infuraProvider({ apiKey: process.env.INFURA_API_KEY }),
  publicProvider(),
])

const client = createClient({
  autoConnect: true,
  provider
})

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
    },
  },
})


const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <SessionProvider session={session}>
      <WagmiConfig client={client}>
        <QueryClientProvider client={queryClient}>
          <AppWrapper alchemySdk={alchemy}>
            <div className="bg-black min-h-screen">
              <Header />
              <Component {...pageProps} />
              <Footer />
            </div>
          </AppWrapper>
          <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
      </WagmiConfig>
    </SessionProvider>
  );
};

const getBaseUrl = () => {
  if (typeof window !== "undefined") return ""; // browser should use relative url
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`; // SSR should use vercel url
  return `http://localhost:${process.env.PORT ?? 3000}`; // dev SSR should use localhost
};

export default withTRPC<AppRouter>({
  config({ ctx }) {
    /**
     * If you want to use SSR, you need to use the server's full URL
     * @link https://trpc.io/docs/ssr
     */
    const url = `${getBaseUrl()}/api/trpc`;

    return {
      links: [
        loggerLink({
          enabled: (opts) =>
            process.env.NODE_ENV === "development" ||
            (opts.direction === "down" && opts.result instanceof Error),
        }),
        httpBatchLink({ url }),
      ],
      url,
      transformer: superjson,
      /**
       * @link https://react-query.tanstack.com/reference/QueryClient
       */
      // queryClientConfig: { defaultOptions: { queries: { staleTime: 60 } } },

      // To use SSR properly you need to forward the client's headers to the server
      // headers: () => {
      //   if (ctx?.req) {
      //     const headers = ctx?.req?.headers;
      //     delete headers?.connection;
      //     return {
      //       ...headers,
      //       "x-ssr": "1",
      //     };
      //   }
      //   return {};
      // }
    };
  },
  /**
   * @link https://trpc.io/docs/ssr
   */
  ssr: false,
})(MyApp);
