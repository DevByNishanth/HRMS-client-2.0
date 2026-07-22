export const getCurrentAcademicYear = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth() + 1;
    return month >= 7
        ? `${year}-${year + 1}`
        : `${year - 1}-${year}`;
};