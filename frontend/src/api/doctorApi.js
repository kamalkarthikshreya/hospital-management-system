import API from "./api";

export const getDoctorEHRs = () => API.get("/doctor/ehr");
export const createEHR = (data) => API.post("/doctor/ehr", data);
export const updateEHR = (id, data) => API.put(`/doctor/ehr/${id}`, data);
export const deleteEHR = (id) => API.delete(`/doctor/ehr/${id}`);
