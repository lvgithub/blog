const Koa = require('koa');
const { ApolloServer, gql } = require('apollo-server-koa');
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');

const adapter = new FileSync('./db/data.json');
const db = low(adapter);

// 定义两个查询方法
const typeDefs = gql`
    type Query {
      hero(id :Int): Hero
    }
    type Mutation {
      createHero(name: String, age: Int, attr: AttrInput): [Hero]
    }
    input AttrInput {
      shoes: String
      clothes: String
      hat: String
    }
    type Hero {
      id: Int
      name: String
      age: Int
      attr: Attr
    }
    type Attr {
      shoes: String
      clothes: String
      hat: String
    }
  `;

// 为各自的方法提供数据
const resolvers = {
  Query: {
    hero: async (parent, args, context, info) => {
      const { id } = args;
      return db.get('hero').find({ id }).value();
    }
  },
  Mutation: {
    createHero: async (parent, args, context, info) => {
      const model = db.get('hero');
      const len = model.value().length;
      model
        .push({ id: len + 1, ...args })
        .write();
      return db.get('hero').value();
    }
  }
};

const server = new ApolloServer({ typeDefs, resolvers });

const app = new Koa();
server.applyMiddleware({ app });

app.listen({ port: 4000 }, () =>
  console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`),
);