import React from 'react'
import Sidebar from '../../../../components/Siedbar'
import CommonHeader from '../../../../components/CommonHeader'
import AttendanceBody from './AttendanceBody'

export default function HolidayManagement() {
  return (
    <div className='flex h-screen overflow-hidden bg-[#051424]'>
      <Sidebar/>
      <div className="flex min-w-0 flex-1 flex-col">
        <CommonHeader />
        <AttendanceBody />
      </div>
    </div>
  )
}
