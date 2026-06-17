import React, { useState } from 'react'
import Sidebar from './Siedbar'
import CommonHeader from './CommonHeader'
import { Plus } from 'lucide-react'
import FacultyCompOffTable from './FacultyCompOffTable'
import ApplyCompOffForm from './ApplyCompOffForm'
import { jwtDecode } from 'jwt-decode'

// data's 
const tabs = ["My Compoff", "Approvals"]

const CompoffPage = () => {
    // Auth 
    const token = localStorage.getItem("hrms_token")
    let decoded = jwtDecode(token)
    const role = decoded.role

    // states 
    const [selectedTab, setSelectedTab] = useState("My Compoff")
    const [showCompOffForm, setShowCompOffForm] = useState(false)


    return (
        <>
            <div className="flex h-screen overflow-hidden bg-[#051424]">
                <Sidebar />

                <div className="flex min-w-0 flex-1 flex-col">
                    <CommonHeader />
                    <main className="max-h-[calc(100vh-56px)] overflow-y-auto bg-[#071425] px-4 py-4 text-white table-custom-scrollbar">
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-xl font-medium leading-tight text-white">
                                    Comp Off
                                </h1>
                                <p className="mt-1 text-[16px] text-[#9eb0cc]">
                                    Review comp off history and track approvals.
                                </p>
                            </div>
                            <button
                                onClick={() => setShowCompOffForm(true)}
                                className="inline-flex h-10 w-fit px-4 items-center justify-center gap-2 rounded-md bg-[#2564eba3] text-[16px] font-semibold text-white shadow-[0_2px_10px_rgba(25,118,255,0.2)] transition hover:bg-[#0d2b55]"
                            >
                                <Plus size={14} />
                                Apply comp off
                            </button>
                        </div>


                        {/* main container  */}
                        <div className="mt-4 w-full rounded-lg border border-[#213857] bg-[#0d2138]  py-2">

                            {/* tabs  */}
                            {role == "hod" && <div className="flex items-center gap-2 mx-4 mt-2">
                                {tabs.map((tab) => {
                                    return <button
                                        type="button"
                                        onClick={() => setSelectedTab(tab)}
                                        key={tab}
                                        className={`px-6 py-2 text-sm font-medium transition ${tab === selectedTab
                                            ? "rounded-md bg-[#2563EB] text-white"
                                            : "rounded-md hover:bg-slate-600/20"
                                            }`}
                                    >{tab}</button>
                                })}
                            </div>}

                            {/* main content  */}
                            {selectedTab === "My Compoff" ? <FacultyCompOffTable /> : ""}


                        </div>


                    </main>
                </div>


            </div>

            {showCompOffForm && <ApplyCompOffForm onClose={() => setShowCompOffForm(false)} />}

        </>
    )
}

export default CompoffPage