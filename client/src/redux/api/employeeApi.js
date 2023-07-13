
import axiosClient from "./axiosClient";
 export const adminApi = {
    userDetails:() => axiosClient.get('/details'),
    addEmployee:params => axiosClient.post('/admin/addemployees',params),
    allEmployees:()=> axiosClient.get('/admin/employees'),
    searchEmployee:params => axiosClient.post('/admin/search',params),
    blockEmployee:params => axiosClient.patch('/admin/employee-status',params),
    getTeamlead:() => axiosClient.get('/admin/employees?role=teamlead'),
    getDepartment:() => axiosClient.get('/admin/department'),
    addDepartment:params => axiosClient.post('/admin/department',params),
}
export const projectApi = {
    getAllProject:() =>axiosClient.get('/admin/project'),
    addProject: params => axiosClient.post('/admin/addproject',params),
    getSingleProject: projectId => axiosClient.get(`/admin/edit-project/${projectId}`),
    updateProject: (projectId, formValues) => axiosClient.patch(`/admin/edit-project/${projectId}`, formValues)
}
export const employeeApi = {
    getEmployeeProject:()=> axiosClient.get('/employee/view-project'),
    getEmployeeTask: projectId => axiosClient.get(`/employee/view-task?id=${projectId}`),
}
export const teamleadApi = {
    getTeamleadProject:() =>axiosClient.get('/teamlead/view-project'),
    singleProjectLead: projectId => axiosClient.get(`/teamlead/view-task?id=${projectId}`),
    addTask:(inputs,projectId) => axiosClient.post('/teamlead/addtask', { ...inputs, project_id: projectId }),
    updateTask:params =>axiosClient.post('/update-task-status',params)
}