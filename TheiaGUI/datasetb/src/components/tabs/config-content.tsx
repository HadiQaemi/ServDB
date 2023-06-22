import * as React from 'react';

interface Props {
  handleJsonClick(): any;
  handleCollectClick(): any;
  handleCloneClick(): any;
  handleWebServices(): any;
  handleGithub(): any;
}
const ConfigContent: React.FunctionComponent<Props> = ({ handleJsonClick, handleCollectClick, handleCloneClick, handleWebServices, handleGithub }) => {
  return <>
    <div id="ServDb_config" className="tabcontent first">
      <p>Set Configuration for dataset collector</p>
      <div>
        <div style={{ margin: '10px 0px' }}>Web Services:</div>
        <div style={{ margin: '10px 0px' }}>
          <input
            style={{ width: '75%', display: 'inline-block', marginRight: '5px' }}
            placeholder="Web Services"
            id="web_service"
          />
          <input
            style={{ width: '20%', display: 'inline-block' }}
            className="with-25"
            type="submit"
            value="add"
            onClick={handleWebServices}
          />
        </div>
        <div style={{ margin: '10px 0px', display: 'table' }} id="web_services_list"></div>
        <div style={{ margin: '10px 0px' }}>Github Tokens:</div>
        <div style={{ margin: '10px 0px' }}>
          <input
            style={{ width: '75%', display: 'inline-block', marginRight: '5px' }}
            placeholder="Github Token"
            id="github"
          />
          <input
            style={{ width: '20%', display: 'inline-block' }}
            className="with-25"
            type="submit"
            value="add"
            onClick={handleGithub}
          />
        </div>
        <div style={{ margin: '10px 0px', display: 'table' }} id="github_list"></div>
        <div style={{ margin: '10px 0px' }}><input name='api_keys_libraries_io' className='api_keys_libraries_io' placeholder="API_KEYS of libraries.io" /></div>
        <div style={{ margin: '10px 0px' }}><input name='number_libraries' className='number_libraries' placeholder="Number of Liberaries" /></div>
        <div style={{ margin: '10px 0px' }}><input name='number_repository' className='number_repository' placeholder="Number of Repository" /></div>
        <div style={{ margin: '10px 0px' }}><input name='programming_langguage' className='programming_langguage' placeholder="Programming Langguage" /></div>
        <div style={{ margin: '10px 0px' }}><input name='endpoint_github_repositories' className='endpoint_github_repositories' placeholder="Endpoint of github Repositories" /></div>
        <div style={{ margin: '10px 0px' }}><input name='endpoint_github' className='endpoint_github' placeholder="Endpoint of github codes" /></div>
        <div style={{ margin: '10px 0px' }}><input name='endpoint_libraries' className='endpoint_libraries' placeholder="Endpoint of Liberaries" /></div>
        <div style={{ margin: '10px 0px', borderTop: '2px solid #999' }}>
          <button onClick={handleJsonClick} className="btn btn-submit">Save Json</button>
          <button onClick={handleCollectClick} className="btn btn-submit">Collect service</button>
          <button onClick={handleCloneClick} className="btn btn-submit">Clone repositories</button>
        </div>
      </div>
      <div id="temp_result"></div>
    </div>
  </>;
}

export default ConfigContent;