import React,{useState} from 'react'
import AddShiftForm from './AddShiftForm';

export default function ShiftBody() {
    const [showModal, setShowModal] = useState(false);

    const handleAddShift = () => {
        setShowModal(true);
    };


  return (
    <div>
        <div>
            <h1>Shift Management</h1>
            <button onClick={handleAddShift}>Add Shift</button>
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
            {showModal && ( 
                <AddShiftForm
                onClose={() => setShowModal(false)}
                />
            )}
        </div>
    </div>
  )
}
