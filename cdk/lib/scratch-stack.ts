import * as cdk from 'aws-cdk-lib';
import { RemovalPolicy } from 'aws-cdk-lib';
import { LambdaRestApi } from 'aws-cdk-lib/aws-apigateway';
import { AttributeType, BillingMode, Table } from 'aws-cdk-lib/aws-dynamodb';
import { Code, Function, Runtime } from 'aws-cdk-lib/aws-lambda';
import { Construct } from 'constructs';


export class ScratchStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

      const table = new Table(this,'dynamo-table',{
        billingMode: BillingMode.PAY_PER_REQUEST,
        removalPolicy: RemovalPolicy.DESTROY,
        partitionKey: {
          name: "alias",
          type: AttributeType.STRING
        },
      })

      const lambda = new Function(this, "lambda",
      {
        runtime: Runtime.NODEJS_16_X,
        handler: 'lambda.handler',
        code: Code.fromAsset("../vanilla-express"),
        environment: {
          'TABLE_NAME' : table.tableName
        }
      })

      table.grantReadWriteData(lambda)

      new LambdaRestApi(this, 'api', {
        handler: lambda
      })
   }
}

