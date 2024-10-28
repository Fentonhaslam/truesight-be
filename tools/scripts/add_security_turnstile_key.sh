#!/bin/bash

# Prompt for the Cloudflare Turnstile Key
read -p "Enter your Cloudflare Turnstile Key: " turnstile_key

# Check if the input is not empty
if [[ -z "$turnstile_key" ]]; then
  echo "The Cloudflare Turnstile Key cannot be empty."
  exit 1
fi

# Specify the AWS region (change "us-east-1" to your region)
aws_region="eu-west-2"
environment="dev"

# Add the Security Turnstile Key to secrets manager
aws secretsmanager create-secret \
    --name "/security-$environment/turnstile_secret_key" \
    --secret-string "$turnstile_key" \
    --region $aws_region

# Check if the command was successful
if [ $? -eq 0 ]; then
    echo "Cloudflare Turnstile Key was successfully added to secrets manager."
else
    echo "Failed to add the Cloudflare Turnstile Key to secrets manager."
fi