/**
 * Created by CC on 2016/11/9.
 * 管理员登录时的js
 */
'use strict';
(function ($) {
    function SuperLogin() {
        this.$selectLang = $('#selectLang');
        this.$login = $('#login');
        this.$inputAdminId = $('#inputAdminId');
        this.$inputAdminPws = $('#inputAdminPws');
        this.$remember = $('#remember');
        this.$forgetLink = $('#forgetLink');
        this.langType = $.getCookie('superLanguage') || $.langType.CN;
        this.adminId = $.getCookie('adminId') || '';
    }

    SuperLogin.prototype = {
        init: function () {
            this.$selectLang.val(this.langType);
            this.$inputAdminId.val(this.adminId);
            if(!$.isEmpty(this.adminId)){
                this.$remember.prop('checked', true);
            }
            this.addListener();
        },
        addListener: function () {
            this.$selectLang.on('change', $.proxy(this.changeLanguage, this));

            //整个页面注册回车事件
            $(document).bind('keydown', 'return', $.proxy(this.keydownAction, this));

            //去掉按钮的点击感,避免按回车时调用按钮的点击事件
            this.$login.on('focus', function () {
                this.blur();
            });

            this.$login.on('click', $.proxy(this.logining, this));

            this.$forgetLink.on('click', $.proxy(this.forgetPws, this));
        },
        logining: function () {
            var that = this;
            //前端校验
            if (!this.checkLoginInfo())return;
            //校验完成后
            //加个提示错误信息的div吧
            var loginData = {
                adminId: this.$inputAdminId.val(),
                adminPws: this.crypto(this.$inputAdminPws.val())
            };
            if(this.$remember.is(':checked')){
                $.setCookie('adminId', loginData.adminId);
            }else {
                $.setCookie('adminId');
            }
            //加正在登录
            this.$login.html($.clientLang('正在登录...'));
            $.ajax({
                url: '/super.do',
                data: loginData,
                timeout: 10000,
                loadingId:'.box',
                redirectCallback: function (){
                    $.setLocalStore('liList',JSON.stringify([]));
                },
                success: function (result) {
                    $.createAlert(result.msg);
                },
                error: function () {
                    $.createAlert('登录超时,请重新登录');
                },
                complete: function () {
                    that.$login.html($.clientLang('登{0}录', ' '))
                }
            });
        },
        checkLoginInfo: function () {
            var aid = this.$inputAdminId.val();
            var pws = this.$inputAdminPws.val();
            if (!aid) {
                $.createAlert('请输入用户名');
            } else if (!aid.match($.userNameExp)) {
                $.createAlert('用户名含有非法字符');
            } else if(!pws){
                $.createAlert('请输入密码');
            } else if(pws.trim() === ''){
                $.createAlert('无效的密码');
            } else{
                return true;
            }
            return false;
        },
        crypto: function (pws) {
            return CryptoJS.SHA256(pws).toString();
        },
        forgetPws:function () {
            // $.createAlert('没做该功能,哈哈');
        },
        changeLanguage: function () {
            var type = this.$selectLang.val();
            $.ajax({
                url: '/back/language/' + type,
                loadingId:'.box',
                success: function (result) {
                    if (result.code === 1) {
                        window.location.reload();
                    }
                }
            });
        },
        keydownAction: function (e) {
            var keyCode = window.event ? e.keyCode : e.which;
            if (keyCode === $.KEYS_CODE.ENTER) {
                this.logining();
                e.preventDefault();
            }
        }
    };

    var login = new SuperLogin();
    login.init();

})(jQuery);