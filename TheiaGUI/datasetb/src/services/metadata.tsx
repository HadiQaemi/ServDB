import { URL_EndPoint, VERSION } from "../config";
import { disabled, enabled } from "../utility/helper";

const handleMetaData = (messageService: any): any => {
    // keyword_size,summarizer_size,checkbox_keyword,checkbox_summarizer
    const checkbox_summarizer = (document.querySelector("#checkbox_summarizer") as HTMLInputElement);
    const checkbox_keyword = (document.querySelector("#checkbox_keyword") as HTMLInputElement);
    const summarizer_size = (document.querySelector("#summarizer_size") as HTMLInputElement);
    const keyword_size = (document.querySelector("#keyword_size") as HTMLInputElement);
    const data = {
        'checkbox_summarizer': checkbox_summarizer.checked ? true : false,
        'checkbox_keyword': checkbox_keyword.checked ? true : false,
        'summarizer_size': summarizer_size.value,
        'keyword_size': keyword_size.value,
    }
    disabled()
    fetch(URL_EndPoint + '/metadata/' + VERSION + '/summarizer',
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
                messageService.info('ReadMe files of projects summarized!');
            } else {
                messageService.error('Some error happened!');
            }
            enabled()
        })
};

export { handleMetaData };