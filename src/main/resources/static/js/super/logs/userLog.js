/**
 * Created by CC on 2017/12/30.
 */
'use strict';

define([], function () {
    var $ = jQuery;

    function UserLog() {
        this.$searchLog = $('#searchLog');
        this.$table = $('#userLogTable');
        this.$input = $('#searchInput');
        this.$inputShopId = $('#inputShopId');
        this.$inputAdminId = $('#inputAdminId');
        this.$inputType = $('#inputType');
        this.$inputDate = $('#inputDate');
        this.$inputDateSpan = $('#inputDateSpan');
        this.tempCond = {};
    }

    UserLog.prototype.init = function () {
        this.registerEvents();
        this.$inputDate.inputmask('yyyy-mm-dd', $.checkDateJson);
        this.$inputDateSpan.datetimepicker($.getTimeOption);
        this.$table.bootstrapTable(this.getTableOption());
    };

    UserLog.prototype.getTableOption = function () {
        var that = this;
        return {
            url: '/super/logs/userLogsList',
            method: 'post',
            ajaxOptions: {
                loadingId: '.box-body'
            },
            sidePagination: 'server',
            // height: 500,
            columns: [
                {
                    field: "_id",
                    visible: false
                }, {
                    title: $.clientLang('店铺ID'),
                    field: 'shopId'
                }, {
                    title: $.clientLang('用户ID'),
                    field: 'userName'
                }, {
                    title: $.clientLang('日志类型'),
                    field: 'type'
                }, {
                    title: $.clientLang('时间'),
                    field: 'date',
                    width: '200',
                    class: 'mw-200 mw-over',
                    formatter: function (value) {
                        return new Date(value).format('YYYY-MM-DD HH:mm:ss:SSS');
                    }
                }, {
                    title: $.clientLang('远程IP'),
                    field: 'requestIP'
                }, {
                    title: $.clientLang('内容'),
                    field: 'content',
                    width: '400',
                    class: 'mw-400 mw-over'
                }, {
                    title: $.clientLang('操作'),
                    width: 100,
                    events: {
                        'click .viewLog':$.proxy(this.viewLog, that)
                    },
                    formatter: that.formatterFn
                }
            ],
            queryParams: $.proxy(this.queryParams, that)
        };
    };

    UserLog.prototype.registerEvents = function () {
        this.$searchLog.on('click', $.proxy(this.refreshLogs, this));
        this.$input.bind('keydown', 'return', $.proxy(this.refreshLogs, this));
        this.$inputType.on('change', $.proxy(this.refreshLogs, this));
        this.$inputDateSpan.on('click', $.proxy(this.showDate, this));
    };

    UserLog.prototype.refreshLogs = function () {
        if (!$.compareObjects(this.tempCond, this.getCurrentCond())) {
            this.tempCond = this.getCurrentCond();
            this.$table.bootstrapTable('selectPage', 1);
            return;
        }
        this.$table.bootstrapTable('refresh');
    };

    UserLog.prototype.queryParams = function (params) {
        return $.extend(this.tempCond, $.getParams(params));
    };

    UserLog.prototype.getCurrentCond = function () {
        var content = this.$input.val();
        var shopId = this.$inputShopId.val();
        var adminId = this.$inputAdminId.val();
        var type = this.$inputType.val();
        var date = this.$inputDate.val();
        var cond = {};
        if (content) {
            cond.input = content;
        }
        if (shopId) {
            cond.shopId = shopId;
        }
        if (adminId) {
            cond.adminId = adminId;
        }
        if (type) {
            cond.type = type;
        }
        if (date) {
            cond.date = date;
        }
        return cond;
    };

    UserLog.prototype.viewLog = function (e, value, row) {
        $.createAlert(row.content, $.noop, {title: $.clientLang('日志详情')});
    };

    UserLog.prototype.formatterFn = function () {
        var arr = ['<div class="btn-group btn-group-xs pull-right min-w-100">'];
        arr.push($.replaceArgs('<button class="btn btn-default btn-flat viewLog" title="{0}">' +
            '<span class="fa fa-eye"></span></button> '
            , $.clientLang('查看')));
        arr.push('</div>');
        return arr.join('');
    };

    UserLog.prototype.showDate = function () {
        var date = this.$inputDate.val();
        this.$inputDateSpan.datetimepicker('setInitialDate', date || new Date())
            .datetimepicker('update');
    };

    var logs = new UserLog();
    logs.init();
});