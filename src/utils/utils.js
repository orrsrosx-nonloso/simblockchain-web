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