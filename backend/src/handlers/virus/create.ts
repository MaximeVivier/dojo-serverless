import { APIGatewayProxyHandler } from 'aws-lambda';

import uuid from 'uuid';
import { success } from '@libs/response';
import { Virus } from './types';
import { DynamoDB } from 'aws-sdk';

const documentClient = new DynamoDB.DocumentClient();

export const main: APIGatewayProxyHandler = async () => {
  const virusId = uuid();

  const virus: Virus = { partitionKey: 'Virus', sortKey: virusId };

  await documentClient
    .put({
      TableName: 'dojo-serverless-table',
      Item: virus,
    })
    .promise();

  return success({ id: virusId });
};