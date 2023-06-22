import * as React from 'react';
import { injectable, postConstruct, inject } from '@theia/core/shared/inversify';
import { ReactWidget } from '@theia/core/lib/browser/widgets/react-widget';
import { MessageService } from '@theia/core';
import { Message } from '@theia/core/lib/browser';
import { renderToStaticMarkup } from "react-dom/server";

import WidgetTabs from "../components/widget-tabs";
import ConfigContent from '../components/tabs/config-content';
import TemplateContent from '../components/tabs/template-content';
import PreprocessorContent from '../components/tabs/preprocessor-content';
import SummarizerContent from '../components/tabs/summarizer-content';
import EndpointContent from '../components/tabs/endpoint-content';
import * as databaseService from '../services/database';
import { addGithub, addWebServices, handleEndpoint, displayMenuItems } from '../utility/helper';
import { handleMetaData } from '../services/metadata';
import { handleEndpoints, handlePreprocessor, handleToText } from '../services/preprocessor';
import { handleReloadImages } from '../services/display';
import { handleCloneEndpoint, handleCollectEndpoint, handleSaveEndpoint } from '../services/endpoint';
import WidgetDesc from '../components/widget-desc';
/**
 * Widget for dataset collector
 */
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
    protected async init(): Promise<void> {
        this.id = DatasetbWidget.ID;
        this.title.label = DatasetbWidget.LABEL;
        this.title.caption = DatasetbWidget.LABEL;
        this.title.closable = true;
        this.title.iconClass = 'fa fa-window-maximize'; // example widget icon.
        this.update();
    }

    render(): React.ReactElement {
        //Template generation using API
        const handleEndpointClick = (): any => {
            const endpoint = handleEndpoint()
            DatasetbWidget.state.endpoints.push(endpoint);
        };
        const handleJsonClick = (): any => {
            databaseService.handleJson(DatasetbWidget, this.messageService)
        };
        const handleCloneClick = (): any => {
            databaseService.handleClone(this.messageService)
        };
        const handleCollectClick = (): any => {
            databaseService.handleCollect(this.messageService)
        };
        const handleCloneEndpointClick = (): any => {
            handleCloneEndpoint(this.messageService)
        };
        const handleGithub = (): any => {
            const github = addGithub()
            DatasetbWidget.state.githubtokens.push(github);
        };
        const handleWebServices = (): any => {
            const web_service = addWebServices()
            DatasetbWidget.state.webservices.push(web_service);
        }
        //Template generation using API handleJsonClick
        const handleMetaDataClick = (): any => {
            handleMetaData(this.messageService)
        };
        const handleCollectEndpointClick = (): any => {
            handleCollectEndpoint(this.messageService)
        };
        const handleEndpointsClick = (): any => {
            const res = handleEndpoints(this.messageService)
            DatasetbWidget.state.endpointsPath = res
            const Preprocessor = (document.querySelector("#Preprocessor") as HTMLInputElement);
            Preprocessor.click()
        }
        const handleToTextClick = (): any => {
            const res = handleToText(this.messageService)
            DatasetbWidget.state.preprocessedPath = res
            const Preprocessor = (document.querySelector("#Preprocessor") as HTMLInputElement);
            Preprocessor.click()
        }
        const handlePreprocessorClick = (): any => {
            const res = handlePreprocessor(this.messageService)
            DatasetbWidget.state.preprocessedPath = res
            const Preprocessor = (document.querySelector("#Preprocessor") as HTMLInputElement);
            Preprocessor.click()
        }
        const handleReloadImagesClick = (): any => {
            const res = handleReloadImages(this.messageService)
            DatasetbWidget.state.image.issuesRepo = res.issues_repo;
            DatasetbWidget.state.image.year = res.year;
            DatasetbWidget.state.image.check = 'checked';
            DatasetbWidget.state.image.categories = []
            res.categories.forEach((value: never, key: number) => {
                DatasetbWidget.state.image.categories[DatasetbWidget.state.image.categories.length] = value
            })
        }

        const handleSaveEndpointClick = (): any => {
            handleSaveEndpoint(DatasetbWidget.state.endpoints, this.messageService)
        };

        (document.getElementById("theia-main-content-panel") as HTMLElement).innerHTML = renderToStaticMarkup(DiaplayWidgetDesc("ServDb_config"));
        return <div id='widget-container'>
            <WidgetTabs onClick={(e: any) => this.displayMenu(e)} />
            <ConfigContent handleWebServices={handleWebServices} handleGithub={handleGithub} handleCloneClick={handleCloneClick} handleJsonClick={handleJsonClick} handleCollectClick={handleCollectClick} />
            <TemplateContent handleReloadImages={handleReloadImagesClick} />
            <PreprocessorContent handlePreprocessorClick={handlePreprocessorClick} handleToTextClick={handleToTextClick} handleEndpointsClick={handleEndpointsClick} />
            <SummarizerContent handleMetaDataClick={handleMetaDataClick} />
            <EndpointContent handleEndpointClick={handleEndpointClick} handleSaveEndpointClick={handleSaveEndpointClick} handleCollectEndpointClick={handleCollectEndpointClick} handleCloneEndpointClick={handleCloneEndpointClick} />
        </div>
    }

    displayMenu(e: any) {
        var menuItem = e.target.value;
        displayMenuItems(menuItem, DiaplayWidgetDesc)
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
    return WidgetDesc(tab, DatasetbWidget)
}