import { APIGatewayProxyHandler } from "aws-lambda";
import { dynamoClient } from "src/db/dynamodbClient";

interface IPayload {
  title: string;
  deadline: Date;
}

export const handler: APIGatewayProxyHandler = async (event, _context) => {
  try {
    const { userId } = event.pathParameters;
    const { title, deadline } = JSON.parse(event.body) as IPayload;

    const todoAlreadyExists = await dynamoClient.query({
      TableName: 'todos',
      KeyConditionExpression: 'userId = :userId',
      FilterExpression: 'title = :title',
      ExpressionAttributeValues: {
        ':userId': userId,
        ':title': title,
      },
    }).promise();

    if (todoAlreadyExists.Count > 0) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          message: 'Todo already exists'
        })
      }
    }

    await dynamoClient.put({
      TableName: 'todos',
      Item: {
        userId,
        title,
        deadline: new Date(deadline).toISOString(),
        done: false
      }
    }).promise();

    return {
      statusCode: 201,
      body: JSON.stringify({
        message: "To-do created successfully"
      }),
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