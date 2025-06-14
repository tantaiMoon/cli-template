import React from 'react'
import { DatePicker, Pagination } from 'antd'

export default function User() {
  return (
    <div>
      user
      <DatePicker />
      <Pagination defaultCurrent={1} total={50} showSizeChanger />
    </div>
  )
}
