/**
 * Created by qin on 2017/7/28.
 */

//获取cookie
function getCookie( key ) {
    var val = document.cookie.match( new RegExp('\\b'+key+'=([^;]+)(; |\$)') );
    return val?val[1]:'';
}
//设置cookie
function setCookie(key , value , time) {
    document.cookie = key +'='+value+';expires='+(new Date( new Date().getTime() + time*1000 )).toGMTString();
}
//删除cookie
function removeCookie(key) {
    setCookie(key , '' , -1);
}
