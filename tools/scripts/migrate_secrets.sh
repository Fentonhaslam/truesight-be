#!/bin/bash

# Specify the AWS region (change "eu-west-2" to your region)
aws_region="eu-west-2"
environment="dev"

migrate_params=(
  "/supabase-$environment/secret_key"
  "/openai-$environment/api_key"
  "/security-$environment/turnstile_secret_key"
  "/security-$environment/github_token"
  "/email-$environment/smtp_pass"
)

for param in "${migrate_params[@]}"
do
  # get keys from aws parameter store
  value=$(aws ssm get-parameter --name $param --region $aws_region --query Parameter.Value --output text)
  if [ $? -ne 0 ]; then
    echo "Failed to get the $param from the AWS SSM Parameter Store."
    continue
  fi
  # add keys to secrets manager
  aws secretsmanager create-secret --name $param --secret-string $value --region $aws_region
  if [ $? -ne 0 ]; then
    echo "Failed to add the $param to the AWS Secrets Manager."
    continue
  fi
  # delete keys from parameter store
  aws ssm delete-parameter --name $param --region $aws_region
  if [ $? -ne 0 ]; then
    echo "Failed to delete the $param from the AWS SSM Parameter Store."
    continue
  fi
done