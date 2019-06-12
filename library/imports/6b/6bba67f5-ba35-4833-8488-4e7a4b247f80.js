"use strict";
cc._RF.push(module, '6bba6f1ujVIM4SITnpLJH+A', 'customSprite');
// scripts/customComponents/customSprite.js

"use strict";

// Learn cc.Class:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] https://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html
var bgTextureEnum = cc.Enum({
    Null: 0,
    Bg_1: 1,
    Bg_2: 2
});

var spriteModeEnum = cc.Enum({
    Bg: 0,
    Disperse: 1
});

//自定义精灵组件  默认为图集模式

var customSprite = cc.Class({
    extends: cc.Sprite,

    editor: {
        disallowMultiple: true,
        executeInEditMode: true,
        menu: "自定义组件/自定义精灵组件"
    },

    properties: {
        bgTexture: {
            default: bgTextureEnum.Null,
            type: bgTextureEnum,
            displayName: "图片精灵背景贴图枚举",
            notify: function notify() {
                this.onLoadTexture2DToSprite();
            }
        },

        fileName: {
            default: "bg",
            displayName: "散图文件夹"
        },

        disperseName: {
            default: "null",
            displayName: "搜索图片",
            multiline: false,
            notify: function notify() {
                this.onSpriteNameToAtlasEvent();
            }
        },

        disperseIndex: {
            default: 0,
            type: cc.Integer,
            displayName: "散图序号",
            notify: function notify() {
                this.onSpriteFrameIndexToAtlasEvent();
            }
        },

        disperse: {
            default: true,
            displayName: "图集模式"
        },

        _oldDefaultTexture2D: null,
        _oldSpriteFrame: null
    },

    _applyAtlas: CC_EDITOR && function (spriteFrame) {
        // Set atlas
        var self = this;
        if (spriteFrame && spriteFrame._atlasUuid) {

            cc.AssetLibrary.loadAsset(spriteFrame._atlasUuid, function (err, asset) {
                self._atlas = asset;
            });
        } else {
            this._atlas = null;
        }
        self.disperseName = "";
    },

    onLoadTexture2DToSprite: function onLoadTexture2DToSprite() {
        var _this = this;

        this.textureUrl = cc.url.raw("res/texture/" + this.fileName + "/" + (this.fileName + this.bgTexture) + ".png");
        if (this.bgTexture !== bgTextureEnum.Null) {
            cc.loader.load(this.textureUrl, function (err, resTexture2D) {
                _this.spriteFrame = null;
                var newSpriteFrame = new cc.SpriteFrame(resTexture2D);
                if (_this._oldSpriteFrame !== newSpriteFrame) {
                    _this.spriteFrame = newSpriteFrame;
                    _this._oldSpriteFrame = _this.spriteFrame;
                }
            });
        } else {
            this.spriteFrame = null;
        }
    },
    onSpriteFrameIndexToAtlasEvent: function onSpriteFrameIndexToAtlasEvent() {
        if (this.disperseIndex !== -1) {
            if (this.disperse && this._atlas) {
                if (this.disperseIndex >= 0 && this.disperseIndex < this._atlas.getSpriteFrames().length) {
                    this.spriteFrame = this._atlas.getSpriteFrames()[this.disperseIndex];
                } else {
                    if (this.disperseIndex < this._atlas.getSpriteFrames().length / 2) {
                        this.disperseIndex = 0;
                    } else {
                        this.disperseIndex = this._atlas.getSpriteFrames().length - 1;
                    }
                }
            } else {
                cc.error("请将图集文件拖入Atlas框中");
            }
        }
    },
    onSpriteNameToAtlasEvent: function onSpriteNameToAtlasEvent() {
        if (this.disperseName !== "") {
            if (this.disperse && this._atlas) {
                for (var i = 0; i < this._atlas.getSpriteFrames().length; i++) {
                    if (this._atlas.getSpriteFrames()[i].name === this.disperseName) {
                        this.spriteFrame = this._atlas.getSpriteFrames()[i];
                    }
                }
            } else {
                cc.error("请将图集文件拖入Atlas框中");
            }
        }
    }
});

if (CC_EDITOR) {
    cc.Class.Attr.setClassAttr(customSprite, 'bgTexture', 'visible', function () {
        return !this.disperse;
    });
    cc.Class.Attr.setClassAttr(customSprite, 'fileName', 'visible', function () {
        return !this.disperse;
    });
    cc.Class.Attr.setClassAttr(customSprite, 'disperseIndex', 'visible', function () {
        return this.disperse;
    });
    cc.Class.Attr.setClassAttr(customSprite, 'disperseName', 'visible', function () {
        return this.disperse;
    });
}

cc._RF.pop();