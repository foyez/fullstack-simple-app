# Backend

## Project setup

<details>
<summary>View contents</summary>

### Create a server directory and initialize `package.json` file

```bash
mkdir server
cd server
yarn init
```

### Create `tsconfig.json` file & install typescript packages

```bash
npx tsconfig.json
npx gitignore node
yarn add -D typescript @types/node
yarn add -D tsc-watch
```

### Create `src` directory & create `index.ts` file

```bash
mkdir src
cd src && touch index.ts
```

### Write _Hello World_ in `index.ts` file

`server/src/index.ts`

```ts
console.log("Hello World");
```

### Add `scripts` in package.json file

`server/package.json`

```json
{
  "scripts": {
    "dev": "tsc-watch --onSuccess \"node ./dist/index.js\"",
    "start": "node dist/index.js",
    "build": "tsc"
  }
}
```

### Run `yarn dev`

```bash
yarn dev
```

</details>

## Setup Database

<details>
<summary>View contents</summary>

### Install `Typeorm`

```bash
yarn add typeorm reflect-metadata
yarn add pg # for postgresql only
yarn add sqlite3 # for sqlite only
```

### Database options (credentials)

sqlite

```ts
import "reflect-metadata";
import { ConnectionOptions, createConnection } from "typeorm";

const sqliteOptions: ConnectionOptions = {
  type: "sqlite",
  database: `${rootPath}/data/fullstack.sqlite`,
  logging: !__prod__, // showing logs
  synchronize: !__prod__, // automatically create table
  entities: [],
};
createConnection(sqliteOptions);
```

postgres

```ts
const postgresOptions: ConnectionOptions = {
  type: "postgres",
  database: "fullstack",
  username: "postgres",
  password: "postgres",
  logging: true, // showing logs
  synchronize: true, // automatically create table
  entities: [],
};
createConnection(postgresOptions);
```

</details>

## Create entities

<details>
<summary>View contents</summary>

## Create Post entity

`server/src/entities/Post.ts`

```ts
// Libraries
import {... } from 'typeorm'

@Entity()
export class Post extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number

  @Column()
  title!: string

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}
```

### Add `Post` entity in db options

```ts
const sqliteOptions: ConnectionOptions = {
  ...,
  entities: [Post],
}
```

### Insert an post & read the posts

`server/src/index.ts`

```ts
const main = async () => {
  // Database setup
  await createConnection(sqliteOptions);

  // Insert Posts
  await Post.create({title: 'My First Post'}).save()
  await Post.create({title: 'My First Post 2'}).save()
  await Post.create({ title: "My First Post 3" }).save();

  // Read post by id
  const id = 1;
  const postById = await Post.findOne(id);
  console.log(postById);

  // Read post by options
  const title = "My First Post 2";
  const postByTitle = await Post.findOne({ title });
  console.log(postByTitle);

  // Update an post
  const idToUpdate = 2;
  const updatedTitle = "My First Post 2 updated";
  await Post.update(idToUpdate, { title: updatedTitle });

  // Delete an post
  const idToDelete = 3;
  await Post.delete(idToDelete);

  // Read posts
  const posts = await Post.find();
  console.log(posts);
};

main();
```

</details>

## Server setup

<details>
<summary>View contents</summary>

### Install express

```bash
yarn add express
yarn add -D @types/express
```

### setup express & test

`server/src/index.ts`

```ts
const main = async () => {
  // ...

  const app = express();

  app.get("/test", (_req, res) => res.send("Hello World"));

  app.listen(4000, () => console.log("server listening on port 4000"));
};

main();
```

### Install graphql & apolloServer related packages

```bash
yarn add graphql apollo-server-express type-graphql
```

### Add `skipLibCheck: true` in tsconfig.json to escape from class-validator error <sup>[help](https://typegraphql.com/docs/validation.html#caveats)</sup>

`server/tsconfig.json`

```json
{
  "compilerOptions: {
    "skipLibCheck": true
  }
}
```

### Setup apollo server

`server/src/index.ts`

```ts
const main = async () => {
  // ...

  const app = express();
  const apolloServer = new ApolloServer({
    schema: new buildSchema({
      resolvers: [HelloResolver],
      validate: false, // stop auto validating using class-validator
    }),
  });
  apolloServer.applyMiddleware({ app });
  app.listen(4000, () => console.log("server listening on port 4000"));
};

main();
```

### Create a test resolver

`server/src/resolvers/hello.ts`

```ts
import { Arg, Query, Resolver } from "type-graphql";

@Resolver()
export class HelloResolver {
  @Query(() => String)
  hello(): string {
    return "hello world";
  }

  @Query(() => String)
  greet(@Arg("name", () => String) name: string): string {
    return `hi, ${name}`;
  }
}
```

### Add `HelloResolver` in apollo server

`server/src/index.ts`

```ts
const main = async () => {
  // ...

  const apolloServer = new ApolloServer({
    schema: new buildSchema({
      resolvers: [HelloResolver],
      validate: false, // stop auto validating using class-validator
    }),
  });

  // ...
};
```

### Test `hello` & `greet` query

- go to: `http://locahost:4000/graphql`
- write this:

```graphql
query {
  hello
  greet(name: "Laaibah")
}
```

- hit: `ctrl+enter`

</details>

## Connecting `type-graphql` with `typeorm`

<details>
<summary>View contents</summary>

### Add `Post` entity

`server/src/entities/Post.ts`

```ts
import { ... } from 'typeorm'
import { Field, Int, ObjectType } from 'type-graphql'

@ObjectType()
@Entity()
export class Post extends BaseEntity {
  @Field(() => Int) // expose the field
  @PrimaryGeneratedColumn()
  id!: number

  @Field(() => String)
  @Column()
  title!: string

  @Field(() => String)
  @CreateDateColumn()
  createdAt: Date

  @Field(() => String)
  @UpdateDateColumn()
  updatedAt: Date
}
```

`server/src/index.ts`

```ts
const main = async () => {
  // ...

  const sqliteOptions: ConnectionOptions = {
    type: "sqlite",
    database: `${rootPath}/data/fullstack.sqlite`,
    logging: !__prod__,
    synchronize: !__prod__, // automatically create table
    entities: [Post],
  };

  // ...
};
```

### Add `post` resolver

`server/src/resolvers/post.ts`

```ts
import { Query, Resolver } from "type-graphql";
import { Post } from "../entities/Post";

@Resolver()
export class PostResolver {
  @Query(() => [Post])
  posts(): Promise<Post[]> {
    return Post.find();
  }
}
```

`server/src/index.ts`

```ts
const main = async () => {
  // ...

  const apolloServer = new ApolloServer({
    schema: new buildSchema({
      resolvers: [HelloResolver, PostResolver],
      validate: false, // stop auto validating using class-validator
    }),
  });

  // ...
};
```

### Test `posts` query

- go to: `http://locahost:4000/graphql`
- write this:

```graphql
query {
  posts {
    id
    title
    createdAt
    updatedAt
  }
}
```

- hit: `ctrl+enter`

</details>

## Authentication

<details>
<summary>View contents</summary>

### Add `User` entity

`src/entities/User.ts`

```ts
import { Field, Int, ObjectType } from "type-graphql";
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

@ObjectType()
@Entity()
export class User extends BaseEntity {
  @Field(() => Int) // expose the field
  @PrimaryGeneratedColumn()
  id!: number; // ! means the field is required

  @Field(() => String)
  @Column({ unique: true })
  username!: string;

  @Field(() => String)
  @Column({ unique: true })
  email!: string;

  // the is not exposed
  @Column()
  hashedPassword!: string;

  @Field(() => String)
  @CreateDateColumn()
  createdAt: Date;

  @Field(() => String)
  @UpdateDateColumn()
  updatedAt: Date;
}
```

`src/index.ts`

```ts
const main = async () => {
  // ...

  const sqliteOptions: ConnectionOptions = {
    type: "sqlite",
    database: `${rootPath}/data/fullstack.sqlite`,
    logging: !__prod__,
    synchronize: !__prod__, // automatically create table
    entities: [Post, User],
  };

  // ...
};
```

### Add `user` resolver

`src/resolvers/user.ts`

```ts
import { Arg, Field, Mutation, ObjectType, Resolver } from "type-graphql";

import { User } from "../entities";
import { UserRegisterInput } from "./types/user-input";
import { hashPassword } from "../utils/libraries";
import { validateRegister } from "../utils/validations";

@ObjectType()
class FieldError {
  @Field()
  field: string;

  @Field()
  message: string;
}

@ObjectType()
class UserResponse {
  @Field(() => User, { nullable: true })
  user?: User;

  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[];
}

@Resolver(User)
export class UserResolver {
  @Mutation(() => UserResponse)
  async register(
    @Arg("credentials", () => UserRegisterInput) credentials: UserRegisterInput
  ): Promise<UserResponse> {
    const { username, email, password } = credentials;

    const errors = validateRegister(credentials);
    if (errors) {
      return { errors };
    }

    const hashedPassword = await hashPassword(password);
    const user = User.create({ username, email, hashedPassword });

    try {
      await user.save();
    } catch (err) {}

    return { user };
  }
}
```

### Test `register` mutation

- go to: `http://locahost:4000/graphql`
- write this:

```graphql
mutation {
  register(
    credentials: {
      username: "test"
      email: "test@email.com"
      password: "testpass"
    }
  ) {
    user {
      id
      email
      username
    }
    errors {
      field
      message
    }
  }
}
```

- hit: `ctrl+enter`

</details>
