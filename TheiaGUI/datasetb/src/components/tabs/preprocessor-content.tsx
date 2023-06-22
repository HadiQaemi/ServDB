import * as React from 'react';

interface Props {
  handlePreprocessorClick(): any;
  handleToTextClick(): any;
  handleEndpointsClick(): any;
}

const PreprocessorContent: React.FunctionComponent<Props> = ({ handlePreprocessorClick, handleToTextClick, handleEndpointsClick }): any => {
  return <>
    <div id="preprocessor" className="tabcontent">
      <p>pre-processor</p>
      <div>
        <button onClick={handlePreprocessorClick} className="btn btn-submit">preprocess</button>
        <button onClick={handleToTextClick} className="btn btn-submit">toText</button>
        <button onClick={handleEndpointsClick} className="btn btn-submit">extract endpoints</button>
      </div>
      <div id="temp_result"></div>
    </div>
  </>;
}

export default PreprocessorContent;