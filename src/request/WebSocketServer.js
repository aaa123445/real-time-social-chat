export default class SocketService {
    /**
     * 单例
     */
    static instance = null
    // 和服务端连接的socket对象
    ws = null
    // 存储回调函数
    callBackMapping = {}
    // 标识是否连接成功
    connected = false
    // 记录重试的次数
    sendRetryCount = 0
    // 重新连接尝试的次数
    connectRetryCount = 0

    static get Instance() {
        if (!this.instance) {
            this.instance = new SocketService()
        }
        return this.instance
    }

    //  定义连接服务器的方法
    connect() {
        // 连接服务器
        if (!window.WebSocket) {
            return this.$message({
                type: "error",
                message: "当前浏览器不支持websocket"
            })
        }
        if (!localStorage.getItem('userInfo')) {
            return
        }
        const userId = JSON.parse(localStorage.getItem('userInfo')).id;
        this.ws = new WebSocket('ws://localhost:7777/websocket/' + userId)
        // 连接成功的事件
        this.ws.onopen = () => {
            this.connected = true
            // 重置重新连接的次数
            this.connectRetryCount = 0
        }
        //   // 1.连接服务端失败
        //   // 2.当连接成功之后, 服务器关闭的情况(连接失败重连)
        this.ws.onclose = () => {
            this.connected = false
            this.connectRetryCount++
            setTimeout(() => {
                this.connect()
            }, 500 * this.connectRetryCount)
        }
        // 得到服务端发送过来的数据
        this.ws.onmessage = msg => {
            const realData = JSON.parse(msg.data);
            if (this.callBackMapping) {
                this.callBackMapping.call(this, realData)
            }
        }
    }

    // 回调函数的注册
    registerCallBack(callBack) {
        this.callBackMapping = callBack
    }

    // 取消某一个回调函数
    unRegisterCallBack(callBack) {
        this.callBackMapping = null
    }

    // 发送数据的方法
    send(data) {
        // 判断此时此刻有没有连接成功
        if (this.connected) {
            this.sendRetryCount = 0
            this.ws.send(data)
        } else {
            this.sendRetryCount++
            setTimeout(() => {
                this.send(data)
            }, this.sendRetryCount * 500)
        }
    }

    //断开连接
    disconnect() {
        this.ws.close()
    }

}

