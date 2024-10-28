# Define the parameters to prompt for
params=("smtp_host" "smtp_port" "smtp_user" "smtp_pass" "smtp_from")

# Loop through each parameter, prompt the user, and validate the input
for param in "${params[@]}"; do
  read -p "Enter your ${param//_/ }: " value

  if [[ -z "$value" ]]; then
    echo "The ${param//_/ } cannot be empty."
    exit 1
  fi

  # Store the input in a variable with the same name as the key
  declare $param="$value"
done

# Specify the AWS region (change "eu-west-2" to your region)
aws_region="eu-west-2"
environment="dev"

# Loop through each parameter and add it to the AWS Systems Manager Parameter Store
for param in "${params[@]}"; do
  aws ssm put-parameter \
      --name "/email-$environment/$param" \
      --value "${!param}" \
      --type "String" \
      --overwrite \
      --region $aws_region

  if [ $? -eq 0 ]; then
      echo "$param was successfully added to the AWS SSM Parameter Store."
  else
      echo "Failed to add $param to the AWS SSM Parameter Store."
  fi
done