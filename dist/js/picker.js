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
return webpackJsonp([4],[
/* 0 */,
/* 1 */,
/* 2 */,
/* 3 */,
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
/* 5 */,
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
/* 7 */,
/* 8 */,
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

/***/ })
],[4]);
});