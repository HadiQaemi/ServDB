import * as React from 'react';
import { injectable, postConstruct, inject } from '@theia/core/shared/inversify';
import { ReactWidget } from '@theia/core/lib/browser/widgets/react-widget';
import { MessageService } from '@theia/core';
import { Message } from '@theia/core/lib/browser';
import { renderToStaticMarkup } from "react-dom/server";

@injectable()
export class DatasetbWidget extends ReactWidget {

    static readonly ID = 'dataset:widget';
    static readonly LABEL = 'Dataset Widget';
    static state = {
        webservices: new Array(),
        githubtokens: new Array(),
        endpoints: new Array(),
        preprocessedPath: '',
        endpointsPath: '',
        preprocessedPathToText: '',
        image: {
            density: '',
            year: '',
            issuesRepo: '',
            check: '',
            categories: []
        }
    };
    @inject(MessageService)
    protected readonly messageService!: MessageService;

    @postConstruct()
    protected async init(): Promise < void> {
        this.id = DatasetbWidget.ID;
        this.title.label = DatasetbWidget.LABEL;
        this.title.caption = DatasetbWidget.LABEL;
        this.title.closable = true;
        this.title.iconClass = 'fa fa-window-maximize'; // example widget icon.
        this.update();
    }

    render(): React.ReactElement {
        //Template generation using API
        const handleWebServicesClick = () => {
            const rndInt = Math.floor(Math.random() * 10000) + 1;
            const web_services_list = (document.getElementById("web_services_list") as HTMLInputElement);
            const web_service = (document.getElementById("web_service") as HTMLInputElement);
            
            const input = document.createElement('input');
            input.type = "hidden";
            input.value = web_service.value;
            input.name = "webservices[]";
            // const input = "<input type='hidden' value='"+ web_service.value +"' name='' />";
    
            const spanRemove = document.createElement('span');
            spanRemove.innerHTML = "X";
            spanRemove.onclick = function() {
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

            DatasetbWidget.state.webservices.push(web_service.value);

        };
        const handleEndpointClick = () => {
            const rndInt = Math.floor(Math.random() * 10000) + 1;
            const endpoint_based_list = (document.getElementById("endpoint_based_list") as HTMLInputElement);
            const endpoint = (document.getElementById("endpoint") as HTMLInputElement);
            
            const input = document.createElement('input');
            input.type = "hidden";
            input.value = endpoint.value;
            input.name = "endpoints[]";
            // const input = "<input type='hidden' value='"+ endpoint.value +"' name='' />";
    
            const spanRemove = document.createElement('span');
            spanRemove.innerHTML = "X";
            spanRemove.onclick = function() {
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

            DatasetbWidget.state.endpoints.push(endpoint.value);

        };
        //Template generation using API handleJsonClick
        const handleMetaDataClick = () => {
            // keyword_size,summarizer_size,checkbox_keyword,checkbox_summarizer
            const checkbox_summarizer = (document.querySelector("#checkbox_summarizer") as HTMLInputElement);
            const checkbox_keyword = (document.querySelector("#checkbox_keyword") as HTMLInputElement);
            const summarizer_size = (document.querySelector("#summarizer_size") as HTMLInputElement);
            const keyword_size = (document.querySelector("#keyword_size") as HTMLInputElement);
            const data = {
                'checkbox_summarizer': checkbox_summarizer.checked ? 'checked' : 'unchecked',
                'checkbox_keyword': checkbox_keyword.checked ? 'checked' : 'unchecked',
                'summarizer_size': summarizer_size.value,
                'keyword_size': keyword_size.value,
            }
            fetch('http://localhost:5000/metadata/summarizer', 
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
              let res = response.json();
              return res
            }).then(res => {
                alert(res.status)
            })
        };
        //Template generation using API handleJsonClick
        const handleGithubClick = () => {
            const rndInt = Math.floor(Math.random() * 10000) + 1;
            const github_list = (document.getElementById("github_list") as HTMLInputElement);
            const github = (document.getElementById("github") as HTMLInputElement);
            
            const input = document.createElement('input');
            input.type = "hidden";
            input.value = github.value;
            input.name = "github[]";
            // const input = "<input type='hidden' value='"+ web_service.value +"' name='' />";
    
            const spanRemove = document.createElement('span');
            spanRemove.innerHTML = "X";
            spanRemove.onclick = function() {
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

            DatasetbWidget.state.githubtokens.push(github.value);
        };
        //Template generation using API handleCollectClick
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
        const handleCloneEndpointClick = () => {
            fetch('http://localhost:5000/endpoints/clone', 
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
              let res = response.json();
              return res
            }).then(res => {
                alert(res.status)
                let htmlElement = (document.getElementById("theia-main-content-panel") as HTMLElement);
                htmlElement.innerHTML = "";
                let data = "<tr>" +
                    "<th>full_name</th>" +
                    "<th>forks_count</th>" +
                    "<th>stargazers_count</th>" +
                    "<th>created_at</th>" +
                    "<th>updated_at</th>" +
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
                a.onclick = ()=> download(res.result);
                a.style.cursor = "pointer";
                let span = document.createElement('span');
                span.innerHTML = "To download data as json click on ";
                span.style.margin = "20px 40px";
                span.appendChild(a);
                div.innerHTML = "<table class='repository'>" + data + "</table>";
                htmlElement.appendChild(span);
                htmlElement.appendChild(div);
            })
        };
        const handleCloneClick = () => {
            fetch('http://localhost:5000/database/clone', 
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
              let res = response.json();
              return res
            }).then(res => {
                alert(res.status)
                let htmlElement = (document.getElementById("theia-main-content-panel") as HTMLElement);
                htmlElement.innerHTML = "";
                let data = "<tr>" +
                    "<th>full_name</th>" +
                    "<th>forks_count</th>" +
                    "<th>stargazers_count</th>" +
                    "<th>created_at</th>" +
                    "<th>updated_at</th>" +
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
                a.onclick = ()=> download(res.result);
                a.style.cursor = "pointer";
                let span = document.createElement('span');
                span.innerHTML = "To download data as json click on ";
                span.style.margin = "20px 40px";
                span.appendChild(a);
                div.innerHTML = "<table class='repository'>" + data + "</table>";
                htmlElement.appendChild(span);
                htmlElement.appendChild(div);
            })
        };
        const handleCollectClick = () => {
            fetch('http://localhost:5000/database/collect', 
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
              let res = response.json();
              return res
            }).then(res => {
                alert(res.status)
                let htmlElement = (document.getElementById("theia-main-content-panel") as HTMLElement);
                htmlElement.innerHTML = "";
                let data = "<tr>" +
                    "<th>full_name</th>" +
                    "<th>forks_count</th>" +
                    "<th>stargazers_count</th>" +
                    "<th>created_at</th>" +
                    "<th>updated_at</th>" +
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
                a.onclick = ()=> download(res.result);
                a.style.cursor = "pointer";
                let span = document.createElement('span');
                span.innerHTML = "To download data as json click on ";
                span.style.margin = "20px 40px";
                span.appendChild(a);
                div.innerHTML = "<table class='repository'>" + data + "</table>";
                htmlElement.appendChild(span);
                htmlElement.appendChild(div);
            })
        };
        const handleCollectEndpointClick = () => {
            fetch('http://localhost:5000/endpoints/collect', 
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
              let res = response.json();
              return res
            }).then(res => {
                alert(res.status)
                let htmlElement = (document.getElementById("theia-main-content-panel") as HTMLElement);
                htmlElement.innerHTML = "";
                let data = "<tr>" +
                    "<th>full_name</th>" +
                    "<th>forks_count</th>" +
                    "<th>stargazers_count</th>" +
                    "<th>created_at</th>" +
                    "<th>updated_at</th>" +
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
                a.onclick = ()=> download(res.result);
                a.style.cursor = "pointer";
                let span = document.createElement('span');
                span.innerHTML = "To download data as json click on ";
                span.style.margin = "20px 40px";
                span.appendChild(a);
                div.innerHTML = "<table class='repository'>" + data + "</table>";
                htmlElement.appendChild(span);
                htmlElement.appendChild(div);
            })
        };
        const handleEndpointsClick = () => {
            fetch('http://localhost:5000/database/endpoints',
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
                let res = response.json();
                return res
            }).then(res => {
                alert(JSON.stringify(res.status))
                DatasetbWidget.state.endpointsPath = res.result
                const Preprocessor = (document.querySelector("#Preprocessor") as HTMLInputElement);
                Preprocessor.click()
            }).then(res => {
                //console.log(res)
            })
        }
        const handleToTextClick = () => {
            fetch('http://localhost:5000/database/preprocessor_toText',
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
                let res = response.json();
                return res
            }).then(res => {
                alert(JSON.stringify(res.status))
                DatasetbWidget.state.preprocessedPathToText = res.result
                const Preprocessor = (document.querySelector("#Preprocessor") as HTMLInputElement);
                Preprocessor.click()
            }).then(res => {
                //console.log(res)
            })
        }
        const handlePreprocessorClick = () => {
            fetch('http://localhost:5000/database/preprocessor',
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
                let res = response.json();
                return res
            }).then(res => {
                alert(JSON.stringify(res.status))
                DatasetbWidget.state.preprocessedPath = res.result
                const Preprocessor = (document.querySelector("#Preprocessor") as HTMLInputElement);
                Preprocessor.click()
            }).then(res => {
                //console.log(res)
            })
        }
        const handleReloadImagesClick = () =>{
            fetch('http://localhost:5000/display/createImages', 
            {
                method: "GET",
            })
            .then(response => {
                let res = response.json();
                return res
            }).then(res => {
                DatasetbWidget.state.image.issuesRepo = res.issues_repo;
                DatasetbWidget.state.image.year = res.year;
                DatasetbWidget.state.image.check = 'checked';
                // DatasetbWidget.state.image.categories = res.categories;
                DatasetbWidget.state.image.categories = []
                res.categories.forEach((value: never, key: number) => {
                    DatasetbWidget.state.image.categories[DatasetbWidget.state.image.categories.length] = value
                    //console.log(value, DatasetbWidget.state.image.categories)
                })
                //console.log(res.categories[0])
                //console.log(res.categories.length)
                //console.log(DatasetbWidget.state.image.categories)
                return res
            }).then(res => {
                // const templates_functionality = (document.querySelector("#templates_functionality") as HTMLInputElement);
                // templates_functionality.click()
            })
        }
        const handleJsonClick = () => {
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
                'liberary_number': number_libraries.value,
                'repository_number': number_repository.value,
                'lang': programming_langguage.value,
                'github_endpoint_repository': endpoint_github_repositories.value,
                'github_endpoint_code': endpoint_github.value,
                'libraries_endpoint': endpoint_libraries.value,
            }
            // console.log(number_libraries, data)
            fetch('http://localhost:5000/database/config', 
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
              let res = response.json();
            //   console.log('res:', res)
              return res
            }).then(res => {
                alert(res.status)
                // console.log(res)
            })
        };
        const handleSaveEndpointClick = () => {
            const data = {
                'endpoints': DatasetbWidget.state.endpoints,
            }
            // console.log(number_libraries, data)
            fetch('http://localhost:5000/endpoints/config',
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
              let res = response.json();
            //   console.log('res:', res)
              return res
            }).then(res => {
                alert(res.status)
                // console.log(res)
            })
        };
        (document.getElementById("theia-main-content-panel") as HTMLElement).innerHTML = renderToStaticMarkup(DiaplayWidgetDesc("ServDb_config"));
        return <div id='widget-container'>
            <div className="tab">
                <button
                    className="tablinks first"
                    value="ServDb_config"
                    onClick={(e) => this.displayMenu(e)}
                    >
                        ServDb
                </button>
                <button
                    className="tablinks"
                    value="summarizer_keyword_extractor"
                    onClick={(e) => this.displayMenu(e)}
                    >
                        MetaData enhancer
                </button>
                <button
                    className="tablinks"
                    value="preprocessor"
                    onClick={(e) => this.displayMenu(e)}
                    id="Preprocessor"
                    >
                        Preprocessor
                </button>
                <button
                    className="tablinks"
                    value="templates_functionality"
                    id="Statistics"
                    onClick={(e) => this.displayMenu(e)}
                    >
                        Statistics
                </button>
                <button
                    className="tablinks"
                    value="endpoint_based"
                    id="Endpoint"
                    onClick={(e) => this.displayMenu(e)}
                    >
                        Endpoint based
                </button>
            </div>
            <div id="ServDb_config" className="tabcontent first">
                <p>Set Configuration for dataset collector</p>
                <div>
                    <div style={{margin: '10px 0px'}}>Web Services:</div>
                    <div style={{margin: '10px 0px'}}>
                    <input
                        style={{width: '75%', display:'inline-block', marginRight: '5px'}}
                        placeholder="Web Services"
                        id="web_service"
                    />
                    <input
                        style={{width: '20%', display:'inline-block'}}
                        className="with-25"
                        type="submit"
                        value="add"
                        onClick={handleWebServicesClick}
                    />
                    </div>
                    <div style={{margin: '10px 0px', display: 'table'}} id="web_services_list"></div>
                    <div style={{margin: '10px 0px'}}>Github Tokens:</div>
                    <div style={{margin: '10px 0px'}}>
                    <input
                        style={{width: '75%', display:'inline-block', marginRight: '5px'}}
                        placeholder="Github Token"
                        id="github"
                    />
                    <input
                        style={{width: '20%', display:'inline-block'}}
                        className="with-25"
                        type="submit"
                        value="add"
                        onClick={handleGithubClick}
                    />
                    </div>
                    <div style={{margin: '10px 0px', display: 'table'}} id="github_list"></div>
                    <div style={{margin: '10px 0px'}}><input name='api_keys_libraries_io' className='api_keys_libraries_io' placeholder="API_KEYS of libraries.io"/></div>
                    <div style={{margin: '10px 0px'}}><input name='number_libraries' className='number_libraries' placeholder="Number of Liberaries"/></div>
                    <div style={{margin: '10px 0px'}}><input name='number_repository' className='number_repository' placeholder="Number of Repository"/></div>
                    <div style={{margin: '10px 0px'}}><input name='programming_langguage' className='programming_langguage' placeholder="Programming Langguage"/></div>
                    <div style={{margin: '10px 0px'}}><input name='endpoint_github_repositories' className='endpoint_github_repositories' placeholder="Endpoint of github Repositories"/></div>
                    <div style={{margin: '10px 0px'}}><input name='endpoint_github' className='endpoint_github' placeholder="Endpoint of github codes"/></div>
                    <div style={{margin: '10px 0px'}}><input name='endpoint_libraries' className='endpoint_libraries' placeholder="Endpoint of Liberaries"/></div>
                    <div style={{margin: '10px 0px', borderTop: '2px solid #999'}}>
                        <button onClick={handleJsonClick} className="btn btn-submit">Save Json</button>
                        <button onClick={handleCollectClick} className="btn btn-submit">Collect</button>
                        <button onClick={handleCloneClick} className="btn btn-submit">Clone repositories</button>
                    </div>
                </div>
                <div id="temp_result"></div>
            </div>
            <div id="templates_functionality" className="tabcontent">
                <p>Get Statistics of data</p>
                <div>
                    <div style={{margin: '10px 0px', borderTop: '2px solid #999', padding: '10px 0px'}}>
                    Collecting oss project using selected services and associated libraries <br style={{margin: '10px'}} />
                    In this sub-component, the selected services and libraries in the previous steps will be used to extract the source codes, so the repositories that use these services and libraries will be extracted.<br style={{margin: '10px'}} />
                    GitHub api can help to in this oss project collection process.<br style={{margin: '10px'}} />
                    These api provide valuable data including: user rate, Readme file, software license, vulnerability alerts, last commit date, requirement of software, number of issues, data or parameter media type, number of pull request comments. some of mentioned features can be used for non-functional information, they can consider the number of issues, user rate, issue comments, pull request and last commit date.
                    </div>
                    <button onClick={handleReloadImagesClick} className="btn btn-submit">Reload images</button>
                </div>
                <div id="temp_result"></div>
            </div>
            <div id="preprocessor" className="tabcontent">
                <p>pre-processor</p>
                <div>
                    <button onClick={handlePreprocessorClick} className="btn btn-submit">preprocess</button>
                    <button onClick={handleToTextClick} className="btn btn-submit">toText</button>
                    <button onClick={handleEndpointsClick} className="btn btn-submit">extract endpoints</button>
                </div>
                <div id="temp_result"></div>
            </div>
            <div id="summarizer_keyword_extractor" className="tabcontent">
                <p>Summarizer and Keyword Extractor</p>
                <div>
                <div style={{margin: '10px 0px'}}>Config:</div>
                    <div style={{margin: '10px 0px'}}>
                        <input
                            style={{width: '20%', display:'inline-block'}}
                            className="with-25"
                            type="checkbox"
                            value="add"
                            id="checkbox_summarizer"
                        />
                        Enable summarizer
                    </div>
                    <div style={{margin: '10px 0px'}}>
                        <input
                            style={{width: '20%', display:'inline-block'}}
                            className="with-25"
                            type="checkbox"
                            value="add"
                            id="checkbox_keyword"
                        />
                        Enable Keyword Extractor
                    </div>
                    <div style={{margin: '10px 0px'}}>
                        <input
                            style={{width: '75%', display:'inline-block', marginRight: '5px'}}
                            placeholder="Size of summarizer"
                            id="summarizer_size"
                        />
                    </div>
                    <div style={{margin: '10px 0px'}}>
                        <input
                            style={{width: '75%', display:'inline-block', marginRight: '5px'}}
                            placeholder="Number of keyword"
                            id="keyword_size"
                        />
                    </div>
                    <div style={{margin: '10px 0px', borderTop: '2px solid #999'}}>
                        <button onClick={handleMetaDataClick} className="btn btn-submit">Take Meta</button>
                    </div>
                </div>
                <div id="temp_result"></div>
            </div>
            <div id="endpoint_based" className="tabcontent">
                <p>Code Extractor</p>
                <div>
                    <div style={{margin: '10px 0px'}}>Endpoint Based:</div>
                    <div style={{margin: '10px 0px'}}>
                        <input
                            style={{width: '75%', display:'inline-block', marginRight: '5px'}}
                            placeholder="Endpoint"
                            id="endpoint"
                        />
                        <input
                            style={{width: '20%', display:'inline-block'}}
                            className="with-25"
                            type="submit"
                            value="add"
                            onClick={handleEndpointClick}
                        />
                    </div>
                    <div style={{margin: '10px 0px', display: 'table'}} id="endpoint_based_list"></div>
                    <div style={{margin: '10px 0px', borderTop: '2px solid #999'}}>
                        <button onClick={handleSaveEndpointClick} className="btn btn-submit">Save endpoint</button>
                        <button onClick={handleCollectEndpointClick} className="btn btn-submit">Collect</button>
                        <button onClick={handleCloneEndpointClick} className="btn btn-submit">Clone repositories</button>
                    </div>
                </div>
                <div id="temp_result"></div>
            </div>
        </div>
    }

    displayMenu(e: any) {
        // Declare all variables
        var i, tablinks, j = 0;
        var menuItem = e.target.value;
        var tab_ids = ["ServDb_config", "templates_functionality", "endpoint_based", "summarizer_keyword_extractor", "preprocessor"]
        // Get all elements with class="tabcontent" and hide them
        if (menuItem == "ServDb_config") {
          for (j = 0; j < tab_ids.length; j++) {
            (document.getElementById(tab_ids[j]) as HTMLElement).style.display = "none";
          }
          (document.getElementById("theia-main-content-panel") as HTMLElement).innerHTML = renderToStaticMarkup(DiaplayWidgetDesc("ServDb_config"));
        } else if (menuItem == "templates_functionality") {
          for (j = 0; j < tab_ids.length; j++) {
            (document.getElementById(tab_ids[j]) as HTMLElement).style.display = "none";
          }
          (document.getElementById("theia-main-content-panel") as HTMLElement).innerHTML = renderToStaticMarkup(DiaplayWidgetDesc("templates_functionality"));    
        } else if (menuItem == "summarizer_keyword_extractor") {
            for (j = 0; j < tab_ids.length; j++) {
              (document.getElementById(tab_ids[j]) as HTMLElement).style.display = "none";
            }
            (document.getElementById("theia-main-content-panel") as HTMLElement).innerHTML = renderToStaticMarkup(DiaplayWidgetDesc("summarizer_keyword_extractor"));    
        } else if (menuItem == "preprocessor") {
            for (j = 0; j < tab_ids.length; j++) {
                (document.getElementById(tab_ids[j]) as HTMLElement).style.display = "none";
            }
            (document.getElementById("theia-main-content-panel") as HTMLElement).innerHTML = renderToStaticMarkup(DiaplayWidgetDesc("preprocessor"));    
        } else if (menuItem == "endpoint_based") {
            for (j = 0; j < tab_ids.length; j++) {
                (document.getElementById(tab_ids[j]) as HTMLElement).style.display = "none";
            }
            (document.getElementById("theia-main-content-panel") as HTMLElement).innerHTML = renderToStaticMarkup(DiaplayWidgetDesc("endpoint_based"));    
        }
        tablinks = document.getElementsByClassName("tablinks");
        for (i = 0; i < tablinks.length; i++) {
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

    protected displayMessage(): void {
        this.messageService.info('Congratulations: Dataset Widget Successfully Created!');
    }

    protected onActivateRequest(msg: Message): void {
        super.onActivateRequest(msg);
        const htmlElement = document.getElementById('displayMessageButton');
        if (htmlElement) {
            htmlElement.focus();
        }
    }

}
function DiaplayWidgetDesc(tab: string): React.ReactElement<any, string | React.JSXElementConstructor<any>> {
    var widgetInfo =
    {
        name: "",
        description: "",
        tip: ""
    }
    if(tab === "ServDb_config"){
        fetch('http://localhost:5000/display/image', 
        {
            method: "GET",
        })
        .then(response => {
            let res = response.json();
            return res
        }).then(res => {
            DatasetbWidget.state.image.issuesRepo = res.issues_repo;
            DatasetbWidget.state.image.year = res.year;
            DatasetbWidget.state.image.check = 'checked';
            // DatasetbWidget.state.image.categories = res.categories;
            DatasetbWidget.state.image.categories = []
            res.categories.forEach((value: never, key: number) => {
                DatasetbWidget.state.image.categories[DatasetbWidget.state.image.categories.length] = value
                //console.log(value, DatasetbWidget.state.image.categories)
            })
            //console.log(res.categories[0])
            //console.log(res.categories.length)
            //console.log(DatasetbWidget.state.image.categories)
            return res
        }).then(res => {
            //console.log(res)
        })
        widgetInfo =
            {
            name: "Database collector config",
            description: "Database collector",
            tip: ""
            }
        return (
            <div id="widget_desc">
                <h2>{widgetInfo.name}</h2>
                <p>{widgetInfo.description}</p>
                <pre>
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&#123;<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&quot;web_services&quot;:&nbsp;[<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&quot;Facebook_API&quot;,<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&quot;Google_Maps_API&quot;,<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&quot;Google_Calendar&quot;,<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&quot;YouTube_API&quot;,<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&quot;Twitter_API&quot;,<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&quot;OpenStreetMap_API&quot;,<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&quot;Amazon_Product_Advertising_API&quot;,<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&quot;Flickr_API&quot;,<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&quot;Twilio_API&quot;,<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&quot;SoundCloud_API&quot;<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;],<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&quot;libraries_io_api_keys&quot;:&nbsp;&quot;libraries_io_api_key&quot;,<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&quot;liberary_number&quot;:&nbsp;10,<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&quot;repository_number&quot;:&nbsp;10,<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&quot;lang&quot;:&nbsp;&quot;java&quot;,<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&quot;github_token&quot;:&nbsp;[<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&quot;ghp_github_token___________1&quot;,<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&quot;ghp_github_token___________2&quot;,<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&quot;ghp_github_token___________3&quot;,<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&quot;ghp_github_token___________4&quot;<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;],<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&quot;github_endpoint_repository&quot;:&nbsp;&quot;https://api.github.com/search/repositories?q=__@QUERY__+language:__@LANG__&amp;sort=stars&amp;order=desc&quot;,<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&quot;github_endpoint_code&quot;:&nbsp;&quot;https://api.github.com/search/code?q=import+__@QUERY__+in:file+language:__@LANG__&amp;sort=stars&amp;order=desc&quot;,<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&quot;libraries_endpoint&quot;:&nbsp;&quot;https://libraries.io/api/github/__@QUERY__/projects?api_key=__@APIKEY__&quot;<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&#125;
                </pre>
                <div id="result_" >
                    <p>{widgetInfo.tip}</p>
                </div>
             </div>
            );
    }else if(tab === "templates_functionality"){
        widgetInfo =
            {
            name: "Get Statistic of data",
            description: "description: Get Statistic of data",
            tip: ""
            }
        return (
            <div id="widget_desc">
                <h2>{widgetInfo.name}</h2>
                <p>{widgetInfo.description}</p>
                <div id="result_" >
                    <p>{widgetInfo.tip}</p>
                </div>
                <div style={{ width: '100%'}}>
                    {DatasetbWidget.state.image.categories.map((img: any) => { return <img style={{ width: '20%'}} src={`${img}`} alt=""/>})}
                </div>
                <div style={{ width: '49%', display: 'inline-block', margin: '5px'}}>
                    <img style={{ width: '100%', height: '264px'}} src={`${DatasetbWidget.state.image.year}`} alt=""/>
                </div> 
                <div style={{ width: '49%', display: 'inline-block', margin: '5px'}}>
                    <img style={{ width: '100%', height: '264px'}} src={`${DatasetbWidget.state.image.issuesRepo}`} alt=""/>
                </div> 
            </div>
        );
    }else if(tab === "endpoint_based"){
        widgetInfo =
            {
            name: "Endpoint Based",
            description: "description: Extract code based endpoint",
            tip: ""
            }
        return (
            <div id="widget_desc">
                <h2>{widgetInfo.name}</h2>
                <p>{widgetInfo.description}</p>
                <pre>
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&#123;<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&quot;Endpoints&quot;:&nbsp;[<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&quot;https://graph.facebook.com&quot;,<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&quot;https://maps.googleapis.com/map&quot;,<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&quot;https://www.googleapis.com/youtube&quot;,<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&quot;https://api.twitter.com&quot;,<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&quot;https://api.openstreetmap.org&quot;,<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&quot;https://api.rainforestapi.com&quot;,<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&quot;https://www.flickr.com/services/rest&quot;,<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&quot;https://api.twilio.com&quot;,<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&quot;https://www.mediawiki.org/wiki/&quot;<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;],<br/>
                </pre>
            </div>
        );
    }else if(tab === "summarizer_keyword_extractor"){
        widgetInfo =
            {
            name: "summarizer",
            description: "description: summarizer",
            tip: ""
            }
        return (
            <div id="widget_desc">
                summarizer 
            </div>
        );
    }else if(tab === "preprocessor"){
        widgetInfo =
            {
            name: "preprocessor",
            description: "",
            tip: ""
            }
        return (
            <div id="widget_desc">
                <h2>{widgetInfo.name}</h2>
                <h3>Path of preprocessor repositories:{DatasetbWidget.state.preprocessedPath}</h3>
                <h3>Path of source code as text:{DatasetbWidget.state.preprocessedPathToText}</h3>
                <h3>Path of extracted endpoints:{DatasetbWidget.state.endpointsPath}</h3>
            </div>
        );
    }
    return (
        <div id="widget_desc">
            <h2>{widgetInfo.name}</h2>
            <p>{widgetInfo.description}</p>
            <div id="result_" >
                <p>{widgetInfo.tip}</p>
            </div>
        </div>
    );
}

