# Backend

## Project setup

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
yarn add -D nodemon concurrently
```

### Create `src` directory & create `index.ts` file

```bash
mkdir src
cd src && touch index.ts
```

### Write _Hello World_ in `index.ts` file

`server/src/index.ts`

```ts
console.log('Hello World')
```

### Add `scripts` in package.json file

`server/package.json`

```json
{
  "scripts": {
    "watch": "tsc -w",
    "dev:nodemon": "nodemon dist/index.js",
    "dev": "concurrently \"yarn watch\" \"yarn dev:nodemon\"",
    "start": "node dist/index.js"
  }
}
```

### Run `yarn dev`

```bash
yarn dev
```

Here is the results:

## Setup Database

### Install `Typeorm`

```bash
yarn add typeorm reflect-metadata
yarn add pg # for postgresql only
yarn add sqlite3 # for sqlite only
```

### Database options (credentials)

sqlite

```ts
import 'reflect-metadata'
import { ConnectionOptions, createConnection } from 'typeorm'

const sqliteOptions: ConnectionOptions = {
  type: 'sqlite',
  database: `${rootPath}/data/fullstack.sqlite`,
  logging: !__prod__, // showing logs
  synchronize: !__prod__, // automatically create table
  entities: [],
}
createConnection(sqliteOptions)
```

postgres

```ts
const postgresOptions: ConnectionOptions = {
  type: 'postgres',
  database: 'fullstack',
  username: 'postgres',
  password: 'postgres',
  logging: true, // showing logs
  synchronize: true, // automatically create table
  entities: [],
}
createConnection(postgresOptions)
```

### Create entities

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
  // Connect with database
  await createConnection(sqliteOptions)

  // Insert an post
  await Post.create({ title: 'My first post' }).save()

  // Read the posts
  const posts = await Post.find()
  console.log(posts)
}

main()
```

## Server setup

### Install express

```bash
yarn add express
yarn add -D @types/express
```

### setup express & test

`server/src/index.ts`

```ts
const main = async () => {
  ...
  const app = express()

  app.get('/test', (_req, res) => res.send('Hello World'))

  app.listen(4000, () => console.log('server listening on port 4000'))
}

main()
```

### Install graphql & apolloServer related packages

```bash
yarn add graphql apollo-server-express type-graphql
```

### Setup apollo server

`server/src/index.ts`

```ts
const main = async () => {
  ...
  const app = express()
  const apolloServer = new ApolloServer({
    schema: new buildSchema({
      resolvers: [HelloResolver],
      validate: false // stop auto validating using class-validator
    })
  })
  apolloServer.applyMiddleware({ app })
  app.listen(4000, () => console.log('server listening on port 4000'))
}

main()
```

### Create a test resolver

`server/src/resolvers/hello.ts`

```ts
import { Arg, Query, Resolver } from 'type-graphql'

@Resolver()
export class HelloResolver {
  @Query(() => String)
  hello(): string {
    return 'hello world'
  }

  @Query(() => String)
  greet(@Arg('name', () => String) name: string): string {
    return `hi, ${name}`
  }
}
```

### Add `HelloResolver` in apollo server

`server/src/index.ts`

```ts
const main = async () => {
  ...
  const apolloServer = new ApolloServer({
    schema: new buildSchema({
      resolvers: [HelloResolver],
      validate: false // stop auto validating using class-validator
    })
  })
  ...
}
```

### Add `skipLibCheck: true` in tsconfig.json to escape from class-validator error <sup>[help](https://typegraphql.com/docs/validation.html#caveats)</sup>

`server/tsconfig.json`

```json
{
  "compilerOptions: {
    ...,
    "skipLibCheck": true
  }
}
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

### Connecting `type-graphql` with `typeorm`

`server/src/resolvers/post.ts`

```ts
import { Query, Resolver } from 'type-graphql'
import { Post } from '../entities/Post'

@Resolver()
export class PostResolver {
  @Query(() => [Post])
  posts(): Promise<Post[]> {
    return Post.find()
  }
}
```

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

### Add `PostResolver` in apollo server

`server/src/index.ts`

```ts
const main = async () => {
  ...
  const apolloServer = new ApolloServer({
    schema: new buildSchema({
      resolvers: [HelloResolver, PostResolver],
      validate: false // stop auto validating using class-validator
    })
  })
  ...
}
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
