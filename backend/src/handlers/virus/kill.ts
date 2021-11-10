import { APIGatewayProxyHandler } from 'aws-lambda';
import { DynamoDB } from 'aws-sdk';

import { Virus } from './types';

import { success } from '@libs/response';

const docClient = new DynamoDB.DocumentClient();

export const main: APIGatewayProxyHandler = async (event) => {
  const id = event!.pathParameters!['id'];
  const virus: Virus = {
    partitionKey: 'Virus',
    sortKey: id,
  };

  const params = {
    TableName: 'dojo-serverless-table',
    Key: virus
  };

  await docClient.delete(params, function (err, data) {
    if (err) console.log('ERR', err);
    else console.log('DATA', data);
  }).promise();

  return success({ id: virus.sortKey });
};
