#! /bin/sh
# Copyright Monwoo 2017, service@monwoo.com, code by Miguel Monwoo

# We use the stack-name prod to mean production but any stack name can be used.
STACK_NAME=prod

# Bonus config, not working yet :
STACK_POLICY_FILE="file://$PWD/bonus/MiguelStackPolicy.json"
EMPTY_STACK_TEMPLATE="file://$PWD/bonus/EmptyStackTemplate.yml"
STACK_PARAMETERS="file://$PWD/bonus/stack-parameters.dist.json"

# http://docs.aws.amazon.com/fr_fr/AmazonS3/latest/dev/UsingBucket.html#access-bucket-intro
# http://demo.awslambda.monwoo.com.s3-us-east-1.amazonaws.com/prod2-GraphQL-4F0BWEF1N03
# http://demo.awslambda.monwoo.com.s3-us-east-1.amazonaws.com/demoBeta/

aws configure
# TODO : try with miguel2, to fine tune only needable access
# AWS Access Key ID [None]: your key ID
# AWS Secret Access Key [None]: your key access
# Default region name [None]: us-east-1
# Default output format [None]: json


# Read and transform the template, created in previous step.
# Package and upload the artifact to the S3 bucket
# and generate another template for the deployment.
# need IAM user with cloudformation access,
# check CloudWatch logs to see access errors if troubles
# check uploaded packages at :
# https://console.aws.amazon.com/s3/buckets/demo.awslambda.monwoo.com/?region=us-east-1&tab=overview#
aws cloudformation package \
   --template-file template.yaml \
   --output-template-file serverless-output.yaml \
   --s3-bucket demo.awslambda.monwoo.com

#################### => instead, use IAM user with IAMFullAccess roles
# ## NOT WORKING YET, may be need user with specific roles to do it...
# ## for now only need code in prod
# # adpat permission for the bucket (can be associated by user too if prefered)
# # better to use stack policy for quick dev tests
#
# # validate stack template
# aws cloudformation validate-template --template-body "$EMPTY_STACK_TEMPLATE"
# # create stack
# aws cloudformation create-stack --stack-name $STACK_NAME \
#   --template-body "$EMPTY_STACK_TEMPLATE" \
#   --parameters "$STACK_PARAMETERS"
#
# # list all stack and ensure our's is inside
# aws cloudformation list-stacks --region us-east-1 --output table \
#   --query '"StackSummaries[*].StackName";"StackSummaries[*].StackStatus" "StackSummaries[*].CreationTime"'
# #  --query '{name:StackSummaries[*].StackName,status:StackSummaries[*].StackStatus,date:StackSummaries[*].CreationTime}'
# #  --query '[StackSummaries[*].StackName,[StackSummaries[*].StackStatus,[StackSummaries[*].CreationTime' \
# #  --stack-status-filter 'CREATE_COMPLETE'
#
# # validate and update stack policy to Amazon (you can use --debug to see http debugs...)
# aws cloudformation set-stack-policy --stack-name $STACK_NAME --stack-policy-body "$STACK_POLICY_FILE"
#
# # ensure our policy have been updated :
# aws cloudformation get-stack-policy --stack-name $STACK_NAME
####################

# create the Lambda Function and API Gateway for GraphQL.
aws cloudformation deploy \
   --template-file serverless-output.yaml \
   --stack-name $STACK_NAME \
   --capabilities CAPABILITY_IAM

# list all available lambda function
aws lambda list-functions

# configure the test acordingly to generated function name
LAMBDA_TEST_FUNCTION_NAME=prod-GraphQL-96TD40MRFT5Z
LAMBDA_TEST_PAYLOAD='{"key1":"value1", "key2":"value2", "key3":"value3"}'

# test the lambda function :
aws lambda invoke \
--invocation-type RequestResponse \
--function-name "$LAMBDA_TEST_FUNCTION_NAME" \
--region us-east-1 \
--log-type Tail \
--payload "$LAMBDA_TEST_PAYLOAD" \
outputfile.txt && cat outputfile.txt

# access the lambda function via get :
# => go in Amazon console => API Gateway service
# => you should see lambda api ready to deploy on the uploaded package
# checking in get :
# https://ghcekje7sa.execute-api.us-east-1.amazonaws.com/demoBeta/graphql
# transform the stack in api ready for frontend :
# https://console.aws.amazon.com/apigateway/home?region=us-east-1#/apis

# liste errors : CloudWatch
# https://console.aws.amazon.com/cloudwatch/home?region=us-east-1#logs:

# Checking for uploaded packages :
# https://console.aws.amazon.com/s3/buckets/demo.awslambda.monwoo.com/?region=us-east-1&tab=overview#

# Checking for get acces in API builder => direclty launch test from Ressource
# https://console.aws.amazon.com/apigateway/home?region=us-east-1#/apis/ghcekje7sa/resources/gnu4zv/methods/GET

# Checking for available lambda :
# https://console.aws.amazon.com/lambda/home?region=us-east-1#/functions

# Checking for available stacks :
# https://console.aws.amazon.com/cloudformation/home?region=us-east-1#/stacks?filter=active
