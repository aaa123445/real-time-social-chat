import request from "@/utils/axios";

async function addChat(params) {
    return await request.post('api/websocket/addChat', params);
}

async function getChatList(params) {
    return await request.get('api/websocket/getChatList/' + params.pageNum + '/' + params.pageSize + '/' + params.userId);
}

async function getMessageList(params) {
    return await request.get('api/websocket/getMessageList/' + params.pageNum + '/' + params.pageSize + '/' + params.chatId)
}

export default {
    addChat,
    getChatList,
    getMessageList
}