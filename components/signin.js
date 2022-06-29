import { getProviders, signIn } from "next-auth/react";
import useSWR from "swr";
import Content from "./content";

export default function Page() {
  const { data: providers, error } = useSWR("/api/auth/providers", () =>
    getProviders()
  );

  if (error) return <p>Oops something went wrong...</p>;

  if (!providers) return <p>Loading...</p>;

  return (
    <Content>
      <h1>My SignIn Page!!!</h1>
      {Object.values(providers).map((provider) => {
        return (
          <div key={provider.name}>
            <button onClick={() => signIn(provider.id)}>
              SignIn with {provider.name}
            </button>
          </div>
        );
      })}
    </Content>
  );
}
