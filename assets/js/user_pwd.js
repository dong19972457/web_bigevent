$(function() {
    var form = layui.form;
    form.verify({
        pass: [
            /^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'
        ],
        samePwd: function(value) {
            if (value == $("[name=oldPwd]").val()) {
                return '新旧密码不能相同';
            }
        },
        rePwd: function(value) {
            if (value !== $("[name=newPwd]").val()) {
                return '密码不一致';
            }
        }
    })

    $(".layui-form").on('submit', function(e) {
        e.preventDefault();
        $.ajax({
            method: 'POST',
            url: '/my/updataPwd',
            data: $(this).serialize(),
            success: function(res) {
                console.log(res);
                if (res.status !== 0) {
                    return layui.layer.msg('更新密码失败');
                }
                layui.layer.msg('更新成功');
                // 重置表单，reset为原生DOM元素的方法
                // $('element')[0] 将jQuery元素转为DOM元素
                $(".layui-form")[0].reset();
            }
        })
    })
})