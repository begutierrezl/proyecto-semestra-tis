/* 
Se utiliza almacenamiento local para almacenar los tokens de acceso

Aquí se encuentra un interceptor: Se encarga de interceptar cualquier 
tipo de request que enviemos y añadir los headers apropiados para evitar 
escribir demasiado boilerplate
Para esto se utiliza Axios -> Libreria especializada en enviar Network requests
mediante la clase AxiosInterceptor.
*/

import { ACCESS_TOKEN } from "./constants"
import axios from "axios"

// baseURL + path -> vista de django
const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL
})

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem(ACCESS_TOKEN);
        if (token) {
            config.headers.Authorization = `Bearer ${token}`
        }
        return config
    },
    (error) => {
        return Promise.reject(error)
    }
)

export default api