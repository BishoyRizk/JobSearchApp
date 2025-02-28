import { GraphQLObjectType, GraphQLSchema, GraphQLString } from "graphql";
import *as get  from "./admin/admin.resolver.js";



export const schema = new GraphQLSchema({
    query: new GraphQLObjectType({
        name:'jobSearchApp',
        fields:{
          ...get
        }
    })
})