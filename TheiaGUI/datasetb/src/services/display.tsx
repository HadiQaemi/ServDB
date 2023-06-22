import { URL_EndPoint, VERSION } from "../config";
import { disabled, enabled } from "../utility/helper";

const handleReloadImages = (messageService: any): any => {
    disabled()
    fetch(URL_EndPoint + '/display/' + VERSION + '/createImages',
        {
            method: "GET",
        })
        .then(response => {
            return response.json()
        }).then(res => {
            if (res.status == 'OK') {
                messageService.info('ReadMe files of projects summarized!');
            }else{
                messageService.error('Some error happened!');
            }
            enabled()
        })
}
export { handleReloadImages };