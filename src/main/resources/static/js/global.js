/**
 * Created by CC on 2016/11/9.
 * 客户端全局的js
 */
'use strict';
if (!Date.prototype.format) {
    Date.prototype.format = function (fmt) {
        return moment(this).format(fmt || 'YYYY-MM-DD');
    };
}

if(!Date.prototype.add){
    Date.prototype.add = function (num, type, val, fmt) {
        return moment(val || this).add(num, type).format(fmt || 'YYYY-MM-DD');
    };
}

if(!Date.prototype.subtract){
    Date.prototype.subtract = function (num, type, val, fmt) {
        return moment(val || this).subtract(num, type).format(fmt || 'YYYY-MM-DD');
    };
}

if(!String.prototype.contains){
    String.prototype.contains = function (s) {
        return this.indexOf(s) > -1;
    };
}

if (typeof jQuery === "undefined") {
    throw new Error("global requires jQuery");
}
//定义一些常量,封装在jquery里面
+function ($) {
    $.staticParams = {};
    $('#_parameters').find('input').each(function () {
        var that = $(this);
        var value = that.val();
        var key = that.attr('title');
        $.staticParams[key] = value;
    });
}(jQuery);

+function ($) {
    $.langType = {
        CN: 'CN',
        EN: 'EN'
    };

    $.cookie_Expires = 7 * 24 * 3600 * 1000;//7天

    $.KEYS_CODE = {
        BACKSPACE: 8,
        TAB: 9,
        ENTER: 13,
        SHIFT: 16,
        CTRL: 17,
        ALT: 18,
        ESC: 27,
        SPACE: 32,
        PAGE_UP: 33,
        PAGE_DOWN: 34,
        END: 35,
        HOME: 36,
        LEFT: 37,
        UP: 38,
        RIGHT: 39,
        DOWN: 40,
        DELETE: 46
    };

    $.iCheckTheme = {
        checkboxClass: 'icheckbox_square-blue',
        radioClass: 'iradio_square-blue',
        increaseArea: '20%'
    };

    $.checkDateJson = {
        onincomplete: function () {
            var value = $(this).val();
            if (value) {
                $.createAlert($.clientLang('无效的日期:{0}', value));
            }
        },
        clearIncomplete: true
    };

    $.mailExp = /^[\w\.\-]+@[\w]+((\.[\w]{2,3}){1,2})$/;

    $.userNameExp = /^[\w\u4e00-\u9fa5\@\.]+$/;

    $.devModel = 'dev';//开启debug输出log模式
}(jQuery);

//把方法封装在jQuery里面
+function ($) {
    //判断null或者''
    $.isEmpty = function (obj) {
        return obj == null || obj === '' || /\?\s(string|undefined):(.*)\s\?/.test(obj);
    };

    //得到Cookie
    $.getCookie = function (name) {
        var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
        if (arr = document.cookie.match(reg))
            return decodeURIComponent(arr[2]);
        else
            return null;
    };

    //设置Cookie
    $.setCookie = function (name, value, path) {
        var exp = new Date();
        exp.setTime(exp.getTime() + $.cookie_Expires);
        //如果不设值,那么默认这个cookie没有有效时间
        if ($.isEmpty(value)) {
            exp.setTime(0);
        }
        document.cookie = name + "=" + encodeURIComponent(value) + ";expires=" + exp.toUTCString()
            + ";path=" + (path || '/');
    };

    //客户端翻译函数
    $.clientLang = function (str) {
        var langType = $.getLangType();
        if (typeof $.fn.bootstrapTable !== "undefined") {
            $.extend($.fn.bootstrapTable.defaults,
                $.fn.bootstrapTable.locales[getBootstrapTableType($.getLangType())]);//表格的多语言
        }
        switch (langType) {
            case $.langType.EN:
                $.langProperties[str]
                    ? str = $.langProperties[str][0]
                    : str;
                break;
            default:
                break;
        }
        arguments[0] = str || arguments[0];
        //如果替换的内容是个数组
        if(Array.isArray(arguments[1])){
            var array = arguments[1];
            array.unshift(arguments[0]);//这里会改变arguments[0]和[1]的原始值
            return $.replaceArgs.apply($.clientLang, array);
        }
        return $.replaceArgs.apply($.clientLang, arguments);
    };

    //替换参数
    $.replaceArgs = function () {
        var SKIP_INDEXES = 1;

        var templateArgs = arguments;
        var str = arguments[0];
        var message = '';

        if (typeof str !== 'string') {
            return '';
        }

        message += str.replace(/\{\d+\}/g, function (match) {
            var index = +match.slice(1, -1),//==>\d是什么数字
                shiftedIndex = index + SKIP_INDEXES;//==>替换字符的参数位置

            if (shiftedIndex < templateArgs.length) {
                return templateArgs[shiftedIndex];
            }
            return match;
        });

        return message;
    };

    $.downloadFile = function (filename, header, data) {
        var ua = window.navigator.userAgent;
        var DownloadEvt = null;
        if (filename !== false && (ua.indexOf("MSIE ") > 0 || !!ua.match(/Trident.*rv\:11\./))) {
            if (window.navigator.msSaveOrOpenBlob)
                window.navigator.msSaveOrOpenBlob(new Blob([data]), filename);
            else {
                var frame = document.createElement("iframe");

                if (frame) {
                    document.body.appendChild(frame);
                    frame.setAttribute("style", "display:none");
                    frame.contentDocument.open("txt/html", "replace");
                    frame.contentDocument.write(data);
                    frame.contentDocument.close();
                    frame.focus();

                    frame.contentDocument.execCommand("SaveAs", true, filename);
                    document.body.removeChild(frame);
                }
            }
        }
        else {
            var DownloadLink = document.createElement('a');

            if (DownloadLink) {
                DownloadLink.style.display = 'none';
                if (filename !== false)
                    DownloadLink.download = filename;
                else
                    DownloadLink.target = '_blank';

                if (header.toLowerCase().indexOf("base64,") >= 0)
                    DownloadLink.href = header + base64encode(data);
                else
                    DownloadLink.href = header + encodeURIComponent(data);

                document.body.appendChild(DownloadLink);

                if (document.createEvent) {
                    if (DownloadEvt === null)
                        DownloadEvt = document.createEvent('MouseEvents');

                    DownloadEvt.initEvent('click', true, false);
                    DownloadLink.dispatchEvent(DownloadEvt);
                }
                else if (document.createEventObject)
                    DownloadLink.fireEvent('onclick');
                else if (typeof DownloadLink.onclick == 'function')
                    DownloadLink.onclick();

                document.body.removeChild(DownloadLink);
            }
        }

        function base64encode(input) {
            var keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
            var output = "";
            var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
            var i = 0;
            input = utf8Encode(input);
            while (i < input.length) {
                chr1 = input.charCodeAt(i++);
                chr2 = input.charCodeAt(i++);
                chr3 = input.charCodeAt(i++);
                enc1 = chr1 >> 2;
                enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
                enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
                enc4 = chr3 & 63;
                if (isNaN(chr2)) {
                    enc3 = enc4 = 64;
                } else if (isNaN(chr3)) {
                    enc4 = 64;
                }
                output = output +
                    keyStr.charAt(enc1) + keyStr.charAt(enc2) +
                    keyStr.charAt(enc3) + keyStr.charAt(enc4);
            }
            return output;
        }

        function utf8Encode(string) {
            if (typeof string !== 'string')return string;
            string = string.replace(/\x0d\x0a/g, "\x0a");
            var utftext = "";
            for (var n = 0; n < string.length; n++) {
                var c = string.charCodeAt(n);
                if (c < 128) {
                    utftext += String.fromCharCode(c);
                }
                else if ((c > 127) && (c < 2048)) {
                    utftext += String.fromCharCode((c >> 6) | 192);
                    utftext += String.fromCharCode((c & 63) | 128);
                }
                else {
                    utftext += String.fromCharCode((c >> 12) | 224);
                    utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                    utftext += String.fromCharCode((c & 63) | 128);
                }
            }
            return utftext;
        }
    };

    $.loadingDiv = function (id) {
        var loadId = 'loading-'+parseInt(Math.random()*1000);
        var overlay = '<div class="overlay loadingDiv" id="' + loadId + '">' +
            '<div class="sk-spinner sk-spinner-fading-circle">' +
            '<div class="sk-circle1 sk-circle"></div>' +
            '<div class="sk-circle2 sk-circle"></div>' +
            '<div class="sk-circle3 sk-circle"></div>' +
            '<div class="sk-circle4 sk-circle"></div>' +
            '<div class="sk-circle5 sk-circle"></div>' +
            '<div class="sk-circle6 sk-circle"></div>' +
            '<div class="sk-circle7 sk-circle"></div>' +
            '<div class="sk-circle8 sk-circle"></div>' +
            '<div class="sk-circle9 sk-circle"></div>' +
            '<div class="sk-circle10 sk-circle"></div>' +
            '<div class="sk-circle11 sk-circle"></div>' +
            '<div class="sk-circle12 sk-circle"></div>' +
            '</div></div>';
        var $id = $(id || 'body');
        $id.append(overlay).css('position', 'relative');
        if(!id || id === 'body'){
            $('#'+loadId).css({
                position:'fixed',
                width:'100vw',
                height:'100vh'
            });
        }
        return loadId;
    };

    $.cancelLoadingDiv = function (loadId) {
        if(loadId){
            $('#'+loadId).remove();
            return;
        }
        $('.loadingDiv').remove();
    };

    $.setLocalStore = function (name, val) {
        if (typeof (Storage) !== "undefined") {
            localStorage.setItem(name, val);
        } else {
            console.warn('Please use a modern browser to properly view this template!');
            $.setCookie(name, val);
        }
    };

    $.getLocalStore = function (name) {
        if (typeof (Storage) !== "undefined") {
            return localStorage.getItem(name);
        } else {
            console.warn('Please use a modern browser to properly view this template!');
            return $.getCookie(name);
        }
    };

    $.getLangType = function() {
        var pathname = window.location.pathname;
        var cookieType = '';
        if (pathname.startsWith('/super')) {
            cookieType = $.getCookie('superLanguage');
        } else {
            cookieType = $.getCookie('userLanguage');
        }
        return cookieType || $.langType.CN;
    };

    function getBootstrapTableType(type) {
        var langType = 'zh-CN';
        switch (type) {
            case $.langType.EN:
                langType = 'en-US';
                break;
            default:
                break;
        }
        return langType;
    }

    //返回日期插件options,只不过可以设置默认值
    $.extendTimeOption = function (opt) {
        var param = {};
        if(opt.date){
            param.initialDate = opt.date;
        }
        return $.extend(param, $.getTimeOption);
    };

    $.getTimeOption = {
        bootcssVer: 3,//使用glyphicon
        // weekStart: 0,//一周从星期几开始,0是星期天
        todayBtn: 1,
        autoclose: 1,
        todayHighlight: 1,
        // startView: 2,默认是2
        minView: 2,//0是选择到分钟,1是小时,2是日
        pickerPosition: 'bottom-left',
        language: getBootstrapTableType($.getLangType()),
        // forceParse: 1,
        format: 'yyyy-mm-dd',
        zIndex: 2147483650,
        container: '#ngView'
    };

    $.createAlert = function (str, fn, params) {
        params = params || {};
        return layer.open({
            title: params.title || $.clientLang('操作提示'),
            content: $.clientLang(str),
            btn: [$.clientLang('确定')],
            move: false,
            resize: false,
            skin: 'bs-class',
            shade: [0],
            yes: function (index) {//该回调携带两个参数,分别为当前层索引、当前层DOM对象
                if (typeof fn === 'function')fn();
                layer.close(index);
            },
            cancel: function (index) {
                if (typeof fn === 'function')fn();
                layer.close(index);
            }
        });
    };

    $.createConfirm = function (str, fn, cancelFn) {
        return layer.open({
            title: $.clientLang('操作提示'),
            content: $.clientLang(str),
            btn: [$.clientLang('确定'), $.clientLang('取消')],
            skin: 'bs-class',
            move: false,
            shade: [0],
            resize: false,
            yes: function (index, layero, $btn) {//该回调携带两个参数,分别为当前层索引、当前层DOM对象
                if (typeof fn === 'function')fn($btn);
                layer.close.apply(this, arguments);
            },
            btn2: function (index, layero, $btn) {
                if (typeof cancelFn === 'function')cancelFn($btn);
                layer.close.apply(this, arguments);
            }
        });
    };

    $.parseParams = function (str, sep, eq) {
        var obj = {},
            _sep = sep || '&',
            _eq = eq || '=',
            regex = new RegExp('^(.+)' + _eq + '(.+)$');

        if (typeof str !== 'string' || str.length === 0)return obj;
        if (typeof _sep !== 'string')
            _sep += '';
        var strArray = str.split(_sep);

        $.each(strArray, function (i, value) {
            var matches = value.match(regex);
            if (matches) {
                var objKey = matches[1];
                var objValue = matches[2];
                createNode(obj, objKey, objValue);
            }
        });

        function createNode(obj, objKey, objValue) {
            var objKeyArr = objKey.split('.');
            var temp = '';
            for (var i = objKeyArr.length - 1; i >= 0; i--) {
                if (i === objKeyArr.length - 1) {
                    temp = '"' + objKeyArr[i] + '"' + ':' + objValue;
                    continue;
                }
                temp = '"' + objKeyArr[i] + '"' + ':' + '{' + temp + '}';
            }
            temp = "{" + temp + "}";
            $.extend(true, obj, JSON.parse(temp));
        }

        return obj;
    };

    $.stringifyParams = function (obj, sep, eq) {
        var temp = JSON.stringify(obj),
            _sep = sep || '&',
            _eq = eq || '=';

        if (!$.isPlainObject(obj) || Object.keys(obj).length === 0) {
            return temp;
        }
        var arr = [];
        appendParams(arr, obj, _eq);
        temp = [];
        $.each(arr, function (i, value) {
            temp.push(value);
        });

        function appendParams(arr, obj, eq, prefix) {
            $.each(obj, function (key, value) {
                if (prefix) key = prefix + '.' + key;
                var row = JSON.stringify(value);
                if (!$.isPlainObject(value) || row === '{}') {
                    //值不是对象,或者是数组处理
                    if (row === 'null' || row === undefined) {
                        row = '';
                    }
                    arr.push(key + eq + row);
                } else {
                    //值是一个对象处理
                    appendParams(arr, value, eq, key);
                }
            });
        }

        return temp.join(_sep);
    };

    $.compareObjects = function (objA, objB) {
        var objectAProperties = Object.getOwnPropertyNames(objA),
            objectBProperties = Object.getOwnPropertyNames(objB),
            propName = '';

        if (objectAProperties.length !== objectBProperties.length) {
            return false;
        }

        for (var i = 0; i < objectAProperties.length; i++) {
            propName = objectAProperties[i];
            if ($.inArray(propName, objectBProperties) > -1) {
                var isObj = $.isPlainObject(objA[propName]) && $.isPlainObject(objB[propName]);
                var isArr = Array.isArray(objA[propName]) && Array.isArray(objB[propName]);
                if (isArr || isObj) {
                    if (!$.compareObjects(objA[propName], objB[propName])) {
                        return false;
                    }
                } else if (objA[propName] !== objB[propName]) {
                    return false;
                }
            } else {
                return false;
            }
        }
        return true;
    };

    $.getParams = function (params) {
        return {
            offset: params.offset,
            pageSize: params.limit,
            sortOrder: {
                sort: params.sort,
                order: params.order
            }
        };
    };

    $.getHashUrl = function () {
        return $.getLocalStore('hashUrl') || '';
    };

    $.getCurrentUrl = function () {
        return $.getLocalStore('currentUrl') || '';
    };

    $.getObjLength = function (obj) {
        if(!$.isPlainObject(obj)){
            return 0;
        }
        return Object.keys(obj).length;
    };

    $.createConfirmModal = function (str, fn, cancelFn, params) {
        var $modal = $('#_confirmModal');
        var $title = $('#_confirmModalTitle');
        var $body = $('#_confirmBody');
        var $ok = $('#_confirmOk');
        var $cancel = $('#_confirmCancel');

        params = params || {};
        $title.html($.clientLang(params.title || '操作提示'));
        $body.html(str);
        if(params.okUrl){
            $ok.attr('href', params.okUrl);
        }
        // if(params.cancelUrl){
        //     $cancel.attr('href',params.cancelUrl);
        // }

        $modal.modal({
            backdrop: false,
            keyboard: false
        });

        $cancel.off('click').on('click', cancel);
        $ok.off('click').on('click', function () {
            if(typeof fn === 'function'){
                if(!fn())return false;
            }
            cancel();
        });

        function cancel() {
            if(typeof cancelFn === 'function'){
                cancelFn();
            }
            $modal.modal('hide');
            $body.html('');
            $title.html('');
        }
    };
}(jQuery);

+(function ($) {
    $.saveAs = (function (view) {
        if (typeof navigator !== "undefined" && /MSIE [1-9]\./.test(navigator.userAgent)) {
            return;
        }
        var
            doc = view.document
            // only get URL when necessary in case Blob.js hasn't overridden it yet
            , get_URL = function () {
                return view.URL || view.webkitURL || view;
            }
            , save_link = doc.createElementNS("http://www.w3.org/1999/xhtml", "a")
            , can_use_save_link = "download" in save_link
            , click = function (node) {
                var event = new MouseEvent("click");
                node.dispatchEvent(event);
            }
            , is_safari = /Version\/[\d\.]+.*Safari/.test(navigator.userAgent)
            , webkit_req_fs = view.webkitRequestFileSystem
            , req_fs = view.requestFileSystem || webkit_req_fs || view.mozRequestFileSystem
            , throw_outside = function (ex) {
                (view.setImmediate || view.setTimeout)(function () {
                    throw ex;
                }, 0);
            }
            , force_saveable_type = "application/octet-stream"
            , fs_min_size = 0
            // See https://code.google.com/p/chromium/issues/detail?id=375297#c7 and
            // https://github.com/eligrey/FileSaver.js/commit/485930a#commitcomment-8768047
            // for the reasoning behind the timeout and revocation flow
            , arbitrary_revoke_timeout = 500 // in ms
            , revoke = function (file) {
                var revoker = function () {
                    if (typeof file === "string") { // file is an object URL
                        get_URL().revokeObjectURL(file);
                    } else { // file is a File
                        file.remove();
                    }
                };
                if (view.chrome) {
                    revoker();
                } else {
                    setTimeout(revoker, arbitrary_revoke_timeout);
                }
            }
            , dispatch = function (filesaver, event_types, event) {
                event_types = [].concat(event_types);
                var i = event_types.length;
                while (i--) {
                    var listener = filesaver["on" + event_types[i]];
                    if (typeof listener === "function") {
                        try {
                            listener.call(filesaver, event || filesaver);
                        } catch (ex) {
                            throw_outside(ex);
                        }
                    }
                }
            }
            , auto_bom = function (blob) {
                // prepend BOM for UTF-8 XML and text/* types (including HTML)
                if (/^\s*(?:text\/\S*|application\/xml|\S*\/\S*\+xml)\s*;.*charset\s*=\s*utf-8/i.test(blob.type)) {
                    return new Blob(["\ufeff", blob], {type: blob.type});
                }
                return blob;
            }
            , FileSaver = function (blob, name, no_auto_bom) {
                if (!no_auto_bom) {
                    blob = auto_bom(blob);
                }
                // First try a.download, then web filesystem, then object URLs
                var
                    filesaver = this
                    , type = blob.type
                    , blob_changed = false
                    , object_url
                    , target_view
                    , dispatch_all = function () {
                        dispatch(filesaver, "writestart progress write writeend".split(" "));
                    }
                    // on any filesys errors revert to saving with object URLs
                    , fs_error = function () {
                        if (target_view && is_safari && typeof FileReader !== "undefined") {
                            // Safari doesn't allow downloading of blob urls
                            var reader = new FileReader();
                            reader.onloadend = function () {
                                var base64Data = reader.result;
                                target_view.location.href = "data:attachment/file" + base64Data.slice(base64Data.search(/[,;]/));
                                filesaver.readyState = filesaver.DONE;
                                dispatch_all();
                            };
                            reader.readAsDataURL(blob);
                            filesaver.readyState = filesaver.INIT;
                            return;
                        }
                        // don't create more object URLs than needed
                        if (blob_changed || !object_url) {
                            object_url = get_URL().createObjectURL(blob);
                        }
                        if (target_view) {
                            target_view.location.href = object_url;
                        } else {
                            var new_tab = view.open(object_url, "_blank");
                            if (new_tab == undefined && is_safari) {
                                //Apple do not allow window.open, see http://bit.ly/1kZffRI
                                view.location.href = object_url;
                            }
                        }
                        filesaver.readyState = filesaver.DONE;
                        dispatch_all();
                        revoke(object_url);
                    }
                    , abortable = function (func) {
                        return function () {
                            if (filesaver.readyState !== filesaver.DONE) {
                                return func.apply(this, arguments);
                            }
                        };
                    }
                    , create_if_not_found = {create: true, exclusive: false}
                    , slice;
                filesaver.readyState = filesaver.INIT;
                if (!name) {
                    name = "download";
                }
                if (can_use_save_link) {
                    object_url = get_URL().createObjectURL(blob);
                    setTimeout(function () {
                        save_link.href = object_url;
                        save_link.download = name;
                        click(save_link);
                        dispatch_all();
                        revoke(object_url);
                        filesaver.readyState = filesaver.DONE;
                    });
                    return;
                }
                // Object and web filesystem URLs have a problem saving in Google Chrome when
                // viewed in a tab, so I force save with application/octet-stream
                // http://code.google.com/p/chromium/issues/detail?id=91158
                // Update: Google errantly closed 91158, I submitted it again:
                // https://code.google.com/p/chromium/issues/detail?id=389642
                if (view.chrome && type && type !== force_saveable_type) {
                    slice = blob.slice || blob.webkitSlice;
                    blob = slice.call(blob, 0, blob.size, force_saveable_type);
                    blob_changed = true;
                }
                // Since I can't be sure that the guessed media type will trigger a download
                // in WebKit, I append .download to the filename.
                // https://bugs.webkit.org/show_bug.cgi?id=65440
                if (webkit_req_fs && name !== "download") {
                    name += ".download";
                }
                if (type === force_saveable_type || webkit_req_fs) {
                    target_view = view;
                }
                if (!req_fs) {
                    fs_error();
                    return;
                }
                fs_min_size += blob.size;
                req_fs(view.TEMPORARY, fs_min_size, abortable(function (fs) {
                    fs.root.getDirectory("saved", create_if_not_found, abortable(function (dir) {
                        var save = function () {
                            dir.getFile(name, create_if_not_found, abortable(function (file) {
                                file.createWriter(abortable(function (writer) {
                                    writer.onwriteend = function (event) {
                                        target_view.location.href = file.toURL();
                                        filesaver.readyState = filesaver.DONE;
                                        dispatch(filesaver, "writeend", event);
                                        revoke(file);
                                    };
                                    writer.onerror = function () {
                                        var error = writer.error;
                                        if (error.code !== error.ABORT_ERR) {
                                            fs_error();
                                        }
                                    };
                                    "writestart progress write abort".split(" ").forEach(function (event) {
                                        writer["on" + event] = filesaver["on" + event];
                                    });
                                    writer.write(blob);
                                    filesaver.abort = function () {
                                        writer.abort();
                                        filesaver.readyState = filesaver.DONE;
                                    };
                                    filesaver.readyState = filesaver.WRITING;
                                }), fs_error);
                            }), fs_error);
                        };
                        dir.getFile(name, {create: false}, abortable(function (file) {
                            // delete file if it already exists
                            file.remove();
                            save();
                        }), abortable(function (ex) {
                            if (ex.code === ex.NOT_FOUND_ERR) {
                                save();
                            } else {
                                fs_error();
                            }
                        }));
                    }), fs_error);
                }), fs_error);
            }
            , FS_proto = FileSaver.prototype
            , saveAs = function (blob, name, no_auto_bom) {
                return new FileSaver(blob, name, no_auto_bom);
            };
        // IE 10+ (native saveAs)
        if (typeof navigator !== "undefined" && navigator.msSaveOrOpenBlob) {
            return function (blob, name, no_auto_bom) {
                if (!no_auto_bom) {
                    blob = auto_bom(blob);
                }
                return navigator.msSaveOrOpenBlob(blob, name || "download");
            };
        }

        FS_proto.abort = function () {
            var filesaver = this;
            filesaver.readyState = filesaver.DONE;
            dispatch(filesaver, "abort");
        };
        FS_proto.readyState = FS_proto.INIT = 0;
        FS_proto.WRITING = 1;
        FS_proto.DONE = 2;

        FS_proto.error =
            FS_proto.onwritestart =
                FS_proto.onprogress =
                    FS_proto.onwrite =
                        FS_proto.onabort =
                            FS_proto.onerror =
                                FS_proto.onwriteend =
                                    null;
        return saveAs;
    })(window);

    $.download = function (filename, header, data) {
        try {
            //这里CSV格式的协议和头有点区别,这里没有判断
            var blob = new Blob([data], {type: header});
            $.saveAs(blob, filename);
        }
        catch (e) {
            $.downloadFile(filename, 'data:'+header, data);
        }
    };
})(jQuery);

+function ($) {
    //初始化皮肤方法
    $.changeSkin = function (skinValue) {
        var color = null;
        var skinType = $.getLocalStore('skin');
        if (!skinType) {
            color = 'blue';
        } else {
            color = skinType.split('-')[1];
        }
        $('body').removeClass('skin-' + color).addClass(skinValue);
        var newColor = skinValue.split('-')[1];
        //icheck类转化
        if (color === 'black') color = '';
        else color = '-' + color;
        if (newColor === 'black') newColor = '';
        else newColor = '-' + newColor;
        $.iCheckTheme = {
            checkboxClass: 'icheckbox_square' + newColor,
            radioClass: 'iradio_square' + newColor
        };
        var $icheck = $('.icheck-group');
        $icheck.find('>label>div').each(function () {
            var $this = $(this);
            var type = $this.find('input').attr('type');
            var oldClass = $.replaceArgs('i{0}_square{1}', type, color);
            var newClass = $.replaceArgs('i{0}_square{1}', type, newColor);
            $this.removeClass(oldClass).addClass(newClass);
        });
        $.setLocalStore('skin', skinValue);
    };

    $.changeSkin($.getLocalStore('skin') || 'skin-blue');

    $.debug = {
        log:function (str) {
            if($.devModel === 'debug')console.log(str);
        }
    };

    $.formatNumber = function (number, fractionSize) {
        if(!((typeof number === 'number') || (typeof number === 'string')))return '';
        if(!(typeof fractionSize === 'number'))fractionSize = 0;
        var zero = 0;
        var num = number + '';//数字转字符串
        var index = num.indexOf('.');//获取小数点下标
        var isFloat = index > 0 ? true : false;//判断是否是浮点型数字
        if(!isFloat){
            //整数进来
            if(fractionSize > 0)num = num + '.';//没有保留有效位数不加小数点
            for(var j = 0;j < fractionSize; j++){
                num += zero;
            }
            return num;
        }
        var n = num.length - index - 1;//获取小数位的个数
        if(fractionSize >= n){
            //保留位比小数位多
            for(var j = n;j < fractionSize; j++){
                num += zero;
            }
            return num;
        }
        //保留位比小数位少
        var e = Math.pow(10, fractionSize);
        number = Math.round(number * e);
        return number/e;
    };

    //layer的弹出层封装
    $.createDialog = function (params) {
        params = params || {};
        if(!params.$el){
            $.createAlert('缺少$el参数');
            return;
        }
        var $el = params.$el;
        $el.css({display: 'block'});
        if(!params.fnList){
            params.fnList = {};
        }
        var fnList = params.fnList;
        var option = {
            title:$.clientLang(params.title || ''),
            type: 1,
            maxmin: params.maxmin || false,
            area: [params.width, params.height],
            content: $el,
            skin: 'bs-class',
            move: false,
            resize: false,
            shade:[0],
            cancel: function (index) {
                if(typeof fnList.cancel === 'function'){
                    fnList.cancel.apply(this, arguments);
                }
                layer.close(index);
            },
            btn: params['btns'] || [],
            yes:function (index) {
                if(typeof fnList.yes === 'function'){
                    fnList.yes.apply(this, arguments);
                }
                //如果btn的个数是1个那么默认是关闭的效果
                if(this.btn.length === 1){
                    this.cancel(index);
                }
            },
            end:function () {
                $el.css({display: 'none'});
            },
            scrollbar:true
        };
        $.each(params.fnList, function (key, value) {
            if(key === 'yes' || key === 'cancel')return true;
            option[key] = value;
        });
        return layer.open(option);
    };

    $.weekDay = [
        $.clientLang("星期天"),$.clientLang("星期一"),$.clientLang("星期二"),$.clientLang("星期三"),
        $.clientLang("星期四"),$.clientLang("星期五"),$.clientLang("星期六")
    ];

    $.formatJSON = function (txt/*格式化内容文本*/, compress/*是否压缩文本,true即为压缩*/) {
        var indentChar = '    ';//4个空格
        if (typeof txt !== 'string' || /^\s*$/.test(txt)) {
            return txt;
        }
        if (typeof compress !== 'boolean'){
            compress = false;
        }
        try {
            var data = eval('(' + txt + ')');
        }catch (e) {
            return txt;
        }

        var draw = [],//内容数组
            line = compress ? '' : '\n',
            nodeCount = 0,
            maxDepth = 0;//最大深度

        var notify = function (name, value, isLast, indent/*缩进*/, formObj) {
            nodeCount++;
            /*节点计数*/
            for (var i = 0, tab = ''; i < indent; i++){
                tab += indentChar;
            }
            /* 缩进HTML */
            tab = compress ? '' : tab;
            /*压缩模式忽略缩进*/
            maxDepth = ++indent;
            /*缩进递增并记录*/
            if (Array.isArray(value)) {/*处理数组*/
                draw.push(tab + (formObj ? ('"' + name + '":') : '') + '[' + line);
                /*缩进'[' 然后换行*/
                $.each(value, function (i, v) {
                    notify(i, v, i === value.length - 1, indent, false);
                });
                draw.push(tab + ']' + (isLast ? line : (',' + line)));
                /*缩进']'换行,若非尾元素则添加逗号*/
            } else if ($.isPlainObject(value)) {/*处理对象*/
                draw.push(tab + (formObj ? ('"' + name + '":') : '') + '{' + line);
                /*缩进'{' 然后换行*/
                var len = $.getObjLength(value), j = 0;
                $.each(value, function (key, v) {
                    notify(key, v, ++j === len, indent, true);
                });
                draw.push(tab + '}' + (isLast ? line : (',' + line)));
                /*缩进'}'换行,若非尾元素则添加逗号*/
            } else {
                if (typeof value === 'string')value = '"' + value + '"';
                draw.push(tab + (formObj ? ('"' + name + '":') : '') + value + (isLast ? '' : ',') + line);
            }
        };

        notify('', data, true, 0, false);

        return draw.join('');
    };
}(jQuery);
