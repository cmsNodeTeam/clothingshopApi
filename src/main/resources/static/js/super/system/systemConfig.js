'use strict';
define([], function () {
    var $ = jQuery;
    function SysytemConfig() {
        this.$search = $('#searchConfig');
        this.$input = $('#searchInput');
        this.$newConfig = $('#newConfig');
        this.$deleteConfig = $('#deleteConfig');
        this.$returnConfig = $('#returnConfig');
        this.$table = $('#systemConfigTable');
        this.$configName = $('#configName');

        this.tempCondition = {
            groupName: $.getLocalStore('configName') || ''
        };

        this.selectedId = '';
        this.pageNumber = 1;
    }

    SysytemConfig.prototype.init = function () {
        this.initEvents();
        this.initComp();
    };

    SysytemConfig.prototype.initEvents = function () {
        this.$search.on('click', $.proxy(this.refreshData, this));
        this.$input.bind('keydown', 'return', $.proxy(this.refreshData, this));
        this.$newConfig.on('click', $.proxy(this.newConfigAction, this));
        this.$deleteConfig.on('click', $.proxy(this.deleteConfigAction, this));
        this.$returnConfig.on('click', $.proxy(this.returnGroup, this, ''));
    };

    SysytemConfig.prototype.initComp = function () {
        this.$table.bootstrapTable(this.getTableOption(this.tempCondition.groupName));
        if(this.tempCondition.groupName){
            this.$configName.html(this.tempCondition.groupName);
            this.$returnConfig.removeClass('hidden');
        }
    };

    SysytemConfig.prototype.getTableOption = function (groupName, pageNumber) {
        var that = this;
        var option = {
            url: '/super/system/findGroup',
            method: 'post',
            ajaxOptions: {
                loadingId: '.box-body'
            },
            sidePagination: 'server',
            // height: 500,
            clickToSelect: true,
            columns: [
                {
                    radio: true,
                    class: 'hidden'
                }, {
                    field: '_id',
                    visible: false
                }, {
                    title: $.clientLang('Key'),
                    field: 'key',
                    width: '200',
                    class: 'mw-200 mw-over'
                }, {
                    title: $.clientLang('组名'),
                    field: 'groupName',
                    width: '200',
                    class: 'mw-200 mw-over',
                    visible: !$.isEmpty(groupName) ? true : false
                }, {
                    title: $.clientLang('值'),
                    field: 'value',
                    width: '200',
                    class: 'mw-200 mw-over'
                }, {
                    title: $.clientLang('描述'),
                    field: 'desc'
                }, {
                    title: $.clientLang('操作'),
                    width: '100',
                    events: {
                        'click .modifyConfig': $.proxy(this.modifyConfigAction, that),
                        'click .deleteConfig': $.proxy(this.deleteConfigAction, that),
                        'click .searchGroup': $.proxy(this.searchGroup, that)
                    },
                    formatter: that.formatterFn
                }
            ],
            queryParams: $.proxy(this.queryParams, that),
            contextMenu: '#context-menu',
            onContextMenuItem: function (row, $el) {
                var item = $el.data('item');
                if (item === "modifyConfig") {
                    that.modifyConfigAction(null,null,row);
                } else if (item === "deleteConfig") {
                    that.deleteConfigAction(null,null,row);
                } else if (item === 'newConfig') {
                    that.newConfigAction();
                }
            },
            onLoadSuccess: function () {
                if(that.selectedId){
                    that.$table.bootstrapTable('checkBy',{
                        field: '_id',
                        values: [that.selectedId]
                    });
                }
            },
            onCheck: function (row) {
                that.selectedId = row._id;
            }
        };
        if(typeof pageNumber === 'number'){
            option.pageNumber = pageNumber;
        }
        return option;
    };

    SysytemConfig.prototype.searchGroup = function (e, value, row) {
        if(row.groupName){
            this.returnGroup();
        }else {
            this.pageNumber = this.$table.bootstrapTable('getCurrentPage');
            this.returnGroup(row.key);
        }
    };

    SysytemConfig.prototype.returnGroup = function (groupName) {
        groupName = groupName || '';
        $.setLocalStore('configName', groupName);
        this.tempCondition.groupName = groupName;
        this.$configName.html(groupName);
        if(groupName){
            this.$table.bootstrapTable('refreshOptions', this.getTableOption(groupName, 1));
            this.$returnConfig.removeClass('hidden');
        }else {
            this.$returnConfig.addClass('hidden');
            this.$table.bootstrapTable('refreshOptions', this.getTableOption(groupName, this.pageNumber));
        }

    };

    SysytemConfig.prototype.modifyConfigAction = function (e, value, row) {
        var that = this;
        $.ajax({
            url: '/super/system/findGroupById',
            data: {
                id: row._id
            },
            loadingId: 'body',
            success:function (result) {
                if(result.code !== 1){
                    return $.createAlert(result.msg);
                }
                that.getModifyConfig().showModal(result);
            }
        });
    };

    SysytemConfig.prototype.formatterFn = function (value, row) {
        var arr = ['<div class="btn-group btn-group-xs min-w-100">'];
        arr.push($.replaceArgs('<button class="btn btn-danger btn-flat deleteConfig" title="{0}">' +
            '<span class="glyphicon glyphicon-trash"></span></button> '
            , $.clientLang('删除')));
        var groupName = row.groupName;
        arr.push($.replaceArgs('<button class="btn btn-default btn-flat searchGroup" title="{0}">' +
            '<span class="fa {1}"></span></button> '
            , groupName ? $.clientLang('返回') : $.clientLang('更多')
            , groupName ? 'fa-reply' : 'fa-share'));
        arr.push($.replaceArgs('<button class="btn btn-default btn-flat modifyConfig" title="{0}">' +
            '<span class="glyphicon glyphicon-edit"></span></button> '
            , $.clientLang('编辑')));
        arr.push('</div>');
        return arr.join('');
    };

    SysytemConfig.prototype.refreshData = function () {
        if (!$.compareObjects(this.tempCondition, this.getSearchCond())) {
            this.tempCondition = this.getSearchCond();
            this.$table.bootstrapTable('selectPage', 1);//这个也会刷新数据
            return;
        }
        this.refreshTable();
    };

    SysytemConfig.prototype.getSearchCond = function () {
        return {
            input: this.$input.val(),
            groupName: this.tempCondition.groupName
        };
    };

    SysytemConfig.prototype.refreshTable = function (type) {
        if(type === 'remove'){
            var currentPage = this.$table.bootstrapTable('getCurrentPage');
            if(currentPage !== 1 && this.$table.bootstrapTable('getData').length === 1){
                this.$table.bootstrapTable('prevPage');
                return;
            }
        }
        this.$table.bootstrapTable('refresh');
    };

    SysytemConfig.prototype.queryParams = function (params) {
        return $.extend($.getParams(params), this.tempCondition);
    };

    SysytemConfig.prototype.newConfigAction = function () {
        this.getModifyConfig().showModal({
            groupName: this.tempCondition.groupName
        });
    };

    SysytemConfig.prototype.deleteConfigAction = function (e, value, row) {
        var title = row.groupName ? $.clientLang('确定删除 {0} 下的 {1} 配置?', row.groupName, row.key)
            : $.clientLang('确定删除 {0} 配置?注意会自动删除{0}下的二类配置.', row.key);
        var that = this;
        $.createConfirm(title, function () {
            that.deleteConfigById(row._id);
        });
    };

    SysytemConfig.prototype.deleteConfigById = function (id) {
        var that = this;
        $.ajax({
            url: '/super/system/deleteGroupById',
            data: {
                id:id
            },
            loadingId: '.box-body',
            success: function (result) {
                if(result.code !== 1){
                    return $.createAlert(result.msg);
                }
                $.createAlert('删除成功', function () {
                    that.refreshTable('remove');
                });
            }
        });
    };

    SysytemConfig.prototype.getModifyConfig = function () {
        if (!(this.modifyConfig instanceof ModifyConfig)) {
            this.modifyConfig = new ModifyConfig({
                yesFn: $.proxy(this.refreshData, this),
                noFn: $.proxy(this.refreshData, this)
            });
        }
        return this.modifyConfig;
    };

    function ModifyConfig(params) {
        this.$modal = $('#configModal');
        this.$title = $('#configTitle');
        this.$inputKey = $('#inputKey');
        this.$inputValue = $('#inputValue');
        this.$inputDesc = $('#inputDesc');
        this.$configParse = $('#configParse');
        this.$configOk = $('#configOk');
        this.$configClose = $('#configClose');
        this._init();
        this._fn = {
            yesFn: params.yesFn || $.noop,
            noFn: params.noFn || $.noop
        };
    }

    ModifyConfig.prototype._init = function () {
        this.$configOk.off('click').on('click', $.proxy(this.okAction, this));
        this.$configClose.off('click').on('click', $.proxy(this.closeAction, this));
        this.$configParse.off('click').on('click', $.proxy(this.parseValue, this));
    };

    ModifyConfig.prototype.showModal = function (row) {
        this.groupName = row.groupName || '';
        if(row.groupName){
            //二级组
            if(row._id){
                this.$title.html($.clientLang('编辑 {0} 下 {1}二类组', row.groupName, row.key));
            }else {
                this.$title.html($.clientLang('新建 {0} 二类组', row.groupName));
            }
        }else{
            //一级组
            if(row._id){
                this.$title.html($.clientLang('编辑 {0} 一类组', row.key));
            }else {
                this.$title.html($.clientLang('新建一类组'));
            }
        }
        this.$inputKey.val(row.key || '');
        this.$inputValue.val(row.value || '');
        this.$inputDesc.val(row.desc || '');
        this._id = row._id || '';
        this.$modal.modal({
            backdrop: false,
            keyboard: false
        });
    };

    ModifyConfig.prototype.okAction = function () {
        if(!this.checkInfo())return;
        var data = this.getConfigData();
        var that = this;
        var url;
        if(data.groupName){
            if(data.id){
                url = '/super/system/modifyTwoGroup';
            }else {
                url = '/super/system/addTwoGroup';
            }
        }
        else{
            if(data.id){
                url = '/super/system/modifyOneGroup';
            }else {
                url = '/super/system/addOneGroup';
            }
        }
        $.ajax({
            url: url,
            data:data,
            success:function (result) {
                if(result.code !== 1){
                    return $.createAlert(result.msg);
                }
                $.createAlert(that._id ? '修改成功' : '创建成功', function () {
                    that.$modal.modal('hide');
                    if (typeof that._fn.yesFn === 'function') {
                        that._fn.yesFn();
                    }
                });
            }
        });
    };

    ModifyConfig.prototype.checkInfo = function () {
        var key = this.$inputKey.val();
        var value = this.$inputValue.val();
        if(!key){
            $.createAlert('Key不能为空');
            return false;
        }
        if(!value){
            $.createAlert('值不能为空');
            return false;
        }
        return true;
    };

    ModifyConfig.prototype.getConfigData = function () {
        return {
            key:this.$inputKey.val(),
            value:this.$inputValue.val(),
            groupName:this.groupName || null,
            desc:this.$inputDesc.val(),
            id:this._id
        };
    };

    ModifyConfig.prototype.closeAction = function () {
        this.$modal.modal('hide');
        if (typeof this._fn.noFn === 'function') {
            this._fn.noFn();
        }
    };

    ModifyConfig.prototype.parseValue = function () {
        var value = $.formatJSON(this.$inputValue.val());
        this.$inputValue.val(value);
    };

    var config = new SysytemConfig();
    config.init();

});