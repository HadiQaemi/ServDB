import * as React from 'react';

interface Props {
  handleReloadImages(): any;
}

const TemplateContent: React.FunctionComponent<Props> = ({ handleReloadImages }): any => {
  return <>
    <div id="templates_functionality" className="tabcontent">
      <p>Get Statistics of data</p>
      <div>
        <div style={{ margin: '10px 0px', borderTop: '2px solid #999', padding: '10px 0px' }}>
          Collecting oss project using selected services and associated libraries <br style={{ margin: '10px' }} />
          In this sub-component, the selected services and libraries in the previous steps will be used to extract the source codes, so the repositories that use these services and libraries will be extracted.<br style={{ margin: '10px' }} />
          GitHub api can help to in this oss project collection process.<br style={{ margin: '10px' }} />
          These api provide valuable data including: user rate, Readme file, software license, vulnerability alerts, last commit date, requirement of software, number of issues, data or parameter media type, number of pull request comments. some of mentioned features can be used for non-functional information, they can consider the number of issues, user rate, issue comments, pull request and last commit date.
        </div>
        <button onClick={handleReloadImages} className="btn btn-submit">Reload images</button>
      </div>
      <div id="temp_result"></div>
    </div>
  </>;
}

export default TemplateContent;