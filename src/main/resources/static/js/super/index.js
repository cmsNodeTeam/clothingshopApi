/**
 * Created by CC on 2016/5/30.
 */
"use strict";
+(function ($) {
    //绑定快捷键,注掉了以后看情况做
    // $(document).bind('keydown', 'ctrl+r', function (e) {
    //     // window.location.href = '#rightsSetup';
    //     // var parser = document.createElement('a');
    //     // parser.href = 'rightsSetup';
    //     // var $a = $(parser);
    //     // $a.off('click').on('click',function (e) {
    //     //     e.preventDefault();
    //     //     console.log(222)
    //     //     return true;
    //     // });
    //     // console.log($a);
    //     // $a.trigger('click');
    //     window.location.href = 'rightsSetup';
    //     e.preventDefault();
    // }).bind('keydown', 'ctrl+u', function (e) {
    //     window.location.href = 'userSetup';
    //     e.preventDefault();
    // });

    $.initSize = {
        resizeBody: function () {
            //根据窗口变化改变ngView的高度
            // 方式1
            // var height = $(window).height() - $('header').height();
            // var oldHeight = parseInt($('#ngView').css('height'));
            // if(oldHeight !== height){
            //     $('#ngView').css({
            //         height: height + 'px',
            //         overflow: 'auto',
            //         'padding-bottom': '50px'//footer.html页面的高度
            //     });
            // }

            //方式2
            var height = $('nav').height();
            var minHeight = $(window).height() - height;
            $('#ngView').css({
                // 'margin-top': height + 'px',
                'min-height': minHeight + 'px'
                // 'padding-bottom': '40px'
            });
        },
        resizeModal: function () {
            //改变模态框的高度
            var modal = $('.modal-body');
            //padding-top和bottom各30px,title 56px,footer 65px
            var maxHeight = $(window).height() - 30 * 2 - 56 - 65;
            modal.css({
                "max-height": maxHeight + 'px',
                overflow: 'auto'
            });
            // modal.slimScroll({
            //     height:maxHeight + 'px'
            // });
        }
    };

    //设置按钮事件
    // $.toggleBtn = function () {
    //     var configBox = $('.theme-config-box');
    //     var btnList = configBox.find('button');
    //     if (btnList.length !== 0) {
    //         configBox.css('margin-right', '-' + btnList.eq(0).css('width'));
    //     } else {
    //         $('.skin-settings').css('width', '220px');
    //     }
    //     $('.spin-icon').click(function () {
    //         configBox.toggleClass("show");
    //     });
    // };

    if($.getLocalStore('sidebar-collapse') === 'true'){
        $('body').addClass('sidebar-collapse');
    }

    $(window).resize(function () {
        //当浏览器大小变化时
        $.initSize.resizeModal();
        $.initSize.resizeBody();
    });

    $('body').tooltip({
        selector: "[data-toggle='tooltip']",
        container: 'body'
    });

})(jQuery);
