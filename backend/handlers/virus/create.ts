import { APIGatewayProxyHandler } from 'aws-lambda';
import { success } from '@libs/response';

export const main: APIGatewayProxyHandler = async () => {
  return success({});
};
