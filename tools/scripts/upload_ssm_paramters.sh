#!/bin/bash

# Input file with parameters
input_file="ssm_parameters.json"

# Function to upload parameters to destination AWS account
upload_ssm_parameters() {
    parameters=$(cat $input_file | jq -c '.[]')

    for param in $parameters; do
        name=$(echo $param | jq -r '.Name')
        value=$(echo $param | jq -r '.Value')
        type=$(echo $param | jq -r '.Type')
        key_id=$(echo $param | jq -r '.KeyId // empty')

        if [ -n "$name" ] && [ -n "$value" ] && [ -n "$type" ]; then
            if [ "$type" == "SecureString" ]; then
                aws ssm put-parameter --name "$name" --value "$value" --type "$type" --key-id "$key_id" --overwrite
            else
                aws ssm put-parameter --name "$name" --value "$value" --type "$type" --overwrite
            fi
        fi
    done
}

# Run the function
upload_ssm_parameters