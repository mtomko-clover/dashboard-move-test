import { makeExecutableSchema } from 'graphql-tools'
import { fileLoader, mergeResolvers, mergeTypes } from 'merge-graphql-schemas'
import path from 'path'


const typesArray = fileLoader(path.join(__dirname, './**/*.graphql'))
const resolversArray = fileLoader(path.join(__dirname, './**/resolvers.*'))

const typeDefs = mergeTypes(typesArray, { all: true })
const resolvers = mergeResolvers(resolversArray)

export default makeExecutableSchema({
  resolvers,
  typeDefs
})
