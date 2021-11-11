// @ts-nocheck
import { DynamoDBStreamEvent } from 'aws-lambda';
import { Converter } from 'aws-sdk/clients/dynamodb';
import { getAllConnections } from '@libs/connections';
import { sendMessageToConnection } from '@libs/websocket';
import { Item } from '@libs/types';
import { Virus } from '../virus/types';

const sendMessageToEachConnection = async (message: any): Promise<void> => {
    // TODO use sendMessageToConnection for each connection
};

const isVirus = (item: Item): item is Virus => item.partitionKey === 'Virus';

export const main = async (event: DynamoDBStreamEvent): Promise<void> => {
    // TODO for each record, if it's an insertion of virus, sendMessageToEachConnection
    console.log(event);
    // const domain = event.requestContext.domainName;
    // const stage = event.requestContext.stage;
    // const connectionId = event.requestContext.connectionId;
    // const callbackUrlForAWS = util.format(util.format('https://%s/%s', domain, stage)); //construct the needed url
    // await sendMessageToClient(callbackUrlForAWS, connectionId, event);

    return {
        statusCode: 200,
    };
};
