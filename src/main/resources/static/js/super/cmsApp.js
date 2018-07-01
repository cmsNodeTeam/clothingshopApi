/**
 * Created by CC on 2017/12/30.
 */
"use strict";
var app = angular.module('appCMS', ['ngRoute', 'cmsServices', 'cmsControllers']);

//angular路由控制
app.config(function ($routeProvider) {
    $routeProvider.when('/userSetup', {
        //用户设置
        templateUrl: '/super/web/userSetup',
        controller: 'commonCtrl'
    }).when('/createUser', {
        templateUrl: '/super/web/userDetails',
        controller: 'commonCtrl'
    }).when('/modifyUser/:id', {
        templateUrl: '/super/web/userDetails',
        controller: 'commonCtrl'
    }).when('/rightsSetup', {
        //权限设置
        templateUrl: '/super/web/rightsSetup',
        controller: 'commonCtrl'
    }).when('/example/:id', {
        //例子页面
        templateUrl: function ($routeParams) {
            return '/super/web/example/test/' + $routeParams.id;
        },
        controller: 'commonCtrl'
    }).when('/home', {
        //主页
        templateUrl: '/super/web/home',
        controller: 'commonCtrl'
    }).when('/userLogs', {
        templateUrl: '/super/web/userLogs',
        controller: 'commonCtrl'
    }).when('/serverLogs', {
        templateUrl: '/super/web/serverLogs',
        controller: 'commonCtrl'
    }).when('/systemConfig', {
        templateUrl: '/super/web/systemConfig',
        controller: 'commonCtrl'
    }).otherwise({
        redirectTo: '/home'
    }).when('/agile_board', {
        templateUrl: '/super/web/agileboard',
        controller: 'commonCtrl'
    }).when('/pin_board', {
        templateUrl: '/super/web/pinboard',
        controller: 'commonCtrl'
    });
}).constant('moment', moment);

//清除模板缓存
app.run(function ($rootScope, $templateCache, $browser, $location, navLinkService) {
    //这里还有$locationChangeStart,$locationChangeSuccess,$routeChangeStart
    // $routeChangeSuccess -->(这里不能触发的原因是成功了还没加载视图出来)  4个方法
    //这个是路由加载前触发
    $rootScope.$on('$routeChangeStart', function (event, next, current) {
        if (typeof(current) !== 'undefined') {
            $templateCache.remove(current['templateUrl']);
        }
    });

    //路由改变成功时触发
    $rootScope.$on('$locationChangeSuccess', function (event, next, current) {
        $.setLocalStore('currentUrl', $location.path().substr(1));
        navLinkService.init();
        if (next !== current) {
            var domain = location.origin + $browser.baseHref();//域名
            $.setLocalStore('hashUrl', current.replace(domain, ''));
            navLinkService.refresh();
        }
    });
    //当路由成功后才触发controller
});

app.config(function ($httpProvider, $locationProvider, cmsConfigProvider) {
    $locationProvider.hashPrefix('');
    $locationProvider.html5Mode(true);
    $httpProvider.interceptors.push('RequestHandler');
    // var cmsConfig = cmsConfigProvider.$get();
    // console.log(cmsConfig);
});

app.directive('breadcrumb', function () {
    return {
        restrict: 'E',
        templateUrl: '/super/web/navbar/navlink',
        replace: true
    };
});