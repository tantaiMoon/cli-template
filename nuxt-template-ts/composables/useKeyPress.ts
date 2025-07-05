
export const useKeyPress = (key: string, cb: () => void) => {
  const trigger = (event: KeyboardEvent) => {
    if (event.key === key) {
      cb()
    }
  }
  onMounted(() => {
    document.addEventListener('keydown', trigger)
  })
  onUnmounted(() => {
    document.removeEventListener('keydown', trigger)
  })
}
