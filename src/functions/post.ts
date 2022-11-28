import { APIGatewayProxyHandler } from "aws-lambda";


export const handler: APIGatewayProxyHandler = async (event, _context) => {
  const { userId } = event.pathParameters;
  return {
    statusCode: 200,
    body: JSON.stringify({
      message: "Hello World",
      userId,
    }),
  };
}