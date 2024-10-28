#!/bin/bash

# Prompt for the Supabase URL
read -p "Enter your Supabase URL: " supabase_url

# Check if the Supabase URL is not empty
if [[ -z "$supabase_url" ]]; then
  echo "The Supabase URL cannot be empty."
  exit 1
fi

# Prompt for the Supabase Key
read -p "Enter your Supabase service role secret key: " supabase_key

# Check if the Supabase Key is not empty
if [[ -z "$supabase_key" ]]; then
  echo "The Supabase Key cannot be empty."
  exit 1
fi

# Prompt for the Supabase Key
read -p "Enter your Supabase public anon key: " supabase_public_anon_key

# Check if the Supabase Key is not empty
if [[ -z "$supabase_key" ]]; then
  echo "The Supabase Public Anon Key cannot be empty."
  exit 1
fi

# Specify the AWS region (change "eu-west-2" to your region)
aws_region="eu-west-2"
environment="dev"

# Add the Supabase URL to AWS Systems Manager Parameter Store
aws ssm put-parameter \
    --name "/supabase-$environment/url" \
    --value "$supabase_url" \
    --type "String" \
    --overwrite \
    --description "Supabase URL for accessing Supabase database" \
    --region $aws_region

# Check if adding the Supabase URL was successful
if [ $? -ne 0 ]; then
    echo "Failed to add the Supabase URL to the AWS SSM Parameter Store."
    exit 1
fi

# Add the Supabase Key to AWS secrets manager
aws secretsmanager create-secret \
    --name "/supabase-$environment/secret_key" \
    --secret-string "$supabase_key" \
    --region $aws_region

# Check if adding the Supabase secret key was successful
if [ $? -ne 0 ]; then
    echo "Failed to add the Supabase secret key to the AWS secrets manager."
    exit 1
fi

# Add the Supabase Public Anon Key to AWS Systems Manager Parameter Store
aws ssm put-parameter \
    --name "/supabase-$environment/public_anon_key" \
    --value "$supabase_public_anon_key" \
    --type "String" \
    --overwrite \
    --description "Supabase public anon key for public access" \
    --region $aws_region

# Check if adding the Supabase Key was successful
if [ $? -eq 0 ]; then
    echo "Supabase URL and Key were successfully added to the AWS SSM Parameter Store."
else
    echo "Failed to add the Supabase Key to the AWS SSM Parameter Store."
fi