import { useState } from "react";
import ApplyDropdown from "../../../components/ApplyDropdown";
import ApplyLeaveForm from "../../../components/ApplyLeaveForm";
import ApplyPermission from "../../../components/ApplyPermission";
import FacultySearchPopup from "../../../components/FacultySearchPopup";

const PrincipalQuickActions = () => {
  const [isLeaveApplyModal, setIsLeaveApplyModal] = useState(false);
  const [isPermissionApplyModal, setIsPermissionApplyModal] = useState(false);
  const [isFacultySearchLeave, setIsFacultySearchLeave] = useState(false);
  const [isFacultySearchPermission, setIsFacultySearchPermission] = useState(false);
  const [selectedEmployeeForLeave, setSelectedEmployeeForLeave] = useState(null);
  const [selectedEmployeeForPermission, setSelectedEmployeeForPermission] = useState(null);

  const handleApplyLeaveForMe = () => {
    setSelectedEmployeeForLeave(null);
    setIsLeaveApplyModal(true);
  };

  const handleApplyLeaveForOthers = () => {
    setIsFacultySearchLeave(true);
  };

  const handleFacultySelectForLeave = (faculty) => {
    setIsFacultySearchLeave(false);
    setSelectedEmployeeForLeave(faculty);
    setIsLeaveApplyModal(true);
  };

  const handleApplyPermissionForMe = () => {
    setSelectedEmployeeForPermission(null);
    setIsPermissionApplyModal(true);
  };

  const handleApplyPermissionForOthers = () => {
    setIsFacultySearchPermission(true);
  };

  const handleFacultySelectForPermission = (faculty) => {
    setIsFacultySearchPermission(false);
    setSelectedEmployeeForPermission(faculty);
    setIsPermissionApplyModal(true);
  };

  const handleCloseLeave = () => {
    setIsLeaveApplyModal(false);
    setSelectedEmployeeForLeave(null);
  };

  const handleClosePermission = () => {
    setIsPermissionApplyModal(false);
    setSelectedEmployeeForPermission(null);
  };

  return (
    <>
      <div className="flex flex-wrap gap-3">
        <ApplyDropdown
          label="Apply Leave"
          onForMe={handleApplyLeaveForMe}
          onForOthers={handleApplyLeaveForOthers}
        />
        <ApplyDropdown
          label="Apply Permission"
          onForMe={handleApplyPermissionForMe}
          onForOthers={handleApplyPermissionForOthers}
        />
      </div>

      {isLeaveApplyModal && (
        <ApplyLeaveForm onClose={handleCloseLeave} employee={selectedEmployeeForLeave} />
      )}
      {isPermissionApplyModal && (
        <ApplyPermission
          onClose={handleClosePermission}
          employee={selectedEmployeeForPermission}
        />
      )}
      {isFacultySearchLeave && (
        <FacultySearchPopup
          onClose={() => setIsFacultySearchLeave(false)}
          onSelect={handleFacultySelectForLeave}
        />
      )}
      {isFacultySearchPermission && (
        <FacultySearchPopup
          onClose={() => setIsFacultySearchPermission(false)}
          onSelect={handleFacultySelectForPermission}
        />
      )}
    </>
  );
};

export default PrincipalQuickActions;
