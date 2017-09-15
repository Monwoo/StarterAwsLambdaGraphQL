#! /bin/sh

# Read and transform the template, created in previous step. Package and upload the artifact to the S3 bucket and generate another template for the deployment.
aws cloudformation package \
   --template-file template.yaml \
   --output-template-file serverless-output.yaml \
   --s3-bucket demo.awslambda.monwoo.com

# create the Lambda Function and API Gateway for GraphQL. We use the stack-name prod to mean production but any stack name can be used.
aws cloudformation deploy \
   --template-file serverless-output.yaml \
   --stack-name prod \
   --capabilities CAPABILITY_IAM
