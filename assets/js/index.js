$(function() {
        // 调用getUserInfo 获取用户基本信息
        getUserInfo();

        var layer = layui.layer;
        $("#btnLogout").on('click', function() {
            //提示用户是否确认退出
            layer.confirm('确定退出登录', { icon: 3, title: '提示' }, function(index) {

                // 清除本地存储中的token
                localStorage.removeItem('token');
                // 跳转到登录页
                location.href = '/login.html';
                // 关闭confirm 询问狂
                layer.close(index);
            });
        })
    })
    // 获取用户基本信息
function getUserInfo() {
    $.ajax({
        method: 'GET',
        url: '/my/userinfo',
        // 请求头 配置对象
        // headers: {
        //     Authorizations: localStorage.getItem('token') | ''
        // },
        success: function(res) {
            if (res.status !== 0) {
                return layui.layer.msg('获取用户信息失败');
            }
            // 调用 renderAvatar渲染用户头像
            renderAvatar(res.data)
        },
    })
}

function renderAvatar(user) {
    // 获取用户名称
    var name = user.nickname || user.username;
    $("#welcome").html("欢迎" + name);
    // 按需渲染用户头像 
    if (user.user_pic !== null) {
        // 渲染图片头像
        $(".layui-nav-img").attr('src', user.user_pic).show();
        $(".text-avatar").hide();
    } else {
        // 渲染文本头像
        $(".layui-nav-img").hide();
        var first = name[0].toUpperCase();
        $(".text-avatar").html(first).show();
    }
}