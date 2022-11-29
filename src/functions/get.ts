import { APIGatewayProxyHandler } from "aws-lambda";
import { dynamoClient } from "src/db/dynamodbClient";

export const handler: APIGatewayProxyHandler = async (event, _context) => {
  try {
    const { userId } = event.pathParameters;

    const todos = await dynamoClient.query({
      TableName: 'todos',
      KeyConditionExpression: 'userId = :userId',
      ExpressionAttributeValues: {
        ':userId': userId,
      },
    }).promise();

    return {
      statusCode: 200,
      body: JSON.stringify(todos.Items),
    };
  } catch (error) {
    console.log(error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: `Internal Server Error: ${error.message}`,
      }),
    };
  }
}