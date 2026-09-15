import React from 'react'
import Sidebar from '../../../../components/Siedbar'
import CommonHeader from '../../../../components/CommonHeader'
import LeaveTypeBody from './LeaveTypeBody'

export default function LeaveTypeManagement() {
  return (
    <div className='flex h-screen overflow-hidden bg-[var(--theme-bg-main)]'>
      <Sidebar/>
      <div className="flex min-w-0 flex-1 flex-col">
        <CommonHeader />
        <LeaveTypeBody />
      </div>
    </div>
  )
}

