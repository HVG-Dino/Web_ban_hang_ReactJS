import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:5000/api',
    headers: { 'Content-Type': 'application/json' },
});

export const fetchCartByUserId = (userId) => api.get(`/cart/${userId}`);

export const updateCartItemQuantity = (userId, productId, quantity) =>
    api.put('/cart/update', { userId, productId, quantity });

export const removeCartItem = (cartItemId) =>
    api.delete(`/cart/${cartItemId}`);

export default api;
