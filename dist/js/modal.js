(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else {
		var a = factory();
		for(var i in a) (typeof exports === 'object' ? exports : root)[i] = a[i];
	}
})(this, function() {
return webpackJsonp([3],[
/* 0 */,
/* 1 */,
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
/**
 * 基础数据
 */

var EVENTS = exports.EVENTS = {
  'ACTION:MASK:CLICK': 'ACTION:MASK:CLICK'
};

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function($) {

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _mask = __webpack_require__(5);

var _mask2 = _interopRequireDefault(_mask);

var _tools = __webpack_require__(1);

var _tools2 = _interopRequireDefault(_tools);

var _const = __webpack_require__(2);

var _alert = __webpack_require__(7);

var _alert2 = _interopRequireDefault(_alert);

var _confirm = __webpack_require__(8);

var _confirm2 = _interopRequireDefault(_confirm);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * 浮层
 * @Class
 * @options: {
        mask：{boolean} 是否显示浮层遮罩
        picker: {boolean} 是否是选择弹出窗
        content：{string} 弹出窗口的内容
        once: {boolean} 关闭弹窗时是否清除元素
        onInit: {function} 初始化钩子函数
        onClose：{function} 关闭窗口回调
   }
 */

var $body = $(document.body);

var Modal = function () {
    /**
     * @constructor
     * @param {object} 配置对象     
     */
    function Modal(options) {
        _classCallCheck(this, Modal);

        this.mask = options.mask;
        this.picker = options.picker;
        this.content = options.content;
        this.once = options.once;

        this.onClose = options.onClose;
        this.onInit = options.onInit;

        this.isOpen = false;

        this.create();
    }

    /**
     * 构建元素和事件
     * @returns none
     */


    _createClass(Modal, [{
        key: 'create',
        value: function create() {
            var self = this;

            this.ele = $('<div class="ui-modal"></div>');
            this.ele.html(this.content);

            $body.append(this.ele);

            if (this.picker) {
                this.ele.addClass('picker');

                _tools2.default.addEventListener(_const.EVENTS['ACTION:MASK:CLICK'], function () {
                    if (self.isOpen) {
                        self.close();
                    }
                });
            }

            this.ele.on('touchstart', function (e) {
                e.preventDefault();
            });

            this.ele.find('[data-role=close]').on('touchstart', function (e) {
                self.close();
            });

            if (this.onInit && typeof this.onInit === 'function') {
                this.onInit.apply(this);
            }
        }

        /**
         * 打开浮层
         * @returns none
         */

    }, {
        key: 'open',
        value: function open() {
            if (this.mask) {
                _mask2.default.show();
            }

            this.isOpen = true;
            this.ele.addClass('open');

            return this;
        }

        /**
         * 关闭浮层
         * @returns none
         */

    }, {
        key: 'close',
        value: function close() {
            this.ele.removeClass('open');
            this.isOpen = false;

            if (this.mask) {
                _mask2.default.hide();
            }

            if (this.onClose && typeof this.onClose === 'function') {
                this.onClose.apply(this);
            }

            if (this.once) {
                this.remove();
            }
        }

        /**
         * 添加事件
         * @param {string} css选择器
         * @param {string} 事件名称
         * @param {function} 事件处理函数 
         * @returns none
         */

    }, {
        key: 'addEventHandler',
        value: function addEventHandler(cssQuery, event, handler) {
            this.ele.find(cssQuery).on(event, handler);
        }

        /**
         * 添加内容
         * @param {string} css选择器
         * @param {string} 内容 
         * @returns none
         */

    }, {
        key: 'setContent',
        value: function setContent(cssQuery, content) {
            this.ele.find(cssQuery).html(content);
        }

        /**
         * 找到浮层中的子节点
         * @param {string} css选择器 
         * @returns {jquery} 子节点对象
         */

    }, {
        key: 'findElement',
        value: function findElement(cssQuery) {
            return this.ele.find(cssQuery);
        }

        /**
         * 移除弹出窗 
         * @returns none
         */

    }, {
        key: 'remove',
        value: function remove() {
            this.ele.remove();
        }
    }]);

    return Modal;
}();

/**
 * 创建窗口
 * @param {object} 浮层配置对象  
 * @returns none
 */


Modal.create = function (options) {
    return new Modal(options);
};

/**
 * 打开一个提示窗口
 * @param {object} 提示窗口配置对象  
    {
        message: {string} 显示的信息
        onConfirm: {function} 关闭窗口的回调 
    }
 * @returns none
 */
Modal.alert = function (options) {
    var _options = {
        mask: true,
        close: false,
        content: _alert2.default,
        onInit: function onInit() {
            var self = this;

            this.addEventHandler('[data-role=confirm]', 'click', function () {
                self.close();

                if (options.onConfirm && typeof options.onConfirm === 'function') {
                    options.onConfirm.apply(self);
                }
            });

            this.setContent('#message', options.message);
            this.open();
        }
    };

    new Modal(_options);
};

/**
 * 打开一个确认窗口
 * @param {object} 确认窗口配置对象  
    {
        message: {string} 显示的信息
        onConfirm: {function} 确认的回调函数
        onCancel: {function} 取消的回调函数
    }
 * @returns none
 */
Modal.confirm = function (options) {
    var _options = {
        mask: true,
        close: false,
        content: _confirm2.default,
        onInit: function onInit() {
            var self = this;

            this.addEventHandler('[data-role=confirm]', 'click', function () {
                self.close();

                if (options.onConfirm && typeof options.onConfirm === 'function') {
                    options.onConfirm.apply(self);
                }
            });

            this.setContent('#message', options.message);
            this.open();
        }
    };

    new Modal(_options);
};

exports.default = Modal;
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(0)))

/***/ }),
/* 4 */,
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function($) {

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _tools = __webpack_require__(1);

var _tools2 = _interopRequireDefault(_tools);

var _const = __webpack_require__(2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * 浮层遮罩
 * @Class
 */
var Mask = function () {
    /**
     * 浮层遮罩
     * @constructor
     */
    function Mask() {
        _classCallCheck(this, Mask);

        this.ele = $('<div class="ui-modal-mask"></div>');

        this.ele.on('touchstart', function (e) {
            e.preventDefault();
            _tools2.default.triggerEvent(_const.EVENTS['ACTION:MASK:CLICK']);
        });

        document.body.appendChild(this.ele[0]);
    }

    /**
     * 显示遮罩
     * @returns none     
     */


    _createClass(Mask, [{
        key: 'show',
        value: function show() {
            this.ele.show();
        }

        /**
         * 隐藏遮罩
         * @returns none
         */

    }, {
        key: 'hide',
        value: function hide() {
            this.ele.hide();
        }
    }]);

    return Mask;
}();

exports.default = {
    ins: null,
    num: 0,

    /**
     * 显示遮罩
     * @returns none     
     */
    show: function show() {
        if (!this.ins) {
            this.ins = new Mask();
        }

        this.num++;
        this.ins.show();
    },


    /**
     * 隐藏遮罩
     * @returns none
     */
    hide: function hide() {
        this.num--;

        if (this.num === 0) {
            this.ins.hide();
        }
    }
};
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(0)))

/***/ }),
/* 6 */,
/* 7 */
/***/ (function(module, exports) {

module.exports = "<div class=\"ui-modal-inner alert\">\r\n    <h4 class=\"ui-modal-message\" data-role=\"message\"></h4>\r\n    <div class=\"ui-modal-footer\">\r\n        <a href=\"javascript:void(0);\" \r\n           class=\"ui-btn ui-btn-info\"\r\n           data-role=\"confirm\">确定</a>\r\n    </div>\r\n</div>";

/***/ }),
/* 8 */
/***/ (function(module, exports) {

module.exports = "<div class=\"ui-modal-inner confirm\">\r\n    <h4 class=\"ui-overlay-message\" data-role=\"message\"></h4>\r\n    <div class=\"ui-modal-footer\">\r\n        <a href=\"javascript:void(0);\"\r\n           class=\"ui-btn ui-btn-info\"\r\n           data-role=\"confirm\">确定</a>\r\n        <a href=\"javascript:void(0);\" \r\n           class=\"ui-btn ui-btn-info\"\r\n           data-role=\"close\">取消</a>\r\n    </div>\r\n</div>";

/***/ })
],[3]);
});