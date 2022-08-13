import React, { Fragment, useContext, useState, useEffect, useRef } from 'react'
import { message, Table, Button, Modal, Form, Input } from 'antd'
import { DeleteTwoTone, ExclamationCircleOutlined } from "@ant-design/icons"
import type { InputRef } from 'antd';
import type { FormInstance } from 'antd/lib/form';
import axios from '../../../../axiosModel'
interface ICategory {
  id: number;
  title: string;
  value: string;
}

interface EditableRowProps {
  index: number;
}
interface EditableCellProps {
  title: React.ReactNode;
  editable: boolean;
  children: React.ReactNode;
  dataIndex: keyof ICategory;
  record: ICategory;
  handleSave: (record: ICategory) => void;
}
const { confirm } = Modal
const EditableContext = React.createContext<FormInstance<any> | null>(null);
const EditableRow: React.FC<EditableRowProps> = ({ index, ...props }) => {
  const [form] = Form.useForm();
  return (
    <Form form={form} component={false}>
      <EditableContext.Provider value={form}>
        <tr {...props} />
      </EditableContext.Provider>
    </Form>
  );
};
const EditableCell: React.FC<EditableCellProps> = ({
  title,
  editable,
  children,
  dataIndex,
  record,
  handleSave,
  ...restProps
}) => {
  const [editing, setEditing] = useState(false);
  const inputRef = useRef<InputRef>(null);
  const form = useContext(EditableContext)!;

  useEffect(() => {
    if (editing) {
      inputRef.current!.focus();
    }
  }, [editing]);

  const toggleEdit = () => {
    setEditing(!editing);
    form.setFieldsValue({ [dataIndex]: record[dataIndex] });
  };

  const save = async () => {
    try {
      const values = await form.validateFields();

      toggleEdit();
      handleSave({ ...record, ...values });
    } catch (errInfo) {
      console.log('Save failed:', errInfo);
    }
  };

  let childNode = children;

  if (editable) {
    childNode = editing ? (
      <Form.Item
        style={{ margin: 0 }}
        name={dataIndex}
        rules={[
          {
            required: true,
            message: `${title} is required.`,
          },
        ]}
      >
        <Input ref={inputRef} onPressEnter={save} onBlur={save} />
      </Form.Item>
    ) : (
      <div className="editable-cell-value-wrap" style={{ paddingRight: 24 }} onClick={toggleEdit}>
        {children}
      </div>
    );
  }

  return <td {...restProps}>{childNode}</td>;
};

export default function NewsCateGory() {

  const [CategoryData, setCategoryData] = useState<ICategory[]>([])
  useEffect(() => {
    axios.get("categories").then(res => {
      if (res.status !== 200) return message.error("获取分类失败！")
      setCategoryData(res.data);
    })
  }, [])
  const HandleDelete = (item: ICategory) => {
    confirm({
      title: '角色删除',
      icon: <ExclamationCircleOutlined />,
      content: '确定删除该角色吗？',
      onOk() {
        setCategoryData(CategoryData.filter(children => {
          return children.id !== item.id;
        }))
        // axios.delete(`categories/${item.id}`).then(res => {
        //     if (res.status !== 200) return message.error("删除失败！")
        //     message.success("删除成功！")
        // })
      }
    });
  }
  const handleSave = (record: ICategory) => {
    console.log(record);
    axios.patch(`categories/${record.id}`, {
      title: record.title
    }).then(res => {
      setCategoryData(CategoryData.map(item => {
        // item.id === record.id && (item.title = record.title);//法一
        if (item.id === record.id) return { ...item, title: record.title }//法二
        return item;
      }))
    })
  }
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      render: (id: string) => {
        return <b>{id}</b>
      },
      width: '12%',
    },
    {
      title: '栏目名称',
      dataIndex: 'title',
      width: '40%',
      onCell: (record: ICategory) => ({
        record,
        editable: true,
        dataIndex: 'title',
        title: '栏目名称',
        handleSave,
      }),
    },
    {
      title: '操作',
      width: '30%',
      render: (item: ICategory) => {
        return <Button shape="circle" icon={<DeleteTwoTone />} onClick={() => { HandleDelete(item) }}></Button>
      }
    },
  ];
  return (
    <Fragment><Table
      columns={columns}
      dataSource={CategoryData}
      components={{
        body: {
          row: EditableRow,
          cell: EditableCell,
        },
      }}
      rowKey={'id'}
      pagination={{
        pageSize: 5
      }}
    />
    </Fragment >


  )
}
