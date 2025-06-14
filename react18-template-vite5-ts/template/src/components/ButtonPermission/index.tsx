import { FunctionComponent, ReactNode } from 'react'
import { ButtonProps } from 'antd'
import useAuthButtons from '@/hooks/useAuthButtons.ts'

type ButtonComp = FunctionComponent<ButtonProps> | null
const ButtonPer = (permission: string, Comp: ButtonComp): ReactNode | null => {
  const { BUTTONS } = useAuthButtons()
  if (!Comp) return null
  if (!permission) return <Comp />
  if (Object.keys(BUTTONS).length === 0) {
    return null
  }
  if (BUTTONS && BUTTONS.includes(permission) && Comp) {
    return <Comp />
  }
  return null
}
export default ButtonPer
