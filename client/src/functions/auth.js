import axios from 'axios'

export const register = async(formData) =>
    await axios.post(import.meta.env.VITE_REACT_APP_API + "/register", formData);

