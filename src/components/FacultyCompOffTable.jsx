import { Eye } from 'lucide-react'
import React from 'react'

const data = [
    { fromDate: "2022-01-01", toDate: "2022-01-01", noOfDays: 10, Reason: "Worked for events", document: "DOC", status: "Approved", },
    { fromDate: "2022-01-01", toDate: "2022-01-01", noOfDays: 10, Reason: "Worked for events", document: "DOC", status: "Pending", },
    { fromDate: "2022-01-01", toDate: "2022-01-01", noOfDays: 10, Reason: "Worked for events", document: "DOC", status: "Rejected", },
]

const FacultyCompOffTable = () => {
    return (
        <>
            <div className="relative z-0 mt-3 max-h-[calc(100vh-280px)] overflow-auto table-custom-scrollbar">
                <header className="px-4 mb-4">
                    <div>
                        <h1 className="text-xl font-semibold">Comf off list</h1>
                    </div>
                </header>
                <table className="w-full min-w-[760px] border-collapse text-left">
                    <thead className="sticky top-0 z-10 bg-[#172c46] text-[12px] uppercase tracking-wide text-[#9aacc7]">
                        <tr>
                            <th className="px-4 py-3 font-semibold">Worked From</th>
                            <th className="px-4 py-3 font-semibold">Worked To</th>
                            <th className="px-4 py-3 font-semibold">No of Days</th>
                            <th className="px-4 py-3 font-semibold">Reason</th>
                            <th className="px-4 py-3 font-semibold">Document</th>
                            <th className="px-4 py-3 font-semibold">Status</th>
                            <th className="px-4 py-3 text-right font-semibold">Action</th>
                        </tr>
                    </thead>

                    <tbody className="text-[16px]">
                        {data.map((item, index) => {
                            return <tr className={``}>
                                <td className="pl-4 py-2 text-[12px] border-b border-gray-400/20">{item.fromDate}</td>
                                <td className="pl-4 py-2 text-[12px] border-b border-gray-400/20">{item.toDate}</td>
                                <td className="pl-4 py-2 text-[12px] border-b border-gray-400/20">{item.noOfDays}</td>
                                <td className="pl-4 py-2 text-[12px] border-b border-gray-400/20">
                                    <div className="truncate max-w-12" title={item.Reason}>
                                        {item.Reason}..
                                    </div>
                                </td>
                                <td className="pl-4 py-2 text-[12px] border-b border-gray-400/20">
                                    <div className=" w-fit px-3 py-2 cursor-pointer underline">
                                        <p>Doc.Pdf</p>
                                    </div>
                                </td>
                                <td className="pl-4 py-2 text-[12px] border-b border-gray-400/20">

                                    <p>{item.status === "Pending" ? "Pending" : item.status === "Approved" ? "Approved" : "Rejected"}</p>

                                </td>
                                <td className="pl-4 py-2 text-[12px] border-b border-gray-400/20">
                                    <button className="text-center translate-x-[60px]">
                                        <Eye className="text-gray-500" />
                                    </button>
                                </td>
                            </tr>

                        })}
                    </tbody>
                </table>
            </div>
        </>
    )
}

export default FacultyCompOffTable