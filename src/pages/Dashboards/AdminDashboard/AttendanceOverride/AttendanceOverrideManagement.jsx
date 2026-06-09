import React from 'react'
import Sidebar from '../../../../components/Siedbar'
import CommonHeader from '../../../../components/CommonHeader'
import AttendanceOverrideBody from './AttendanceOverrideBody'

export default function AttendanceOverrideManagement() {
    return (
        <div className='flex h-screen overflow-hidden bg-[#051424]'>
            <Sidebar/>
            <div className="flex min-w-0 flex-1 flex-col">
                <CommonHeader />
                <AttendanceOverrideBody/>
            </div>
        </div>
    )
}
