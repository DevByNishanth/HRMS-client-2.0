import { useLocation, useParams } from 'react-router-dom'
import Sidebar from '../components/Siedbar'
import CommonHeader from '../components/CommonHeader'
import ProfileBody from './Profile/ProfileBody'

const ProfilePage = () => {
    const { empid } = useParams();
    const location = useLocation();
    const userId = location.state?.userId || empid;


    return (
        <>
            <div className='flex h-screen overflow-hidden bg-[#020618]'>
                <Sidebar />
                {/* right container  */}

                <div className="flex min-w-0 flex-1 flex-col">
                    <CommonHeader />
                    <ProfileBody userId={userId} />
                </div>
            </div>
        </>

    )
}
export default ProfilePage
