import axios from "axios";
import { jwtDecode } from "jwt-decode";
import dayjs from "dayjs";
import Cookies from 'js-cookie';

const baseURL = 'http://localhost:5050'

let accessToken: any = Cookies.get('accessToken')

const axiosInstance = axios.create({
    baseURL,
    headers: {'x-auth-token': accessToken}
})

axiosInstance.interceptors.request.use(async req => {
    if(!accessToken) {
        accessToken = Cookies.get('accessToken')
        req.headers['x-auth-token'] = accessToken
    }
    const decodedToken: any = jwtDecode(accessToken)
    const isExpired = dayjs.unix(decodedToken.exp).isBefore(dayjs())

    if(!isExpired) {
        return req
    }

    const response = await axios.post(`${baseURL}/api/user/token`, {refreshToken: Cookies.get('refreshToken')})

    Cookies.set("accessToken", response.data.accessToken)
    req.headers['x-auth-token'] = response.data.accessToken

    return req
})

export default axiosInstance