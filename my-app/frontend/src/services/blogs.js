import axios from 'axios'
const baseUrl = '/api/blogs'
let token = null

const setToken = (newToken) => {
    token = `bearer ${newToken}`
}

const getAll = () => {
    const request = axios.get(baseUrl)
    return request.then(response => response.data)
}

const addNew = async (object) => {
    const response = await axios.post(baseUrl, object, { headers: { Authorization: token } })
    return response.data
}

const update = async (object, id) => {
    const response = await axios.put(`${baseUrl}/${id}`, object)
    return response.data
}

const remove = async (id) => {
    const response = await axios.delete(`${baseUrl}/${id}`, { headers: { Authorization: token } })
    return response.data
}

const exported = {
    getAll, setToken, addNew, update, remove
}
export default exported