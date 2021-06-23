// Libraries
import 'reflect-metadata'
import { ConnectionOptions, createConnection } from 'typeorm'
import express from 'express'
import cors from 'cors'
import { ApolloServer } from 'apollo-server-express'
import { buildSchema } from 'type-graphql'

// Files
import { __prod__ } from './constants'
import { rootPath } from './utils'
import { Post } from './entities/Post'
import { HelloResolver } from './resolvers/hello'
import { PostResolver } from './resolvers/post'

const sqliteOptions: ConnectionOptions = {
  type: 'sqlite',
  database: `${rootPath}/data/fullstack.sqlite`,
  logging: !__prod__,
  synchronize: !__prod__, // automatically create table
  entities: [Post],
}

const main = async () => {
  // Database setup
  await createConnection(sqliteOptions)
  // await Post.create({ title: 'my first post' }).save()
  // const posts = await Post.find()
  // console.log(posts)

  // Server setup
  const app = express()

  app.use(cors({ origin: 'http://localhost:3000', credentials: true }))

  // Test api
  app.get('/test', (_req, res) => res.send('Hello World'))

  // Apollo server setup
  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [HelloResolver, PostResolver],
      validate: false, // stop auto validating using class-validator
    }),
    context: () => ({}), // context - special object, accessible by all resolvers
  })

  apolloServer.applyMiddleware({ app, cors: false })

  app.listen(4000, () => console.log('server listen on port 4000'))
}

main().catch((err) => console.log(err))
