
import axiosClient from "./axiosClient";
 export const adminApi = {
    findAdmin:()=>axiosClient.get('/admin/admin-setup'),
    adminSetUp:params => axiosClient.post('/admin/signup',params),
    userDetails:() => axiosClient.get('/details'),
    addEmployee:params => axiosClient.post('/admin/addemployees',params),
    allEmployees:()=> axiosClient.get('/admin/employees'),
    searchEmployee:params => axiosClient.post('/admin/search',params),
    blockEmployee:params => axiosClient.patch('/admin/employee-status',params),
    getTeamlead:() => axiosClient.get('/admin/employees?role=teamlead'),
    getDepartment:() => axiosClient.get('/admin/department'),
    addDepartment:params => axiosClient.post('/admin/department',params),
    updateDepartment:(id,inputs)=>axiosClient.patch(`/admin/department?id=${id}`,inputs),
    addHoliday:params => axiosClient.post('/admin/add-holiday',params),
    allHoliday:() => axiosClient.get('/admin/holiday'),
    dashboard:() => axiosClient.get('/admin/dashboard'),
}
export const projectApi = {
    getAllProject:() =>axiosClient.get('/admin/project'),
    addProject: params => axiosClient.post('/admin/addproject',params),
    getSingleProject: projectId => axiosClient.get(`/admin/edit-project/${projectId}`),
    updateProject: (projectId, formValues) => axiosClient.patch(`/admin/edit-project/${projectId}`, formValues),
    
}
export const employeeApi = {
    getEmployeeProject:()=> axiosClient.get('/employee/view-project'),
    getEmployeeTask: projectId => axiosClient.get(`/employee/view-task?id=${projectId}`),
    dashboard:() => axiosClient.get('/employee/employee-dashboard')
}
export const teamleadApi = {
    getTeamleadProject:() =>axiosClient.get('/teamlead/view-project'),
    teamMembers:() => axiosClient.get('/teamlead/team-members'),
    singleProjectLead: projectId => axiosClient.get(`/teamlead/view-task?id=${projectId}`),
    addTask:(inputs,projectId) => axiosClient.post('/teamlead/addtask', { ...inputs, project_id: projectId }),
    updateTask:params =>axiosClient.patch('/update-task-status',params),
    dashboard:() => axiosClient.get('/teamlead/dashboard'),
    sendMeetingIDEmail: ({ from,meetingID, emailAddresses }) =>
    axiosClient.post('/teamlead/send-meeting-id', { from, meetingID, emailAddresses }),
}
export const dutyApi = {
    allDuty:(from,to) => axiosClient.get(`/onduty-list?from=${from}&to=${to}`),
    getDuty:() => axiosClient.get('/onduty'),
    addDuty:params => axiosClient.post('/add-onduty',params),
    approveDuty:params => axiosClient.patch('/onduty-approve',params),
    addTimesheet:params=>axiosClient.post('/timesheet',params),
    getTimesheet:() => axiosClient.get('/timesheet'),
    attendance:() => axiosClient('/attendance-report')
}

export const leaveApi = {
    getLeave:() => axiosClient.get('/leave'),
    addLeave:params => axiosClient.post('/leave',params),
    employeeLeaveList:(from,to) => axiosClient.get(`/leave-list?from=${from}&to=${to}`),
    approveLeave:params => axiosClient.patch('/leave-approve',params)
}

export const complaintsApi = {
    addComplaints:params => axiosClient.post('/complaints',params),
    viewComplaints:() => axiosClient.get('/complaints'),
    viewAllComplaints:() => axiosClient.get('/admin/complaints'),
    updateResponse: (id, response) => axiosClient.patch(`/admin/add-response?id=${id}`, { response })

}
export const salaryApi = {
    addSalary:params => axiosClient.patch('/admin/add-salary',params),
    getEmployeeSalary:()=>axiosClient.get('/admin/salary'),
    getSalary:() =>axiosClient.get('/salary')
}