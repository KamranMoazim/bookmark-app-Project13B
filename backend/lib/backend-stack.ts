import * as cdk from '@aws-cdk/core';
import * as appsync from '@aws-cdk/aws-appsync';
import * as ddb from '@aws-cdk/aws-dynamodb';
import * as lambda from '@aws-cdk/aws-lambda';

export class BackendStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // The code that defines your stack goes here
    
    // here we are defining GraphqlApi
    const api = new appsync.GraphqlApi(this, 'Api', {
      name: 'cdk-bookmark-appsync-api',
      schema: appsync.Schema.fromAsset('graphql/schema.graphql'),
      authorizationConfig: {
        defaultAuthorization: {
          authorizationType: appsync.AuthorizationType.API_KEY,
          apiKeyConfig: {
            expires: cdk.Expiration.after(cdk.Duration.days(365))
          }
        },
      },
      xrayEnabled: true,
    });

    // here we are adding lambda functions
    const bookmarkLambda = new lambda.Function(this, 'AppSyncNotesHandler', {
      runtime: lambda.Runtime.NODEJS_12_X,
      handler: 'main.handler',
      code: lambda.Code.fromAsset('functions'),
      memorySize: 1024
    });
    // here we are adding above defined lambda as a datasource for api
    const lambdaDs = api.addLambdaDataSource('lambdaDatasource', bookmarkLambda);

    // following we are defining resolvers for different functionalities
    lambdaDs.createResolver({
      typeName: "Query",
      fieldName: "getBookMarks"
    });
    lambdaDs.createResolver({
      typeName: "Mutation",
      fieldName: "addBookMark"
    });


    // here we are making a table in DynamoDB
    const bookmarksTable = new ddb.Table(this, 'CDKBookmarkTable', {
      partitionKey: {
        name: 'id',
        type: ddb.AttributeType.STRING,
      },
    });
    // here we are giving access to lambda functions to add or update records of above tablel
    bookmarksTable.grantFullAccess(bookmarkLambda)
    // here we are adding environment variable (which is the name of above created table) which we will use in lambda functions
    bookmarkLambda.addEnvironment('BOOKMARK_TABLE', bookmarksTable.tableName);


    // Prints out the AppSync GraphQL endpoint to the terminal
    new cdk.CfnOutput(this, "GraphQLAPIURL", {
      value: api.graphqlUrl
    });

    // Prints out the AppSync GraphQL API key to the terminal
    new cdk.CfnOutput(this, "GraphQLAPIKey", {
      value: api.apiKey || ''
    });

    // Prints out the stack region to the terminal
    new cdk.CfnOutput(this, "Stack Region", {
      value: this.region
    });

  }
}
