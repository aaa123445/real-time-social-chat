import request from '@/utils/axios.js';

async function getArticleListIndex(pageNum, pageSize) {
    return await request.get('api/article/getList/' + pageNum + '/' + pageSize);
}

async function addImage(file) {
    return await request.post('api/article/addImage', file, {headers: {'Content-Type': 'multipart/form-data'}}
    );
}

async function addArticle(params) {
    return await request.post('api/article/addArticle', params)
}

async function delArticle(id) {
    return await request.post('api/article/delArticle/' + id)
}

async function getFollowerList(id) {
    return await request.get('api/follower/getFollowerList/' + id)
}

function addFollower(params) {
    return request.post('api/follower/addFollower', params)
}

function delFollower(params) {
    return request.post('api/follower/delFollower', params)
}

async function getSelfArticle(pageNum, pageSize, uId) {
    return await request.get('/api/article/getSelfList/' + pageNum + '/' + pageSize + '/' + uId);
}

export default {
    getArticleListIndex,
    addImage,
    addArticle,
    delArticle,
    getFollowerList,
    addFollower,
    delFollower,
    getSelfArticle
}