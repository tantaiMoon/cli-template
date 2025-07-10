import { z } from 'zod'

export const userLoginSchema = z.object({
  username: z
    .string()
    .min(4, '最短4位')
    .regex(/^[a-zA-Z][a-zA-Z0-9_]*$/, '用户名必须以字母开头，只能包含字母、数字和下划线')
    .max(20),
  password: z.string().min(8, '最短8位').max(20, '最长20位')
})

export const userSignupSchema = z.object({
  email: z.string({ message: '邮箱不能为空' }).email('邮箱格式错误').optional(),
  username: z
    .string()
    .min(4, '最短4位')
    .regex(/^[a-zA-Z][a-zA-Z0-9_]*$/, '用户名必须以字母开头，只能包含字母、数字和下划线')
    .max(20),
  password: z.string().min(8, '最短8位').max(20, '最长20位'),
  confirmPassword: z
    .string()
    .min(8, '最短8位')
    .max(20, '最长20位')
    .refine((data) => data.password === data.confirmPassword, {
      message: "passwords don't match",
      path: ['confirmCassword']
    })
})
export type UserLoginType = z.infer<typeof userLoginSchema>
