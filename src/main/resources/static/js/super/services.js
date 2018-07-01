/**
 * Created by CC on 2017/12/30.
 */
"use strict";
var cmsServices = angular.module('cmsServices', []);

cmsServices.factory('RequestHandler', function ($q) {
    return {
        'request': function (request) {
            request.headers['X-Requested-With'] = 'XMLHttpRequest';
            if (request.loadingId) request.loadId = $.loadingDiv(request.loadingId);
            return request;
        },
        'response': function (response) {
            var result = response.data;
            if (typeof result === 'string') {
                //这里是因为res.render的时候不知道为什么返回的是字符串而不是json
                //可能是因为单页应用路由请求时返回的参数都是转成字符串的原因
                try {
                    result = JSON.parse(result);
                } catch (e) {
                    if (response.config.loadId)
                        $.cancelLoadingDiv(response.config.loadId);
                    return response;
                }
            }
            if (result.code === -302) {
                window.location.href = result.redirectURL;
            }
            if (response.config.loadId)
                $.cancelLoadingDiv(response.config.loadId);
            return response;
        },
        'responseError': function (rejection) {
            $.cancelLoadingDiv();
            if (rejection.status === 500) {
                $.createAlert('请求服务器500错误');
            }
            return $q.reject(rejection);
        }
    };
});

cmsServices.factory('cmsConfig', function () {
    return {
        commonCtrlFn: function () {
            $.initSize.resizeBody();
            $.initSize.resizeModal();
        },
        langProp: {
            'CN': '简体中文',
            'EN': 'English'
        },
        skinList: {
            'black': $.clientLang('黑色'),
            'red': $.clientLang('红色'),
            'green': $.clientLang('绿色'),
            'blue': $.clientLang('蓝色'),
            'aero': $.clientLang('透明'),
            'grey': $.clientLang('灰色'),
            'orange': $.clientLang('橘色'),
            'yellow': $.clientLang('黄色'),
            'pink': $.clientLang('粉色'),
            'purple': $.clientLang('紫色')
        },
        navbarList: {
            '/userSetup': '用户设置',
            '/createUser': '创建用户',
            '/modifyUser/:id': '编辑用户',
            '/rightsSetup': '权限设置',
            '/example/:id': '测试页面{0}',
            '/userLogs': '操作日志',
            '/serverLogs': '服务器日志',
            '/pin_board': '便利贴',
            '/agile_board': '敏捷工作',
            '/systemConfig': '系统数据设置'
        }
    };
});

cmsServices.factory('superService', function ($http) {
    return {
        toggleLang: function (type) {
            if (type === $.getLangType())return;
            $http({
                url: '/back/language/' + type,
                method: 'post',
                loadingId: 'body'
            }).then(function (response) {
                if (response.data.code === 1) {
                    window.location.reload();
                }
            });
        },
        logOut: function () {
            $http({
                url: '/super/abort',
                data: {
                    hash: $.getCurrentUrl()
                },
                loadingId: 'body',
                method: 'post'
            });
            $.setLocalStore('liList',JSON.stringify([]));
        }
    }
});

cmsServices.factory('testService', function ($http, $q) {
    return {
        getResult: function () {
            var deferred = $q.defer();
            $http({
                url: '/super/web/example/parseSessionid',
                method: 'post',
                loadingId: '.box-body'
            }).then(function (resp) {
                deferred.resolve(resp.data);
            });
            return deferred;
        },
        findTest: function () {
            var deferred = $q.defer();
            $http({
                // url: '/super/test/find'
                url: '/super/test/addFloor'
            }).then(function (resp) {
                deferred.resolve(JSON.stringify(resp.data));
            });
            return deferred;
        },
        addRoom:function (params) {
            var deferred = $q.defer();
            $http({
                url: '/super/test/addRoom',
                method: 'post',
                data: params
            }).then(function (resp) {
                deferred.resolve(JSON.stringify(resp.data));
            });
            return deferred;
        },
        deleteRoom:function (params) {
            var deferred = $q.defer();
            $http({
                url: '/super/test/deleteRoom',
                method: 'post',
                data: params
            }).then(function (resp) {
                deferred.resolve(JSON.stringify(resp.data));
            });
            return deferred;
        },
        findRoom:function (params) {
            var deferred = $q.defer();
            $http({
                url: '/super/test/findRoom',
                method: 'post',
                data: params
            }).then(function (resp) {
                deferred.resolve(JSON.stringify(resp.data));
            });
            return deferred;
        },
        findRoomByCond:function (params) {
            var deferred = $q.defer();
            $http({
                url: '/super/test/findRoomByCond',
                method: 'post',
                data: params
            }).then(function (resp) {
                deferred.resolve(JSON.stringify(resp.data));
            });
            return deferred;
        },
        modifyRoom:function (params) {
            var deferred = $q.defer();
            $http({
                url: '/super/test/modifyRoom',
                method: 'post',
                data: params
            }).then(function (resp) {
                deferred.resolve(JSON.stringify(resp.data));
            });
            return deferred;
        }
    };
});

cmsServices.factory('navLinkService', function (cmsConfig, $rootScope, $route, $location) {
    var once;
    function initNav() {
        //该方法设计单例,只能执行一次
        if(once)return;
        once = 'initNav';
        var original = $route.current.$$route.originalPath;
        $rootScope.liList = getLiList();
        if(original === '/home'){//主页不执行
            return;
        }
        var currentUrl = $location.path().substr(1);
        $rootScope.activeLink = $.clientLang(cmsConfig.navbarList[original]
            , jsonToArray($route.current.pathParams));
        $rootScope.lastLiUrl = {
            url: currentUrl,
            desc: $rootScope.activeLink,
            original: original
        };
    }

    function refreshNav() {
        var original = $route.current.$$route.originalPath;
        if(original === '/home'){
            $rootScope.liList = [];
            $rootScope.lastLiUrl = {};
            $.setLocalStore('liList',JSON.stringify($rootScope.liList));
            return;
        }
        var currentUrl = $location.path().substr(1);
        $rootScope.activeLink = $.clientLang(cmsConfig.navbarList[original]
            , jsonToArray($route.current.pathParams));
        var regexp = $route.current.regexp;
        var index = -1;
        if($.getObjLength($rootScope.lastLiUrl) !== 0){
            $rootScope.liList.push($rootScope.lastLiUrl);
            $rootScope.liList.forEach(function (value, i) {
                if(value.$$hashKey){
                    delete value.$$hashKey;
                }
                if(regexp.test('/' + value.url)){
                    index = i;
                }
            });
        }
        if(index !== -1){
            // $.each(index, function (i, value) {
            //     $rootScope.liList.splice(i === 0 ? value : value - 1, 1);
            // });
            $rootScope.liList.splice(index);
        }
        if($rootScope.liList.length >= 5){
            $rootScope.liList.splice(0, 1);
        }

        $rootScope.lastLiUrl = {
            url: currentUrl,
            desc: $rootScope.activeLink,
            original: original
        };
        $.setLocalStore('liList',JSON.stringify($rootScope.liList));
    }

    function getLiList() {
        var list = $.getLocalStore('liList');
        if(!list)return [];
        try{
            return JSON.parse(list);
        }catch (e) {
            return [];
        }
    }

    function jsonToArray(json) {
        return $.map(json, function (value) {
            return value;
        });
    }
    
    return {
        init: initNav,
        refresh: refreshNav
    };
});

cmsServices.factory('adminUserService', function ($http, $q) {
    return {
        getUserById: function (id) {
            var deferred = $q.defer();
            $http({
                url: '/super/user/getUserById',
                method: 'post',
                data: {id: id},
                loadingId: '.box'
            }).then(function (resp) {
                if (resp.data.code === 0) {
                    return deferred.reject(resp.data.msg);
                }
                deferred.resolve(resp.data);
            });
            return deferred;
        }
    };
});

cmsServices.factory('serverLogService', function ($http, $q) {
    return {
        getLogs: function () {
            var deferred = $q.defer();
            $http({
                url: '/super/serverlogs/search',
                loadingId: 'body'
            }).then(function (resp) {
                deferred.resolve(resp.data['logs']);
            });
            return deferred;
        },
        downloadLog: function (logname) {
            var deferred = $q.defer();
            $http({
                url: '/super/serverlogs/download',
                params: {logname: logname},
                loadingId: 'body'
            }).then(function (resp) {
                if (resp.data.code === 0) {
                    return deferred.reject(resp.data.msg);
                }
                deferred.resolve(resp.data['content']);
            });
            return deferred;
        },
        deleteLog: function (logname) {
            var deferred = $q.defer();
            $http({
                url: '/super/serverlogs/delete',
                method: 'post',
                data: {logname: logname},
                loadingId: 'body'
            }).then(function (resp) {
                if (resp.data.code === 0) {
                    return deferred.reject(resp.data.msg);
                }
                deferred.resolve();
            });
            return deferred;
        }
    }
});