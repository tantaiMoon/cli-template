import { Reflector } from '@nestjs/core'
import { SetMetadata } from '@nestjs/common'
import { ActionEnum } from '@/common/enums/actions.enum'

const accumulateMetadata =
  (key: string, permission: string) =>
  (target: any, propertyKey?: string | symbol, descriptor?: TypedPropertyDescriptor<any>) => {
    const reflector = new Reflector()
    // 针对方法
    if (descriptor && descriptor.value) {
      // 获取 路由方法 已有的权限
      const existingPermisssions: string[] = reflector.get(key, descriptor.value) || []
      // 添加新的权限
      const newPermission: string[] = [...existingPermisssions, permission]
      // 重新设置元数据
      SetMetadata(key, newPermission)(target, propertyKey!, descriptor)
    } else {
      // 针对类 -> constructor
      // 获取 装饰器类上 已有的权限
      const existingPermisssions: string[] = reflector.get(key, target) || []
      // 添加新的权限
      const newPermission: string[] = [...existingPermisssions, permission]
      // 重新设置元数据
      SetMetadata(key, newPermission)(target)
    }
  }

export const PERMISSION_KEY = 'permission'

export const Permission = (permission: string) => accumulateMetadata(PERMISSION_KEY, permission)

export const PermissionCreate = () =>
  accumulateMetadata(PERMISSION_KEY, ActionEnum.Create.toLocaleLowerCase())

export const PermissionUpdate = () =>
  accumulateMetadata(PERMISSION_KEY, ActionEnum.Update.toLocaleLowerCase())

export const PermissionRead = () =>
  accumulateMetadata(PERMISSION_KEY, ActionEnum.Read.toLocaleLowerCase())

export const PermissionDelete = () =>
  accumulateMetadata(PERMISSION_KEY, ActionEnum.Delete.toLocaleLowerCase())
