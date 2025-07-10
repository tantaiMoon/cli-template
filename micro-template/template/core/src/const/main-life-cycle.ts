
export interface LifeCycleProps {
  bootstrap?: Function | Function[]
  mounted?: Function | Function[]
  unmounted?: Function | Function[]
}

let mainLifeCycle: LifeCycleProps = {}

export function setMainLifeCycle(props: LifeCycleProps): void {
  if (props.bootstrap) {
    mainLifeCycle.bootstrap = Array.isArray(props.bootstrap) ? props.bootstrap : [props.bootstrap]
  }
  if (props.mounted ) {
    mainLifeCycle.mounted = Array.isArray(props.mounted) ? props.mounted : [props.mounted]
  }
  if (props.unmounted) {
    mainLifeCycle.unmounted = Array.isArray(props.unmounted) ? props.unmounted : [props.unmounted]
  }
}

export const getMainLifeCycle = () => mainLifeCycle
