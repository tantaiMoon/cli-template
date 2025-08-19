import { stores } from '@/stores'
import { createContext, useContext } from 'react'

export const StoreContext = createContext(stores)

export const useStores = () => {
  const context = useContext(StoreContext)
  if (!context) throw new Error('useStores must bu used within StoreProvider')
  return context
}
