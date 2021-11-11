import { APIGatewayProxyHandler } from 'aws-lambda';
import { DynamoDB, ApiGatewayManagementApi } from 'aws-sdk';

import uuid from 'uuid';
import { success } from '@libs/response';
import { Virus } from './types';
import { getAllConnections } from '@libs/connections';

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

  const connections = await getAllConnections();

  await Promise.all(connections.map(async connection => {
    await sendMessageToClient(
      `https://${connection.endpoint}`,
      connection.connectionId,
      JSON.stringify({ virusId: virus.sortKey })
    );
  }));

  return success({ id: virusId });
};

const sendMessageToClient = (url: string, connectionId: string, payload: string) =>
  new Promise((resolve, reject) => {
    const apigatewaymanagementapi = new ApiGatewayManagementApi({
      endpoint: url,
    });
    apigatewaymanagementapi.postToConnection(
      {
        ConnectionId: connectionId, // connectionId of the receiving ws-client
        Data: JSON.stringify(payload),
      },
      (err, data) => {
        if (err) {
          console.log('err is', err);
          reject(err);
        }
        resolve(data);
      }
    );
  });