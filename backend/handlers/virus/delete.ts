import { APIGatewayProxyHandler } from 'aws-lambda';
import { success } from '@libs/response';

export const main: APIGatewayProxyHandler = async (event) => {
  const id = event!.pathParameters!['id'];
  console.log(`deleting id : ${id}`)
  return success({});
};
