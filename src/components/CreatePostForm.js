import React from 'react';
import { Form, Input} from 'antd';

const FormItem = Form.Item;
class CreatePostForm extends React.Component{
  render(){
    const { getFieldDecorator } = this.props.form;
    return(
        <Form layout="vertical">
          <FormItem label="Message">
            {getFieldDecorator('message', {
              rules: [{ required: true, message: 'Please input a message' }],
            })(
                <Input />
            )}
          </FormItem>
        </Form>
    )
  }
}

export const WrappedCreatePostForm = Form.create()(CreatePostForm);