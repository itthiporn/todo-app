import React, { useState } from 'react';
import { message, Modal, Typography, Button } from 'antd';

import http from 'shared/config/http-common';
import { TodoList } from 'shared/models/todoList.model';
import { getStoredAuthToken } from 'shared/utils/authToken';

const { Text } = Typography;

interface ModalDeleteTodoProps {
  visible: boolean;
  onCancel: () => void;
  onOk: (todo: TodoList) => void;
  todo: TodoList;
}

const ModalDeleteTodo: React.FC<ModalDeleteTodoProps> = (props) => {
  const [isLoading, setLoading] = useState<boolean>(false);
  const { visible, onCancel, onOk, todo } = props;

  const deleteTodo = async () => {
    try {
      setLoading(true);
      await http.delete(`todo/todos/${todo._id}`, {
        headers: {
          authorization: `Bearer ${getStoredAuthToken()}`,
        },
      });
      setLoading(false);

      message.success(`${todo.title} Deleted`);
      onOk(todo);
    } catch (error) {
      message.error(error.message);
      setLoading(false);
    }
  };

  return (
    <Modal
      title="Delete Todo"
      visible={visible}
      onCancel={onCancel}
      destroyOnClose
      footer={[
        <Button key="close" onClick={onCancel}>
          Cancel
        </Button>,
        <Button key="submit" danger onClick={() => deleteTodo()} loading={isLoading}>
          Delete
        </Button>,
      ]}
    >
      Want delete <Text strong>{todo.title}</Text> ?
    </Modal>
  );
};

export default ModalDeleteTodo;
