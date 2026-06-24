import { useLocation, useParams, useSearchParams } from 'react-router-dom'
import { jwtDecode } from 'jwt-decode'
import Sidebar from '../components/Siedbar'
import CommonHeader from '../components/CommonHeader'
import ProfileBody from './Profile/ProfileBody'

const ProfilePage = () => {
    const { empid } = useParams();
    const [searchParams] = useSearchParams();
    const location = useLocation();
    const userId = location.state?.userId || empid;

    // Determine if the logged-in user is viewing their own profile
    const urlId = searchParams.get("id") || empid;

    let loggedInFacultyId = "";
    try {
        const token = localStorage.getItem("hrms_token");
        if (token) {
            const decoded = jwtDecode(token);
            loggedInFacultyId = decoded.facultyId;
        }
    } catch {
        loggedInFacultyId = "";
    }

    const canEditOwnProfile = String(urlId) === String(loggedInFacultyId);

    return (
        <>
            <div className='flex h-screen overflow-hidden bg-[#071425]'>
                <Sidebar />
                {/* right container  */}

                <div className="flex min-w-0 flex-1 flex-col">
                    <CommonHeader />
                   
                    <ProfileBody userId={userId} canEditOwnProfile={canEditOwnProfile} />
                </div>
            </div>
        </>

    )
}
export default ProfilePage
