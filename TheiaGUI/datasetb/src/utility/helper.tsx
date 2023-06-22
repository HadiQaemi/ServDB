import { renderToStaticMarkup } from "react-dom/server";

const download = (myData: any) => {
    // create file in browser
    const fileName = "my-file";
    const json = JSON.stringify(myData, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const href = URL.createObjectURL(blob);

    // create "a" HTLM element with href to file
    const link = document.createElement("a");
    link.href = href;
    link.download = fileName + ".json";
    document.body.appendChild(link);
    link.click();

    // clean up "a" element & remove ObjectURL
    document.body.removeChild(link);
    URL.revokeObjectURL(href);
}

const addWebServices = (): any => {
    const rndInt = Math.floor(Math.random() * 10000) + 1;
    const web_services_list = (document.getElementById("web_services_list") as HTMLInputElement);
    const web_service = (document.getElementById("web_service") as HTMLInputElement);

    const input = document.createElement('input');
    input.type = "hidden";
    input.value = web_service.value;
    input.name = "webservices[]";

    const spanRemove = document.createElement('span');
    spanRemove.innerHTML = "X";
    spanRemove.onclick = function () {
        const selected_web_service = (document.getElementById(`${rndInt}`) as HTMLInputElement);
        selected_web_service.remove();
    }
    spanRemove.style.color = '#fb8080';
    spanRemove.style.cursor = 'pointer';
    spanRemove.style.margin = '0px 5px';
    spanRemove.style.fontSize = '15px';

    const spanParent = document.createElement('span');
    spanParent.id = `${rndInt}`;
    spanParent.style.border = '1px solid #bbb';
    spanParent.style.borderRadius = '5px';
    spanParent.style.padding = '5px';
    spanParent.style.display = 'inline-table';
    spanParent.className = 'webservice-item';
    spanParent.innerHTML = web_service.value;
    spanParent.append(input);
    spanParent.append(spanRemove);
    web_services_list.appendChild(spanParent);
    return web_service.value
}

const addGithub = (): any => {
    const rndInt = Math.floor(Math.random() * 10000) + 1;
    const github_list = (document.getElementById("github_list") as HTMLInputElement);
    const github = (document.getElementById("github") as HTMLInputElement);

    const input = document.createElement('input');
    input.type = "hidden";
    input.value = github.value;
    input.name = "github[]";

    const spanRemove = document.createElement('span');
    spanRemove.innerHTML = "X";
    spanRemove.onclick = function () {
        const selected_github = (document.getElementById(`github_${rndInt}`) as HTMLInputElement);
        selected_github.remove();
    }
    spanRemove.style.color = '#fb8080';
    spanRemove.style.cursor = 'pointer';
    spanRemove.style.margin = '0px 5px';
    spanRemove.style.fontSize = '15px';

    const spanParent = document.createElement('span');
    spanParent.id = `github_${rndInt}`;
    spanParent.style.border = '1px solid #bbb';
    spanParent.style.borderRadius = '5px';
    spanParent.style.padding = '5px';
    spanParent.style.display = 'inline-table';
    spanParent.className = 'github-item';
    spanParent.innerHTML = github.value;
    spanParent.append(input);
    spanParent.append(spanRemove);
    github_list.appendChild(spanParent);
    return github.value
};

const displayMenuItems = (menuItem: any, DiaplayWidgetDesc: any) => {
    var tab_ids = ["ServDb_config", "templates_functionality", "endpoint_based", "summarizer_keyword_extractor", "preprocessor"]
    // Get all elements with class="tabcontent" and hide them
    if (menuItem == "ServDb_config") {
        for (let j = 0; j < tab_ids.length; j++) {
            (document.getElementById(tab_ids[j]) as HTMLElement).style.display = "none";
        }
        (document.getElementById("theia-main-content-panel") as HTMLElement).innerHTML = renderToStaticMarkup(DiaplayWidgetDesc("ServDb_config"));
    } else if (menuItem == "templates_functionality") {
        for (let j = 0; j < tab_ids.length; j++) {
            (document.getElementById(tab_ids[j]) as HTMLElement).style.display = "none";
        }
        (document.getElementById("theia-main-content-panel") as HTMLElement).innerHTML = renderToStaticMarkup(DiaplayWidgetDesc("templates_functionality"));
    } else if (menuItem == "summarizer_keyword_extractor") {
        for (let j = 0; j < tab_ids.length; j++) {
            (document.getElementById(tab_ids[j]) as HTMLElement).style.display = "none";
        }
        (document.getElementById("theia-main-content-panel") as HTMLElement).innerHTML = renderToStaticMarkup(DiaplayWidgetDesc("summarizer_keyword_extractor"));
    } else if (menuItem == "preprocessor") {
        for (let j = 0; j < tab_ids.length; j++) {
            (document.getElementById(tab_ids[j]) as HTMLElement).style.display = "none";
        }
        (document.getElementById("theia-main-content-panel") as HTMLElement).innerHTML = renderToStaticMarkup(DiaplayWidgetDesc("preprocessor"));
    } else if (menuItem == "endpoint_based") {
        for (let j = 0; j < tab_ids.length; j++) {
            (document.getElementById(tab_ids[j]) as HTMLElement).style.display = "none";
        }
        (document.getElementById("theia-main-content-panel") as HTMLElement).innerHTML = renderToStaticMarkup(DiaplayWidgetDesc("endpoint_based"));
    }
    const tablinks = document.getElementsByClassName("tablinks");
    for (let i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace("tablinks first", "tablinks");
        if (tablinks[i].getAttribute("value") == menuItem) {
            tablinks[i].className = tablinks[i].className.replace("tablinks", "tablinks active");
        } else {
            tablinks[i].className = tablinks[i].className.replace("tablinks active", "tablinks");
        }
    }

    // Show the current tab, and add an "active" class to the button that opened the tab
    (document.getElementById(menuItem) as HTMLElement).style.display = "block";
}
const handleEndpoint = () => {
    const rndInt = Math.floor(Math.random() * 10000) + 1;
    const endpoint_based_list = (document.getElementById("endpoint_based_list") as HTMLInputElement);
    const endpoint = (document.getElementById("endpoint") as HTMLInputElement);

    const input = document.createElement('input');
    input.type = "hidden";
    input.value = endpoint.value;
    input.name = "endpoints[]";

    const spanRemove = document.createElement('span');
    spanRemove.innerHTML = "X";
    spanRemove.onclick = function () {
        const selected_endpoint = (document.getElementById(`${rndInt}`) as HTMLInputElement);
        selected_endpoint.remove();
    }
    spanRemove.style.color = '#fb8080';
    spanRemove.style.cursor = 'pointer';
    spanRemove.style.margin = '0px 5px';
    spanRemove.style.fontSize = '15px';

    const spanParent = document.createElement('span');
    spanParent.id = `${rndInt}`;
    spanParent.style.border = '1px solid #bbb';
    spanParent.style.borderRadius = '5px';
    spanParent.style.padding = '5px';
    spanParent.style.display = 'inline-table';
    spanParent.className = 'webservice-item';
    spanParent.innerHTML = endpoint.value;
    spanParent.append(input);
    spanParent.append(spanRemove);
    endpoint_based_list.appendChild(spanParent);
    return endpoint.value
};
const disabled = () => {
    document.querySelectorAll<HTMLButtonElement>('#widget-container button').forEach(element => {
        element.disabled = true
    });
};
const enabled = () => {
    document.querySelectorAll<HTMLButtonElement>('#widget-container button').forEach(element => {
        element.disabled = false
    });
};

export { download, addWebServices, addGithub, handleEndpoint, displayMenuItems, disabled, enabled };