import request from '@/utils/axios.js';

async function loginRequest(val) {
    return await request.post('/api/auth/login', val);
}

async function logout() {
    return await request.post('/api/auth/logout');
}


export default {
    loginRequest,
    logout,
}