/**
 * Created by CC on 2017/9/23.
 */
define(['../../../select2/select2.full.min'
    ,'../../../select2/select2-locale-all'],function (S,L) {
    'use strict';
    var e = jQuery.fn.select2.amd;
    e.define('select2/i18n/all',[],L);
    var $ = jQuery;

    function Select2() {
        this.select2 = $('.select2');
        this.$st1 = $('#select1');
        this.$st2 = $('#select2');
        this.$st3 = $('#select3');
        this.$st4 = $('#select4');
        this.$st5 = $('#select5');
        this.$st6 = $('#select6');
        this.$st7 = $('#select7');
        this.$st8 = $('#select8');
        this.$st9 = $('#select9');
        this.$st10 = $('#select10');
        this.$st11 = $('#select11');
    }

    Select2.prototype.init = function () {
        this.initSt(this.$st1);
        this.initSt(this.$st2);this.$st2.val('item5');
        this.initSelect2();
        this.onChange();
    };

    Select2.prototype.onChange = function () {
        // var that = this;
        // this.select2.off('change').on('change',function () {
        //     var $this = $(this);
        //     that.$result.html($.clientLang('你选择的是{0}',$this.val()));
        // });

        //由于这里使用了select2的插件,如果写change方法会把插件的change方法覆盖
        //后面看看如何把之前的change函数继承
    };

    Select2.prototype.getData = function (num) {
        var arr = [];
        num = num || 10;
        for(var i = 0;i < num; i++){
            arr.push('item'+i);
        }
        return arr;
    };

    Select2.prototype.initSt = function ($st,num) {
        var option = [];
        $.each(this.getData(num),function (i,value) {
            option.push($.replaceArgs('<option value="{0}">{0}</option>',value));
        });
        $st.html(option.join(''));
    };

    Select2.prototype.initSelect2 = function () {
        this.$st3.select2({
            data:this.getData(),
            width:'100%'
        });

        this.$st4.select2({
            data:this.getData(),
            width:'100%',
            multiple:true
        });

        this.$st5.select2({
            data:this.getData(),
            width:'100%',
            multiple:true,
            maximumSelectionLength:3
        });

        this.$st6.select2({
            data:this.getData(),
            width:'100%',
            tags:true
        });

        this.$st7.select2({
            data:this.getData(),
            width:'100%',
            tags:true,
            placeholder:$.clientLang('请选择'),//allowClear要和placeholder配合一起用
            allowClear:true
            // selectOnClose: false//这个参数是关闭下拉时自动选择一个默认值 是就选择,不是就不选择
            // closeOnSelect: false//选择下拉时是否自动关闭下拉列表
        });

        this.$st8.select2({
            data:this.getTheme1(),
            width:'100%',
            language:{
                noResults:function () {
                    return '';
                }
            }
        });

        this.$st9.select2({
            data:this.getTheme2(),
            width:'100%'
            // minimumResultsForSearch: 'Infinity'//不显示搜索框
        });

        this.github();//this.$st10

        this.autoComplete();//this.$st11,自动补齐

        //Select2赋值时调用trigger('change.select2');
    };

    Select2.prototype.getTheme1 = function () {
        return [
            {
                "id": 1,//这个是value
                "text": "Option 1"//显示的文本
            },
            {
                "id": 2,
                "text": "Option 2",
                "selected": true//默认被选中
            },
            {
                "id": 3,
                "text": "Option 3",
                "disabled": true//不能选中
            }
        ];
    };

    Select2.prototype.getTheme2 = function () {
        return [
            {
                "text": "Group 1",
                "children" : [
                    {
                        "id": 1,
                        "text": "Option 1.1"
                    },
                    {
                        "id": 2,
                        "text": "Option 1.2"
                    }
                ]
            },
            {
                "text": "Group 2",
                "children" : [
                    {
                        "id": 3,
                        "text": "Option 2.1"
                    },
                    {
                        "id": 4,
                        "text": "Option 2.2"
                    }
                ]
            }
        ];
    };

    Select2.prototype.github = function () {
        this.$st10.select2({
            ajax: {
                url: "https://api.github.com/search/repositories",
                // url: "http://localhost:4000/get",
                dataType: 'json',
                delay: 250,
                // method:'OPTIONS',
                data: function (params) {
                    return {
                        q: params.term, // search term
                        page: params.page
                    };
                },
                processResults: function (data, params) {
                    // parse the results into the format expected by Select2
                    // since we are using custom formatting functions we do not need to
                    // alter the remote JSON data, except to indicate that infinite
                    // scrolling can be used
                    params.page = params.page || 1;
                    // console.log(params)
                    // console.log(data)
                    return {
                        results: data.items,
                        pagination: {
                            more: (params.page * 30) < data.total_count
                        }
                    };
                },
                cache: true
            },
            placeholder: 'Search for a repository',
            escapeMarkup: function (markup) { return markup; }, // let our custom formatter work
            minimumInputLength: 1,
            templateResult: formatRepo,
            templateSelection: formatRepoSelection,
            width:'100%'
        });

        function formatRepo (repo) {
            if (repo.loading) {
                return repo.text;
            }

            var markup = "<div class='select2-result-repository clearfix'>" +
                "<div class='select2-result-repository__avatar'><img src='" + repo.owner.avatar_url + "' /></div>" +
                "<div class='select2-result-repository__meta'>" +
                "<div class='select2-result-repository__title'>" + repo.full_name + "</div>";

            if (repo.description) {
                markup += "<div class='select2-result-repository__description'>" + repo.description + "</div>";
            }

            markup += "<div class='select2-result-repository__statistics'>" +
                "<div class='select2-result-repository__forks'><i class='fa fa-flash'></i> " + repo.forks_count + " Forks</div>" +
                "<div class='select2-result-repository__stargazers'><i class='fa fa-star'></i> " + repo.stargazers_count + " Stars</div>" +
                "<div class='select2-result-repository__watchers'><i class='fa fa-eye'></i> " + repo.watchers_count + " Watchers</div>" +
                "</div>" +
                "</div></div>";

            return markup;
        }

        function formatRepoSelection (repo) {
            return repo.full_name || repo.text;
        }
    };

    Select2.prototype.autoComplete = function () {
        var arr = ['qq.com','shijigroup.com','sina.com'];
        var reg = /^[\w\.\-]+@[\w]+((\.[\w]{2,3}){1,3})$/;
        var that = this;
        this.$st11.select2({
            data:[],
            width:'100%',
            tags:true,
            createTag: function (params) {
                var term = $.trim(params.term);
                if (term === '') {
                    return null;
                }
                //可以自定义输入的值
                return {
                    id: term,
                    text: term,
                    newTag: true // add additional parameters
                }
            },
            insertTag: function (data, tag) {
                // Insert the tag at the end of the results
                data.splice(0,data.length);
                console.log(data)
                $.each(arr,function (i,value) {
                    var _tag = $.extend(true,{},tag);
                    _tag.id = tag.id + '@' + value;
                    _tag.text = tag.text + '@' + value;
                    data.push(_tag);
                });
            },
            placeholder:'',//allowClear要和placeholder配合一起用
            allowClear:true,
            language:{
                noResults:function () {
                    return '';
                }
            },
            selectOnClose: false,
            templateResult:function (state) {
                // console.log(state)
                if(reg.test(state.text)){
                    return state.text;
                }
                return '';
            }
        }).on('select2:close',function (e) {
            var args = e.params;
            var mail = that.$st11.val();
            if($.isEmpty(mail) || !reg.test(mail)){
                return that.$st11.val('').trigger('change.select2');
            }
            // console.log(e.params.originalSelect2Event)
            // if(typeof e.params.originalSelect2Event === 'undefined'){
            //     return that.$st11.val('').trigger('change.select2');;
            // }
            // console.log('args:'+args);
        });


    };

    return Select2;
});