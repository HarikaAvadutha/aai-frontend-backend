import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Row, Col, Table, Form, Input } from 'antd';
import FeatherIcon from 'feather-icons-react';
import { Link } from 'react-router-dom';
import { Action, ContactPageheaderStyle } from './style';
import { PageHeader } from '../../components/page-headers/page-headers';
import { Main, TableWrapper, CardToolbox, BasicFormWrapper } from '../styled';
import Heading from '../../components/heading/heading';
import { AutoComplete } from '../../components/autoComplete/autoComplete';
import { Button } from '../../components/buttons/buttons';
import { Cards } from '../../components/cards/frame/cards-frame';
import { AddUser, UserTableStyleWrapper } from '../pages/style';
import { onStarUpdate, contactDeleteData, contactSearchData, contactAddData } from '../../redux/contact/actionCreator';
import { Dropdown } from '../../components/dropdown/dropdown';
import { Modal } from '../../components/modals/antd-modals';

const ContactTable = () => {
  const dispatch = useDispatch();
  const { users } = useSelector(state => {
    return {
      users: state.Contact.data,
    };
  });
  const [form] = Form.useForm();

  const [state, setState] = useState({
    selectedRowKeys: 0,
    selectedRows: 0,
    visible: true,
    editVisible: false,
    modalType: 'primary',
    url: null,
    update: {},
  });

  const { update } = state;

  const handleSearch = searchText => {
    dispatch(contactSearchData(searchText));
  };

  const onHandleDelete = id => {
    const value = users.filter(item => item.id !== id);
    dispatch(contactDeleteData(value));
  };

  const showModal = () => {
    setState({
      ...state,
      visible: true,
    });
  };

  const showEditModal = data => {
    setState({
      ...state,
      editVisible: true,
      update: data,
    });
  };

  const onCancel = () => {
    setState({
      ...state,
      visible: false,
      editVisible: false,
    });
  };

  const handleOk = values => {
    onCancel();
    const arrayData = [];
    users.map(data => {
      return arrayData.push(data.id);
    });
    const max = Math.max(...arrayData);
    dispatch(
      contactAddData([
        ...users,
        {
          ...values,
          id: max + 1,
          time: new Date().getTime(),
          img: 'static/img/users/6.png',
          live: false,
          stared: false,
        },
      ]),
    );
    form.resetFields();
  };

  const handleEditOk = values => {
    onCancel();
    const updateUsers = users;

    updateUsers.map(user => {
      if (user.id === update.id) {
        const updateUser = user;
        updateUser.id = update.id;
        updateUser.name = values.name;
        updateUser.email = values.email;
        updateUser.phone = values.phone;
        updateUser.designation = values.designation;
        updateUser.company = values.company;
        updateUser.time = update.time;
        updateUser.img = update.img;
        updateUser.stared = update.stared;
      }
      return true;
    });
    dispatch(contactAddData(updateUsers));
    form.resetFields();
  };

  const handleCancel = () => {
    onCancel();
  }

  const usersTableData = [];


  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      setState({ ...state, selectedRowKeys, selectedRows });
    },
    getCheckboxProps: record => ({
      disabled: record.name === 'Disabled User', // Column configuration not to be checked
      name: record.name,
    }),
  };

  return (
    <>
    
     </>
  );
};

export default ContactTable;
