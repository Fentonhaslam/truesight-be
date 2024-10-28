#!/bin/bash

# Prompt for the OpenAI API key
read -p "Enter your OpenAI API Key: " openai_key

# Check if the input is not empty
if [[ -z "$openai_key" ]]; then
  echo "The OpenAI API Key cannot be empty."
  exit 1
fi

# Specify the AWS region (change "us-east-1" to your region)
aws_region="eu-west-2"
environment="dev"

# Add the OpenAI API Key to AWS secrets manager
aws secretsmanager create-secret \
    --name "/openai-$environment/api_key" \
    --secret-string "$openai_key" \
    --region $aws_region

# Check if the command was successful
if [ $? -eq 0 ]; then
    echo "OpenAI API Key was successfully added to the AWS secrets manager."
else
    echo "Failed to add the OpenAI API Key to the AWS secrets manager."
fi