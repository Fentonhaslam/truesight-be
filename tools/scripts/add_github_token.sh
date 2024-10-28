#!/bin/bash

# Prompt for the Github Token
read -p "Enter your Github Token: " github_token

# Check if the input is not empty
if [[ -z "$github_token" ]]; then
  echo "The Github Token cannot be empty."
  exit 1
fi

# Specify the AWS region (change "us-east-1" to your region)
aws_region="eu-west-2"
environment="dev"

# Add the Github Token to AWS secrets manager
aws secretsmanager create-secret \
    --name "/security-$environment/github_token" \
    --secret-string "$github_token" \
    --region $aws_region

# Check if the command was successful
if [ $? -eq 0 ]; then
    echo "Github Token was successfully added to the AWS secrets manager."
else
    echo "Failed to add the Github Token to the AWS secrets manager."
fi