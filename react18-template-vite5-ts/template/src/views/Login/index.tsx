import { useEffect, useReducer, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import qs from 'qs'
import { Button, Checkbox, Form, Input } from 'antd'
import { useForm } from 'antd/es/form/Form'
import { useDispatch, useSelector } from 'react-redux'
import { getMenusByRole } from '@/store/permission/action.ts'
import { dispatchLogin } from '@/store/user/action.ts'

interface Props {}

const initState = {
  username: '',
  password: '',
  isLoading: false,
  remember: true
}

interface Action {
  type?: 'SET_NAME' | 'SET_PWD' | 'SET_LOADING' | 'SET_REMEMBER'
  payload: any
}

const reducer = (state: typeof initState, action: Action) => {
  switch (action.type) {
    case 'SET_NAME':
      return {
        ...state,
        username: action.payload
      }
    case 'SET_PWD':
      return {
        ...state,
        password: action.payload
      }
    case 'SET_REMEMBER':
      return {
        ...state,
        remember: action.payload
      }
    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload as boolean
      }
    default:
      return {
        ...state,
        username: '',
        password: '',
        isLoading: false
      }
  }
}

const Login = () => {
  const [captchaImg, setcaptchaImg] = useState<string | null>(null)
  const [searchParmas] = useSearchParams()
  const navigate = useNavigate()
  const [loginForm, setForm] = useReducer(reducer, initState)
  const [formIns] = useForm()
  const userStore = useSelector((state: RootState) => state.user)
  console.log(userStore, 'root')
  const dispatch = useDispatch()
  const toLogin = async (values: typeof initState) => {
    // const values = await formIns.validateFields()
    console.log(values)
    if (!values) return
    try {
      setForm({ type: 'SET_LOADING', payload: true })
      dispatch<any>(dispatchLogin(values))
      // dispatch<any>(getMenusByRole(userStore.roles!))
      // let path = '/'
      // if (searchParmas.get('redirect')) {
      //   path = searchParmas.get('redirect')!
      //   const query: any = {}
      //   searchParmas.forEach((value, key) => {
      //     if (key !== 'redirect') query[key] = value
      //   })
      //   path += '?' + qs.stringify(query)
      // }
      // setForm({ payload: false })
      // navigate(path)
      // window.location.reload()
    } catch (e) {
      console.log(e)
      setForm({ payload: false })
    }
  }
  useEffect(() => {
    const getCaptcha = async () => {}
  }, [])
  const onFinishFailed = () => {}
  return (
    <div
      className="login-wrapper"
      w-full
      h-full
      bg-blue-950
    >
      <Form
        form={formIns}
        className="w-600px m-0 m-auto h-400px p-40px rd-4px shadow-light-900 shadow-md bg-fuchsia-2"
        style={{}}
        initialValues={loginForm}
        onFinish={toLogin}
        onFinishFailed={onFinishFailed}
      >
        <Form.Item
          className="Item"
          name="username"
          rules={[{ required: true, message: '请输入用户名' }]}
        >
          <Input
            placeholder="用户名"
            size="large"
          />
        </Form.Item>
        <Form.Item
          name="password"
          rules={[{ required: true, message: '请输入密码' }]}
        >
          <Input
            type="password"
            placeholder="密码 "
          />
        </Form.Item>
        <Form.Item
          name="captcha"
          rules={[{ required: true, message: '请输入验证码' }]}
        >
          <Input
            type="text"
            maxLength={4}
            placeholder="验证码 "
            addonAfter={
              <img
                src={captchaImg!}
                alt=""
                className="w-120px h-full"
              />
            }
          />
        </Form.Item>
        <Form.Item
          name="remember"
          valuePropName="checked"
        >
          <Checkbox> Remember me</Checkbox>
        </Form.Item>
        <Form.Item>
          <Button
            type="primary"
            size="large"
            style={{ width: '100%' }}
            disabled={loginForm.isLoading}
            htmlType="submit"
          >
            {loginForm.isLoading ? '登录中...' : '登录'}
          </Button>
        </Form.Item>
      </Form>
    </div>
  )
}

export default Login
