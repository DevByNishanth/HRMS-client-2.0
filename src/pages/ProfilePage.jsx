import React from 'react'
import Sidebar from '../components/Siedbar'
import CommonHeader from '../components/CommonHeader'
import ProfileBody from './Profile/ProfileBody'

const ProfilePage = () => {


    return (
        <>
            <div className='flex h-screen overflow-hidden bg-[#020618]'>
                <Sidebar />
                {/* right container  */}

                <div className="flex min-w-0 flex-1 flex-col">
                    <CommonHeader />
                    <ProfileBody />
                </div>
            </div>
        </>

    )
}
export default ProfilePage
