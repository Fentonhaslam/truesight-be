# How to Start Backend Environment

## Setup Instructions

Follow these steps to set up and synchronize your backend environment effectively.

### Step 1: Install & Configure AWS components

- Install the AWS CLI & AWS SAM CLI
- Ensure you have created a CLI IAM user with admin rights
- Create an access key for the IAM user
  ```
  aws configure
      ^ Provide access key & secret access key
  ```

### Step 2: Install Global Dependencies

- Install esbuild globally via npm: `npm install -g esbuild`
- Install make e.g. on windows: `choco install make`

### Step 3: Install Node Modules

- `npm install`

### Step 4: Run SAM sync

- `sam sync --stack-name dev-truesight-service --watch --parameter-overrides ParameterKey=Stage,ParameterValue=dev ParameterKey=AssistantHash,ParameterValue=$(git hash-object functions/utils/assistant-initializer-handler.ts)$(git hash-object layer/utils/assistants.ts) --region eu-west-2 --build-in-source`

## What This Does

This setup will:

- Automatically sync your code changes to the development stack as soon as you save them, allowing for continuous integration.
- Display the API endpoint and s3 bucket in the output upon successful deployment, which you can use to access your backend services.
- Ensure you have the AWS SAM CLI installed and configured correctly to use these commands. For more information on setup and troubleshooting, refer to the official AWS SAM documentation.
