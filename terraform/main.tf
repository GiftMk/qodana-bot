terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = ">= 6.0"
    }
  }
  required_version = ">= 1.0"
}

provider "aws" {
  region = "ap-southeast-2"
}

resource "aws_lambda_function" "qodana_bot" {
  function_name    = "qodana-bot"
  description      = "Qodana Bot: responds to GitHub issues and creates pull requests."
  handler          = "lambda.handler"
  runtime          = "nodejs24.x"
  filename         = "lambda.zip"
  source_code_hash = filebase64sha256("lambda.zip")
  role             = aws_iam_role.lambda_exec.arn

  environment {
    variables = {
      GITHUB_APP_IDENTIFIER = "2304130"
      PRIVATE_KEY_FILE      = "./qodana-setup-bot.2025-11-16.private-key.pem"
      GITHUB_WEBHOOK_SECRET = "8233863c-bbad-4c8c-80df-cfd4ffe27654"
      GITHUB_CLIENT_SECRET  = "7d3e0014c194ba8acdd6931c8f58c0710c312dbd"
    }
  }

  timeout     = 10
  memory_size = 128
}

resource "aws_lambda_function_url" "qodana_bot_url" {
  function_name      = aws_lambda_function.qodana_bot.function_name
  authorization_type = "NONE"
}

output "lambda_function_url" {
  description = "Public URL for the Lambda function"
  value       = aws_lambda_function_url.qodana_bot_url.function_url
}