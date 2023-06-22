import * as React from 'react';
import { URL_EndPoint, VERSION } from '../config';

const WidgetDesc = (tab: string, DatasetbWidget: { state: { image: { issuesRepo: any; year: any; check: string; categories: any[]; }; preprocessedPath: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | React.ReactFragment | React.ReactPortal | null | undefined; preprocessedPathToText: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | React.ReactFragment | React.ReactPortal | null | undefined; endpointsPath: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | React.ReactFragment | React.ReactPortal | null | undefined; }; }): any => {
  var widgetInfo =
  {
    name: "",
    description: "",
    tip: ""
  }
  if (tab === "ServDb_config") {

    fetch(URL_EndPoint + '/display/' + VERSION + '/image',
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
        DatasetbWidget.state.image.categories = []
        res.categories.forEach((value: never, key: number) => {
          DatasetbWidget.state.image.categories[DatasetbWidget.state.image.categories.length] = value
        })
        return res
      }).then(res => {
        console.log(res)
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
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&#123;<br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&quot;web_services&quot;:&nbsp;[<br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&quot;Facebook_API&quot;,<br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&quot;Google_Maps_API&quot;,<br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&quot;Google_Calendar&quot;,<br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&quot;YouTube_API&quot;,<br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&quot;Twitter_API&quot;,<br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&quot;OpenStreetMap_API&quot;,<br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&quot;Amazon_Product_Advertising_API&quot;,<br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&quot;Flickr_API&quot;,<br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&quot;Twilio_API&quot;,<br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&quot;SoundCloud_API&quot;<br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;],<br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&quot;libraries_io_api_keys&quot;:&nbsp;&quot;libraries_io_api_key&quot;,<br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&quot;liberary_number&quot;:&nbsp;10,<br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&quot;repository_number&quot;:&nbsp;10,<br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&quot;lang&quot;:&nbsp;&quot;java&quot;,<br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&quot;github_token&quot;:&nbsp;[<br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&quot;ghp_github_token___________1&quot;,<br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&quot;ghp_github_token___________2&quot;,<br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&quot;ghp_github_token___________3&quot;,<br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&quot;ghp_github_token___________4&quot;<br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;],<br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&quot;github_endpoint_repository&quot;:&nbsp;&quot;https://api.github.com/search/repositories?q=__@QUERY__+language:__@LANG__&amp;sort=stars&amp;order=desc&quot;,<br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&quot;github_endpoint_code&quot;:&nbsp;&quot;https://api.github.com/search/code?q=import+__@QUERY__+in:file+language:__@LANG__&amp;sort=stars&amp;order=desc&quot;,<br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&quot;libraries_endpoint&quot;:&nbsp;&quot;https://libraries.io/api/github/__@QUERY__/projects?api_key=__@APIKEY__&quot;<br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&#125;
        </pre>
        <div id="result_" >
          <p>{widgetInfo.tip}</p>
        </div>
      </div>
    );
  } else if (tab === "templates_functionality") {
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
        <div style={{ width: '100%' }}>
          {DatasetbWidget.state.image.categories.map((img: any) => { return <img style={{ width: '20%' }} src={`${img}`} alt="" /> })}
        </div>
        <div style={{ width: '49%', display: 'inline-block', margin: '5px' }}>
          <img style={{ width: '100%', height: '264px' }} src={`${DatasetbWidget.state.image.year}`} alt="" />
        </div>
        <div style={{ width: '49%', display: 'inline-block', margin: '5px' }}>
          <img style={{ width: '100%', height: '264px' }} src={`${DatasetbWidget.state.image.issuesRepo}`} alt="" />
        </div>
      </div>
    );
  } else if (tab === "endpoint_based") {
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
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&#123;<br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&quot;Endpoints&quot;:&nbsp;[<br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&quot;https://graph.facebook.com&quot;,<br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&quot;https://maps.googleapis.com/map&quot;,<br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&quot;https://www.googleapis.com/youtube&quot;,<br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&quot;https://api.twitter.com&quot;,<br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&quot;https://api.openstreetmap.org&quot;,<br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&quot;https://api.rainforestapi.com&quot;,<br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&quot;https://www.flickr.com/services/rest&quot;,<br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&quot;https://api.twilio.com&quot;,<br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&quot;https://www.mediawiki.org/wiki/&quot;<br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;],<br />
        </pre>
      </div>
    );
  } else if (tab === "summarizer_keyword_extractor") {
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
  } else if (tab === "preprocessor") {
    widgetInfo =
    {
      name: "preprocessor",
      description: "",
      tip: ""
    }
    return (
      <div id="widget_desc">
        <h2>{widgetInfo.name}</h2>
        <h3>Path of preprocessor repositories: <span id="preprocessed_path"></span></h3>
        <h3>Path of source code as text: <span id="preprocessed_path_to_text"></span></h3>
        <h3>Path of extracted endpoints: <span id="endpoints_path"></span></h3>
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
};

export default WidgetDesc;