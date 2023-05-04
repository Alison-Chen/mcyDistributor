import { Button } from "antd"

const SubmitButton = ({
  text,
  disabled,
  htmlType,
  loading,
  onClick = () => {},
  type,
  className,
  size,
  block = false,
  danger,
}) => {
  return (
    <Button
      disabled={disabled}
      htmlType={htmlType}
      loading={loading}
      onClick={onClick}
      type={type}
      size={size}
      block={block}
      danger={danger}
    >
      {text}
    </Button>
  )
}

export default SubmitButton
