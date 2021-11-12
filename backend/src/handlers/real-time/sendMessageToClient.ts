// @ts-nocheck
import { DynamoDBStreamEvent } from 'aws-lambda';
import DynamoDB, { Converter } from 'aws-sdk/clients/dynamodb';
import { getAllConnections } from '@libs/connections';
import { sendMessageToConnection } from '@libs/websocket';
import { Item } from '@libs/types';
import { Virus } from '../virus/types';

const sendMessageToEachConnection = async (message: any): Promise<void> => {
    // TODO use sendMessageToConnection for each connection
    const connections = await getAllConnections();

    await Promise.all(connections.map(async connection => {
        await sendMessageToConnection({
            connectionId: connection.connectionId,
            endpoint: `https://${connection.endpoint}`,
            message
        });
    }));
};

const isVirus = (item: Item): item is Virus => item.partitionKey === 'Virus';

export const main = async (event: DynamoDBStreamEvent): Promise<void> => {
    // TODO for each record, if it's an insertion of virus, sendMessageToEachConnection
    await Promise.all(event.Records.map(async record => {
        const image = DynamoDB.Converter.unmarshall(record.dynamodb?.NewImage || record.dynamodb?.OldImage);
        if (isVirus(image)) {
            await sendMessageToEachConnection(JSON.stringify({ virusId: image.sortKey, action: record.eventName }));
        }
    }));

    return {
        statusCode: 200,
    };
};
