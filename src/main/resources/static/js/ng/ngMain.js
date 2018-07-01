/**
 * Created by CC on 2018/3/19.
 */
'use strict';

var app = angular.module('ngTest', ['ngSanitize', 'localize', 'ipCookie']);

window.i18n = {
    EN: {
        'Angular 翻译视图':'Angular Translation View',
        '输入框提示':'input title',
        'span提示':'span title',
        '我是提示':'I am a title',
        '内容':'content',
        'Hello {name}!':function (data) {
            return '你好 '+data.name +'!';
        }
    }
};

app.config(['$provide', function ($provide) {
    $provide.decorator('localizeConfig', ['$delegate','ipCookie', function ($delegate, ipCookie) {
        $delegate.i18n = window.i18n[ipCookie('superLanguage')] || {};
        return $delegate;
    }]);
}]).directive('localizeTitle', ['localizeFactory', function (localizeFactory) {
    return localizeFactory();
}]).directive('localizePlaceholder', ['localizeFactory', function (localizeFactory) {
    return localizeFactory();
}]);;

app.controller('ngExample', function ($scope, localize, ipCookie, $window) {
    $scope.name = '';
    $scope.test = function () {
        return localize(
            'Hello {name}!',
            {name: $scope.name}
        );
    };
    $scope.lang = ipCookie('superLanguage') || 'CN';
    $scope.content = localize('内容');
    $scope.changeLanguage = function () {
        ipCookie('superLanguage', $scope.lang, {expires:7, path:'/'});
        $window.location.reload();
    };
});