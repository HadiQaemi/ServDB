def data_maker(repository, readme, cleared_text, item, service):
    repository_data = {
        "repository_name": repository["name"],
        "default_branch": repository["default_branch"],
        "readme_original": readme.text,
        "readme_cleared": cleared_text,
        "readme_summarized": "",
        "keywords": "",
        "html_url": item["html_url"],
        "clone_url": repository["clone_url"],
        "created_at": repository["created_at"],
        "updated_at": repository["updated_at"],
        "size": repository["size"],
        "stargazers_count": repository["stargazers_count"],
        "watchers_count": repository["watchers_count"],
        "has_issues": repository["has_issues"],
        "has_projects": repository["has_projects"],
        "has_downloads": repository["has_downloads"],
        "has_wiki": repository["has_wiki"],
        "has_pages": repository["has_pages"],
        "has_discussions": repository["has_discussions"],
        "forks_count": repository["forks_count"],
        "mirror_url": repository["mirror_url"],
        "archived": repository["archived"],
        "disabled": repository["disabled"],
        "open_issues_count": repository["open_issues_count"],
        "network_count": repository["network_count"],
        "subscribers_count": repository["subscribers_count"],
        "webservice": service,
        "description": repository["description"],
    }
    return repository_data


def data_maker_full(
    item,
    repository,
    readme,
    cleared_text,
    source_repository,
    name,
    repositories,
    repository_count,
    service,
):
    repository_data = {
        "full_name": item["full_name"],
        "repository_name": repository["name"],
        "default_branch": repository["default_branch"],
        "readme_original": readme.text,
        "readme_cleared": cleared_text,
        "readme_summarized": "",
        "keywords": "",
        "html_url": item["html_url"],
        "sha": source_repository["sha"],
        "library": name[0],
        "total_count": repositories["total_count"],
        "repository_count": repository_count,
        "url": source_repository["repository"]["url"],
        "clone_url": repository["clone_url"],
        "created_at": repository["created_at"],
        "updated_at": repository["updated_at"],
        "size": repository["size"],
        "stargazers_count": repository["stargazers_count"],
        "watchers_count": repository["watchers_count"],
        "has_issues": repository["has_issues"],
        "has_projects": repository["has_projects"],
        "has_downloads": repository["has_downloads"],
        "has_wiki": repository["has_wiki"],
        "has_pages": repository["has_pages"],
        "has_discussions": repository["has_discussions"],
        "forks_count": repository["forks_count"],
        "mirror_url": repository["mirror_url"],
        "archived": repository["archived"],
        "disabled": repository["disabled"],
        "open_issues_count": repository["open_issues_count"],
        "network_count": repository["network_count"],
        "subscribers_count": repository["subscribers_count"],
        "webservice": service,
        "description": repository["description"],
    }
    return repository_data


def clean_address(service):
    clean_service = service.replace("https:", "").replace("//", "").replace(".", "").replace("/", "_")
    return (
        str(clean_service)
    )
