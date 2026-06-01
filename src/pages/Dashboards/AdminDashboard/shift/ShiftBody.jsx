import React,{useState} from 'react'
import AddShiftForm from './AddShiftForm';

export default function ShiftBody() {
    const [showDrawer, setShowDrawer] = useState(false);
    

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
            <div>
                <table> 
                    <thead>
                        <tr>
                            <th>Shift Name</th>
                            <th>Start Time</th>
                            <th>End Time</th>
                            <th>End Time</th>
                            <th>Grace Time</th>
                            <th>Working Hours</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>Morning Shift</td>
                            <td>9:00 AM</td>
                            <td>5:00 PM</td>
                            <td>5:30 PM</td>
                            <td>30 minutes</td>
                            <td>8 hours</td>
                            <td>
                                <button>Edit</button>
                                <button>Delete</button>
                            </td>
                        </tr>
                    </tbody>
                </table>
                {showDrawer && (
                    <AddShiftForm
                    onClose={() => setShowDrawer(false)}
                    />
                )}
            </div>
        </div>
    )
}
