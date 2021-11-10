import { APIGatewayProxyHandler } from 'aws-lambda';
import { DynamoDB } from 'aws-sdk';

import { success } from '@libs/response';
import { Virus } from './types';

const docClient = new DynamoDB.DocumentClient();

export const main: APIGatewayProxyHandler = async () => {
  const params = {
    TableName: 'dojo-serverless-table',
    KeyConditionExpression: 'partitionKey = :pKey',
    ExpressionAttributeValues: {
      ':pKey': 'Virus'
    }
  };

  const viruses = await docClient.query(params, function (err, data) {
    if (err) console.log(err);
    else console.log(data);
  }).promise();

  return success({
    viruses: (viruses.Items as Virus[]).map(({ sortKey }) => ({ id: sortKey })),
  });
};
