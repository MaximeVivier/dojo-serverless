import * as AwsConfig from 'serverless/aws';

import ApiGatewayErrors from './resources/apiGatewayErrors';
import DojoServerlessTable from './resources/dynamodb';

const serverlessConfiguration: AwsConfig.Serverless = {
  service: 'dojo-serverless-backend',
  frameworkVersion: '>=1.83',
  plugins: ['serverless-webpack'],
  // @ts-ignore
  configValidationMode: 'error',
  provider: {
    name: 'aws',
    runtime: 'nodejs14.x',
    region: 'eu-west-1',
    stage: 'dev',
    profile: 'dojo-serverless',
    iamRoleStatements: [
      {
        Effect: 'Allow',
        Action: [
          'dynamodb:Query',
          'dynamodb:PutItem',
          'dynamodb:DeleteItem',
          'dynamodb:ListStreams',
        ],
        Resource: { 'Fn::GetAtt': ['DojoServerlessTable', 'Arn'] },
      },
    ],
    usagePlan: {
      quota: {
        limit: 5000,
        offset: 2,
        period: 'MONTH',
      },
      throttle: {
        burstLimit: 200,
        rateLimit: 100,
      },
    },
  },
  functions: {
    hello: {
      handler: 'hello.main',
      events: [
        {
          http: {
            method: 'get',
            path: 'hello',
            cors: true,
          },
        },
      ],
    },
    createVirus: {
      handler: 'src/handlers/virus/create.main',
      events: [
        {
          http: {
            method: 'post',
            path: 'virus',
            cors: true,
          },
        },
        {
          schedule: {
            rate: 'rate(1 minute)'
          }
        },
      ],
    },
    getVirus: {
      handler: 'src/handlers/virus/get.main',
      events: [
        {
          http: {
            method: 'get',
            path: 'virus',
            cors: true,
          },
        },
      ],
    },
    killVirus: {
      handler: 'src/handlers/virus/kill.main',
      events: [
        {
          http: {
            method: 'delete',
            path: 'virus/{id}',
            cors: true,
          },
        },
      ],
    },
    connectHandler: {
      handler: 'src/handlers/real-time/connect.main',
      events: [
        {
          websocket: {
            route: '$connect'
          },
        },
      ],
    },
    disconnectHandler: {
      handler: 'src/handlers/real-time/disconnect.main',
      events: [
        {
          websocket: {
            route: '$disconnect'
          },
        },
      ],
    },
    sendMessageToClient: {
      handler: 'src/handlers/real-time/sendMessageToClient.main',
      events: [
        {
          stream: {
            // @ts-ignore
            type: 'dynamodb',
            // @ts-ignore
            arn: { 'Fn::GetAtt': ['DojoServerlessTable', 'StreamArn'] },
          },
        },
      ],
    },
  },
  resources: {
    Resources: {
      ...ApiGatewayErrors,
      DojoServerlessTable,
    },
  },
};

module.exports = serverlessConfiguration;
