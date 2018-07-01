/**
 * Created by CC on 2018/1/15.
 */
define(['../../../select2/select2.full.min'
    ,'../../../select2/select2-locale-all'],function (S,L) {
    'use strict';
    var e = jQuery.fn.select2.amd;
    e.define('select2/i18n/all', [], L);
});