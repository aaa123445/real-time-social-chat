import request from "@/utils/axios";

async function getUserInfo(id) {
    return await request.get('api/user/getUserInfo/' + id)
}

export default {
    getUserInfo,
}