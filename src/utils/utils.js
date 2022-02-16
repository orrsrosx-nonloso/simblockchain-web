function getDate() {
    const date = new Date();
    const y = date.getFullYear();
    const mm = (parseInt(date.getMonth()) + 1) < 10 ? '0' + (parseInt(date.getMonth()) + 1) : (parseInt(date.getMonth()) + 1);
    const d = parseInt(date.getDate()) < 10 ? '0' + parseInt(date.getDate()) : parseInt(date.getDate());
    const h = parseInt(date.getHours()) < 10 ? '0' + parseInt(date.getHours()) : parseInt(date.getHours());
    const m = parseInt(date.getMinutes()) < 10 ? '0' + parseInt(date.getMinutes()) : parseInt(date.getMinutes());
    const s = parseInt(date.getSeconds()) < 10 ? '0' + parseInt(date.getSeconds()) : parseInt(date.getSeconds());
    return y + '-' + mm + '-' + d + ' ' + h + ':' + m + ':' + s
}
export { getDate }

export function uuid(before = '', after = '') {
    const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('')
    const charsLen = chars.length
    let uuid = []
    const len = 16
    for (let i = 0; i < len; i++) {
        uuid[i] = chars[0 | Math.random() * charsLen]
    }
    return before + uuid.join('') + after
}
/**
获取当前时间 格式：yyyy-MM-dd HH:MM:SS
*/
export function getDataString() {
    var date = new Date();//当前时间
    var month = zeroFill(date.getMonth() + 1);//月
    var day = zeroFill(date.getDate());//日
    var hour = zeroFill(date.getHours());//时
    var minute = zeroFill(date.getMinutes());//分
    var second = zeroFill(date.getSeconds());//秒

    //当前时间
    var curTime = date.getFullYear() + "-" + month + "-" + day
        + " " + hour + ":" + minute + ":" + second;
    return curTime;
}

/**
补零
*/
export function zeroFill(i) {
    if (i >= 0 && i <= 9) {
        return "0" + i;
    } else {
        return i;
    }
}