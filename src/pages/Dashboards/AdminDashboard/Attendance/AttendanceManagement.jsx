import React from 'react'
import Sidebar from '../../../../components/Siedbar'
import CommonHeader from '../../../../components/CommonHeader'
import AttendanceBody from './AttendanceBody'

export default function AttendanceManagement() {
  return (
    <div className='flex h-screen overflow-hidden bg-[var(--theme-bg-main)]'>
      <Sidebar/>
      <div className="flex min-w-0 flex-1 flex-col">
        <CommonHeader />
        <AttendanceBody />
      </div>
    </div>
  )
}
