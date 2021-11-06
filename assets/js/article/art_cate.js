$(function() {
    var layer = layui.layer;
    var form = layui.form;
    initArtCateList();

    function initArtCateList() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function(res) {
                console.log(res.data);
                var htmlStr = template('tpl-table', res);
                $('tbody').html(htmlStr);
            }
        })
    }
    var indexAdd = null;
    // 为添加类别按钮绑定点击事件
    $("#btnAddCate").on('click', function() {
        indexAdd = layer.open({
            type: 1,
            area: ['500px', '200px'],
            title: '添加文章分类',
            content: $("#dialog-add").html()
        });

    })
    $("body").on('submit', '#form-add', function(e) {
        e.preventDefault();
        $.ajax({
            method: 'POST',
            url: '/my/article/addcates',
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg("新增分类失败！");
                }
                initArtCateList();
                layer.msg("新增分类成功");
                // 根据索引关闭对应弹出层
                layer.close(indexAdd);
            }
        })
    })
    var indexEdit = null;
    // 通过代理的形式为 btn-edit按钮绑定点击事件
    $("tbody").on('click', '.btn-edit', function() {
        // 弹出层
        indexEdit = layer.open({
            type: 1,
            area: ['500px', '200px'],
            title: '添加文章分类',
            content: $("#dialog-edit").html()
        });
        var id = $(this).attr('data-id');
        // 发起请求 获取对应分类的数据
        // 将对应数据 渲染到编辑框中
        $.ajax({
            method: 'GET',
            url: '/my/article/cates/' + id,
            success: function(res) {
                form.val('form-edit', res.data);
            }
        })
    })

    // 通过代理的形式 为修改分类的表单绑定 submit事件
    $('body').on('submit', '#form-edit', function(e) {
            e.preventDefault();
            $.ajax({
                method: 'POST',
                url: '/my/article/updatecata',
                data: $(this).serialize(),
                success: function(res) {
                    if (res.stauts !== 0) {
                        return layer.msg('更新分类失败');
                    }
                    layer.msg('更新成功');
                    // 关闭弹出层
                    layer.close(indexEdit);
                    initArtCateList();
                }
            })
        })
        // 通过代理形式 为删除按钮绑定点击事件
    $("body").on('click', '.btn-delete', function() {
        var id = $(this).attr('data-id');
        // 提示用户  是否要删除
        layer.confirm('确认删除?', { icon: 3, title: '提示' }, function(index) {
            //do something
            $.ajax({
                method: 'GET',
                url: '/my/article/deletecate/' + id,
                success: function(res) {
                    if (res.status !== 0) {
                        return layer.msg('删除失败');
                    }
                    layer.msg('删除分类成功！');
                    layer.close(index);
                    initArtCateList();
                }
            })

        });
    })
})