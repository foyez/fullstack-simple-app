import { AppProps } from "next/app";
import { ApolloProvider } from "@apollo/client";

import { createApolloClient } from "src/utils/apolloClient";
import "~/styles/globals.css";

const client = createApolloClient();

const MyApp: React.FC<AppProps> = ({ Component, pageProps }) => {
  return (
    <ApolloProvider client={client}>
      <Component {...pageProps} />
    </ApolloProvider>
  );
};

export default MyApp;
