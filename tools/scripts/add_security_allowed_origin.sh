#!/bin/bash

# Prompt for the Security Allowed Origin
read -p "Enter your Security Allowed Origin: " allowed_origin

# Check if the input is not empty
if [[ -z "$allowed_origin" ]]; then
  echo "The Security Allowed Origin cannot be empty."
  exit 1
fi

# Specify the AWS region (change "us-east-1" to your region)
aws_region="eu-west-2"
environment="dev"

# Add the Security Allowed Origin to AWS Systems Manager Parameter Store
aws ssm put-parameter \
    --name "/security-$environment/allowed_origin" \
    --value "$allowed_origin" \
    --type "String" \
    --overwrite \
    --description "Security Allowed Origin for CSRF security" \
    --region $aws_region

# Check if the command was successful
if [ $? -eq 0 ]; then
    echo "Security Allowed Origin was successfully added to the AWS SSM Parameter Store."
else
    echo "Failed to add the Security Allowed Origin to the AWS SSM Parameter Store."
fi