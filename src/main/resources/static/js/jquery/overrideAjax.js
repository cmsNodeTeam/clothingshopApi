/**
 * Created by CC on 2017/5/1.
 */
'use strict';
(function ($) {
    //首先备份下jquery的ajax方法
    var _ajax = $.ajax;

    //重写jquery的ajax方法
    $.ajax = function (opt) {
        //备份方法
        var fn = {
            success: opt.success || $.noop,
            error: opt.error || $.noop,
            beforeSend: opt.beforeSend || $.noop,
            complete: opt.complete || $.noop,
            loadingId: opt.loadingId,
            redirectCallback: opt.redirectCallback || $.noop
        };
        //扩展增强处理
        var _opt = $.extend(opt, {
            error: function (xhr) {
                if (xhr.status === 500) {
                    $.createAlert('请求服务器错误,错误代码:500');
                    // return;
                }
                //错误方法增强处理
                fn.error.apply(this.error, arguments);
            },
            success: function (result) {
                try {
                    result = JSON.parse(result);
                    $.debug.log('result:'+ JSON.stringify(result));
                } catch (e) {
                }
                if ($.isPlainObject(result) && result.code === -302) {
                    window.location.href = result['redirectURL'];
                    return;
                }
                fn.success.apply(this.success, [result]);
            },
            beforeSend: function (callback, jqXHR) {
                //提交前回调方法
                var loadId;
                if (fn.loadingId) {
                    loadId = $.loadingDiv(fn.loadingId);
                }
                $.debug.log('url:' + opt.url);
                $.debug.log('params:' + decodeURIComponent(opt.data));
                callback.loadId = loadId;
                fn.beforeSend.apply(this.beforeSend, [callback, jqXHR]);
            },
            complete: function (callback) {
                //请求完成后回调函数 (请求成功或失败之后均调用)。
                if (callback.loadId)$.cancelLoadingDiv(callback.loadId);
                fn.redirectCallback.apply(this.complete, [callback['responseJSON']]);
                fn.complete.apply(this.complete, arguments);
            },
            method: opt.method || opt.type || 'post',
            cache: opt.cache || false,
            contentType: opt.contentType || 'application/json',
            timeout: opt.timeout || 2 * 60 * 1000
        });
        if ($.isPlainObject(opt.data)) {
            if(_opt.method.toLowerCase() === 'get'){
                _opt.data = $.param(opt.data);
            }else if ($.isEmpty(opt.dataType) || opt.dataType !== 'json') {
                _opt.data = JSON.stringify(opt.data);
            }
        }
        if($.isPlainObject(opt.params)){
            opt.url = opt.url + '?' + $.param(opt.params);
        }
        return _ajax(_opt);
    };

})(jQuery);