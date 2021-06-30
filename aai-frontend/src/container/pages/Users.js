import React, { useState, lazy, Suspense } from 'react';
import { useSelector } from 'react-redux';
import { Row, Col, Pagination, Skeleton } from 'antd';
import { Link, Switch, Route, useRouteMatch, NavLink } from 'react-router-dom';
import FontAwesome from 'react-fontawesome';
import { post } from 'axios';
import { UsercardWrapper, UserCarrdTop } from './style';
import { Main } from '../styled';
import { AutoComplete } from '../../components/autoComplete/autoComplete';
import { Button } from '../../components/buttons/buttons';
import OnStart from '../../components/OnStart';
import CapturePics from '../../components/capturePics/capturePics';
import Ownership from '../../components/ownership/ownership';

const SERVER_ENDPOINT = 'http://localhost:5000/api/analytics/';
const formData = {
  artWorkInfo: {},
  takePictures: {},
  ownership: {},
};

const completedStages = {
  artWorkInfo: false,
  takePictures: false,
  ownership: false,
};

const Users = () => {
  const { searchData, users, userGroup } = useSelector(state => {
    return {
      searchData: state.headerSearchData,
      users: state.users,
      userGroup: state.userGroup,
    };
  });

  const { path } = useRouteMatch();

  const [state, setState] = useState({
    notData: searchData,
    current: 0,
    pageSize: 0,
    page: 0,
  });
  const [showForm, setShowForm] = useState('');
  const [finalResponse, setFinalResponse] = useState(null);

  const loadNextSection = (prevSection = null) => {
    console.log('section', prevSection);
    formData[prevSection.name] = prevSection.data;
    completedStages[prevSection.name] = true;
    setShowForm('');
  };

  const shouldButtonDisable = () => {
    return !(completedStages.artWorkInfo && completedStages.takePictures && completedStages.ownership);
  };

  const converBase64toFileObj = base64String => {
    const arr = base64String.split(',');
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);

    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }

    return new File([u8arr], `upload-${+new Date()}`, { type: mime });
  };

  const blobToFile = fileInBloB => {
    console.log('file', new File([fileInBloB], 'file'));
    return new File([fileInBloB], 'file');
  };

  const submitApplication = $e => {
    $e.preventDefault();
    console.log('formData', formData.ownership.takePictures);
    const payload = new FormData();
    payload.append('remark', 'Test Remark');
    payload.append(
      'file',
      formData.ownership.takePictures,
      // formData.ownership.takePictures.indexOf('base64') > -1
      //   ? converBase64toFileObj(formData.ownership.takePictures)
      //   : blobToFile(formData.ownership.takePictures),
      // localStorage.getItem('mainImage')
    );
    const config = {
      headers: {
        'content-type': 'multipart/form-data',
        Authorization: `Token ${localStorage.getItem('token')}`,
      },
    };
    post(SERVER_ENDPOINT, payload, config)
      .then(res => {
        console.log('res', res);
        // setFinalResponse(res);
        // localStorage.setItem('final', JSON.stringify(res));
        var obj = JSON.parse(res.data.analytics);
        console.log(obj);

        // console.log("Print Artist");
        localStorage.setItem(
          'final',
          JSON.stringify({
            name: obj.Artist.TopResult.value,
            Confidence: (obj.Artist.TopResult.confidence * 100).toFixed(2),
          }),
        );
      })
      .catch(err => setFinalResponse(err));
  };

  return (
    <>
      {/* Main Page */}
      {!showForm && (
        <Main style={{ background: '#0B1A23', marginLeft: '0', marginBottom: '100px', fontSize: '14px' }}>
          <UsercardWrapper>
            <Row gutter={25} style={{ maxWidth: '300px', margin: 'auto' }}>
              <Row style={{ maxWidth: '300px', marginBottom: '30px' }}>
                <div xs={24} className="d-flex justify-content-center" style={{ margin: 'auto' }} key="index">
                  <Col style={{ margin: 'auto' }}>
                    <FontAwesome
                      name="keyboard-o"
                      size="3x"
                      style={{ padding: '10px', color: '#BAA06A', minWidth: '75px' }}
                    />
                  </Col>
                  <Col>
                    <h4 style={{ color: '#BAA06A', fontSize: '24px', fontWeight: 'bolder', margin: '0' }}>
                      Step 1:
                      {completedStages.artWorkInfo === true && (
                        <span style={{ color: '#00FF87', paddingLeft: '10px' }}>Complete</span>
                      )}
                    </h4>
                    <div style={{ color: '#9598A5', fontSize: '24px' }}>
                      {completedStages.artWorkInfo !== true ? 'Enter Artwork info' : 'Artwork Info'}
                    </div>
                  </Col>
                </div>
              </Row>
              <Row style={{ maxWidth: '300px', marginBottom: '30px', height: '30%', width: '100%', marginLeft: '23%' }}>
                {completedStages.artWorkInfo === false &&
                  completedStages.takePictures === false &&
                  completedStages.ownership === false && (
                    <Button
                      onClick={() => setShowForm('artWorkInfo')}
                      className="start_btn"
                      type="button"
                      style={{ height: '30%', width: '65%' }}
                    >
                      START
                    </Button>
                  )}
              </Row>
              <Row style={{ maxWidth: '300px', marginBottom: '30px' }}>
                <div xs={24} className="d-flex justify-content-center" style={{ margin: 'auto' }} key="index">
                  <Col style={{ margin: 'auto' }}>
                    <FontAwesome
                      name="camera"
                      size="3x"
                      style={{ padding: '10px', color: '#BAA06A', minWidth: '75px' }}
                    />
                  </Col>
                  <Col>
                    <h4 style={{ color: '#BAA06A', fontSize: '24px', fontWeight: 'bolder', margin: '0' }}>
                      Step 2:
                      {completedStages.takePictures === true && (
                        <span style={{ color: '#00FF87', paddingLeft: '10px' }}>Complete</span>
                      )}
                    </h4>
                    <div style={{ color: '#9598A5', fontSize: '24px' }}>
                      {completedStages.takePictures !== true ? 'Take Pictures' : 'Take Pictures'}
                    </div>
                  </Col>
                </div>
              </Row>
              <Row style={{ maxWidth: '300px', marginBottom: '30px', height: '30%', width: '100%', marginLeft: '23%' }}>
                {completedStages.artWorkInfo === true &&
                  completedStages.takePictures === false &&
                  completedStages.ownership === false && (
                    <Button
                      onClick={() => setShowForm('takePictures')}
                      className="start_btn"
                      type="button"
                      style={{ height: '30%', width: '70%' }}
                    >
                      START
                    </Button>
                  )}
              </Row>
              <Row style={{ maxWidth: '300px', marginBottom: '30px' }}>
                <div xs={24} className="d-flex justify-content-center" style={{ margin: 'auto' }} key="index">
                  <Col style={{ margin: 'auto' }}>
                    <FontAwesome name="tag" size="3x" style={{ padding: '10px', color: '#BAA06A', minWidth: '75px' }} />
                  </Col>
                  <Col>
                    <h4 style={{ color: '#BAA06A', fontSize: '24px', fontWeight: 'bold', margin: '0' }}>
                      Step 3:
                      {completedStages.ownership === true && (
                        <span style={{ color: '#00FF87', paddingLeft: '10px' }}>Complete</span>
                      )}
                    </h4>
                    <div style={{ color: '#9598A5', fontSize: '24px' }}>Ownership and History</div>
                  </Col>
                </div>
              </Row>
              <Row style={{ maxWidth: '300px', marginBottom: '30px', height: '30%', width: '100%', marginLeft: '23%' }}>
                {completedStages.artWorkInfo === true &&
                  completedStages.takePictures === true &&
                  completedStages.ownership === false && (
                    <Button
                      onClick={() => setShowForm('ownership')}
                      className="start_btn"
                      type="button"
                      style={{ height: '30%', width: '70%' }}
                    >
                      START
                    </Button>
                  )}
              </Row>
              <div style={{ textAlign: 'center', width: '100%' }}>
                <Button
                  className="rvw_btn"
                  type="button"
                  disabled={shouldButtonDisable()}
                  style={{ height: '50px', width: '130px', alignSelf: 'center', margin: '10px' }}
                >
                  REVIEW
                </Button>
                <Button
                  className="sbmt_btn"
                  type="button"
                  disabled={shouldButtonDisable()}
                  onClick={$e => submitApplication($e)}
                  style={{ height: '50px', width: '130px', margin: '10px' }}
                >
                  SUBMIT
                </Button>
                {finalResponse && <p>`Server Response: ${JSON.stringify(finalResponse.data)}`</p>}
              </div>
            </Row>
          </UsercardWrapper>
        </Main>
      )}
      {/* Art Work Info Page */}
      {showForm === 'artWorkInfo' && <OnStart loadNextSection={response => loadNextSection(response)} />}
      {/* Capture pics Page */}
      {showForm === 'takePictures' && (
        <CapturePics formData={formData} loadNextSection={response => loadNextSection(response)} />
      )}
      {/* Ownership Page */}
      {showForm === 'ownership' && (
        <Ownership formData={formData} loadNextSection={response => loadNextSection(response)} />
      )}
    </>
  );
};

export default Users;
