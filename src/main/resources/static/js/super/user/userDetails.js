/**
 * Created by CC on 2017/11/19.
 */
define(['select2'], function () {
    'use strict';
    var $ = jQuery;
    function UserDetails() {
        this.$getId = $('#getId');
        this.$inputShopId = $('#inputShopId');
        this.$inputAdminId = $('#inputAdminId');
        this.$inputAdminName = $('#inputAdminName');
        this.$inputRights = $('#inputRights');
        this.$inputEmail = $('#inputEmail');
        this.$inputSupplierCode = $('#inputSupplierCode');
        this.$inputAdminType = $('#inputAdminType');
        this.$inputStatus = $('#inputStatus');
        this.$save = $('#save');
        this.$saveAndClose = $('#saveAndClose');
        this.$close = $('#close');
        this.currentObj = this.getUserObj();
    }

    UserDetails.prototype.init = function () {
        this.initComp();
        this.initEvents();
    };

    UserDetails.prototype.initComp = function () {
        this.$inputStatus.select2({
            width:'100%'
        });
        this.$inputAdminType.select2({
            width:'100%'
        });
    };


    UserDetails.prototype.initEvents = function () {
        this.$save.on('click',$.proxy(this.save,this));
        this.$saveAndClose.on('click',$.proxy(this.saveAndClose,this));
        this.$close.on('click',$.proxy(this.close,this));
    };

    UserDetails.prototype.save = function () {

    };

    UserDetails.prototype.saveAndClose = function () {

    };

    UserDetails.prototype.close = function () {
        if(!$.compareObjects(this.currentObj, this.getUserObj())){
            $.createConfirmModal('确定不保存用户信息?', function () {
                return true;
            }, $.noop, {okUrl: $.getHashUrl()});
            return;
        }
        this.$close.attr('href',$.getHashUrl());
        return true;
    };

    UserDetails.prototype.getUserObj = function () {
        var id = this.$getId.val();
        var shopId = this.$inputShopId.val();
        var adminId = this.$inputAdminId.val();
        var adminName = this.$inputAdminName.val();
        var type = this.$inputAdminType.val();
        var rights = this.$inputRights.val();
        var mail = this.$inputEmail.val();
        var status = this.$inputStatus.val();
        var supplier = this.$inputSupplierCode.val();
        var obj = {};
        if(!$.isEmpty(id)){
            obj._id = id;
        }
        if(!$.isEmpty(shopId)){
            obj.shopId = shopId;
        }
        if(!$.isEmpty(adminId)){
            obj.adminId = adminId;
        }
        if(!$.isEmpty(adminName)){
            obj.adminName = adminName;
        }
        if(!$.isEmpty(type)){
            obj.adminType = type;
        }
        if(!$.isEmpty(rights)){
            obj.rights = rights;
        }
        if(!$.isEmpty(mail)){
            obj.email = mail;
        }
        if(!$.isEmpty(status)){
            obj.adminStatus = status;
        }
        if(!$.isEmpty(supplier)){
            obj.supplierCode = supplier;
        }
        return obj;
    };

    var details = new UserDetails();
    details.init();
    
});