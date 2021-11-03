$(function() {
        var form = layui.form;
        var layer = layui.layer;
        form.verify({
            nickname: function(value) {
                if (value.length > 6) {
                    return layer.msg("获取失败");
                }
            }
        })
        initUserInfo();

        function initUserInfo() {
            $.ajax({
                method: 'GET',
                url: '/my/userinfo',
                success: function(res) {
                        if (res.status !== 0) {
                            return layer.msg('获取用户信息失败');
                        }
                        console.log(res);
                        form.val("formUserInfo", res.data);
                    }
                    // 调用form.val为表单快速赋值

            })
        }
        $("#btnReset").on('click', function(e) {
                // 阻止默认的重置行为
                e.preventDefault();
                initUserInfo();
            })
            // 监听表单提交事件
        $(".layui-form").on('submit', function(e) {
            // 阻止表单默认提交行为
            e.preventDefault();
            $.ajax({
                method: "POST",
                url: '/my/userInfo',
                data: $(this).serialize(),
                success: function(res) {
                    if (res.status !== 0) {
                        return layer.msg("更新用户信息失败！");
                    }
                    layer.msg("更新用户信息成功!");
                    // 调用父页面中的方法 重新渲染头像等
                    window.parent.getUserInfo();
                }
            })
        })
    })
    // 初始化用户基本信息