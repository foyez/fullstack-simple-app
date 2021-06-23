# Frontend

## Project setup

### Create nextjs app

```bash
npx create-next-app client
cd client
```

### Convert nextjs app to typescript

- create a `tsconfig.json` file:

```bash
npx tsconfig.json
```

- install required types packages:

```bash
yarn add -D typescript @types/react @types/node
```

- convert js files to tsx/ts

- create a `src` directory & transfer `pages`, `public` & `styles` directories to `src` directory

- run: `yarn dev`

## Setup apollo client

### Install required packages

```bash
yarn add @apollo/client graphql
```
