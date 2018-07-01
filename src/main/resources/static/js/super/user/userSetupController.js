/**
 * Created by CC on 2017/6/25.
 */
'use strict';

define(['bsTablePlugin','tableExport','png','jspdfTable','jspdf'], function () {
    var $ = jQuery;
    function User() {
        this.$radioGroup = $('input[type="radio"][name="opt"]');
        this.$tabList = $('#tabList');
        this.$userTable = $('#userTable');
        this.$esSearchInput = $('#esSearchInput');
        this.$searchUserBtn = $('#searchUser');
        this.$newUserBtn = $('#newUser');
        this.userType = 'ALL';
        this.tempSearch = {};//保存用户输入的查询内容
    }

    User.prototype.init = function () {
        this.initComp();
        this.registerEvents();
    };

    User.prototype.initComp = function () {
        // this.$radioGroup.iCheck($.iCheckTheme);
        this.tempSearch = this.getSearchCond();
        this.$userTable.bootstrapTable(this.getUserTableOption());
    };

    User.prototype.registerEvents = function () {
        var that = this;
        this.$tabList.find('a').on('click', function (e) {
            that.changeTab(that, this);
            e.preventDefault();
        });

        this.$searchUserBtn.on('click', $.proxy(this.searchUser, this));
        this.$radioGroup.on('change', $.proxy(this.searchUser, this));
        this.$newUserBtn.on('click', this.newUser);
        this.$esSearchInput.bind('keydown', 'return', $.proxy(this.searchUser, this));
    };

    User.prototype.changeTab = function (UserThis, TabThis) {
        this.userType = $(TabThis).attr('href').replace('#', '');
        UserThis.searchUser();
    };

    User.prototype.getSearchCond = function () {
        return {
            input: this.$esSearchInput.val(),
            type: this.userType,
            status: this.$radioGroup.filter(':checked').val()
        };
    };

    User.prototype.searchUser = function () {
        if (!$.compareObjects(this.tempSearch, this.getSearchCond())) {
            this.tempSearch = this.getSearchCond();
            this.$userTable.bootstrapTable('selectPage', 1);//这个也会刷新数据
            return;
        }
        this.refreshTable();
    };

    User.prototype.refreshTable = function (type) {
        if (type === 'remove') {
            var currentPage = this.$userTable.bootstrapTable('getCurrentPage');
            if (currentPage !== 1 && 1 === this.$table.bootstrapTable('getData').length) {
                this.$userTable.bootstrapTable('prevPage');
                return;
            }
        }
        this.$userTable.bootstrapTable('refresh');
    };

    User.prototype.getUserTableOption = function () {
        var that = this;
        return {
            url: '/super/user/getUsersList',
            method: 'post',
            ajaxOptions: {
                loadingId: '.box'
            },
            sidePagination: 'server',
            // height: 500,
            customToolbar:'#toolbar',
            isShowColumns:true,
            clickToSelect: true,
            showExport:true,
            // exportTypes: ['png','pdf','json','txt'],
            columns: [
                {
                    radio: true,
                    class: 'hidden'
                }, {
                    field: "_id",
                    visible: false,
                    ignoreView:true
                }, {
                    title: $.clientLang('商店ID'),
                    field: 'shopId',
                    width: '150',
                    class: 'mw-150 mw-over',
                    colAttributes: function (index, row) {
                        return {title: row.shopId};
                    },
                    sortable: true
                }, {
                    title: $.clientLang('用户ID'),
                    field: 'adminId',
                    // events: {
                    //     'click .modifyUser': $.proxy(this.modifyUser, that)
                    // },
                    formatter: function (value, row) {
                        return $.replaceArgs(
                            '<a href="modifyUser/{0}">{1}</a>', row._id, value);
                    },
                    sortable: true,
                    width: '150',
                    class: 'mw-150 mw-over',
                    colAttributes: function (index, row) {
                        return {title: row.adminId};
                    }
                }, {
                    title: $.clientLang('用户名'),
                    field: 'adminName',
                    width: '150',
                    class: 'mw-150 mw-over',
                    sortable: true,
                    colAttributes: function (index, row) {
                        return {title: row.adminName};
                    }
                }, {
                    title: $.clientLang('用户类型'),
                    field: 'adminType',
                    sortable: true,
                    formatter: function (value) {
                        switch (value) {
                            case 'SYSTEM':
                                return $.clientLang('系统用户');
                            case 'NORMAL':
                                return $.clientLang('普通用户');
                            case '3RD':
                                return $.clientLang('接口用户');
                        }
                    }
                }, {
                    title: $.clientLang('邮箱地址'),
                    width: '200',
                    class: 'mw-200 mw-over',
                    field: 'email',
                    colAttributes: function (index, row) {
                        return {title: row.email};
                    }
                }, {
                    title: $.clientLang('用户状态'),
                    field: 'adminStatus',
                    sortable: true,
                    formatter: function (value) {
                        switch (value) {
                            case true:
                                return $.clientLang('激活');
                            case false:
                                return $.clientLang('未激活');
                        }
                    }
                }, {
                    title: $.clientLang('操作'),
                    width: 100,
                    events: {
                        'click .modifyUser': this.modifyUser,
                        'click .deleteUser': $.proxy(this.deleteUser, that),
                        'click .changeStatus': $.proxy(this.changeStatus, that)
                    },
                    formatter: that.formatterFn
                }
            ],
            queryParams: $.proxy(this.queryParams, that),
            contextMenu: '#context-menu',
            onContextMenuItem: function (row, $el) {
                var item = $el.data('item');
                var $a = $el.find('>a');
                if (item === "modifyUser") {
                    $a.attr('href','modifyUser/'+row._id);
                } else if (item === "deleteUser") {
                    that.deleteUser(null, null, row);
                } else if (item === 'newUser') {
                    $a.attr('href','createUser');
                }
            }
            // onClickRow:function (row, $el, field) {
            //     var index = $el.data('index');
            //     if(index <= 1){
            //         console.log(row[field]);
            //     }
            // },
            // onDblClickRow: function (row, $el, field) {
            //     var index = $el.data('index');
            //     if(index > 1){
            //         console.log(row[field]);
            //     }
            // }
        };
    };

    User.prototype.modifyUser = function (e, value, row) {
        var $this = $(this);
        $this.attr('href','modifyUser/'+row._id);
        return true;
    };

    User.prototype.deleteUser = function (e, value, row) {
        if($.staticParams['DR_User'] !== '1')return;
        var that = this;
        $.createConfirm($.clientLang('确定删除 {0} 用户?', row.adminId), function () {
            console.log(that);
        });
    };

    User.prototype.newUser = function () {
        var $this = $(this);
        $this.attr('href','createUser');
        return true;
    };

    User.prototype.changeStatus = function (e, value, row){
        var that = this;
        $.createConfirm($.clientLang('确定修改 {0} 的状态?', row.adminId), function () {
            $.ajax({
                url: '/super/user/changeStatus',
                data: {status: !row.adminStatus, id: row._id},
                success: function (result) {
                    if(result.code !== 1){
                        return $.createAlert(result.msg);
                    }
                    that.refreshTable();
                }
            });
        });
    };

    User.prototype.queryParams = function (params) {
        return $.extend($.getParams(params), this.tempSearch);
    };

    User.prototype.formatterFn = function () {
        var arr = ['<div class="btn-group btn-group-xs pull-right min-w-100">'];
        if($.staticParams['DR_User'] === '1'){
            arr.push($.replaceArgs('<button class="btn btn-danger btn-flat deleteUser" title="{0}">' +
                '<span class="glyphicon glyphicon-trash"></span></button> '
                , $.clientLang('删除')));
        }
        arr.push($.replaceArgs('<a href="javascript:void(0)" class="btn btn-default btn-flat changeStatus" title="{0}">' +
            '<span class="fa fa-exchange"></span></a> '
            , $.clientLang('改变状态')));
        arr.push($.replaceArgs('<a href="javascript:void(0)" class="btn btn-default btn-flat modifyUser" title="{0}">' +
            '<span class="glyphicon glyphicon-edit"></span></a> '
            , $.clientLang('编辑')));
        arr.push('</div>');
        return arr.join('');
    };

    var user = new User();
    user.init();
});

