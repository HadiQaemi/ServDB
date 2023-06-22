import { URL_EndPoint, VERSION } from "../config";
import { disabled, download, enabled } from "../utility/helper";

const handleSaveEndpoint = (endpoints: any, messageService: any): any => {
    const data = {
        'endpoints': endpoints,
    }
    disabled()
    fetch(URL_EndPoint + '/endpoint/' + VERSION + '/config',
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
        }).then(res => {
            if (res.status == 'OK') {
                messageService.info('Config file saved!');
            }else{
                messageService.error('Some error happened!');
            }
            enabled()
        })
};

const handleCollectEndpoint = (messageService: any): any => {
    disabled()
    fetch(URL_EndPoint + '/endpoint/' + VERSION + '/collect',
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
                "<th>full_name</th>" +
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
                messageService.info('Based on endpoints in config file repositories collected!');
            }else{
                messageService.error('Some error happened!');
            }
            enabled()
        })
};

const handleCloneEndpoint = (messageService: any): any => {
    disabled()
    fetch(URL_EndPoint + '/endpoint/' + VERSION + '/clone',
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
            return response.json();
        }).then(res => {
            if (res.status == 'OK') {
                messageService.info('Collected repositories cloned!');
            }else{
                messageService.error('Some error happened!');
            }
            enabled()
        })
};
export { handleSaveEndpoint, handleCollectEndpoint, handleCloneEndpoint };