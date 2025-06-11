import { Button, Form, FormProps, Input } from 'antd'
import { useCallback, useEffect, useState } from 'react'
import { getCaptchaApi } from '@/api/user.ts'
import { useAppDispatch } from '@/hooks/useAppStore.ts'
import { userLogin } from '@/stores/system'
import './login.scss'
import { useNavigate } from 'react-router-dom'

type FieldType = {
  username?: string
  password?: string
  captcha?: string
}

export const Login = () => {
  const dispatch = useAppDispatch()
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
      const imgData = new Blob([result as any], { type: 'image/svg+xml' })
      setCaptchaImg(URL.createObjectURL(imgData))
    }
  }, [])
  useEffect(() => {
    getCaptcha()
  }, [getCaptcha])

  const login: FormProps<FieldType>['onFinish'] = (values: FieldType) => {
    console.log(values)
    dispatch(userLogin(values)).then((res) => {
      console.log('login', res)
      if (res.payload?.token?.access_token) {
        navigate('/home')
      }
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
        <Form.Item<FieldType>
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
        <Form.Item<FieldType>
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
        <Form.Item<FieldType>
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
}
