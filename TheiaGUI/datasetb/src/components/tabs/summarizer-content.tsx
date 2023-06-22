import * as React from 'react';

interface Props {
  handleMetaDataClick(): any;
}

const SummarizerContent: React.FunctionComponent<Props> = ({ handleMetaDataClick }): any => {
  return <>
    <div id="summarizer_keyword_extractor" className="tabcontent">
      <p>Summarizer and Keyword Extractor</p>
      <div>
        <div style={{ margin: '10px 0px' }}>Config:</div>
        <div style={{ margin: '10px 0px' }}>
          <input
            style={{ width: '20%', display: 'inline-block' }}
            className="with-25"
            type="checkbox"
            value="add"
            id="checkbox_summarizer"
          />
          Enable summarizer
        </div>
        <div style={{ margin: '10px 0px' }}>
          <input
            style={{ width: '20%', display: 'inline-block' }}
            className="with-25"
            type="checkbox"
            value="add"
            id="checkbox_keyword"
          />
          Enable Keyword Extractor
        </div>
        <div style={{ margin: '10px 0px' }}>
          <input
            style={{ width: '75%', display: 'inline-block', marginRight: '5px' }}
            placeholder="Size of summarizer"
            id="summarizer_size"
          />
        </div>
        <div style={{ margin: '10px 0px' }}>
          <input
            style={{ width: '75%', display: 'inline-block', marginRight: '5px' }}
            placeholder="Number of keyword"
            id="keyword_size"
          />
        </div>
        <div style={{ margin: '10px 0px', borderTop: '2px solid #999' }}>
          <button onClick={handleMetaDataClick} className="btn btn-submit">Take Meta</button>
        </div>
      </div>
      <div id="temp_result"></div>
    </div>
  </>;
}

export default SummarizerContent;