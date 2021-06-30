import React from 'react';
import { Link, NavLink, Redirect } from 'react-router-dom';
import { Form, Input, Button } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
// eslint-disable-next-line import/no-extraneous-dependencies
import { FacebookOutlined, TwitterOutlined } from '@ant-design/icons';
import { AuthWrapper } from './style';
import { login } from '../../../../redux/authentication/actionCreator';
import Heading from '../../../../components/heading/heading';

const SignIn = () => {
  const dispatch = useDispatch();
  const isLoading = useSelector(state => state.auth.loading);
  const isAuthenticated = useSelector(state => state.auth.isAuthenticated);
  const hasError = useSelector(state => state.auth.error);
  const [form] = Form.useForm();
  

  const handleSubmit = () => {
    dispatch(login(form.getFieldValue("username"), form.getFieldValue("password")));
  };
  
  if(isAuthenticated){
    return(<Redirect to='/admin' />)
  }

  
  const displayMessages = () => {
    if(hasError && hasError.data){
      if (hasError.data.name) return <p>{hasError.data.name.join()}</p>;
      if (hasError.data.email) return <p>{hasError.data.email.join()}</p>;
      if (hasError.data.message) return <p>{hasError.data.message.join()}</p>;
      if (hasError.data.non_field_errors) return <p>{hasError.data.non_field_errors.join()}</p>;
      if (hasError.data.username) return <p>{hasError.data.username.join()}</p>;
    }
    return null;
  };


  return (
    <AuthWrapper>
      <p className="auth-notice">
        Don&rsquo;t have an account? <NavLink to="/register">Sign up now</NavLink>
      </p>
      <div className="auth-contents">
        <Form name="login" form={form} onFinish={handleSubmit} layout="vertical">
          <Heading as="h3">
            Sign in to <span className="color-secondary">Artify.Ai</span>
          </Heading>
          {displayMessages()}
          <Form.Item
            name="username"
            rules={[{ message: 'Please input your username or Email!', required: true }]}
            initialValue="name@example.com"
            label="Username"
          >
          <Input />
          </Form.Item>
          <Form.Item name="password" initialValue="123456" label="Password">
            <Input.Password placeholder="Password" />
          </Form.Item>
          <div className="auth-form-action">
            <NavLink className="forgot-pass-link" to="/forgotPassword">
              Forgot password?
            </NavLink>
          </div>
          <Form.Item>
            <Button className="btn-signin" htmlType="submit" type="primary" size="large">
              {isLoading ? 'Loading...' : 'Sign In'}
            </Button>
          </Form.Item>
          <p className="form-divider">
            <span>Or</span>
          </p>
          <ul className="social-login">
            <li>
              <Link className="google-signup" to="#">
                <img src={require('../../../../static/img/google.png')} alt="" />
                <span>Sign in with Google</span>
              </Link>
            </li>
            <li>
              <Link className="facebook-sign" to="#">
                <FacebookOutlined />
              </Link>
            </li>
            <li>
              <Link className="twitter-sign" to="#">
                <TwitterOutlined />
              </Link>
            </li>
          </ul>
        </Form>
      </div>
    </AuthWrapper>
  );
};

export default SignIn;
