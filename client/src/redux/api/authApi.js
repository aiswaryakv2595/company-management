import axiosClient from "./axiosClient";

const authApi = {
    login:params => axiosClient.post('/',params),
    updateProfile:params => axiosClient.patch('/update-profile',params)
}
export default authApi