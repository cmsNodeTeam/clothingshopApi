/**
 * Created by CC on 2017/9/12.
 * Bootstrap Table 自定义重写
 */

!(function ($) {
    'use strict';
    var BootstrapTable = $.fn.bootstrapTable.Constructor;
    var sprintf = $.fn.bootstrapTable.utils.sprintf;
    // var getItemField = $.fn.bootstrapTable.utils.getItemField;
    var calculateObjectValue = $.fn.bootstrapTable.utils.calculateObjectValue;
    var _init = BootstrapTable.prototype.init;
    var _initBody = BootstrapTable.prototype.initBody;
    var _initToolbar = BootstrapTable.prototype.initToolbar;
    var _toggleColumn = BootstrapTable.prototype.toggleColumn;
    var _toggleAllColumns = BootstrapTable.prototype.toggleAllColumns;
    var _refresh = BootstrapTable.prototype.refresh;
    var _initData = BootstrapTable.prototype.initData;

    var flat = function (element, that) {
        var result = {};

        function recurse(cur, prop) {
            if (Object(cur) !== cur) {
                result[prop] = cur;
            } else if ($.isArray(cur)) {
                for (var i = 0, l = cur.length; i < l; i++) {
                    recurse(cur[i], prop ? prop + that.options.flatSeparator + i : "" + i);
                    if (l == 0) {
                        result[prop] = [];
                    }
                }
            } else {
                var isEmpty = true;
                for (var p in cur) {
                    isEmpty = false;
                    recurse(cur[p], prop ? prop + that.options.flatSeparator + p : p);
                }
                if (isEmpty) {
                    result[prop] = {};
                }
            }
        }

        recurse(element, "");
        return result;
    };

    var flatHelper = function (data, that) {
        var flatArray = [];

        $.each(!$.isArray(data) ? [data] : data, function (i, element) {
            flatArray.push(flat(element, that));
        });
        return flatArray;
    };

    $.extend($.fn.bootstrapTable.defaults,{
        customToolbar: undefined,
        selectColPrefix: 'fa',
        isShowColumns: false,
        buttonsClass:'default btn-flat',
        contextMenuContainer: '#ngView',
        striped: true,
        undefinedText: '',
        pageSize: 30,
        pageList: [30, 50, 100, 200],
        pagination: true,
        flat: undefined,
        formatSelectAll:function () {
            return $.clientLang('全选');
        },
        formateDeSelectAll:function () {
            return $.clientLang('反选');
        }
    });

    $.extend($.fn.bootstrapTable.defaults.icons,{
        selectAll:'fa-check',
        deselectAll:'fa-close'
    });

    $.extend($.fn.bootstrapTable.columnDefaults, {
        colAttributes: undefined
    });

    BootstrapTable.prototype.initToolbar = function () {
        _initToolbar.apply(this, Array.prototype.slice.apply(arguments));

        if(typeof this.options.customToolbar !== 'string')return;

        this.$customTool = $(this.options.customToolbar);

        var that = this,
            html = [],
            $keepOpen,
            switchableCount = 0;
        if(this.options.isShowColumns){
            html.push('<div class="keep-open btn-group">'+
                sprintf('<button type="button" title="%s" class="btn',this.options.formatColumns()) +
                sprintf(' btn-%s', this.options.buttonsClass) +
                sprintf(' btn-%s', this.options.iconSize) +
                ' dropdown-toggle" data-toggle="dropdown">',
                sprintf('<i class="%s %s"></i>', this.options.iconsPrefix, this.options.icons.columns),
                ' <span class="caret"></span>',
                '</button>',
                '<ul class="dropdown-menu columns" role="menu">');

            //加全选和反选
            html.push(sprintf('<li><div class="padding-lr-10">' +
                '<button type="button" class="btn btn-sm' +
                sprintf(' btn-%s', this.options.buttonsClass) +
                '" name="selectAll">' +
                sprintf('<i class="%s %s"></i>', this.options.selectColPrefix, this.options.icons.selectAll)+
                '&nbsp;'+this.options.formatSelectAll()+'</button>' +
                '<button type="button" class="btn btn-sm pull-right' +
                sprintf(' btn-%s', this.options.buttonsClass) +
                '" name="deselectAll">' +
                sprintf('<i class="%s %s"></i>', this.options.selectColPrefix, this.options.icons.deselectAll)+
                '&nbsp;'+this.options.formateDeSelectAll()+'</button>' +
                '</div></li>'));
            //分割线
            html.push('<li class="divider"></li>');

            $.each(this.columns, function (i, column) {
                if (column.radio || column.checkbox) {
                    return;
                }

                if (that.options.cardView && !column.cardVisible) {
                    return;
                }

                var checked = column.visible ? ' checked="checked"' : '';

                if (column.switchable) {
                    html.push(sprintf('<li>' +
                        '<input type="checkbox" data-field="%s" value="%s" id="bs-%s-%s" %s><label for="bs-%s-%s">%s</label>' +
                        '</li>', column.field, i, that.$el.attr('id'), i, checked, that.$el.attr('id'), i, column.title));
                    switchableCount++;
                }
            });
            html.push('</ul>',
                '</div>');
        }

        if(html.length > 0){
            this.$customTool.append(html.join(''));
        }

        if (this.options.isShowColumns) {
            $keepOpen = this.$customTool.find('.keep-open');

            if (switchableCount <= this.options.minimumCountColumns) {
                $keepOpen.find('input').prop('disabled', true);
            }

            $keepOpen.find('li').off('click').on('click', function (event) {
                event.stopImmediatePropagation();
            });
            $keepOpen.find('input').off('click').on('click', function () {
                var $this = $(this);

                that.toggleColumn($(this).val(), $this.prop('checked'), false);
                that.trigger('column-switch', $(this).data('field'), $this.prop('checked'));
            });

            $keepOpen.find('button[name="selectAll"]')
                .off('click').on('click', function () {
                that.showAllColumns();
                $keepOpen.find('input').prop('checked',true);
            });

            $keepOpen.find('button[name="deselectAll"]')
                .off('click').on('click', function () {
                that.hideAllColumns();
                $keepOpen.find('input').prop('checked',false);
            });
        }
    };

    BootstrapTable.prototype.toggleColumn = function (index, checked, needUpdate) {
        _toggleColumn.apply(this, Array.prototype.slice.apply(arguments));

        if (this.options.isShowColumns) {
            var $items = this.$customTool.find('.keep-open input').prop('disabled', false);

            if (needUpdate) {
                $items.filter(sprintf('[value="%s"]', index)).prop('checked', checked);
            }

            if ($items.filter(':checked').length <= this.options.minimumCountColumns) {
                $items.filter(':checked').prop('disabled', true);
            }
        }
    };

    BootstrapTable.prototype.toggleAllColumns = function (visible) {
        _toggleAllColumns.apply(this, Array.prototype.slice.apply(arguments));
        if (this.options.isShowColumns) {
            var $items = this.$customTool.find('.keep-open input').prop('disabled', false);

            if ($items.filter(':checked').length <= this.options.minimumCountColumns) {
                $items.filter(':checked').prop('disabled', true);
            }
        }
    };

    BootstrapTable.prototype.init = function () {
        var _resHandler = this.options.responseHandler;
        var _loadSuccess = this.options.onLoadSuccess;
        var that = this;
        this.options.responseHandler = function (response) {
            if (response.code && response.code === -1) {
                that.options.pageNumber = 1;
                $.createAlert(response.msg);
                return {total: 0, rows: []};
            }
            return _resHandler.apply(this, arguments);
        };
        this.options.onLoadSuccess = function () {
            setTimeout(function () {
                that.resetView();
            }, 300);
            return _loadSuccess.apply(that, arguments);
        };
        _init.apply(this, Array.prototype.slice.apply(arguments));
    };

    BootstrapTable.prototype.initData = function (data, type) {
        if (this.options.flat) {
            data = flatHelper(data ? data : this.options.data, this);
        }
        _initData.apply(this, [data, type]);
    };

    BootstrapTable.prototype.initBody = function () {
        _initBody.apply(this, Array.prototype.slice.apply(arguments));
        var that = this;

        for (var row = this.pageFrom - 1; row < this.pageTo; row++) {
            var item = this.getData()[row];// 行数据信息row
            $.each(this.columns, function (col, column) {//循环列
                //获取自定义列属性
                function _colAttrs(_i, _item, _column) {
                    if (_column.colAttributes && typeof _column.colAttributes === 'function') {
                        return calculateObjectValue(_column, _column.colAttributes, [_i, _item], {});
                    }
                    return {};
                }

                var colAttrs = _colAttrs(col, item, column);

                if (Object.keys(colAttrs).length !== 0) {//如果属性值为空就不加
                    var $tr = that.$body.find('>tr');
                    col = $.inArray(column.field, that.getVisibleFields());//排除隐藏列
                    var $td = $tr.eq(row).find('>td').eq(col);
                    for (var key in colAttrs) {
                        $td.attr(key, colAttrs[key]);
                    }
                }
            });
        }

    };

    BootstrapTable.prototype.refresh = function () {
        this.initHeader();
        _refresh.apply(this, Array.prototype.slice.apply(arguments));
    };

    $.fn.bootstrapTable.methods.push('getCurrentPage', 'getCurrentPage');
    // $.fn.bootstrapTable.methods.push('getColumnsField', 'getColumnsField');

    BootstrapTable.prototype.getCurrentPage = function(){
        return this.options.pageNumber;
    };

    // BootstrapTable.prototype.getColumnsField = function () {
    //     var fieldArr = [];
    //     $.each(this.columns, function (i, column){
    //         if(column.field){
    //             fieldArr.push(column.field);
    //         }
    //     });
    //     return fieldArr;
    // };

})(jQuery);