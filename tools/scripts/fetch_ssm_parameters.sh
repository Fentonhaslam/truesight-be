#!/bin/bash

# Output file to store parameters
output_file="ssm_parameters.json"

# Function to fetch and save all SSM parameters
fetch_ssm_parameters() {
    local next_token=""
    echo "[" > $output_file
    first_record=true

    while : ; do
        if [ -z "$next_token" ]; then
            response=$(aws ssm describe-parameters --output json)
        else
            response=$(aws ssm describe-parameters --output json --starting-token "$next_token")
        fi

        if [ $? -ne 0 ]; then
            echo "Error fetching parameters"
            exit 1
        fi

        parameters=$(echo "$response" | jq -c '.Parameters[]')

        for param in $parameters; do
            param_name=$(echo $param | jq -r '.Name')

            if [ -n "$param_name" ]; then
                param_details=$(aws ssm get-parameter --name "$param_name" --with-decryption --output json | jq '.Parameter')

                if [ $? -ne 0 ]; then
                    echo "Error fetching parameter details for $param_name"
                    exit 1
                fi

                if [ "$first_record" = true ]; then
                    first_record=false
                else
                    echo "," >> $output_file
                fi

                echo $param_details >> $output_file
            fi
        done

        next_token=$(echo "$response" | jq -r '.NextToken')

        if [ "$next_token" == "null" ]; then
            break
        fi
    done

    echo "]" >> $output_file
}

# Run the function
fetch_ssm_parameters
