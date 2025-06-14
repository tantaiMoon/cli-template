import { forwardRef } from 'react'
import { Button, Form, Input, Radio, Select, Space } from 'antd'

interface GenFormProps {
  config: FormConfigItem[]
  onFinish?: (values: any) => void
  onReset?: () => void
  values?: any
  confirmText?: string
  className?: string
  resetText?: string
  ref?: any
  isDialog?: boolean
}

const GeneratorForm: React.FC<GenFormProps> = forwardRef<any, GenFormProps>(
  (
    {
      config,
      onFinish,
      onReset,
      values,
      confirmText = '查询',
      className = '',
      resetText = '重置',
      isDialog = false
    },
    ref
  ) => {
    const renderItem = (item: FormConfigItem) => {
      switch (item.type) {
        case 'input':
          return (
            <Input
              placeholder={item.placeholder}
              value={values?.[item.key]}
            />
          )
        case 'password':
          return (
            <Input.Password
              placeholder={item.placeholder}
              value={values?.[item.key]}
            />
          )
        case 'select':
          return (
            <Select
              placeholder={item.placeholder}
              value={values?.[item.key]}
            >
              {item.options?.map((option: SelectOptionConfig) => {
                return (
                  <Select.Option
                    key={option.value}
                    value={option.value}
                  >
                    {option.label}
                  </Select.Option>
                )
              })}
            </Select>
          )
        case 'radio':
          return <Radio value={item.label} />
      }
    }

    return (
      <Form
        ref={ref}
        className={className}
        onFinish={onFinish}
        onReset={onReset}
      >
        {config.map((item) => {
          return (
            <Form.Item
              key={item.key}
              label={item.label}
              name={item.name}
            >
              {renderItem(item)}
            </Form.Item>
          )
        })}
        {!isDialog && (
          <Form.Item>
            <Space>
              <Button
                type="primary"
                htmlType="submit"
              >
                {confirmText}
              </Button>
              <Button
                type="primary"
                htmlType="reset"
              >
                {resetText}
              </Button>
            </Space>
          </Form.Item>
        )}
      </Form>
    )
  }
)

export default GeneratorForm
