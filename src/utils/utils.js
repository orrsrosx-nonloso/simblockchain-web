import jsrsasign from 'jsrsasign'
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
//随机34位地址
export function addressStr() {
    const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('')
    const charsLen = chars.length
    let uuid = []
    uuid[0] = 1;
    const len = 34
    for (let i = 1; i < len; i++) {
        uuid[i] = chars[0 | Math.random() * charsLen]
    }
    return uuid.join('') + "";
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

export function getTargetDataStr(date) {
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

export function getDataStringDay(decrease) {
    var date = new Date();//当前时间
    var month = zeroFill(date.getMonth() + 1);//月
    var day = zeroFill(date.getDate());//日
    var curTime = "";

    if (decrease == 0) {
        curTime = date.getFullYear() + "-" + month + "-" + day;
    } else {
        if (day <= decrease) {
            if (month == 1) {
                month = 12;
                let newDay = 31 - (decrease - day);
                curTime = (date.getFullYear() - 1) + "-" + month + "-" + newDay;
            }
            else {
                month = month - 1;
                let newDay = getDays(date.getFullYear(), month) - (decrease - day);
                if (newDay < 10) {
                    curTime = date.getFullYear() + "-" + month + "-" + "0" + newDay;
                }
                else {
                    curTime = date.getFullYear() + "-" + month + "-" + newDay;
                }
            }
        }
        else {
            let newDay = day - decrease;
            if (newDay < 10) {
                curTime = date.getFullYear() + "-" + month + "-" + "0" + newDay;
            }
            else {
                curTime = date.getFullYear() + "-" + month + "-" + newDay;
            }
        }

    }
    //当前时间
    return curTime;
}

//获取当前月份的天数
function getDays(year, month) {
    let days = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
    if ((year % 4 === 0) && (year % 100 !== 0 || year % 400 === 0)) {
        days[1] = 29
    }
    return days[month - 1];//对应的月份集合减一
}


export function getseparateDays(day) {
    let days = day.split("-");
    let newDay = days[1] + "/" + days[2];
    return newDay;
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

/**
配置获取ID
*/
export function getNodeId(i) {
    const ids = i.split("e");
    return ids[1];
}

/**
手机号判断
*/
export function judgePhone(i) {
    const length = i.length;
    let first = i.substr(0, 1);
    if (length === 11 && first === "1") {
        return true;
    }
    else {
        return false;
    }
}
function haveNumIs(password) {
    let passwords = password.split("");
    var re = /^[0-9]+.?[0-9]*$/;
    for (let i = 0; i < passwords.length; i++) {
        if (re.test(passwords[i])) {
            return true;
        }
    }
    return false;
}
function haveStrIs(password) {
    let passwords = password.split("");
    var re = /^[0-9]+.?[0-9]*$/;
    var re2 = new RegExp("[`~!@#$^&*()=|{}':;',\\[\\].<>《》/?~！@#￥……&*（）——|{}【】‘；：”“'。，、？ ]")
    for (let i = 0; i < passwords.length; i++) {
        if (!re.test(passwords[i]) && !re2.test(passwords[i])) {
            return true;
        }
    }
    return false;
}
function havePunIs(password) {
    let passwords = password.split("");
    var re = new RegExp("[`~!@#$^&*()=|{}':;',\\[\\].<>《》/?~！@#￥……&*（）——|{}【】‘；：”“'。，、？ ]")
    for (let i = 0; i < passwords.length; i++) {
        if (re.test(passwords[i])) {
            return true;
        }
    }
    return false;
}
/**
密码格式判断
parame{{
        username: "",
        password: "",
        phone: "",
      }}
6-20个字符,密码不能是相同的用户名
只能包含字母、数字以及标点符号(除空格)
字母、数字和标点符号至少包含2种
*/
export function judgePassWord(parame) {
    let end = { mes: "waring!", state: 1 }//1表示密码格式错误，0表示正常
    let passwords = parame.password;
    const passwordSize = passwords.split("").length;
    let passwordSatLen = 0;
    //获取类型长度
    if (haveNumIs(passwords)) {
        passwordSatLen++;
    }
    if (haveStrIs(passwords)) {
        passwordSatLen++;
    }
    if (havePunIs(passwords)) {
        passwordSatLen++;
    }
    //最终结果
    if (parame.username == parame.password) {
        end.mes = "账户和密码不能相同！"
    } else if (passwordSize < 6 || passwordSize > 20) {
        end.mes = "密码长度不符合要求！"
    } else if (passwords.indexOf(" ") != -1) {
        end.mes = "密码内容不应该包含空格！"
    }
    else if(passwordSatLen<2){
        end.mes = "密码内容中字母、数字和标点符号至少包含2种!"
    }else{
        end.mes = "ok";
        end.state = 0;
    }

    return end;
}
/**
判断是否为数字
*/
export function checkNumber(i) {
    var reg = /^[0-9]+.?[0-9]*$/;
    if (reg.test(i)) {
        return true;
    }
    return false;
}


//随机私钥
export function imitationPrivate() {
    let imitationKey = 'MIGTAgEAMBMGByqGSM49AgEGCCqGSM49AwEHBHkwdwIBAQQgSpsvezdkSoLZ5NHFlNg8dxUGjLaeuuS0pEFhYlzdpZqgCgYIKoZIzj0DAQehRANCAAROiaBc3Y4nrCUGks5lw4BOHyfxw+4HqGwwSmkxmdwYV7GfRTnZHKF9IGvfdqC98yBuWxkRJHOdJWOyPBt6RBVF'.split('')
    let imitationK2y = 'MIGTAgEAMBMGByqGSM49AgEGCCqGSM49AwEHBHkwdwIBAQQgM3kIMTFiQrzKm5jBDoqimkJBCk65bT9ohf7sNMbAA2hXLuDpUuPqhD2NBfHSqhkBi4LKNv817VrJkQgccNsz0AnetNikV+2Wk7K7bM0QuR1JRvRYV9cCwj4IBxJEOfNMLw2cFk4bcOlevK9tmQT2hqRf'

    const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('')
    const charsLen = chars.length
    let uuid = []
    const len = imitationKey.length;
    for (let i = 48; i < len; i++) {
        if (imitationKey[i] != "+" && imitationKey[i] != "/") {
            imitationKey[i] = chars[0 | Math.random() * charsLen]
        }
    }
    return imitationKey.join('') + "";
}

//随机公钥
export function imitationPublic() {
    let imitationKey = 'MFkwEwYHKoZIzj0CAQYIKoZIzj0DAQcDQgAETomgXN2OJ6wlBpLOZcOATh8n8cPuB6hsMEppMZncGFexn0U52RyhfSBr33agvfMgblsZESRznSVjsjwbekQVRQ=='.split('')
    let imitationK2y = 'MFkwEwYHKoZIzj0CAQYIKoZIzj0DAQcDQgAERJpRjUZlUEISVtEWzySMOtMk4B3NXmjRgpsiWxeYDKtq2AIvhE50DgVkgm6ZUWSn83HPLU6sTFezDcXAscrBDc=='

    const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('')
    const charsLen = chars.length
    let uuid = []
    const len = imitationKey.length;
    for (let i = 36; i < len - 2; i++) {
        if (imitationKey[i] != "+" && imitationKey[i] != "/") {
            imitationKey[i] = chars[0 | Math.random() * charsLen]
        }
    }
    return imitationKey.join('') + "";
}

//正态分布随机数
export function normalRandom(mean, std) {
    let u = 0.0, v = 0.0, w = 0.0, c = 0.0;
    do {
        //获得两个（-1,1）的独立随机变量
        u = Math.random() * 2 - 1.0;
        v = Math.random() * 2 - 1.0;
        w = u * u + v * v;
    } while (w == 0.0 || w >= 1.0)
    //Box-Muller转换
    c = Math.sqrt((-2 * Math.log(w)) / w);
    let normal = mean + (u * c) * std;
    return normal;
}
//用于生产服从正态分布的随机数矩阵
function normalRandomSize(mean, std, size) {
    let normal = [];
    for (let i = 0; i < size; i++) {
        normal[i] = randomNormal(mean, std);
    }
    return normal;
}


export function getSign() {
    let imitationKey = "BG/V0R0FWgOaN6bg3eu+VLM3N9lztLglF4dIunen+hFf8lYcvUavFMwSKsPNn0jyDJ0pXd5O5KTWm9CTcEFomkG/eXJWciXtUm+0kIXCfiLbEhxnl/IbeUaq".split('')
    const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
    const charsLen = chars.length
    let len = imitationKey.length;

    for (let i = 0; i < len - 2; i++) {
        if (imitationKey[i] != "+" && imitationKey[i] != "/") {
            imitationKey[i] = chars[0 | Math.random() * charsLen]
        }
    }
    return imitationKey.join('') + "";
}