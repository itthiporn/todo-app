import React, { useCallback, useEffect, useState } from 'react';
import { PlusOutlined, CloseOutlined, EditOutlined } from '@ant-design/icons';
import { message, Button, Typography, Row, Col, Card } from 'antd';
import { RouteComponentProps } from 'react-router-dom';
import moment from 'moment';

import ModalAddTodo from './ModalAddTodo';
import ModalEditTodo from './ModalEditTodo';
import ModalDeleteTodo from './ModalDeleteTodo';
import { Container } from './Styles';
import { removeStoredAuthToken } from 'shared/utils/authToken';
import http from 'shared/config/http-common';
import { TodoList } from 'shared/models/todoList.model';
import { getStoredAuthToken } from 'shared/utils/authToken';

const { Text } = Typography;

interface ChildComponentProps extends RouteComponentProps<any> {}

const Todo: React.FC<ChildComponentProps> = ({ history }) => {
  const [isOpenModalCreate, setOpenModalCreate] = useState<boolean>(false);
  const [isOpenModalEdit, setOpenModalEdit] = useState<boolean>(false);
  const [isOpenModalDelete, setOpenModalDelete] = useState<boolean>(false);
  const [selectedTodo, setSelectedTodo] = useState<TodoList>({
    _id: '',
    title: '',
    description: '',
    updatedAt: '',
  });
  const [todos, setTodos] = useState<TodoList[]>([]);

  const fetchData = useCallback(async () => {
    try {
      const response = await http.get('todo/todos', {
        headers: {
          authorization: `Bearer ${getStoredAuthToken()}`,
        },
      });
      setTodos(response.data);
    } catch (error) {
      message.error(error.message);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <Container>
      <Row gutter={[8, 8]}>
        <Col span={24}>
          {todos.length === 0 && (
            <Text type="secondary">Empty press 'Create' for add new todo</Text>
          )}
          <Row gutter={[0, 24]}>
            {todos.map((todo) => (
              <Col span={24} key={todo._id}>
                <Card
                  type="inner"
                  title={todo.title}
                  extra={
                    <>
                      <Button
                        style={{
                          marginRight: 10,
                        }}
                        onClick={() => {
                          setOpenModalEdit(true);
                          setSelectedTodo({
                            _id: todo._id,
                            title: todo.title,
                            description: todo.description,
                            updatedAt: todo.updatedAt,
                          });
                        }}
                        icon={<EditOutlined />}
                      />
                      <Button
                        onClick={() => {
                          setOpenModalDelete(true);
                          setSelectedTodo({
                            _id: todo._id,
                            title: todo.title,
                            description: todo.description,
                            updatedAt: todo.updatedAt,
                          });
                        }}
                        icon={<CloseOutlined style={{ color: 'red' }} />}
                      />
                    </>
                  }
                >
                  {todo.description}
                  <div style={{ marginTop: 10 }}>
                    <Text disabled>
                      Updated at: {moment(todo.updatedAt).format('DD MMMM YYYY HH:mm')}
                    </Text>
                  </div>
                </Card>
              </Col>
            ))}
          </Row>
        </Col>
        <Col span={24} style={{ marginTop: 20 }}>
          <Button type="primary" icon={<PlusOutlined />} onClick={() => setOpenModalCreate(true)}>
            Create
          </Button>
          <Button
            type="link"
            onClick={() => {
              removeStoredAuthToken();
              return history.push('/login');
            }}
          >
            Logout
          </Button>
        </Col>
      </Row>
      <ModalAddTodo
        visible={isOpenModalCreate}
        onCancel={() => setOpenModalCreate(false)}
        onOk={(todo) => {
          setOpenModalCreate(false);
          setTodos((preTodos) => [
            ...preTodos,
            {
              _id: todo._id,
              title: todo.title,
              description: todo.description,
              updatedAt: todo.updatedAt,
            },
          ]);
        }}
      />
      <ModalEditTodo
        visible={isOpenModalEdit}
        onCancel={() => setOpenModalEdit(false)}
        onOk={(todo) => {
          setOpenModalEdit(false);
          setTodos((prevTodos) =>
            prevTodos.map((item) =>
              item._id === todo._id
                ? {
                    _id: item._id,
                    title: todo.title,
                    description: todo.description,
                    updatedAt: todo.updatedAt,
                  }
                : item,
            ),
          );
        }}
        todo={selectedTodo}
      />
      <ModalDeleteTodo
        visible={isOpenModalDelete}
        onCancel={() => setOpenModalDelete(false)}
        onOk={(todo) => {
          setOpenModalDelete(false);
          setTodos((prevTodos) => prevTodos.filter((item) => item._id !== todo._id));
        }}
        todo={selectedTodo}
      />
    </Container>
  );
};

export default Todo;
