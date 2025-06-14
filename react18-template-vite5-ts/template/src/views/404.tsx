import { FunctionComponent } from 'react'
import { Button, Result } from 'antd'
import { useNavigate } from 'react-router-dom'

interface NotFoundProps {}

const NotFound: FunctionComponent<NotFoundProps> = () => {
  const navigate = useNavigate()
  const handleHome = () => {
    navigate('/home', { replace: true })
  }
  return (
    <Result
      status={404}
      title={'404'}
      subTitle="抱歉，页面未找到！"
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

export default NotFound
