import { GraphQLBoolean, GraphQLID, GraphQLInt, GraphQLList, GraphQLObjectType, GraphQLString } from "graphql";

export const companyTypes = new GraphQLObjectType({
    name: 'companyTypes',
    fields: {
        companyName: { type: GraphQLString },
        companyEmail: { type: GraphQLString },
        description: { type: GraphQLString },
        address: { type: GraphQLString },
        industry: { type: GraphQLString },
        numberOfEmployees: { type: GraphQLInt },
        createdBy: { type: GraphQLID },
        Logo: {
            type: new GraphQLObjectType({
                name: 'CompanyLogo',
                fields: {
                    secure_url: { type: GraphQLString },
                    public_id: { type: GraphQLString }
                }
            })
        },
        coverPic: {
            type: new GraphQLObjectType({
                name: 'CompanyCoverPic',
                fields: {
                    secure_url: { type: GraphQLString },
                    public_id: { type: GraphQLString }
                }
            })
        },
        HR: { type: new GraphQLList(GraphQLID) },
        bannedAt: { type: GraphQLString },
        deletedAt: { type: GraphQLString },
        legalAttachment: {
            type: new GraphQLObjectType({
                name: 'LegalAttachment',
                fields: {
                    secure_url: { type: GraphQLString },
                    public_id: { type: GraphQLString }
                }
            })
        },
        approvedByAdmin: { type: GraphQLBoolean }
    }
});