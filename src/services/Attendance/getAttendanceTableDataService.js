    // import axios from "axios";

    // const getCurrentDate = () => {
    //     const today = new Date();

    //     const year = today.getFullYear();
    //     const month = String(
    //         today.getMonth() + 1
    //     ).padStart(2, "0");
    //     const day = String(
    //         today.getDate()
    //     ).padStart(2, "0");

    //     return `${year}-${month}-${day}`;
    // };

    // export const getAttendanceTableData = async (filters) => {
    //     console.log("filter:",filters)
    //     try {
    //         const token = localStorage.getItem("hrms_token");

    //         const response = await axios.get(
    //         `${import.meta.env.VITE_API_BASE_URL}/api/principal/today-attendance-faculty`,
    //         {
    //             params: {
    //             fromDate: filters.fromDate,
    //             toDate: filters.toDate,
    //             search: filters.search,
    //             department: filters.department,
    //             employeeCategory: filters.employeeCategory,
    //             shiftId: filters.shiftId,
    //             status: filters.status,
    //             },
    //             headers: {
    //             Authorization: `Bearer ${token}`,
    //             },
    //         }
    //         );

    //         return response.data;
    //     } catch (error) {
    //         console.error(error);
    //         throw error;
    //     }
    // };


    import axios from "axios";

const getCurrentDate = () => {
  const today = new Date();

  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

export const getAttendanceTableData = async (filters) => {
  console.log("filter:", filters);
  try {
    const token = localStorage.getItem("hrms_token");

    const response = await axios.get(
      `${import.meta.env.VITE_API_BASE_URL}/api/principal/today-attendance-faculty`,
      {
        params: {
          search: filters.search || undefined,
          department: filters.department || undefined,
          employeeCategory: filters.employeeCategory || undefined,
          fromDate: filters.fromDate || getCurrentDate(),
          toDate: filters.toDate || getCurrentDate(),
          status: filters.status || undefined,
          shiftName: filters.shiftName || undefined,
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};