import * as cdk from 'aws-cdk-lib';
import { RemovalPolicy, SecretValue } from 'aws-cdk-lib';
import { RestApi } from 'aws-cdk-lib/aws-apigateway';
import { Distribution } from 'aws-cdk-lib/aws-cloudfront';
import { S3Origin } from 'aws-cdk-lib/aws-cloudfront-origins';
import { AttributeType, BillingMode, Table } from 'aws-cdk-lib/aws-dynamodb';
import { ManagedPolicy, Policy, User } from 'aws-cdk-lib/aws-iam';
import { Code, Function, Runtime } from 'aws-cdk-lib/aws-lambda';
import { Bucket } from 'aws-cdk-lib/aws-s3';
import { Construct } from 'constructs';


export class ScratchStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
    
      const lambda = new Function(this, "lambda",
      {
        runtime: Runtime.NODEJS_16_X,
        handler: 'lamba.handler',
        code: Code.fromAsset("../vanilla-express")
      })

      const table = new Table(this,'dynamo-table',{
        billingMode: BillingMode.PAY_PER_REQUEST,
        removalPolicy: RemovalPolicy.DESTROY,
        partitionKey: {
          name: "alias",
          type: AttributeType.STRING
        },
      })
      table.grantReadWriteData(lambda)

      const api = new RestApi(this, 'api', {
        
      })
   }
}

