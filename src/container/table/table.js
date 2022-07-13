import "./table.scss";
import {
  Form,
  Input,
  InputNumber,
  Popconfirm,
  Table,
  Typography,
  Button,
  Modal,
} from "antd";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { table_data } from "../../redux/action/actions";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";



const EditableCell = ({
  editing,
  dataIndex,
  title,
  inputType,
  record,
  index,
  children,
  ...restProps
}) => {
  const inputNode = inputType === "number" ? <InputNumber /> : <Input />;

  return (
    <td {...restProps}>
      {editing ? (
        <Form.Item
          name={dataIndex}
          style={{
            margin: 0,
          }}
          rules={[
            {
              required: true,
              message: `Please Input ${title}!`,
            },
          ]}
        >
          {inputNode}
        </Form.Item>
      ) : (
        children
      )}
    </td>
  );
};


const TableListBlock = ({ proArr, setProArr }) => {
  const [visible, setVisible] = useState(false);

  const [data, setData] = useState(proArr);
  const [post, setPost] = useState([]);
  const dispatch = useDispatch()
  const tableData = useSelector(state => state.data.data)
  const [form] = Form.useForm();

  useEffect(() => {
    axios
      .get(`http://23.88.43.148/users`, {
      })

      .then(function (response) {
        dispatch(table_data(response.data));
        setProArr(response.data);
        setData(response.data);
      })
  }, [post]);
  
  

  const handleSubmit = (e) => {
    axios
      .post("http://23.88.43.148/users", {
        name: e.name,
        surname: e.surname,
        desc: e.desc,
      })
      .then((res) => setPost(res));

    form.resetFields();

    
  };


  const [editingKey, setEditingKey] = useState("");

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  const isEditing = (record) => record._id === editingKey;

  const edit = (record) => {
    form.setFieldsValue({
      name: "",
      surname: "",
      desc: "",
      ...record,
    });
    setEditingKey(record._id);
  };

  const cancel = () => {
    setEditingKey("");
  };
  const deleteItem = (index) => {
    axios.delete(
        `http://23.88.43.148/user/${index}`,
        
        ).then(e => setPost(e))
  } 
;
  const save = async (key) => {
    try {
      const row = await form.validateFields();
      const newData = [...proArr];
      const index = newData.findIndex((item) => key === item._id);
      if (index > -1) {
        const item = newData[index];
        newData.splice(index, 1, { ...item, ...row });
        setData(newData);
        axios.put(
          `http://23.88.43.148/user/${newData[index].user_id}`,
          JSON.stringify(row),
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        setEditingKey("");
      } else {
        newData.push(row);
        setData(newData);
        setEditingKey("");
      }
    } catch (errInfo) {
      console.log("Validate Failed:", errInfo);
    }
  };


  const columns = [
    {
      title: "name",
      dataIndex: "name",
      width: "25%",
      editable: true,
    },
    {
      title: "surname",
      dataIndex: "surname",
      width: "15%",
      editable: true,
    },
    {
      title: "desc",
      dataIndex: "desc",
      width: "40%",
      editable: true,
    },
    {
      title: "operation",
      dataIndex: "operation",
      render: (_, record) => {
        const editable = isEditing(record);
        return editable ? (
          <span>
            <Typography.Link
              onClick={() => save(record._id)}
              style={{
                marginRight: 8,
              }}
            >
              Save
            </Typography.Link>
            <Popconfirm title="Sure to cancel?" onConfirm={cancel}>
              <a>Cancel</a>
            </Popconfirm>
         
          </span>
        ) : (
            <>
          <Typography.Link onClick={() => edit(record)}>Edit</Typography.Link>
            <Button style={{marginLeft:'10px'}} type="danger" onClick={() => deleteItem(record.user_id)}>
                  delete
            </Button>
          </>
        );
      },
    },
  ];

  const mergedColumns = columns.map((col) => {
    if (!col.editable) {
      return col;
    }

    return {
      ...col,
      onCell: (record) => ({
        record,
        inputType: col.dataIndex === "surname" ? "text" : "text",
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    };
  });
  return (
    <div className="table_block">
      <Form form={form} component={false}>
        <Table
          components={{
            body: {
              cell: EditableCell,
            },
          }}
          bordered
          dataSource={tableData}
          columns={mergedColumns}
          rowClassName="editable-row"
          pagination={{
            onChange: cancel,
          }}
          
        />
      </Form>

      <Button type="primary" onClick={() => setVisible(true)}>
        add new user
      </Button>

      <Modal
        title="add new user"
        centered
        visible={visible}
        onOk={() => setVisible(false)}
        onCancel={() => setVisible(false)}
        width={500}
      >
        <Form
          name="basic"
          labelCol={{
            span: 5,
          }}
          wrapperCol={{
            span: 10,
          }}
          initialValues={{
            remember: true,
          }}
          onFinish={handleSubmit}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
          form={form}
        >
        
          <Form.Item
            label="name"
            name="name"
            rules={[
              {
                required: true,
                message: "Please input your username!",
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="surname"
            name="surname"
            rules={[
              {
                required: true,
                message: "Please input your usersurname!",
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="desc"
            name="desc"
            rules={[
              {
                required: true,
                message: "Please input your userdesc!",
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="remember"
            valuePropName="checked"
            wrapperCol={{
              offset: 8,
              span: 16,
            }}
          ></Form.Item>

          <Form.Item
            wrapperCol={{
              offset: 8,
              span: 16,
            }}
          >
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default TableListBlock;
