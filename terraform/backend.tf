terraform {
  backend "s3" {
    bucket  = "parak-mini-lms-tf-state-2026"
    key     = "mini-lms/terraform.tfstate"
    region  = "us-east-1"
    encrypt = true
  }
}