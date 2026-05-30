import React from 'react'
import Sidebar from '../../../components/Siedbar'
import CommonHeader from '../../../components/CommonHeader'
import FacultyDashboardBody from './FacultyDashboardBody'

const FacultyDashboard = () => {
  return (
    <>
      <div className='flex h-screen overflow-hidden bg-[#051424]'>
        <Sidebar />
        {/* right container  */}

        <div className="flex min-w-0 flex-1 flex-col">
          <CommonHeader />
          <FacultyDashboardBody />
        </div>

      </div>
    </>
  )
}

export default FacultyDashboard
