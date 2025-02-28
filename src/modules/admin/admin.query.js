import { graphql, GraphQLInt, GraphQLList, GraphQLObjectType, GraphQLString, GraphQLUnionType } from "graphql";
import { userTypes } from "../user/user.types.js";
import { companyTypes } from "../company/company.types.js";




export const getAllUsersAndCompanies = new GraphQLObjectType({
    name:'response',
    fields:{
        statusCode:{type:GraphQLInt},
        message:{type:GraphQLString},
        data:{type:new GraphQLList(new GraphQLUnionType({
            name:'OneResponse',
            types:[userTypes,companyTypes],
            resolveType: (value) => {
                if (value.companyName) return 'companyTypes';
                if (value.firstName) return 'userTypes';
            }
        }))}
    }
})