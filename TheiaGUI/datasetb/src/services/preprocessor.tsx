import { URL_EndPoint, VERSION } from "../config";
import { disabled, enabled } from "../utility/helper";

const handlePreprocessor = (messageService: any): any => {
    disabled()
    fetch(URL_EndPoint + '/database/' + VERSION + '/preprocessor',
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
            if (res.status == 'OK') {
                messageService.info('The preprocessing of repositories done!');
            }else{
                messageService.error('Some error happened!');
            }
            const preprocessed_path = (document.querySelector("#preprocessed_path") as HTMLInputElement);
            preprocessed_path.innerHTML = res.result
            enabled()
        })
}

const handleToText = (messageService: any): any => {
    disabled()
    fetch(URL_EndPoint + '/database/' + VERSION + '/preprocessor_toText',
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
            if (res.status == 'OK') {
                messageService.info('The source codes of repositories preprocessed and convert to text!');
            }else{
                messageService.error('Some error happened!');
            }
            const preprocessed_path_to_text = (document.querySelector("#preprocessed_path_to_text") as HTMLInputElement);
            preprocessed_path_to_text.innerHTML = res.result
            enabled()
        })
}
const handleEndpoints = (messageService: any): any => {
    disabled()
    fetch(URL_EndPoint + '/database/' + VERSION + '/endpoints',
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
            if (res.status == 'OK') {
                messageService.info('The endpoints of repositories extracted!');
            }else{
                messageService.error('Some error happened!');
            }
            enabled()
            const endpoints_path = (document.querySelector("#endpoints_path") as HTMLInputElement);
            endpoints_path.innerHTML = res.result
        })
}
export { handlePreprocessor, handleToText, handleEndpoints };