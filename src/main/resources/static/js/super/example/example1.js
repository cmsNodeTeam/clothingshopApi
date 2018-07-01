/**
 * Created by CC on 2017/9/19.
 */
define(['select2Object','downloadObj'], function (Select2,DownloadObj) {
    'use strict';
    function Example() {
        this.select2 = new Select2();
        this.downloadLog = new DownloadObj();
    }

    Example.prototype.init = function () {
        this.select2.init();
        this.downloadLog.init();
    };

    var example = new Example();
    example.init();
});