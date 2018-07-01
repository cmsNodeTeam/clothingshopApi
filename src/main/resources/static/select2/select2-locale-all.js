/**
 * Created by CC on 2017/9/23.
 */
define([],function () {
    return function() {
        return {
            errorLoading: function () {
                return jQuery.clientLang("无法载入结果.");
            }, inputTooLong: function (e) {
                var t = e.input.length - e.maximum, n = "请删除{0}个字符";
                return jQuery.clientLang(n,t);
            }, inputTooShort: function (e) {
                var t = e.minimum - e.input.length, n = "请再输入至少{0}个字符";
                return jQuery.clientLang(n,t);
            }, loadingMore: function () {
                return jQuery.clientLang("载入更多结果…");
            }, maximumSelected: function (e) {
                var t = "最多只能选择{0}个项目";
                return jQuery.clientLang(t,e.maximum);
            }, noResults: function () {
                return jQuery.clientLang("未找到结果");
            }, searching: function () {
                return jQuery.clientLang("搜索中…");
            }
        }
    };
});
