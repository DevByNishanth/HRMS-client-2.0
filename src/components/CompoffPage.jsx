import React, { useState, useCallback } from 'react'
import Sidebar from './Siedbar'
import CommonHeader from './CommonHeader'
import { Plus } from 'lucide-react'
import FacultyCompOffTable from './FacultyCompOffTable'
import HodCompOffTable from './HodCompOffTable'
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
    const [refreshKey, setRefreshKey] = useState(0)
    const [approvalCount, setApprovalCount] = useState(0)

    const handleFormSuccess = useCallback(() => {
        setRefreshKey((k) => k + 1)
    }, [])

    const handleApprovalCountChange = useCallback((count) => {
        setApprovalCount(count)
    }, [])

    return (
        <>
            <div className="flex h-screen overflow-hidden bg-[#f8fafc] transition-colors duration-200 dark:bg-[#051424]">
                <Sidebar />

                <div className="flex min-w-0 flex-1 flex-col">
                    <CommonHeader />
                    <main className="table-custom-scrollbar max-h-[calc(100vh-56px)] overflow-y-auto bg-[#f8fafc] px-4 py-4 text-slate-900 transition-colors duration-200 dark:bg-[#071425] dark:text-white">
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-xl font-medium leading-tight text-slate-900 dark:text-white">
                                    Comp Off
                                </h1>
                                <p className="mt-1 text-[16px] text-slate-500 dark:text-[#9eb0cc]">
                                    Review comp off history and track approvals.
                                </p>
                            </div>
                            <button
                                onClick={() => setShowCompOffForm(true)}
                                className="inline-flex h-10 w-fit px-4 items-center justify-center gap-2 rounded-md bg-[#1e3a8a] text-[16px] font-semibold text-white shadow-[0_2px_10px_rgba(25,118,255,0.2)] transition hover:bg-[#172554]"
                            >
                                <Plus size={14} />
                                Apply comp off
                            </button>
                        </div>


                        {/* main container  */}
                        <div className="mt-4 w-full ">

                            {/* tabs  */}
                            {role == "hod" && <div className="mt-2 flex w-full items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 dark:border-[#213857] dark:bg-[#0d2138]">
                                {tabs.map((tab) => {
                                    const count = tab === "Approvals" ? approvalCount : null
                                    return <button
                                        type="button"
                                        onClick={() => setSelectedTab(tab)}
                                        key={tab}
                                        className={`inline-flex items-center gap-2 px-6 py-2 text-sm font-medium transition ${tab === selectedTab
                                            ? "rounded-md bg-[#2563EB] text-white"
                                            : "rounded-md text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-600/20"
                                            }`}
                                    >
                                        {tab}
                                        {count !== null && (
                                            <span className={`inline-flex items-center justify-center min-w-[20px] h-5 rounded-md px-1.5 text-[11px] font-semibold ${tab === selectedTab
                                                ? "bg-white text-black"
                                                : "bg-slate-100 text-slate-700 dark:bg-[#ffffff] dark:text-[#000000]"
                                                }`}>
                                                {count}
                                            </span>
                                        )}
                                    </button>
                                })}
                            </div>}

                            {/* main content — always render both, hide inactive one */}
                            <div className={selectedTab !== "My Compoff" ? "hidden" : ""}>
                                <FacultyCompOffTable key={`faculty-${refreshKey}`} />
                            </div>
                            <div className={selectedTab !== "Approvals" ? "hidden" : ""}>
                                <HodCompOffTable key={`hod-${refreshKey}`} onCountChange={handleApprovalCountChange} />
                            </div>


                        </div>


                    </main>
                </div>


            </div>

            {showCompOffForm && <ApplyCompOffForm onClose={() => setShowCompOffForm(false)} onSuccess={handleFormSuccess} />}

        </>
    )
}

export default CompoffPage