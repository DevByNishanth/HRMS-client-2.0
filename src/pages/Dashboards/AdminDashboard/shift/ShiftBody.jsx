import React,{useState,useEffect} from 'react'
import AddShiftForm from './AddShiftForm';
import { Pencil,Trash2  } from 'lucide-react';
import {getShifts} from '../../../../services/getShiftService'

export default function ShiftBody() {
    const [showDrawer, setShowDrawer] = useState(false);
    const[loading, setLoading] = useState(true);
    const[shifts, setShifts] = useState([]);

    useEffect(()=>{
        fetchShifts();
    },[]);

    const fetchShifts = async () => {
        try {
        setLoading(true);

        const response = await getShifts();

        console.log("Shift API Response:", response);

        setShifts(response.data);
        } catch (error) {
        console.error("Error fetching shifts:", error);
        } finally {
        setLoading(false);
        }
    };
    

    return (
        <div>
            <div className="flex justify-between items-center mb-5">
                <h1 className="text-2xl font-bold">
                Shift Management
                </h1>

                <button
                    onClick={() => setShowDrawer(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg"
                >
                Add Shift
                </button>
            </div>
            <div className="overflow-hidden ">
                <table className="w-full min-w-[650px] border-collapse text-left"> 
                    <thead className="bg-[#172c46] text-[12px] uppercase tracking-wide text-[#9aacc7]">
                        <tr>
                            <th className="px-4 py-3 font-semibold">Shift Name</th>
                            <th className="px-4 py-3 font-semibold">Start Time</th>
                            <th className="px-4 py-3 font-semibold">End Time</th>
                            <th className="px-4 py-3 font-semibold">Grace Time</th>
                            <th className="px-4 py-3 font-semibold">Working Hours</th>
                            <th className="px-4 py-3 font-semibold">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="text-[12px] text-[#cad7eb]">
                        {loading ? (
                            <tr>
                                <td colSpan="6" className="text-center py-4">
                                Loading...
                                </td>
                            </tr>
                            ) : shifts.length === 0 ? (
                            <tr>
                                <td colSpan="6" className="text-center py-4">
                                No Shifts Found
                                </td>
                            </tr>
                            ) : (
                            shifts.map((shift) => (
                                <tr
                                key={shift._id}
                                className="border-b border-[#132944] last:border-0"
                                >
                                    <td className="px-4 py-4">{shift.shiftName}</td>
                                    <td className="px-4 py-4">{shift.startTime}</td>
                                    <td className="px-4 py-4">{shift.endTime}</td>
                                    <td className="px-4 py-4">{shift.graceTime} minutes</td>
                                    <td className="px-4 py-4">{shift.workingHours} hours</td>
                                    <td className="px-4 py-4 text-center text-[#8ca1bd]">
                                        <button
                                        type="button"
                                        className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-[#c4c6d010] transition hover:bg-[#183052] hover:text-white ml-8"
                                        >
                                        <Pencil className="h-4 w-4" />
                                        </button>

                                        <button
                                        type="button"
                                        className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-[#c4c6d010] transition hover:bg-[#183052] hover:text-white ml-2"
                                        >
                                        <Trash2 className="h-4 w-4" />
                                        </button>
                                    </td>
                                </tr>
                            ))
                            )}
                    </tbody>
                </table>
                {showDrawer && (
                    <AddShiftForm onClose={() => setShowDrawer(false)} />
                )}
            </div>
        </div>
    )
}
