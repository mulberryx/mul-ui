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
return webpackJsonp([2,3,4],[
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
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function($) {

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _tools = __webpack_require__(1);

var _tools2 = _interopRequireDefault(_tools);

var _scroller = __webpack_require__(6);

var _scroller2 = _interopRequireDefault(_scroller);

var _picker = __webpack_require__(9);

var _picker2 = _interopRequireDefault(_picker);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var pickerRender = _tools2.default.tmpl(_picker2.default);
/**
 * Picker 选择组件
 * @class
 * @options: {
        id: {string} 容器id
        cols: {array} 选择数组
        enable: {boolean} 是否可用
        onChange：{function} 关闭窗口回调
        defaultvalue: {array} 默认值
   }
 */

var Picker = function () {
    /**
     * @constructor
     * @param {object} 配置对象     
     */
    function Picker(options) {
        _classCallCheck(this, Picker);

        if (typeof options.container === 'string') {
            this.container = $('#' + options.container);
        } else {
            this.container = options.container;
        }

        this.onChange = options.onChange;
        this.cols = options.cols;

        this.value = options.defaultvalue || [];
        this.scrollers = [];

        this.init();
    }

    /**
     * 初始化
     * @returns none
     */


    _createClass(Picker, [{
        key: 'init',
        value: function init() {
            this.container.html(this.render({
                cols: this.cols
            }));

            this.initScroller();
            this.setValue();
        }

        /**
         * 初始化旋转木马
         * @returns none
         */

    }, {
        key: 'initScroller',
        value: function initScroller() {
            var self = this;
            var cols = this.container.find('.ui-picker-items-col');

            this.scrollers = [];

            cols.each(function (i, ele) {
                var container = $(ele);
                var wrapper = container.find('.ui-picker-items-col-wrapper');

                var options = {
                    snap: ".ui-picker-item",
                    container: container[0],
                    wrapper: wrapper[0],
                    onChange: function onChange(data) {
                        self.value[i] = data.value;
                        self._onChange();
                    }
                };

                self.scrollers.push(new _scroller2.default(options));
            });
        }

        /**
         * 值改变
         * @returns none
         */

    }, {
        key: '_onChange',
        value: function _onChange() {
            var transiting = false;

            for (var i = this.scrollers.length - 1; i >= 0; i--) {
                if (this.scrollers[i].transiting) {
                    transiting = true;
                }
            }

            if (!transiting) {
                this.onChange(this.value);
            }
        }

        /**
         * 设置值
         * @param {array|undefined} 值数组
         * @returns none
         */

    }, {
        key: 'setValue',
        value: function setValue(valArr) {
            this.value = valArr || this.value;

            if (this.value.length) {
                for (var _i2 = this.value.length - 1; _i2 >= 0; _i2--) {
                    var val = this.value[_i2];

                    if (this.cols[_i2]) {
                        var rows = this.cols[_i2].rows;
                        var _i = false;

                        for (var j = rows.length - 1; j >= 0; j--) {
                            var row = rows[j];

                            if (row.value == val) {
                                _i = j;
                                break;
                            }
                        }

                        if (_i !== false) {
                            this.scrollers[_i2].scrollTo(_i);
                        }
                    }
                }
            } else {
                for (var i = this.cols.length - 1; i >= 0; i--) {
                    var col = this.cols[i];
                    var _rows = col.rows;

                    this.value[i] = _rows[0].value;
                    this.scrollers[i].scrollTo(0);
                }
            }
        }

        /**
         * 根据新的列数据模型重绘
         * @param {array} 列
         * @returns none
         */

    }, {
        key: 'setCols',
        value: function setCols(cols) {
            this.cols = cols;

            this.container.html(this.render({
                cols: this.cols
            }));

            this.initScroller();
        }

        /**
         * 获取值
         * @returns {array} 值数组，次序对应列
         */

    }, {
        key: 'getValue',
        value: function getValue() {
            return this.value;
        }

        /**
         * 渲染函数
         * @param {object} 数据
         * @returns none
         */

    }, {
        key: 'render',
        value: function render(data) {
            return pickerRender(data);
        }
    }]);

    return Picker;
}();

exports.default = Picker;
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(0)))

/***/ }),
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
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function($) {

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * 拖拽滚动
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      */

var _transit = __webpack_require__(11);

var _transit2 = _interopRequireDefault(_transit);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

"use strict";

/**
 * 拖拽滚动
 * @class
 * @options: {
        container: {jquery} 最外层容器
        snap: {string} 项的css选择器
        wrapper {jquery} 列的包装
        onScrollEnd {function} 滚动结束后的回调
   } 
 */

var Scroller = function () {
    /**
     * 构造函数
     * @constructor
     * @param {object} 配置对象
     */
    function Scroller(options) {
        _classCallCheck(this, Scroller);

        this.container = options.container;
        this.disabled = this.container.getAttribute('data-disabled');

        this.snap = options.snap;
        this.wrapper = options.wrapper;
        this.onChange = options.onChange;
        this.$snaps = null;

        this.currMove = 0;
        this.transiting = false;

        this.init();
    }

    /**
     * 初始化
     * @returns none
     */


    _createClass(Scroller, [{
        key: 'init',
        value: function init() {
            this.$snaps = this.getSnaps();

            this.containerHeight = this.getContainerHeight();
            this.snapHeight = this.getSnapHeight();
            this.snapNumber = this.getSnapNumber();

            if (this.disabled === 'disabled') {
                return false;
            }

            this.touchstartmove = false;

            var self = this;

            var lastY = null;
            var startY = null;
            var offsetY = null;
            var speed = null;

            /**
             * 触摸移动
             * @param {event} 事件对象
             * @returns none
             */
            var touchmove = function touchmove(e) {
                var touch = e.touches[0];
                var clientY = touch.clientY;

                if (lastY !== null) {
                    offsetY = clientY - lastY;
                    speed = offsetY / self.containerHeight;

                    self.move(offsetY, true);
                }

                lastY = clientY;

                self.touchstartmove = true;
            };

            /**
             * 触摸移动结束
             * @param {event} 事件对象
             * @returns none
             */
            var touchend = function touchend(e) {
                self.container.removeEventListener('touchmove', touchmove);
                self.container.removeEventListener('touchend', touchend);

                lastY = null;

                if (self.touchstartmove === true) {
                    if (speed && Math.abs(speed) > 0.1) {
                        self.scroll(speed);
                    } else {
                        self.keepSnap();

                        if (self.onChange && typeof self.onChange === 'function') {
                            self.onChange(self.getData());
                        }
                    }
                }

                speed = 0;
            };

            this.container.addEventListener('touchstart', function (e) {
                e.preventDefault();

                var touch = e.touches[0];

                lastY = startY = touch.clientY;

                self.container.addEventListener('touchmove', touchmove);
                self.container.addEventListener('touchend', touchend);

                if (self.transitObj) {
                    self.transitObj.stop();
                }

                self.touchstartmove = false;
            });

            this.wrapper.style.transform = 'translateY(0) translateZ(0)';
            this.wrapper.style.webkitTransform = 'translateY(0) translateZ(0)';
        }

        /**
         * 滚动位移
         * @param {number} 速度        
         * @returns none
         */

    }, {
        key: 'scroll',
        value: function scroll(speed) {
            var offset = speed * this.snapHeight * this.snapNumber;
            var destination = this.currMove + offset;

            offset = parseInt(destination / this.snapHeight) * this.snapHeight - this.currMove;

            var min = this.getMin();
            var max = this.getMax();

            var duration = Math.abs(speed * this.snapNumber * this.snapHeight);

            if (this.transitObj && this.transitObj.transiting) {
                this.transitObj.stop();
            }

            // 移除节点激活状态
            this.$snaps.removeClass('ui-picker-selected');
            this.transiting = true;

            var self = this;

            this.transitObj = (0, _transit2.default)({
                step: function step(coe, per) {
                    var _offset = offset * coe;
                    var _destination = self.currMove + offset;

                    if ((_destination > min || _destination < max) && self.transitObj) {
                        self.transitObj.stop();
                    } else {
                        self.move(_offset, true);
                    }
                },
                duration: duration,
                easing: 'easeOutQuad'
            }).then(function () {
                self.keepSnap();
                self.transiting = false;

                if (self.onChange && typeof self.onChange === 'function') {
                    self.onChange(self.getData());
                }
            });
        }

        /**
         * 栅格变化
         * @param {number} 移动之前的值 
         * @returns none
         */

    }, {
        key: 'snapChange',
        value: function snapChange() {
            var currIdx = this.getActiveItemIdx();
            var item = this.$snaps.get(currIdx);

            this.$snaps.removeClass('ui-picker-selected');
            $(item).addClass('ui-picker-selected');
        }

        /**
         * 获取当前激活项下标
         * @returns {number} 当前栅格所在位置
         */

    }, {
        key: 'getActiveItemIdx',
        value: function getActiveItemIdx() {
            var currIdx = parseInt((this.snapHeight - this.currMove) / this.snapHeight);
            var remainder = (this.snapHeight - this.currMove) % this.snapHeight;

            if (currIdx < 0) {
                return 0;
            } else {
                if (remainder > this.snapHeight / 2) {
                    currIdx++;
                }

                if (currIdx + 1 > this.snapNumber) {
                    currIdx = this.snapNumber - 1;
                }

                return currIdx;
            }
        }

        /**
         * 框定栅格
         * @returns none
         */

    }, {
        key: 'keepSnap',
        value: function keepSnap() {
            var snapOffset = null;
            var isNegative = this.currMove < 0;

            snapOffset = Math.abs(this.currMove);
            snapOffset = parseInt(snapOffset / this.snapHeight) + (snapOffset % this.snapHeight >= this.snapHeight / 2 ? 1 : 0);
            snapOffset = snapOffset * this.snapHeight;

            if (isNegative) {
                snapOffset = -snapOffset;
            }

            var min = this.getMin();
            var max = this.getMax();

            if (snapOffset > min) {
                snapOffset = min;
            } else if (snapOffset < max) {
                snapOffset = max;
            }

            this.move(snapOffset, false);
        }

        /**
         * 获取子项数量
         * @returns {number} 子项数量
         */

    }, {
        key: 'getSnapNumber',
        value: function getSnapNumber() {
            return this.wrapper.children.length;
        }

        /**
         * 获取容器高度
         * @returns {number} 容器高度
         */

    }, {
        key: 'getContainerHeight',
        value: function getContainerHeight() {
            return this.container.offsetHeight;
        }

        /**
         * 获取项高度
         * @returns {number} 子项高度
         */

    }, {
        key: 'getSnapHeight',
        value: function getSnapHeight() {
            return this.wrapper.offsetHeight / this.wrapper.children.length;
        }

        /**
         * 获取子项
         * @returns {jquery} 子项的jquery对象
         */

    }, {
        key: 'getSnaps',
        value: function getSnaps() {
            return $(this.wrapper.children);
        }

        /**
         * 获取下边界
         * @returns {number} 上边界
         */

    }, {
        key: 'getMax',
        value: function getMax() {
            return this.snapHeight - (this.snapNumber - 1) * this.snapHeight;
        }

        /**
         * 获取上边界
         * @returns {number} 下边界
         */

    }, {
        key: 'getMin',
        value: function getMin() {
            return this.getSnapHeight();
        }

        /**
         * 移动
         * @param {number} 位移值
         * @param {boolean} 是否是当前位移的偏移量
         * @returns none
         */

    }, {
        key: 'move',
        value: function move(value, isOffset) {
            if (isOffset) {
                this.currMove += value;
            } else {
                this.currMove = value;
            }

            this.wrapper.style.transform = 'translateY(' + (this.currMove + 'px') + ') translateZ(0)';
            this.wrapper.style.webkitTransform = 'translateY(' + (this.currMove + 'px') + ') translateZ(0)';
            this.snapChange();
        }

        /**
         * 滚动至一个节点(snap)
         * @param {number} 节点下标
         * @returns none
         */

    }, {
        key: 'scrollTo',
        value: function scrollTo(idx) {
            this.move((idx - 1) * -50, false);
        }

        /**
         * 获取当前选中值
         * @returns none
         */

    }, {
        key: 'getValue',
        value: function getValue() {
            return this.getData().value;
        }

        /**
         * 获取当前选中对象
         * @returns {object} 当前选中对象
         */

    }, {
        key: 'getData',
        value: function getData() {
            var currIdx = this.getActiveItemIdx();
            var activeItem = $(this.$snaps.get(currIdx));

            return {
                text: activeItem.html(),
                value: activeItem.data('picker-value')
            };
        }

        /**
         * html 产生变化
         * @returns {object} 当前选中对象
         */

    }, {
        key: 'htmlChange',
        value: function htmlChange(wrapper) {
            if (wrapper) {
                this.wrapper = wrapper;
            }

            this.$snaps = this.getSnaps();
            this.containerHeight = this.getContainerHeight();
            this.snapHeight = this.getSnapHeight();
            this.snapNumber = this.getSnapNumber();
        }
    }]);

    return Scroller;
}();

exports.default = Scroller;
;
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(0)))

/***/ }),
/* 7 */
/***/ (function(module, exports) {

module.exports = "<div class=\"ui-modal-inner alert\">\r\n    <h4 class=\"ui-modal-message\" data-role=\"message\"></h4>\r\n    <div class=\"ui-modal-footer\">\r\n        <a href=\"javascript:void(0);\" \r\n           class=\"ui-btn ui-btn-info\"\r\n           data-role=\"confirm\">确定</a>\r\n    </div>\r\n</div>";

/***/ }),
/* 8 */
/***/ (function(module, exports) {

module.exports = "<div class=\"ui-modal-inner confirm\">\r\n    <h4 class=\"ui-overlay-message\" data-role=\"message\"></h4>\r\n    <div class=\"ui-modal-footer\">\r\n        <a href=\"javascript:void(0);\"\r\n           class=\"ui-btn ui-btn-info\"\r\n           data-role=\"confirm\">确定</a>\r\n        <a href=\"javascript:void(0);\" \r\n           class=\"ui-btn ui-btn-info\"\r\n           data-role=\"close\">取消</a>\r\n    </div>\r\n</div>";

/***/ }),
/* 9 */
/***/ (function(module, exports) {

module.exports = "<div class=\"ui-picker\">\r\n    <div class=\"ui-picker-center-highlight\"></div>\r\n    <% for ( var i = 0; i < cols.length; i++ ) { %>\r\n    <div class=\"ui-picker-items-col ui-picker-items-col-center\" <% if (cols[i].disabled) { %>data-disabled=\"disabled\"<% } %>>\r\n        <ul class=\"ui-picker-items-col-wrapper\">\r\n            <% for ( var j = 0; j < cols[i].rows.length; j++ ) { %>\r\n            <li class=\"ui-picker-item\" data-picker-value=\"<%=cols[i].rows[j].value%>\"><%=cols[i].rows[j].text%></li>\r\n            <% } %>\r\n        </ul>\r\n    </div>\r\n    <% } %>\r\n</div>";

/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * 动画
 * @author MulberryX
 */

var vendors = ['webkit', 'moz'];

for (var i = 0; i < vendors.length && !window.requestAnimationFrame; i++) {
    window.requestAnimationFrame = window[vendors[i] + 'RequestAnimationFrame'];
    window.cancelAnimationFrame = window[vendors[i] + 'CancelAnimationFrame'] || window[vendors[i] + 'CancelRequestAnimationFrame'];
}

/**
 * 动画
 * @class
 */

var AnimationFrame = function () {
    /**
     * 构造函数
     * @constructor
     */
    function AnimationFrame() {
        _classCallCheck(this, AnimationFrame);

        this.lastTime = 0;
        this.timer = null;

        if (!window.requestAnimationFrame) {
            this.request = function (action) {
                var currTime = new Date().getTime();
                var timeToCall = Math.max(0, 16.667 - (currTime - this.lastTime));

                this.timer = window.setTimeout(function () {
                    action();
                }, timeToCall);

                this.lastTime = currTime + timeToCall;
            };

            this.cancel = function () {
                clearTimeout(this.timer);
            };
        } else {
            this.request = function (action) {
                this.timer = window.requestAnimationFrame(action);
            };

            this.cancel = function () {
                window.cancelAnimationFrame(this.timer);
            };
        }
    }

    /**
     * 执行动画
     * @param { function } 动画行为
     * @returns none
     */


    _createClass(AnimationFrame, [{
        key: 'request',
        value: function request(action) {}

        /**
         * 取消
         * @returns none
         */

    }, {
        key: 'cancel',
        value: function cancel() {}
    }]);

    return AnimationFrame;
}();

exports.default = AnimationFrame;

/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * 渐进过程
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * @author MulberryX
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      */

exports.default = function (opt) {
    return new Transit(opt).start();
};

var _animation = __webpack_require__(10);

var _animation2 = _interopRequireDefault(_animation);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// 渐进过程的描述函数
var easing = {
    linear: function linear(p) {
        return p;
    },
    swing: function swing(p) {
        return 0.5 - Math.cos(p * Math.PI) / 2;
    }
};

// 运动描述函数
var baseEasings = {
    Sine: function Sine(p) {
        return 1 - Math.cos(p * Math.PI / 2);
    },
    Circ: function Circ(p) {
        return 1 - Math.sqrt(1 - p * p);
    },
    Elastic: function Elastic(p) {
        return p === 0 || p === 1 ? p : -Math.pow(2, 8 * (p - 1)) * Math.sin(((p - 1) * 80 - 7.5) * Math.PI / 15);
    },
    Back: function Back(p) {
        return p * p * (3 * p - 2);
    },
    Bounce: function Bounce(p) {
        var pow2,
            bounce = 4;

        while (p < ((pow2 = Math.pow(2, --bounce)) - 1) / 11) {}
        return 1 / Math.pow(4, 3 - bounce) - 7.5625 * Math.pow((pow2 * 3 - 2) / 22 - p, 2);
    }
};

// 部分基础easing生成
var grades = ["Quad", "Cubic", "Quart", "Quint", "Expo"];

for (var i = 0, len = grades.length; i < len; i++) {
    var grade = grades[i];

    baseEasings[grade] = function (p) {
        return Math.pow(p, i + 2);
    };
}

// 根据基础easing生成easing
for (var name in baseEasings) {
    var build = function build() {
        var easeIn = baseEasings[name];

        easing["easeIn" + name] = easeIn;

        easing["easeOut" + name] = function (p) {
            return 1 - easeIn(1 - p);
        };

        easing["easeInOut" + name] = function (p) {
            return p < 0.5 ? easeIn(p * 2) / 2 : 1 - easeIn(p * -2 + 2) / 2;
        };
    };

    build();
}

window.easing = easing;

/**
 * 渐变
 * @class
 */

var Transit = function () {
    /**
     * 构造函数
     * @constructor
     * @param { object } 配置对象
     */
    function Transit(opt) {
        _classCallCheck(this, Transit);

        this.easing = easing[opt.easing];
        this.duration = opt.duration;
        this.step = opt.step;

        this.success = null;
        this.error = null;
        this.percentage = 0;
        this.coefficient = 0;

        this.ins = 16.7 / this.duration;
        this.animationFrame = new _animation2.default();

        this.state = 'pending'; // fulfilled; pending; rejected; settled;

        this.transiting = false;

        this.action = function () {
            this.step(this.coefficient, this.percentage);
        };
    }

    /**
     * 递归
     * @returns none
     */


    _createClass(Transit, [{
        key: "recursion",
        value: function recursion() {
            var self = this;

            var _run = function _run() {
                var last = self.percentage;

                self.percentage = Math.min(1, self.percentage + self.ins);
                self.coefficient = self.easing(self.percentage) - self.easing(last);

                try {
                    self.action();
                } catch (e) {
                    self.state = 'rejected';
                    self.animationFrame.cancel();
                    self.transiting = false;

                    if (self.error && typeof self.error === 'function') {
                        self.error(e);
                    }
                }

                if (self.percentage <= 1 && self.transiting) {
                    self.animationFrame.request(_run);

                    if (self.percentage === 1) {
                        self.stop();
                    }
                }
            };

            _run();
        }

        /**
         * 重新开始
         * @returns { Transit } 当前实例
         */

    }, {
        key: "restart",
        value: function restart() {
            return this.start();
        }

        /**
         * 开始渐变
         * @returns { Transit } 当前实例
         */

    }, {
        key: "start",
        value: function start() {
            if (this.state === 'pending') {
                this.transiting = true;

                var self = this;

                setTimeout(function () {
                    self.recursion();
                });
            }

            return this;
        }

        /**
         * 停止
         * @returns { Transit } 当前实例
         */

    }, {
        key: "stop",
        value: function stop() {
            if (this.state === 'pending') {
                this.animationFrame.cancel();
                this.transiting = false;

                if (this.success) {
                    this.success();
                    this.state = 'fulfilled';
                }
            }

            return this;
        }

        /**
         * 开始渐变
         * @param { function } 成功回调
         * @param { function } 失败回调
         * @return { transit } 当前实例
         */

    }, {
        key: "then",
        value: function then(success, error) {
            this.success = success;
            this.error = error;

            return this;
        }
    }]);

    return Transit;
}();

/**
 * 渐进函数
 * @param { object } 配置对象
 * - easing 使用的 easing 函数
 * - step 动画的每一步要执行的函数
 * - duration 持续的时间
 * @return none
 */

/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function($) {

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _tools = __webpack_require__(1);

var _tools2 = _interopRequireDefault(_tools);

var _const = __webpack_require__(13);

var _modal = __webpack_require__(3);

var _modal2 = _interopRequireDefault(_modal);

var _picker = __webpack_require__(4);

var _picker2 = _interopRequireDefault(_picker);

var _calendar = __webpack_require__(14);

var _calendar2 = _interopRequireDefault(_calendar);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/*
 * 默认配置
 */
var defaultConfig = {
    id: '', // 初始化容器
    defaultvalue: '', // 默认日期(时间戳，字符串，Date对象)
    min: '1970/01/01 00:00', // 最小值
    max: '2030/01/01 00:00', // 最大值
    displayformat: 'yyyy/MM/dd HH:mm', // 日期显示格式
    valueformat: 'yyyy/MM/dd HH:mm', // 日期值格式
    showtime: true, // 是否显示时分的选择
    onChange: function onChange(val) {
        console.log(val);
    }
};

/**
 * 滚动日期组件
 * @class
 * @options: {
        input: {element|string} 输入框对象或输入框id
        defaultvalue: {string} 默认值
        min: {string} 开始时间
        max: {string} 结束时间
        displayformat: {string} 日期显示格式
        valueformat: {string} 日期值格式
        onChange: {function} 值改变回调
   } 
 */

var Calendar = function () {

    /**
     * 构造函数
     * @constructor
     * @param {object} 配置对象
     */
    function Calendar(options) {
        _classCallCheck(this, Calendar);

        var _options = $.extend(true, {}, defaultConfig, options);

        if (_options.input) {
            if (typeof _options.input === 'string') {
                this.input = $('#' + _options.input);
            } else {
                this.input = $(_options.input);
            }
        } else {
            this.input = false;
        }

        this.value = _options.defaultvalue;
        this.min = _options.min;
        this.max = _options.max;
        this.showtime = options.showtime;

        this.displayformat = _options.displayformat.replace('hh', 'HH');
        this.valueformat = _options.valueformat.replace('hh', 'HH');

        this.onChange = _options.onChange;

        this.modal = null;
        this.picker = null;

        this.init();
    }

    /**
     * 初始化
     * @returns none
     */


    _createClass(Calendar, [{
        key: 'init',
        value: function init() {
            if (!this.value) {
                this.currentDate = new Date();
            } else {
                this.currentDate = this.toDate(this.value);
            }

            this.initData();
            this.initInput();
        }

        /**
         * 初始化输入框
         * @returns none
         */

    }, {
        key: 'initInput',
        value: function initInput() {
            if (!this.input) {
                return false;
            }

            var self = this;

            this.input.click(function () {
                self.open();
                self.input.blur();
            });

            this.input.attr('readonly', 'readonly');
        }

        /**
         * 初始化浮层组件
         * @returns none
         */

    }, {
        key: 'initModal',
        value: function initModal() {
            this.modal = new _modal2.default({
                mask: true,
                picker: true,
                close: false,
                content: _calendar2.default
            });
        }

        /**
         * 初始化选择组件
         * @returns none
         */

    }, {
        key: 'initPicker',
        value: function initPicker() {
            var self = this;

            var pickerContainer = this.modal.findElement('[data-role=picker]');
            var pickerCols = this.getPickerCols();

            this.picker = new _picker2.default({
                container: pickerContainer,
                cols: pickerCols,
                onChange: function onChange(val) {
                    self.valueChange(val);
                }
            });

            this.syncPickerValue();
        }

        /**
         * 初始化基础参数
         * @returns none
         */

    }, {
        key: 'getPickerCols',
        value: function getPickerCols() {
            var cols = [];

            var year = this.currentDate.getFullYear(),
                month = this.currentDate.getMonth() + 1,
                date = this.currentDate.getDate(),
                day = this.currentDate.getDay(),
                hour = this.currentDate.getHours(),
                minute = this.currentDate.getMinutes();

            var beginYear = void 0,
                endYear = void 0,
                beginMonth = void 0,
                endMonth = void 0,
                beginDate = void 0,
                endDate = void 0,
                beginHour = void 0,
                endHour = void 0,
                beiginMinute = void 0,
                endMinute = void 0;

            if (this.valueformat.indexOf('yyyy') !== -1) {
                beginYear = this.getDate('yyyy', this._min);
                endYear = this.getDate('yyyy', this._max);

                var years = [];

                for (var i = beginYear; i <= endYear; i++) {
                    var text = i < 10 ? '0' + i : i;

                    years.push({
                        text: text,
                        value: i
                    });
                }

                cols.push({
                    rows: years
                });
            }

            if (this.valueformat.indexOf('MM') !== -1) {
                beginMonth = 1;
                endMonth = 12;

                if (year === beginYear) {
                    beginMonth = this.getDate('MM', this._min);
                }

                if (year === endYear) {
                    endMonth = this.getDate('MM', this._max);
                }

                var months = [];

                for (var i = beginMonth; i <= endMonth; i++) {
                    var _text = i < 10 ? '0' + i : i;

                    months.push({
                        text: _text,
                        value: i
                    });
                }

                cols.push({
                    rows: months
                });
            }

            if (this.valueformat.indexOf('dd') !== -1) {
                beginDate = 1;
                endDate = 31;

                if (month === 2) {
                    endDate = year % 4 ? 28 : 29;
                } else {
                    endDate = _const.LEEP_MONTH[month] ? 31 : 30;
                }

                if (beginYear === year && beginMonth === month) {
                    beginDate = this.getDate('dd', this._min);
                }

                if (endYear === year && endMonth === month) {
                    endDate = this.getDate('dd', this._max);
                }

                var dates = [];

                for (var i = beginDate; i <= endDate; i++) {
                    var _text2 = i < 10 ? '0' + i : i;

                    dates.push({
                        text: _text2,
                        value: i
                    });
                }

                cols.push({
                    rows: dates
                });
            }

            if (this.valueformat.indexOf('yyyy') !== -1 && this.valueformat.indexOf('MM') !== -1 && this.valueformat.indexOf('dd') !== -1) {
                var days = [];

                days.push({
                    text: '星期' + _const.WEEK_CN[day],
                    value: day
                });

                cols.push({
                    rows: days,
                    disabled: true
                });
            }

            if (this.valueformat.indexOf('HH') !== -1 && this.showtime) {
                beginHour = 0;
                endHour = 23;

                if (beginYear === year && beginMonth === month && beginDate === date) {
                    beginHour = this.getDate('HH', this._min);
                }

                if (endYear === year && endMonth === month && endDate === date) {
                    endHour = this.getDate('HH', this._max);
                }

                var hours = [];

                for (var i = beginHour; i <= endHour; i++) {
                    var _text3 = i < 10 ? '0' + i : i;

                    hours.push({
                        text: _text3,
                        value: i
                    });
                }

                cols.push({
                    rows: hours
                });
            }

            if (this.valueformat.indexOf('mm') !== -1 && this.showtime) {
                var beginMinutes = 0;
                var endMinutes = 59;

                if (beginYear === year && beginMonth === month && beginDate === date && beginHour === hour) {
                    beginMinutes = this.getDate('mm', this._min);
                }

                if (endYear === year && endMonth === month && endDate === date && endHour === hour) {
                    endMinutes = this.getDate('mm', this._max);
                }

                var minutes = [];

                for (var i = beginMinutes; i <= endMinutes; i++) {
                    var _text4 = i < 10 ? '0' + i : i;

                    minutes.push({
                        text: _text4,
                        value: i
                    });
                }

                cols.push({
                    rows: minutes
                });
            }

            return cols;
        }

        /**
         * 值变化
         * @param 新的值
         * @returns none
         */

    }, {
        key: 'valueChange',
        value: function valueChange(nv) {
            var _format = this.valueformat;
            var date = this.currentDate;
            var pickerVals = [];

            var o = {
                'y+': date.getFullYear(),
                'M+': date.getMonth() + 1,
                'd+': date.getDate(),
                'H+': date.getHours(),
                'm+': date.getMinutes(),
                's+': date.getSeconds()
            };

            var i = 0;

            for (var k in o) {
                if (new RegExp("(" + k + ")").test(_format)) {
                    o[k] = nv[i];
                    i++;

                    if (new RegExp(/y+/).test(_format) && new RegExp(/M+/).test(_format) && new RegExp(/d+/).test(_format) && k === 'd+') {
                        i++;
                    }
                }
            }

            this.currentDate = new Date(o['y+'], o['M+'] - 1, o['d+'], o['H+'], o['m+']);

            if (this.currentDate < this._min) {
                this.currentDate = this._min;
            }

            if (this.currentDate > this._max) {
                this.currentDate = this._max;
            }

            this.value = this.getFormatValue();

            this.syncView();

            if (this.onChange && _typeof(this.onChange)) {
                this.onChange(this.value);
            }
        }

        /**
         * 数据变化，触发同步
         * @returns none
         */

    }, {
        key: 'apply',
        value: function apply() {
            var currentDate = this.currentDate;

            this._min = this.toDate(this.min);
            this._max = this.toDate(this.max);

            if (currentDate < this._min) {
                currentDate = this._min;
            }

            if (currentDate > this._max) {
                currentDate = this._max;
            }

            if (currentDate !== this.currentDate) {
                this.currentDate = currentDate;
                this.value = this.getFormatValue();

                if (this.onChange && _typeof(this.onChange)) {
                    this.onChange(this.value);
                }
            }

            this.syncView();
        }

        /**
         * 数据同步至视图
         * @returns none
         */

    }, {
        key: 'syncView',
        value: function syncView() {
            if (this.input) {
                this.input.val(this.getFormatValue(this.displayformat));
            }

            if (this.picker) {
                this.picker.setCols(this.getPickerCols());
                this.syncPickerValue();
            }
        }

        /**
         * 初始化数据
         * @returns none
         */

    }, {
        key: 'initData',
        value: function initData() {
            this._min = this.toDate(this.min);
            this._max = this.toDate(this.max);

            if (this.currentDate < this._min) {
                this.currentDate = this._min;
            }

            if (this.currentDate > this._max) {
                this.currentDate = this._max;
            }

            this.value = this.getFormatValue();

            if (this.input) {
                this.input.val(this.getFormatValue(this.displayformat));
            }
        }

        /**
         * 将组件值同步至picker
         * @returns none
         */

    }, {
        key: 'syncPickerValue',
        value: function syncPickerValue() {
            var _format = this.valueformat;
            var date = this.currentDate;
            var pickerVals = [];

            var o = {
                'y+': date.getFullYear(),
                'M+': date.getMonth() + 1,
                'd+': date.getDate(),
                'H+': date.getHours(),
                'm+': date.getMinutes(),
                's+': date.getSeconds()
            };

            for (var k in o) {
                if (new RegExp(k).test(_format)) {
                    pickerVals.push(o[k]);
                }
            }

            if (new RegExp(/y+/).test(_format) && new RegExp(/M+/).test(_format) && new RegExp(/d+/).test(_format)) {
                pickerVals = _tools2.default.insert(pickerVals, date.getDay(), 3);
            }

            this.picker.setValue(pickerVals);
        }

        /**
         * 设置限制开始值
         * @param {number|string} 时间戳 | 符合格式的字符串
         * @returns none
         */

    }, {
        key: 'setMin',
        value: function setMin(min) {
            this.min = min;
            this.apply();
        }

        /**
         * 设置限制结束值
         * @param {number|string} 时间戳 | 符合格式的字符串
         * @returns none
         */

    }, {
        key: 'setMax',
        value: function setMax(max) {
            this.max = max;
            this.apply();
        }

        /**
         * 设置当前选择下标
         * @param {string} 当前值
         * @returns none
         */

    }, {
        key: 'setValue',
        value: function setValue(val) {
            this.value = val;
            this.currentDate = this.toDate(this.value);

            if (this.picker) {
                this.syncPickerValue();
            }

            if (this.onChange && _typeof(this.onChange)) {
                this.onChange(this.value);
            }

            this.apply();
        }

        /**
         * 获取当前选中值
         * @returns none
         */

    }, {
        key: 'getValue',
        value: function getValue() {
            return this.value;
        }

        /**
         * 获取日期（年|月 ..）的值
         * @param {string} 年月日的正则
         * @param {date} 日期
         * @returns none
         */

    }, {
        key: 'getDate',
        value: function getDate(name, date) {
            if (!(date instanceof Date)) {
                date = this.toDate(date);
            }

            var val = void 0;

            switch (name) {
                case 'yyyy':
                    val = date.getFullYear();
                    break;
                case 'MM':
                    val = date.getMonth() + 1;
                    break;
                case 'dd':
                    val = date.getDate();
                    break;
                case 'day':
                    val = date.getDay();
                    break;
                case 'HH':
                    val = date.getHours();
                    break;
                case 'mm':
                    val = date.getMinutes();
                    break;
            }

            return val;
        }

        /**
         * 格式化当前日期
         * @param {string} 日期格式
         * @returns {string} 格式化后的日期
         */

    }, {
        key: 'getFormatValue',
        value: function getFormatValue(format) {
            var _format = format || this.valueformat;
            var date = this.currentDate;

            var o = {
                'y+': date.getFullYear(),
                'M+': date.getMonth() + 1,
                'd+': date.getDate(),
                'H+': date.getHours(),
                'h+': date.getHours(),
                'm+': date.getMinutes(),
                's+': date.getSeconds()
            };

            for (var k in o) {
                if (new RegExp('(' + k + ')').test(_format)) {
                    var val = o[k];

                    if (k !== 'y+') {
                        _format = _format.replace(RegExp.$1, RegExp.$1.length == 1 ? val : ('00' + val).substr(('' + val).length));
                    } else {
                        _format = _format.replace(RegExp.$1, val);
                    }
                }
            }

            return _format;
        }

        /**
         * 字符串转日期对象
         * @param {string} 被转换的字符串
         * @returns none
         */

    }, {
        key: 'toDate',
        value: function toDate(str) {
            var reg = /^(\d{4})[-\/]((0?[1-9])|(1[0-2]))([-\/](([0-2]?[1-9])|31)([\sT](([0-1]?[0-9])|(2[0-3]))(:([0-5]?[0-9])(:([0-5]?[0-9]))?)?)?)?$/;
            var reg1 = /^(\d{4})[-\/]((0?[1-9])|(1[0-2]))([-\/](([0-2]?[1-9])|31))?$/;
            var reg2 = /^(([0-1]?[0-9])|(2[0-3]))(:([0-5]?[0-9])(:([0-5]?[0-9]))?)?$/;

            var today = new Date();

            if (reg.test(str)) {
                var arr = str.split(/[\sT]/);
                var date = arr[0];
                var time = arr[1];

                var _arr = date.split(/[\/-]/);

                if (!reg1.test(date)) {
                    _arr.push('01');
                }

                var _str = _arr.join('\/');

                if (time && reg2.test(time)) {
                    var __arr = time.split(/:/);

                    for (var i = 0, len = 3; i < len; i++) {
                        __arr[i] = __arr[i] || '00';
                    }

                    _str += ' ';
                    _str += __arr.join(':');
                }

                return new Date(_str);
            } else {
                return new Date();
            }
        }

        /**
         * 打开日期选择组件
         * @returns none
         */

    }, {
        key: 'open',
        value: function open() {
            if (!this.modal) {
                this.initModal();
                this.initPicker();
            }

            this.modal.open();
        }
    }]);

    return Calendar;
}();

/**
 * 添加控件值变更监听
 * @param {object} 日期控件配置
 * @returns {datepicker} 日期选择控件
 */


Calendar.create = function (options) {
    return new Calendar(options);
};

exports.default = Calendar;
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(0)))

/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
// 星期月份的中文
var WEEK_CN = exports.WEEK_CN = ['日', '一', '二', '三', '四', '五', '六'];
var NUMBER_CN = exports.NUMBER_CN = ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十', '十一', '十二'];

// 月份的大小
var LEEP_MONTH = exports.LEEP_MONTH = {
    1: true,
    2: false,
    3: true,
    4: false,
    5: true,
    6: false,
    7: true,
    8: true,
    9: false,
    10: true,
    11: false,
    12: true
};

var DATE_UNITS = exports.DATE_UNITS = {
    yyyy: '年',
    MM: '月',
    dd: '日',
    week: '星期',
    HH: '时',
    mm: '分',
    ss: '秒'
};

// 时间的边界
var NATURE_LIMITS = exports.NATURE_LIMITS = {
    yyyy: [false, false],
    MM: [1, 12],
    dd: [1, 12],
    HH: [0, 23],
    mm: [0, 59],
    ss: [0, 59]
};

/***/ }),
/* 14 */
/***/ (function(module, exports) {

module.exports = "<div class=\"ui-modal-inner ui-calendar\">\r\n    <header class=\"ui-bar ui-bar-nav\">      \r\n        <a class=\"link\" data-role=\"close\">确定</a> \r\n        <h1 class=\"title\">请选择</h1>      \r\n    </header>\r\n    <div class=\"ui-modal-picker\" \r\n         data-role=\"picker\"></div>\r\n</div>";

/***/ })
],[12]);
});