import { createClient } from "microcms-js-sdk";

export const client = createClient({
  serviceDomain: "oxfltt73hd",
  apiKey: process.env.API_KEY,
});
