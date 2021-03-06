# Frontend

## Setup Project

<details>
<summary>View contents</summary>

### Create nextjs app <sup>[link](https://nextjs.org/docs/basic-features/typescript)</sup>

```bash
npx create-next-app@latest client --ts
# or
yarn create next-app client --typescript

cd client
```

### Convert existing nextjs projects to typescript

- create a `tsconfig.json` file:

```bash
npx tsconfig.json
```

- install required types packages:

```bash
yarn add -D typescript @types/react @types/node
```

- convert js files to tsx/ts

### Structure nextjs app

- create a `src` directory & transfer `pages`, `public` & `styles` directories to `src` directory

- run: `yarn dev`

### Setup module path aliases <sup>[link](https://nextjs.org/docs/advanced-features/module-path-aliases)</sup>

```json
// tsconfig.json or jsconfig.json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "~/*": ["src/*"]
    }
  }
}
```

```ts
import "~/styles/globals.css";
```

</details>

## Setup apollo client

<details>
<summary>View contents</summary>

### Install required packages

```bash
yarn add @apollo/client graphql
```

## Connect frontend with graphql

`src/utils/apolloClient.ts`

```ts
import { ApolloClient, createHttpLink, InMemoryCache } from "@apollo/client";

const httpLink = createHttpLink({
  uri: "http://localhost:4000/graphql",
});

export const createApolloClient = () => {
  return new ApolloClient({
    link: httpLink,
    cache: new InMemoryCache(),
  });
};
```

`src/pages/_app.tsx`

```tsx
import { AppProps } from "next/app";
import { ApolloProvider } from "@apollo/client";

import { createApolloClient } from "src/utils/apolloClient";

const client = createApolloClient();

const MyApp: React.FC<AppProps> = ({ Component, pageProps }) => {
  return (
    <ApolloProvider client={client}>
      <Component {...pageProps} />
    </ApolloProvider>
  );
};

export default MyApp;
```

</details>

## Setup graphql code generator

<details>
<summary>View contents</summary>

### Install graphql-codegen

```bash
yarn add -D @graphql-codegen/cli
```

### setup codegen

- run: `yarn graphql-codegen init`
- select these answers:

1. What type of application are you building? `Application built with React`
2. Where is your schema? `http://localhost:4000/graphql`
3. Where are your operations and fragments? `src/graphql/**/*.graphql`
4. Pick plugins: `Typescript, Typescript Operations, Typescript React Apollo`
5. Where to write the output: `src/generated/graphql.tsx`
6. Do you want to generate an introspection file? `No`
7. How to name the config file? `codegen.yml`
8. What script in package.json should run the codegen? `gen`

- After answering these questions a `codegen.yml` file will be generated:

`codegen.yml`

```yml
overwrite: true
schema: "http://localhost:4000/graphql"
documents: "src/graphql/**/*.graphql"
generates:
  src/generated/graphql.tsx:
    plugins:
      - "typescript"
      - "typescript-operations"
      - "typescript-react-apollo"
```

- run: `yarn install`

</details>

## Graphql Query

<details>
<summary>View contents</summary>

### Write graphql posts query

`src/graphql/queries/posts.graphql`

```graphql
query Posts {
  posts {
    id
    title
    createdAt
    updatedAt
  }
}
```

### Run codegen script (The graphql server have to be stay running)

```bash
yarn gen
```

### Use posts query from generated code

```tsx
import { usePostsQuery } from "src/generated/graphql";

export default function Home() {
  const { data } = usePostsQuery();

  return (
    <div>
      <h1>Next js & Graphql App</h1>
      {data?.posts.map((post) => (
        <div key={post.id}>
          <h3>{post.title}</h3>
        </div>
      ))}
    </div>
  );
}
```

</details>

## Graphql Mutation

<details>
<summary>View contents</summary>

### Add `createPost` mutation

`src/graphql/mutations/createPost.graphql`

```graphql
mutation CreatePost($title: String!) {
  createPost(title: $title) {
    id
    title
    createdAt
    updatedAt
  }
}
```

run: `yarn gen`

`src/pages/index.tsx`

```tsx
export default function Home() {
  const { data } = usePostsQuery();
  const [createPost] = useCreatePostMutation();
  const [title, setTitle] = useState("");

  const handleChangePostTitle = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };

  const handleCreatePost = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    createPost({ variables: { title } });
  };

  return (
    <div>
      <h1>Next js & Graphql App</h1>

      <form onSubmit={handleCreatePost}>
        Title:
        <input onChange={handleChangePostTitle} type="text" />
        <button>create post</button>
      </form>

      {data?.posts.map((post) => (
        <div key={post.id}>
          <h3>{post.title}</h3>
        </div>
      ))}
    </div>
  );
}
```

</details>
