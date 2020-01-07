const Koa = require('koa');
const { ApolloServer, gql } = require('apollo-server-koa');

// 定义一个查询，并且返回值为一个对象
const typeDefs = gql`
  union Result = Book | Author

  type Book {
    title: String
  }

  type Author {
    name: String
  }

  type Query {
    search(type:String): [Result]
  }
`;

// 查询实现中，返回该对象的实例
const resolvers = {
    Result: {
        // 当你定义一个查询的返回类型是 union 或者是 interface 的时候，
        // 必须定义这个解析器告诉 graphql 返回的具体类型
        __resolveType(obj, context, info) {
            if (obj.title) {
                return 'Book';
            }

            if (obj.name) {
                return 'Author';
            }
            return null;
        },
    },
    Query: {
        search: (parent, args) => {
            console.log(args)
            const { type } = args;
            if (type === 'Book') {
                return [{
                    title: '红楼梦'
                }]
            }

            if (type === 'Author') {
                return [{
                    name: '曹雪芹'
                }]
            }
        }
    }
}

const server = new ApolloServer({ typeDefs, resolvers });
const app = new Koa();

server.applyMiddleware({ app });

app.listen({ port: 4000 }, () =>
    console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`),
);