import { Injectable } from '@nestjs/common'
import {
  AbilityBuilder,
  AbilityTuple,
  buildMongoQueryMatcher,
  createMongoAbility,
  MatchConditions,
  MongoAbility,
  MongoQuery,
  PureAbility
} from '@casl/ability'
import { allInterpreters, allParsingInstructions } from '@ucast/mongo2js'

export interface IPolicy {
  type: number // 类型标识，0-json ， 1-mongo ， 2-function
  effect: 'can' | 'cannot' // 判断逻辑字段
  action: string // 操作标识 CRUD
  subject: string // 资源标识 class 类
  fields?: string[] | string // 字段
  conditions?: string | Record<string, any> // 查询条件
  args?: string[] | string // 针对于函数场景的参数
}

type AppAbility = PureAbility<AbilityTuple, MatchConditions>
type AbilityType = MongoAbility<AbilityTuple, MongoQuery> | AppAbility

@Injectable()
export class CaslAbilityService {
  async buildAbility(polices: IPolicy[], args?: any) {
    const abilityArr: AbilityType[] = []
    let ability: AbilityType

    polices.forEach((p) => {
      switch (p.type) {
        case 0: // JSON
          ability = this.handleJsonType(p)
          break
        case 1: // Mongo
          ability = this.handleMongoType(p)
          break
        case 2: // Function
          ability = this.handleFunctionType(p, args)
          break
        default:
          ability = this.handleJsonType(p)
          break
      }
      abilityArr.push(ability)
    })
    return abilityArr
  }

  determineAction(effect: string, builder: { can: any; cannot: any }) {
    return effect === 'can' ? builder.can : builder.cannot
  }

  // can(操作「read,delete,update,create,manage」, 实体「'Article','Role'」, [字段列表「'title','content','published'」], 授权条件「{ author: 'John' }」)
  // 一般场景: can(action, subject, fields, comditions)
  handleJsonType(policy: IPolicy) {
    const { can, cannot, build } = new AbilityBuilder(createMongoAbility)
    const action = this.determineAction(policy.effect, { can, cannot })
    const localArgs: any[] = []
    if (policy.fields) {
      if (Array.isArray(policy.fields)) {
        if (policy.fields.length > 0) {
          localArgs.push(policy.fields)
        }
      } else {
        localArgs.push(policy.fields)
      }
    }
    if (policy.conditions) {
      if (Array.isArray(policy.conditions)) {
        if (policy.conditions.length > 0) {
          localArgs.push(policy.conditions)
        }
      } else {
        localArgs.push(
          typeof policy.conditions === 'object' && policy.conditions['data']
            ? policy.conditions['data']
            : policy.conditions
        )
      }
    }
    action(policy.action, policy.subject, ...localArgs)
    return build()
  }

  //   针对mongo 查询
  handleMongoType(policy: IPolicy) {
    const { can, cannot, build } = new AbilityBuilder(createMongoAbility)
    const action = this.determineAction(policy.effect, { can, cannot })
    const conditionsMatcher = buildMongoQueryMatcher(allParsingInstructions, allInterpreters)
    const localArgs: any[] = []
    if (policy.fields) {
      localArgs.push(policy.fields)
    }
    if (policy.conditions) {
      localArgs.push(
        typeof policy.conditions === 'object' && policy.conditions['data']
          ? policy.conditions['data']
          : policy.conditions
      )
    }
    action(policy.action, policy.subject, ...localArgs)
    return build({ conditionsMatcher })
  }

  // 针对函数的场景
  handleFunctionType(policy: IPolicy, args: any) {
    const { can, cannot, build } = new AbilityBuilder<AppAbility>(PureAbility)
    const lambdaMatcher = (matchConditions: MatchConditions) => matchConditions
    const action = this.determineAction(policy.effect, { can, cannot })
    let func
    if (policy.args && policy.args.length > 0) {
      if (policy.conditions && policy.conditions['data']) {
        // eslint-disable-next-line @typescript-eslint/no-implied-eval
        func = new Function(...policy.args, 'return ' + policy.conditions['data'])
      } else {
        // eslint-disable-next-line @typescript-eslint/no-implied-eval
        func = new Function('return ' + (policy.conditions as string))
      }
    } else {
      // eslint-disable-next-line @typescript-eslint/no-implied-eval
      func = new Function('return ' + (policy.conditions as string))
    }
    action(policy.action, policy.subject, func(...args))
    return build({
      conditionsMatcher: lambdaMatcher
    })
  }
}
