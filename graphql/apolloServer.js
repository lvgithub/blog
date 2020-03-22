const Koa = require('koa');
const { ApolloServer, gql } = require('apollo-server-koa');

// 定义两个查询方法
const typeDefs = gql`
  type Book {
    title: String
    authorName: String
  }

  type Author {
    authorName: String
    books(bookName: String): [Book]
  }

  type Query {
    author(name: String): Author
  }
`;

const Books = [
  {
    title: '红楼梦',
    authorName: '曹雪芹'
  },
  {
    title: '西游记',
    authorName: '吴承恩'
  }
];

const resolvers = {
  Query: {
    author(parent, args, context, info) {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve({
            authorName: '吴承恩'
          });
        }, 1000);
      })
    }
  },
  Author: {
    books: (parent, args) => {
      return Books.filter(item => item.authorName === parent.authorName)
    }
  }
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: {},
  tracing: true
});

const app = new Koa();
server.applyMiddleware({ app });

app.listen({ port: 4000 }, () =>
  console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`),
);