import { URL_EndPoint, VERSION } from "../config";
import { disabled, download, enabled } from "../utility/helper";

const handleCollect = (messageService: any): any => {
    disabled()
    fetch(URL_EndPoint + '/database/' + VERSION + '/collect ',
        {
            method: "POST",
            headers: {
                Accept: "*/*",
                "Access-Control-Allow-Origin": "*",
                "Content-Type": "application/json",
            },
            body: JSON.stringify({}),
        })
        .then(response => {
            return response.json()
        }).then(res => {
            let htmlElement = (document.getElementById("theia-main-content-panel") as HTMLElement);
            htmlElement.innerHTML = "";
            let data = "<tr>" +
                "<th>Name</th>" +
                "<th>Forks count</th>" +
                "<th>Star count</th>" +
                "<th>Created date</th>" +
                "<th>Updated date</th>" +
                "</tr>";
            res.result.forEach((value: any, key: string) => {
                data +=
                    "<tr>" +
                    "<td>" + value.full_name + "</td>" +
                    "<td>" + value.forks_count + "</td>" +
                    "<td>" + value.stargazers_count + "</td>" +
                    "<td>" + value.created_at + "</td>" +
                    "<td>" + value.updated_at + "</td>" +
                    "</tr>"
                    ;
            });
            let div = document.createElement('div');
            let a = document.createElement('a');
            a.innerHTML = "click";
            a.onclick = () => download(res.result);
            a.style.cursor = "pointer";
            let span = document.createElement('span');
            span.innerHTML = "To download data as json click on ";
            span.style.margin = "20px 40px";
            span.style.lineHeight = "40px";
            span.appendChild(a);
            div.innerHTML = "<table class='repository'>" + data + "</table>";
            htmlElement.appendChild(span);
            htmlElement.appendChild(div);
            if (res.status == 'OK') {
                messageService.info('Selected projects collected!');
            }else{
                messageService.error('Some error happened!');
            }
            enabled()
        })
}

const handleClone = (messageService: any): any => {
    disabled()
    fetch(URL_EndPoint + '/database/' + VERSION + '/clone',
        {
            method: "POST",
            headers: {
                Accept: "*/*",
                "Access-Control-Allow-Origin": "*",
                "Content-Type": "application/json",
            },
            body: JSON.stringify({}),
        })
        .then(response => {
            return response.json()
        })
        .then(res => {
            if (res.status == 'OK') {
                messageService.info('Repositories cloned!');
            }else{
                messageService.error('Some error happened!');
            }
            enabled()
        })
};

const handleJson = (DatasetbWidget: any, messageService: any): any => {
    disabled()
    const api_keys_libraries_io = (document.querySelector(".api_keys_libraries_io") as HTMLInputElement);
    const number_libraries = (document.querySelector(".number_libraries") as HTMLInputElement);
    const number_repository = (document.querySelector(".number_repository") as HTMLInputElement);
    const programming_langguage = (document.querySelector(".programming_langguage") as HTMLInputElement);
    const endpoint_github_repositories = (document.querySelector(".endpoint_github_repositories") as HTMLInputElement);
    const endpoint_github = (document.querySelector(".endpoint_github") as HTMLInputElement);
    const endpoint_libraries = (document.querySelector(".endpoint_libraries") as HTMLInputElement);
    const data = {
        'web_services': DatasetbWidget.state.webservices,
        'github_token': DatasetbWidget.state.githubtokens,
        'libraries_io_api_keys': api_keys_libraries_io.value,
        'liberary_number': parseInt(number_libraries.value),
        'repository_number': parseInt(number_repository.value),
        'lang': programming_langguage.value,
        'github_endpoint_repository': endpoint_github_repositories.value,
        'github_endpoint_code': endpoint_github.value,
        'libraries_endpoint': endpoint_libraries.value,
    }
    fetch(URL_EndPoint + '/database/' + VERSION + '/config',
        {
            method: "POST",
            headers: {
                Accept: "*/*",
                "Access-Control-Allow-Origin": "*",
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        })
        .then(response => {
            return response.json()
        })
        .then(res => {
            if (res.status == 'OK') {
                messageService.info('Config file saved!');
            }else{
                messageService.error('Can not save config file!');
            }
            enabled()
        })
};

export { handleCollect, handleClone, handleJson };