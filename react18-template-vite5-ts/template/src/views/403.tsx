import { FunctionComponent } from 'react'
import { Button, Result } from 'antd'
import { useNavigate } from 'react-router-dom'

interface NotFoundProps {}

const NotPermission: FunctionComponent<NotFoundProps> = () => {
  const navigate = useNavigate()
  const handleHome = () => {
    navigate('/home', { replace: true })
  }
  return (
    <Result
      status={403}
      title={'403'}
      subTitle="抱歉，页面没有权限！"
      extra={
        <Button
          type="primary"
          onClick={handleHome}
        >
          回首页
        </Button>
      }
    />
  )
}

export default NotPermission
