import * as cdk from 'aws-cdk-lib';
import { RemovalPolicy, SecretValue } from 'aws-cdk-lib';
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
    
    const numUsers = 5;
    for(var i = 0; i <numUsers; i++) {
      const user = new User(this, 'dev-' + i, { 
        password: SecretValue.unsafePlainText('Ekerum-ServerlessLab-2022-' + i),
        passwordResetRequired: false,
        userName: 'dev-' + i,
      });

      var bucket = new Bucket(this, 'bucket-' + i, {
        removalPolicy: RemovalPolicy.DESTROY,
        bucketName: 'shorty-serverless-ekerum-' + i
      })
      bucket.grantReadWrite(user)
      

      const lambda = new Function(this, "lambda-" + i,
      {
        runtime: Runtime.NODEJS_16_X,
        functionName: 'shorty-' + i,
        handler: 'index.handler',
        code: Code.fromInline('//todo: Add your event handler here'),
  
      })

      var table = new Table(this,'table-' + i,{
        billingMode: BillingMode.PAY_PER_REQUEST,
        tableName: 'Shorty-' + i,
        removalPolicy: RemovalPolicy.DESTROY,
        partitionKey: {
          name: "Alias",
          type: AttributeType.STRING
        },
      })
      table.grantFullAccess(user)
      table.grantFullAccess(lambda)

      const cloudfrontDistro = new Distribution(this, 'Shorty-' + i, {
        defaultBehavior: {
          origin: new S3Origin(bucket)
        }
      })
      user.addManagedPolicy(ManagedPolicy.fromAwsManagedPolicyName('AmazonDynamoDBFullAccess'))
      user.addManagedPolicy(ManagedPolicy.fromAwsManagedPolicyName('AmazonS3FullAccess'))
      user.addManagedPolicy(ManagedPolicy.fromAwsManagedPolicyName('AmazonAPIGatewayAdministrator'))
      user.addManagedPolicy(ManagedPolicy.fromAwsManagedPolicyName('CloudFrontFullAccess'))
      user.addManagedPolicy(ManagedPolicy.fromAwsManagedPolicyName('AWSLambda_FullAccess'))
   }
  }
}
