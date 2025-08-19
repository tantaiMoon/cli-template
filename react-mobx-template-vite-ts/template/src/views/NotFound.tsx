import { Button } from 'antd'
import { useNavigate } from 'react-router-dom'

export const NotFound = () => {
  const navigate = useNavigate()
  return (
    <div>
      NotFound
      <Button type={'primary'} onClick={() => navigate('/')}>
        去首页
      </Button>
    </div>
  )
}
