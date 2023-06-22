import * as React from 'react';

interface Props {
  handleEndpointClick: any;
  handleSaveEndpointClick: any;
  handleCollectEndpointClick: any;
  handleCloneEndpointClick: any;
}

const EndpointContent: React.FunctionComponent<Props> = ({ handleEndpointClick, handleSaveEndpointClick, handleCollectEndpointClick, handleCloneEndpointClick }): any => {
  return <>
    <div id="endpoint_based" className="tabcontent">
      <p>Code Extractor</p>
      <div>
        <div style={{ margin: '10px 0px' }}>Endpoint Based:</div>
        <div style={{ margin: '10px 0px' }}>
          <input
            style={{ width: '75%', display: 'inline-block', marginRight: '5px' }}
            placeholder="Endpoint"
            id="endpoint"
          />
          <input
            style={{ width: '20%', display: 'inline-block' }}
            className="with-25"
            type="submit"
            value="add"
            onClick={handleEndpointClick}
          />
        </div>
        <div style={{ margin: '10px 0px', display: 'table' }} id="endpoint_based_list"></div>
        <div style={{ margin: '10px 0px', borderTop: '2px solid #999' }}>
          <button onClick={handleSaveEndpointClick} className="btn btn-submit">Save endpoint</button>
          <button onClick={handleCollectEndpointClick} className="btn btn-submit">Collect</button>
          <button onClick={handleCloneEndpointClick} className="btn btn-submit">Clone repositories</button>
        </div>
      </div>
      <div id="temp_result"></div>
    </div>
  </>;
}

export default EndpointContent;