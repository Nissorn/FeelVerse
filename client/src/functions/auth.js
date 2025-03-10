import axios from "axios";

const API_URL = "http://localhost:5000/api"; // ต้องมี /api ถ้า Backend ใช้ prefix นี้

export const register = async (formData) => {
    console.log("API NOW")
    // try {
    //     const response = await axios.post(`${API_URL}/register`, formData);
    //     return response.data;
    // } catch (error) {
    //     console.error("Registration error:", error.response?.data || error.message);
    //     throw error;
    // }
};
