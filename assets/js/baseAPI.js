// 注意：每次调用 $.get() 或 $.post() 或 $.ajax() 的时候，
// 会先调用 ajaxPrefilter 这个函数
// 在这个函数中，可以拿到我们给Ajax提供的配置对象
// 登录注册模块已完成
$.ajaxPrefilter(function(options) {

    options.url = 'http://api-breakingnews-web.itheima.net' + options.url;
    console.log(options.url);

    // 统一为有权限的接口，设置headers请求头
    // 先执行判断，若请求的接口url中包含/my/
    if (options.url.indexOf('/my/') !== -1) {
        options.headers = {
            Authorizations: localStorage.getItem('token') | ''
        }
    }
    // 全局统一挂载 complete  回调函数
    options.complete = function(res) {
        // 在complete回调中,可以使用res.response
        // console.log(res.responseJSON);
        if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
            console.log('失败了');
            localStorage.removeItem('token');
            location.href = '/login.html';
        }
    }
})