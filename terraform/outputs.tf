output "ecr_repository_urls" {
  value = {
    for name, repo in aws_ecr_repository.services :
    name => repo.repository_url
  }
}

output "eks_cluster_name" {
  value = module.eks.cluster_name
}