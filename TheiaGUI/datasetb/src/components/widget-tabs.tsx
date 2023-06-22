import * as React from 'react';

interface Props {
  onClick?: React.MouseEventHandler;
}

const WidgetTabs: React.FunctionComponent<Props> = ({ onClick }): any => {
  return <>
    <div className="tab">
      <button
        className="tablinks first"
        value="ServDb_config"
        onClick={onClick}
      >
        ServDb
      </button>
      <button
        className="tablinks"
        value="summarizer_keyword_extractor"
        onClick={onClick}
      >
        MetaData enhancer
      </button>
      <button
        className="tablinks"
        value="preprocessor"
        onClick={onClick}
        id="Preprocessor"
      >
        Preprocessor
      </button>
      <button
        className="tablinks"
        value="templates_functionality"
        id="Statistics"
        onClick={onClick}
      >
        Statistics
      </button>
      <button
        className="tablinks"
        value="endpoint_based"
        id="Endpoint"
        onClick={onClick}
      >
        Endpoint based
      </button>
    </div>
  </>;
}

export default WidgetTabs;