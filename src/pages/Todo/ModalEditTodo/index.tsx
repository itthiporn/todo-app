import React, { useState, useRef } from 'react';
import { Formik } from 'formik';
import { message, Modal, Input, Row, Col, Typography, Button, Form } from 'antd';
import * as yup from 'yup';

import http from 'shared/config/http-common';
import { TodoList } from 'shared/models/todoList.model';
import { getStoredAuthToken } from 'shared/utils/authToken';

const { Text } = Typography;

interface ModalAddTodoProps {
  visible: boolean;
  onCancel: () => void;
  onOk: (todo: TodoList) => void;
  todo: TodoList;
}

interface TodoFormValues {
  title: string;
  description: string;
}

const validateSchema = yup.object().shape({
  title: yup.string().required(),
  description: yup.string().required(),
});

const ModalEditTodo: React.FC<ModalAddTodoProps> = (props) => {
  const [isLoading, setLoading] = useState<boolean>(false);
  const { visible, onCancel, onOk, todo } = props;
  const formikRef = useRef(null) as any;
  const initialValues: TodoFormValues = { title: todo.title, description: todo.description };

  return (
    <Modal
      title="Edit Todo"
      visible={visible}
      onCancel={onCancel}
      destroyOnClose
      footer={[
        <Button key="close" onClick={onCancel}>
          Cancel
        </Button>,
        <Button
          key="submit"
          type="primary"
          onClick={() => formikRef.current.handleSubmit()}
          loading={isLoading}
        >
          Edit
        </Button>,
      ]}
    >
      <Formik
        innerRef={formikRef}
        initialValues={initialValues}
        validationSchema={validateSchema}
        onSubmit={async (values) => {
          try {
            setLoading(true);
            const response = await http.put(
              `todo/todos/${todo._id}`,
              {
                title: values.title,
                description: values.description,
              },
              {
                headers: {
                  authorization: `Bearer ${getStoredAuthToken()}`,
                },
              },
            );
            setLoading(false);

            if (response.data._id) {
              message.success(`Updated ${response.data.title}`);
              onOk(response.data);
            }
          } catch (error) {
            message.error(error.message);
            setLoading(false);
          }
        }}
      >
        {({ errors, handleChange, handleBlur, touched, values }) => {
          return (
            <div>
              <Row gutter={[16, 16]}>
                <Col span={24}>
                  Title:<Text type="danger">*</Text>
                  <Form.Item
                    validateStatus={errors.title && touched.title ? 'error' : undefined}
                    help={errors.title && touched.title ? errors.title : undefined}
                  >
                    <Input
                      value={values.title}
                      name="title"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder="required"
                    />
                  </Form.Item>
                </Col>
                <Col span={24}>
                  Description:<Text type="danger">*</Text>
                  <Form.Item
                    validateStatus={errors.description && touched.description ? 'error' : undefined}
                    help={
                      errors.description && touched.description ? errors.description : undefined
                    }
                  >
                    <Input
                      value={values.description}
                      name="description"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder="required"
                    />
                  </Form.Item>
                </Col>
              </Row>
            </div>
          );
        }}
      </Formik>
    </Modal>
  );
};

export default ModalEditTodo;
