locals {
  services = [
    "api-gateway",
    "auth-service",
    "course-catalog-service",
    "enrollment-service",
    "notification-service"
  ]
}

resource "aws_ecr_repository" "services" {
  for_each = toset(local.services)

  name                 = each.value
  image_tag_mutability = "MUTABLE"

  image_scanning_configuration {
    scan_on_push = true
  }

  tags = {
    Project = var.project_name
  }
}