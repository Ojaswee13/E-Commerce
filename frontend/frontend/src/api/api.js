import axios from "axios"

const BASE = "http://localhost:5000/api"

const getToken = () => localStorage.getItem("token")

const authHeaders = () => ({
  Authorization: `Bearer ${getToken()}`,
})

// auth
export const registerUser = (data) => axios.post(`${BASE}/auth/register`, data)
export const loginUser = (data) => axios.post(`${BASE}/auth/login`, data)

// products
export const getProducts = (params) => axios.get(`${BASE}/products`, { params })
export const getProduct = (id) => axios.get(`${BASE}/products/${id}`)
export const createProduct = (data) => axios.post(`${BASE}/products`, data, { headers: authHeaders() })
export const updateProduct = (id, data) => axios.put(`${BASE}/products/${id}`, data, { headers: authHeaders() })
export const deleteProduct = (id) => axios.delete(`${BASE}/products/${id}`, { headers: authHeaders() })

// cart
export const getCart = () => axios.get(`${BASE}/cart`, { headers: authHeaders() })
export const addToCart = (data) => axios.post(`${BASE}/cart`, data, { headers: authHeaders() })
export const removeFromCart = (productId) => axios.delete(`${BASE}/cart/${productId}`, { headers: authHeaders() })

// orders
export const placeOrder = () => axios.post(`${BASE}/orders`, {}, { headers: authHeaders() })
export const getMyOrders = () => axios.get(`${BASE}/orders/myorders`, { headers: authHeaders() })

// reviews
export const getReviews = (productId) => axios.get(`${BASE}/reviews/${productId}`)
export const addReview = (productId, data) => axios.post(`${BASE}/reviews/${productId}`, data, { headers: authHeaders() })

// admin
export const getAllOrders = () => axios.get(`${BASE}/admin/orders`, { headers: authHeaders() })
export const updateOrderStatus = (id, status) => axios.put(`${BASE}/admin/orders/${id}`, { status }, { headers: authHeaders() })
export const getAllUsers = () => axios.get(`${BASE}/admin/users`, { headers: authHeaders() })
