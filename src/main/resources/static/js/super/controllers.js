/**
 * Created by CC on 2017/12/30.
 */
"use strict";
var cmsControllers = angular.module('cmsControllers', []);

cmsControllers.controller('commonCtrl', function (cmsConfig) {
    cmsConfig.commonCtrlFn();
    $('.box').each(function () {
        $(this).boxWidget();
    });
});

cmsControllers.controller('navBarController', function ($scope, superService, cmsConfig) {
    //切换语言
    $scope.toggleLang = superService.toggleLang;
    //用户退出
    $scope.logOut = superService.logOut;
    //当切换侧边栏时记住选择
    $scope.changeNavbar = function () {
        if ($("body").hasClass('sidebar-collapse')) {
            $.setLocalStore('sidebar-collapse', false);
        } else {
            $.setLocalStore('sidebar-collapse', true);
        }
    };
    $scope.langProp = cmsConfig.langProp;
    $scope.langType = $.getLangType();
    $scope.langLogo = cmsConfig.langProp[$scope.langType];
});

cmsControllers.controller('example2Ctrl', function ($scope, cmsConfig, testService, moment, adminUserService) {
    $scope.getResult = function () {
        testService.getResult().promise.then(function (resp) {
            $scope.result = resp;
        });
    };
    $scope.date = moment().format('YYYY-MM-DD');
    $scope.getUser = function () {
        adminUserService.getUserById('5a1051132fd6481fc0138858').promise.then(function (resp) {
            $scope.result = JSON.stringify(resp);
        }, function (errorResp) {
            $scope.result = 'error:' + errorResp;
        });
    };

    //按0 - 就有问题
    $('#num').inputmask('integer',{
        rightAlignNumerics:false,
        allowPlus:false,
        allowMinus:false
    }).TouchSpin({
        // initval:1,
        // min:1,
        verticalbuttons: true,
        verticalupclass: 'glyphicon glyphicon-plus',
        verticaldownclass: 'glyphicon glyphicon-minus'
    });

    $scope.subModal = {};
    $scope.addSub = function () {
        testService.addRoom($scope.subModal).promise.then(function (value) {
            $scope.subResult = $.formatJSON(value);
        });
    };

    $scope.modifySub = function () {
        testService.modifyRoom($scope.subModal).promise.then(function (value) {
            $scope.subResult = $.formatJSON(value);
        });
    };

    $scope.deleteSub = function () {
        testService.deleteRoom($scope.subModal).promise.then(function (value) {
            $scope.subResult = $.formatJSON(value);
        });
    };

    $scope.findSub = function () {
        testService.findRoom($scope.subModal).promise.then(function (value) {
            $scope.subResult = $.formatJSON(value);
        });
    };

    $scope.findSubByCond = function (){
        testService.findRoomByCond($scope.subModal).promise.then(function (value) {
            $scope.subResult = $.formatJSON(value);
        });
    };

    $scope.clearSub = function () {
        $scope.subResult = '';
        $scope.subModal = {};
    };
});

cmsControllers.controller('sideBarCtrl', function () {

});

cmsControllers.controller('footerCtrl', function ($scope, cmsConfig) {
    $scope.skinList = cmsConfig.skinList;
    $scope.changeSkin = $.changeSkin;
});

cmsControllers.controller('adminUserCtrl', function ($scope, $location, $routeParams, adminUserService) {
    $scope.userId = $routeParams.id;
    if ($scope.userId) {
        $scope.userTitle = $.clientLang('编辑用户({0})', '');
        $scope.isShow = false;
        $scope.search = $.clientLang('查询中...');
        adminUserService.getUserById($scope.userId).promise.then(function (data) {
            $scope.isShow = true;
            $scope.user = data;
            $scope.userTitle = $.clientLang('编辑用户({0})', data.adminName);
        },function (errorResp) {
            $scope.user = {};
            $scope.errorText = errorResp;
        });
    }else {
        $scope.user = {
            adminType: 'NORMAL',
            adminStatus: true
        };
        $scope.userTitle = $.clientLang('创建用户');
        $scope.isShow = true;
    }
});

cmsControllers.controller('serverLogCtrl', function ($scope, serverLogService) {
    var $modal = $('#logViewModal');
    $scope.viewLog = function (log) {
        $modal.modal({
            backdrop: false,
            keyboard: false
        });
        $scope.logname = log.name;
        serverLogService.downloadLog(log.name).promise.then(function (value) {
            $scope.content = value;
        },function (reason) {
            $scope.content = reason;
        });
    };

    $scope.downloadLog = function (log) {
        serverLogService.downloadLog(log.name).promise.then(function (value) {
            var blob = new Blob([value], {type: "text/plain;charset=utf-8"});
            $.saveAs(blob, log.name);
        },function (reason) {
            $.createAlert(reason);
        });
    };

    $scope.closeView = function () {
       $modal.modal('hide');
       $scope.content = '';
    };

    $scope.deleteLog = function (log){
        $.createConfirm($.clientLang('确定删除 {0} 日志?', log.name), function () {
            serverLogService.deleteLog(log.name).promise.then(function () {
                $scope.initLogs();
            },function (error) {
                $.createAlert(error);
            });
        });
    };

    $scope.initLogs = function (){
        serverLogService.getLogs().promise.then(function (logs) {
            $scope.logs = logs;
        });
    };

    $scope.initLogs();
});

cmsControllers.controller('pinBoardCtrl', function ($scope) {
    $scope.notes = [{
        date:new Date().format(),
        title: 'Long established fact',
        content: 'The years, sometimes by accident, sometimes on purpose (injected humour and the like).'
    }];

    $scope.deleteNote = function (index, note) {
        $scope.notes.splice(index, 1);
        // $scope.$apply();
    };

    $scope.addNote = function () {
        var note = {
            date: new Date().format(),
            title: 'New',
            content: 'Test'
        };
        $scope.notes.push(note);
    };

    $scope.modifyNote = function (note) {

    };

    $scope.copyNote = function (note) {

    };
});