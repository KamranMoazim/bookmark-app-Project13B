import fetch from "cross-fetch"
import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client"

export const client = new ApolloClient({
  link: new HttpLink({
    uri:
      "https://z3yh4oouzjcmfn6kywydp2zeze.appsync-api.us-east-1.amazonaws.com/graphql", // ENTER YOUR GRAPHQL ENDPOINT HERE
    fetch,
    headers: {
      "x-api-key": "da2-ujar5xzzbrbwdipca3hctzbtce" , // ENTER YOUR API KEY HERE
    },
  }),
  cache: new InMemoryCache(),
})