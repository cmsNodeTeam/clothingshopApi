/**
 * Created by CC on 2017/7/11.
 */
'use strict';

define([], function () {
    var $ = jQuery;
    function RightsGroup() {
        this.$table = $('#rightsTable');
        this.$rightsName = $('#rightsName');
        this.$searchRights = $('#searchRights');
        this.$newRights = $('#newRights');
        this.$deleteRights = $('#deleteRights');
        this.$rightsModal = $('#rightsModal');
        this.$saveRights = $('#saveRights');
        this.$rightsModalLabel = $('#rightsModalLabel');
        this.$inputGroup = $('#inputGroup');
        this.$inputCode = $('#inputCode');
        this.$inputDesc = $('#inputDesc');
        this.$codeTable = $('#codeTable');
        this.$id = $('#_id');
        this.isInit = true;
        this.tempSearchName = '';//保存用户输入的查询条件

    }

    RightsGroup.prototype.init = function () {
        this.$table.bootstrapTable(this.getTableOption());
        this.registerEvents();
    };

    RightsGroup.prototype.getTableOption = function () {
        var that = this;
        return {
            url:'/super/rights/getRightsList',
            method: 'post',
            ajaxOptions:{
                loadingId:'.box-body'
            },
            // sidePagination: 'server',
            // height: 500,
            columns: [
                {
                    checkbox: true
                },
                {
                    field: "_id",
                    visible: false
                }, {
                    title: $.clientLang('权限组名'),
                    field: 'groupName',
                    width: '150',
                    class: 'mw-150 mw-over',
                    colAttributes: function (index,row) {
                        return {title:row.groupName};
                    },
                    events: {
                        'click .modifyRights':$.proxy(this.modifyRights,that)
                    },
                    formatter:function (value) {
                        return $.replaceArgs(
                            '<a href="javascript:void(0);" class="modifyRights">{0}</a>',value);
                    },
                    sortable: true
                }, {
                    title: $.clientLang('权限组描述'),
                    width: '300',
                    class: 'mw-300 mw-over',
                    colAttributes: function (index,row) {
                        return {title:row.desc};
                    },
                    field: 'desc'
                }, {
                    title: $.clientLang('权限代码'),
                    class: 'mw-450 mw-over',
                    width: '450',
                    colAttributes: function (index,row) {
                        return {title:row.rightsCode};
                    },
                    field: 'rightsCode'
                }, {
                    title: $.clientLang('操作'),
                    width: 100,
                    events: {
                        'click .modifyRights':$.proxy(this.modifyRights,that),
                        'click .deleteRights':$.proxy(this.deleteRights,that)
                    },
                    formatter: that.formatterFn
                }
            ],
            queryParams: $.proxy(this.queryParams,that),
            contextMenu: '#context-menu',
            onContextMenuItem: function(row, $el){
                var item = $el.data('item');
                if(item === "modifyRights"){
                    that.modifyRights(null,null,row);
                } else if(item === "deleteRights"){
                    that.deleteRights(null,null,row);
                } else if(item === 'newRights'){
                    that.newRightsGroup();
                }
            }
        };
    };

    RightsGroup.prototype.modifyRights = function (e, value, row) {
        this.$rightsModalLabel.html($.clientLang('编辑权限组'));
        this.$saveRights.html($.clientLang('更新'));
        this.findRightsById(row._id);
    };

    RightsGroup.prototype.deleteRights = function (e, value, row) {
        var that = this;
        $.createConfirm($.clientLang('确定删除 {0} 权限组?',row.groupName),function () {
            that.deleteRightsById(row._id);
        });
    };

    RightsGroup.prototype.formatterFn = function () {
        var arr = ['<div class="btn-group btn-group-xs pull-right min-w-100">'];
        arr.push($.replaceArgs('<button class="btn btn-danger btn-flat deleteRights" title="{0}">' +
            '<span class="glyphicon glyphicon-trash"></span></button> '
            , $.clientLang('删除')));
        arr.push($.replaceArgs('<button class="btn btn-default btn-flat modifyRights" title="{0}">' +
            '<span class="glyphicon glyphicon-edit"></span></button> '
            , $.clientLang('编辑')));
        arr.push('</div>');
        return arr.join('');
    };

    RightsGroup.prototype.queryParams = function (params) {
        if (!this.isInit) {
            return false;
        }
        var groupName = this.$rightsName.val();
        var data = $.getParams(params);
        if (groupName) {
            data.groupName = groupName.trim();
        }
        return data;
    };

    RightsGroup.prototype.registerEvents = function () {
        var that = this;

        this.$searchRights.on('click', function () {
            that.searchName();
        });

        this.$newRights.on('click', function () {
            that.newRightsGroup();
        });

        this.$table.on('check.bs.table uncheck.bs.table '+
            'check-all.bs.table uncheck-all.bs.table',function () {
            that.$deleteRights.prop('disabled',!that.$table.bootstrapTable('getSelections').length);
        });

        this.$rightsName.on('keydown',function (e) {
            var keyCode = window.event ? e.keyCode : e.which;
            if (keyCode === $.KEYS_CODE.ENTER) {
                that.searchName();
                e.preventDefault();
            }
        });

        this.$codeTable.on('check.bs.table uncheck.bs.table '+
            'check-all.bs.table uncheck-all.bs.table',function () {
            that.$inputCode.val(that.getCodeList());
        });

        this.$saveRights.on('click',$.proxy(this.saveRightsGroup,this));

        this.$deleteRights.on('click',function () {
            $.createConfirm('确定删除选中的权限组?',function () {
                that.deleteMultipleGroup();
            });
        });
    };

    RightsGroup.prototype.getGroupIds=function() {
        return $.map(this.$table.bootstrapTable('getSelections'),function (row) {
            return row._id;
        });
    };

    RightsGroup.prototype.getCodeList=function() {
        return $.map(this.$codeTable.bootstrapTable('getSelections'),function (row) {
            return row.code;
        });
    };

    RightsGroup.prototype.getCodeTableOption = function () {
        return {
            // height:400,
            clickToSelect:true,
            columns: [
                {
                    checkbox: true
                }, {
                    title: $.clientLang('权限代码'),
                    field: 'code',
                    width: '150',
                    sortable: true
                }, {
                    title: $.clientLang('描述'),
                    field: 'desc',
                    width: '250'
                }
            ]
        };
    };

    RightsGroup.prototype.searchName = function () {
        if(this.$rightsName.val() !== this.tempSearchName){
            //所以跳转页码就不调刷新表格的方法了
            this.tempSearchName = this.$rightsName.val();
            if(this.isInit){
                this.$table.bootstrapTable('selectPage',1);//这个也会刷新数据
                return ;
            }
        }
        this.refreshTable();
    };

    RightsGroup.prototype.refreshTable = function (type) {
        this.isInit = true;
        this.$deleteRights.prop('disabled',true);
        //如果这个参数是remove,说明是删除时要刷新的表格,不然就是默认刷新
        if(type === 'remove'){
            //这里因为单删除时获取的len是0,所以默认给1
            var currentPage = this.$table.bootstrapTable('getCurrentPage');
            var len = this.getGroupIds().length == 0 ? 1 : this.getGroupIds().length;
            if(currentPage !== 1 && len === this.$table.bootstrapTable('getData').length){
                this.$table.bootstrapTable('prevPage');
                return;
            }
        }
        this.$table.bootstrapTable('refresh');

    };

    RightsGroup.prototype.newRightsGroup = function () {
        this.$rightsModalLabel.html($.clientLang('创建权限组'));
        this.$saveRights.html($.clientLang('创建'));
        this.initRightsData({});
    };

    RightsGroup.prototype.initRightsData = function (data) {
        this.$inputGroup.val(data.groupName || '');
        this.$inputCode.val(data.rightsCode || '');
        this.$inputCode.attr('title', data.rightsCode);
        this.$inputDesc.val(data.desc || '');
        this.$id.val(data._id || '');
        this.$rightsModal.modal({
            backdrop: false,
            keyboard: false
        });
        //初始化这个表格要再显示modal之后
        this.$codeTable.bootstrapTable(this.getCodeTableOption());
        this.$codeTable.bootstrapTable('uncheckAll');
        this.$codeTable.bootstrapTable('checkBy',{
            field:'code',
            values:data.rightsCode ? data.rightsCode.split(',') : []
        });
        this.$codeTable.bootstrapTable('scrollTo',0);
        this.$inputGroup.focus();
    };

    RightsGroup.prototype.findRightsById = function (id) {
        var that = this;
        $.ajax({
            url:'/super/rights/findRights/'+id,
            loadingId:'.box-body',
            success:function (result) {
                if(result.code === 0){
                    $.createAlert(result.msg);
                    that.refreshTable();
                    return;
                }
                that.initRightsData(result.data);
            }
        });
    };

    RightsGroup.prototype.deleteRightsById = function (id) {
        var that = this;
        $.ajax({
            url:'/super/rights/removeRights/'+id,
            loadingId:'.box-body',
            success:function (result) {
                $.createAlert(result.msg,function(){
                    that.refreshTable('remove');
                });
            }
        });
    };

    RightsGroup.prototype.saveRightsGroup = function () {
        var id = this.$id.val();
        var info = this.checkInfo();
        if(info === false)return;
        if($.isEmpty(id)){
            this.merge('/super/rights/createRights',info);
        }else {
            info.id = id;
            this.merge('/super/rights/modifyRights',info);
        }
    };

    RightsGroup.prototype.checkInfo = function () {
        var name = this.$inputGroup.val();
        var code = this.$inputCode.val();
        var desc = this.$inputDesc.val();

        if(!name){
            $.createAlert('请输入权限组名');
        }else if(!name.match(/^[\w\u4e00-\u9fa5\@]+$/)){
            $.createAlert('组名含有特殊字符');
        }else if(!code){
            $.createAlert('请输入权限代码');
        }else {
            return {
                groupName:name,
                desc:desc,
                rightsCode:code
            };
        }
        return false;
    };

    RightsGroup.prototype.merge = function (url,info) {
        var that = this;
        $.ajax({
            url:url,
            data:info,
            loadingId: '.right-content',
            success:function (result) {
                if(result.code === 0){
                    $.createAlert(result.msg);
                }else {
                    $.createAlert(result.msg, function () {
                        that.$rightsModal.modal('hide');
                        that.refreshTable();
                    });
                }
            }
        });
    };

    RightsGroup.prototype.deleteMultipleGroup = function () {
        var ids = this.getGroupIds();
        var that = this;
        $.ajax({
            url:'/super/rights/removeRightsList',
            data:{ids:ids},
            success:function (result) {
                if(result.code === 0){
                    $.createAlert(result.msg);
                }else {
                    $.createAlert(result.msg, function () {
                        that.refreshTable('remove');
                    });
                }
            }
        });
    };

    var rights = new RightsGroup();
    rights.init();
});