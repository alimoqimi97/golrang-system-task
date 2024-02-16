import React, { FC, useEffect } from "react";
import { Button, Checkbox, Form, Input } from "antd";
import { User } from "types";

const onFinish = (values: any) => {
  console.log("Success:", values);
};

const onFinishFailed = (errorInfo: any) => {
  console.log("Failed:", errorInfo);
};

type FieldType = {
  name?: string;
  username?: string;
  email?: string;
  phone?: string;
  website?: string;
  address?: string;
};

export interface ICustomForm {
  defaultValues?: User;
  onSubmit?: ((values: any) => void) | undefined;
}

const CustomForm: FC<ICustomForm> = ({ onSubmit, defaultValues }) => {
  const [form] = Form.useForm();

  useEffect(() => {
    form.setFieldsValue(defaultValues);
  }, [defaultValues]);

  return (
    <Form
      form={form}
      name="basic"
      labelCol={{ span: 8 }}
      wrapperCol={{ span: 16 }}
      style={{ maxWidth: 600 }}
      onFinish={(values: any) => {
        const newUser: User = {
            id: defaultValues?.id,
            ...values
        }
        onSubmit?.(newUser);
      }}
      onFinishFailed={onFinishFailed}
      autoComplete="off"
    >
      <Form.Item<FieldType>
        label="Name"
        name="name"
        rules={[{ required: true, message: "Please input your username!" }]}
      >
        <Input />
      </Form.Item>

      <Form.Item<FieldType>
        label="Username"
        name="username"
        rules={[{ required: true, message: "Please input your password!" }]}
      >
        <Input />
      </Form.Item>

      <Form.Item<FieldType>
        label="Email"
        name="email"
        rules={[{ required: true, message: "Please input your password!" }]}
      >
        <Input />
      </Form.Item>

      <Form.Item<FieldType>
        label="Phone"
        name="phone"
        rules={[{ required: true, message: "Please input your password!" }]}
      >
        <Input />
      </Form.Item>

      <Form.Item<FieldType>
        label="Address"
        name="address"
        rules={[{ required: true, message: "Please input your password!" }]}
      >
        <Input />
      </Form.Item>

      <Form.Item<FieldType>
        label="Website"
        name="website"
        rules={[{ required: true, message: "Please input your password!" }]}
      >
        <Input />
      </Form.Item>

      <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
      </Form.Item>
    </Form>
  );
};

export default CustomForm;
