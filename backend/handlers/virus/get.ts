import { APIGatewayProxyHandler } from 'aws-lambda';
import { success } from '@libs/response';

export const main: APIGatewayProxyHandler = async (event) => {
  if (event?.queryStringParameters !== null && event.queryStringParameters['id'] !== null) {
    return success({
      id: event.queryStringParameters['id'],
      positionX: 50,
      positionY: 50,
      src: 5,
    });
  }

  return success([
    {
      id: 'AZERTYUIOP',
      positionX: 20,
      positionY: 20,
      src: 1,
    },
    {
      id: 'qsdfghjklm',
      positionX: 80,
      positionY: 80,
      src: 2,
    },
    {
      id: 'wxcvbn',
      positionX: 50,
      positionY: 50,
      src: 3,
    }
  ])
};
