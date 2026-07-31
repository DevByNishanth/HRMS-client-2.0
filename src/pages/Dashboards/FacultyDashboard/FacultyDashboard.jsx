import React,{useState, useEffect} from 'react'
import Sidebar from '../../../components/Siedbar'
import CommonHeader from '../../../components/CommonHeader'
import FacultyDashboardBody from './FacultyDashboardBody'
import DoumentUploadFormModal from "../../../components/DoumentUploadFormModal";
import { jwtDecode } from "jwt-decode";

const FacultyDashboard = () => {
  // console.log("")

   const [openDocumentUploadModal, setOpenDocumentUploadModal] = useState(false);
    const token = localStorage.getItem("hrms_token");
    useEffect(() => {
      if (token) {
        let decoded = jwtDecode(token);
        if (decoded.isFirstTimeLogin) {
          setOpenDocumentUploadModal(true);
        }
      }
      return;
    }, []);
  return (
    <>
      {openDocumentUploadModal && (
        <DoumentUploadFormModal
          onClose={() => setOpenDocumentUploadModal(false)}
        />
      )}
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
