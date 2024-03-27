import request from "@/utils/axios";

async function getUserInfo(id) {
    return await request.get('api/user/getUserInfo/' + id)
}

async function getFollower(id) {
    return await request.get('api/follower/getFollower/' + id);
}

export default {
    getUserInfo,
    getFollower
}