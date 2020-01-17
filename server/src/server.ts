import * as dotenv from 'dotenv'
dotenv.config({ path: './.env' })
import { ApolloServer, ServerInfo } from 'apollo-server'

import schema from './modules'


const server = new ApolloServer({ schema })

server
  .listen({ port: process.env.PORT || 4000 })
  .then(({ url }: ServerInfo) => console.log(`🤖 Server ready at ${url}`))
