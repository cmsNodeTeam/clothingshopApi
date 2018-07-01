/**
 * Created by CC on 2017/12/6.
 */
define([],function () {
    'use strict';
    var $ = jQuery;
    function DownloadLog() {
        this.$logText = $('#logText');
        this.$getLog = $('#getLog');
        this.$downLog1 = $('#downLog1');
        this.$downLog2 = $('#downLog2');
        this.$downLog3 = $('#downLog3');
        this.$downLog4 = $('#downLog4');
    }

    DownloadLog.prototype.init = function () {
        this.$getLog.off('click').on('click',$.proxy(this.getLog,this));
        this.$downLog1.off('click').on('click',$.proxy(this.downloadLog,this,1));
        this.$downLog2.off('click').on('click',$.proxy(this.downloadLog,this,2));
        this.$downLog3.off('click').on('click',$.proxy(this.downloadLog,this,3));
        this.$downLog4.off('click').on('click',$.proxy(this.downloadLog,this,4));
    };

    DownloadLog.prototype.getLog = function () {
        var that = this;
        // $.ajax({
        //     url:'/super/web/example/getLog',
        //     success:function (data) {
        //         that.$logText.val(data);
        //     }
        // });
        $.ajax({
            url:'/super/web/example/parseSessionid',
            success:function (data) {
                that.$logText.val(data);
            }
        });
    };

    DownloadLog.prototype.downloadLog = function (type) {
        switch (type){
            case 1:
                $.ajax({
                    url:'/super/web/example/getLog',
                    success:function (data) {
                        $.downloadFile('server.log'
                            ,'data:text/plain;charset=utf-8,'
                            ,data);
                    }
                });
                break;
            case 2:
                $.ajax({
                    url:'/super/web/example/getLog',
                    success:function (data) {
                        var blob = new Blob([data], {type: "text/plain;charset=utf-8"});
                        $.saveAs(blob, 'server.log');
                        // $.download('server.log','text/plain;charset=utf-8',data);
                    }
                });
                break;
            case 3:
                window.location.href = '/super/web/example/downloadlog';
                break;
            case 4:
                window.location.href = '/super/web/example/downloadlog_2';
                break;
        }
    };

    return DownloadLog;
});