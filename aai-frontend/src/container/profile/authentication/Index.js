import React from 'react';
import { Row, Col } from 'antd';
import { Aside, Content, AuthWrapper } from './overview/style';
import Heading from '../../../components/heading/heading';

const AuthLayout = WraperContent => {
  return () => {
    return (
      <AuthWrapper>
        <Row>
          <Col xxl={8} xl={9} lg={12} md={8} xs={24}>
            <Aside>
              <div className="auth-side-content">
                <Content>
                  <img style={{ width: '150px' }} src={require('../../../static/img/Logo_white.png')} alt="" />
                  <br />
                  <br />
                  <Heading as="h1">
                    <br />
                    Powered Application
                  </Heading>
                </Content>
              </div>
            </Aside>
          </Col>

          <Col xxl={16} xl={15} lg={12} md={16} xs={24}>
            <WraperContent />
          </Col>
        </Row>
      </AuthWrapper>
    );
  };
};

export default AuthLayout;
