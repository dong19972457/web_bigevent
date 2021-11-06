$(function() {
    var layer = layui.layer;
    var form = layui.form;
    var laypage = layui.laypage;
    // 定义美化时间的过滤器
    template.defaults.imports.dataFormat = function(date) {
            const dt = new Date(date);
            var y = dt.getFullYear();
            var m = padZero(dt.getMonth() + 1);
            var d = padZero(dt.getDate());
            var hh = padZero(dt.getHours());
            var mm = padZero(dt.getMinutes());
            var ss = padZero(dt.getSeconds());

            return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss;
        }
        // 定义补零的函数
    function padZero(n) {
        return n > 9 ? n : '0' + n;
    }
    // 定义查询参数对象 请求数据时 需要将请求参数对象提交到服务器
    var q = {
        pagenum: 1, // 默认请求第一页的数据
        pagesize: 2, //默认每页显示两条
        cate_id: '', //文章分类的id
        state: '' //文章的发布状态
    }
    initTable();
    initCate();
    // 获取文章列表数据的方法
    function initTable() {
        $.ajax({
            method: 'GET',
            url: '/my/article/list',
            data: q,
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('获取文章列表失败');
                }
                // 使用模板引擎渲染页面数据
                var htmlStr = template("tpl-table", res);
                $("tbody").html(htmlStr);
                renderPage(res.total);
            }
        })
    }

    // 初始化文章分类的方法
    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('获取分类数据失败');
                }
                var htmlStr = template('tpl-cate', res);
                $('[name=cate_id]').html(htmlStr);
                // 通过layui重新渲染表单区域的UI结构
                form.render();
            }
        })
    }
    // jump回调的
    // 定义渲染分页的方法
    function renderPage(total) {
        // 调用laypage.render()来渲染分页结构
        laypage.render({
            elem: 'pageBox', //分页容器id
            count: total, //总数据条数
            limits: q.pagesize, //每页显示几条数据
            curr: q.pagenum, //设置默认被选取的页数
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            // 分页发生切换时，触发Jump回调
            // di
            jump: function(obj, first) {
                console.log(obj.curr);
                // 将最新的页码值，赋值到q这个查询参数对象中
                q.pagenum = obj.curr;
                // 将最新的条目数赋值到q查询参数对象的qsize上
                q.pagesize = obj.limit;
                // 根据最新的q获取对应数据列表，并渲染表格
                // 不能直接去调用initTable(),会陷入死循环
                if (first) {
                    initTable();
                }
            }
        });
    }
    // 通过代理的形式 为删除按钮绑定点击事件
    $("tbody").on('click', '.btn-delete', function() {
        // 获取删除按钮个数
        var len = $('.btn-delete').length;
        var id = $(this).attr('data-id')
        layer.confirm('确认删除?', { icon: 3, title: '提示' }, function(index) {
            //do something
            $.ajax({
                method: 'GET',
                url: '/my/article/delete/' + id,
                success: function(res) {
                    if (res.status !== 0) {
                        return layer.msg('删除失败');
                    }
                    layer.msg('删除成功');
                    // 在将某页数据全部删除后，应该判断该页是否还有数据
                    // 无数据 页码值-1
                    // 通过当前页的删除按钮的数量 判断是否还有数据
                    if (len === 1) {
                        // 页码值最小是1

                        q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1;
                    }
                    initTable();
                }
            })
            layer.close(index);
        });
    })
})