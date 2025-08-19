import { Button, Form, FormProps, Input } from 'antd'
import { observer } from 'mobx-react-lite'
import { useCallback, useEffect, useState } from 'react'
import { getCaptchaApi } from '@/api/user.ts'
import { useStores } from '@/hooks/useAppStore.ts'
import './login.scss'
import { useNavigate } from 'react-router-dom'

export const Login = observer(() => {
  const {globalStore} = useStores()
  const navigate = useNavigate()
  const [captchaImg, setCaptchaImg] = useState('')
  const [loginState, setLoginState] = useState({
    username: '',
    password: '',
    captcha: ''
  })
  const getCaptcha = useCallback(async () => {
    const [, result] = await getCaptchaApi()
    if (result) {
      const imgData = new Blob([result as never], { type: 'image/svg+xml' })
      setCaptchaImg(URL.createObjectURL(imgData))
    }
  }, [])
  useEffect(() => {
    void getCaptcha()
  }, [getCaptcha])

  const login: FormProps<LoginFieldType>['onFinish'] = (values: LoginFieldType) => {
    console.log(values)
    void globalStore.getUserInfo(values).then((res) => {
      console.log('login', res)
      if (res?.token?.access_token) {
        navigate('/home')
      }
      return
    })
  }
  return (
    <div className="login-container">
      <div className="background">
        <div className="shape"></div>
        <div className="shape"></div>
      </div>
      <Form className="login-form" initialValues={loginState} onFinish={login}>
        <h3 w-full>React Admin</h3>
        <Form.Item<LoginFieldType>
          name={'username'}
          rules={[{ required: true, message: 'Please input your username!' }]}
        >
          <Input
            className={'login-input'}
            maxLength={30}
            placeholder={'username'}
            value={loginState.username}
            onChange={(e) => setLoginState({ ...loginState, username: e.target.value })}
          />
        </Form.Item>
        <Form.Item<LoginFieldType>
          name={'password'}
          rules={[{ required: true, message: 'Please input your username!' }]}
        >
          <Input.Password
            className={'login-input'}
            maxLength={20}
            placeholder={'密码'}
            value={loginState.password}
            onChange={(e) => setLoginState({ ...loginState, password: e.target.value })}
          />
        </Form.Item>
        <Form.Item<LoginFieldType>
          name={'captcha'}
          rules={[{ required: true, message: 'Please input your username!' }]}
        >
          <Input
            className={'login-input captcha-input flex-1 pr-0!'}
            maxLength={4}
            placeholder={'验证码'}
            suffix={
              <img
                src={captchaImg}
                alt="captcha img"
                bg-gray-100
                h-full
                w-140px
                onClick={getCaptcha}
              />
            }
            value={loginState.captcha}
            onChange={(e) => setLoginState({ ...loginState, captcha: e.target.value })}
          />
        </Form.Item>
        <Form.Item className={'login-input px-0!'} w-full>
          <Button className={'login-button'} type="primary" htmlType="submit" w-full>
            Login
          </Button>
        </Form.Item>
      </Form>
    </div>
  )
})
