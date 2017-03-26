/**
 * 可放置区域
 * @author Mulb
 */

define(['jquery', 'tools'], function (jquery, tools) {
    /**
     * 可放置区域
     * @constructor
     * @param { object } 配置项
     * @options: 
     *      ele {element} 区域元素
     *      handleDrop {function} 区域内放下
     *      handleDroppable {function} 判断是否可放置
     *      handleRemovable {function} 判断是否移出时删除元素
     * @param {string} 可放置区域标识
     */   
    var Drop = function (options, identifier) {
        this.jq_ele = options.ele;

        /**
         * 添加一个子组件
         * @param {object} 拖拽对象的配置
         * @param {number} 组件放下的位置        
         * @return none
         */   
        this.handleDrop = function (data) {
            options.handleDrop(data, this.getDropIdx(), this.identifier);
        };

        this.handleDroppable = options.handleDroppable;
        this.handleRemovable = options.handleRemovable;

        this.identifier = identifier;

        this.jq_dashedframe = null;

        this.fakeIdx = -1;
        this.active = false;

        this.init();
    };

    Drop.prototype = {
        /**
         * 判断元素是否在区域内
         * @param {object} 鼠标当前位移
         * @param {object} 拖拽对象的数据 
         * @return none
         */        
        init: function () {
            this.jq_ele.attr('data-role', 'drop');
        },
        /**
         * 判断元素是否在区域内
         * @param {object} 鼠标当前位移
         * @param {object} 拖拽对象的数据 
         * @return none
         */           
        inZone: function (offset, data) {
            var height = this.jq_ele.outerHeight();
            var width = this.jq_ele.outerWidth();

            var _offset = this.jq_ele.offset();



            var zone = {
                left: _offset.left,
                top: _offset.top,
                right: _offset.left + width,
                bottom: _offset.top + height
            };

            if (zone.left <= offset.left && zone.top <= offset.top && zone.right >= offset.left && zone.bottom >= offset.top) {
                if (this.handleDroppable(data)) {
                    return true;
                } else {
                    return false;
                }
            } else {
                if (this.handleRemovable(data)) {
                    this.removeDashedFrame();
                    return false;
                } else {
                    return true;
                }
            }
        },

        /**
         * 加入虚线框
         * @param {object} 鼠标当前位移
         * @return none
         */   
        createDashedFrame: function (offset) {
            var self = this;

            var fakeIdx = this.fakeIdx;
            var children = this.jq_ele.children();

            if (!this.jq_dashedframe) {
                this.jq_dashedframe = $('<div class="prompt-box" data-role="drop-indicator"></div>');
            }

            if (children.length === 0) {
                this.fakeIdx = 0;
            }

            children.each(function (idx, item) {
                var $item = $(item);
                var role = $item.data('role');

                var height = $item.outerHeight();
                var width = $item.outerWidth();

                var _offset = $item.offset();

                var zone = {
                    left: _offset.left,
                    top: _offset.top,
                    right: _offset.left + width,
                    bottom: _offset.top + height
                };

                if (offset.left >= zone.left && offset.top >= zone.top && offset.top <= zone.bottom && offset.left <= zone.right) {
                    if ((offset.top - zone.top) <= height / 2) {
                        self.fakeIdx = idx;
                    } else {
                        if (role === 'drop-indicator') {
                            self.fakeIdx = idx;
                        } else {
                            self.fakeIdx = idx  + 1;
                        }
                    }
                }
            });

            if (this.fakeIdx === -1) {
                this.fakeIdx = children.length;
            }

            if (this.fakeIdx === 0) {
                this.jq_ele.prepend(this.jq_dashedframe);
            } else if (this.fakeIdx === children.length) {
                this.jq_ele.append(this.jq_dashedframe);
            } else {
                $(children.get(this.fakeIdx)).before(this.jq_dashedframe);
            }
        },

        /**
         * 移除虚线框
         * @return none
         */   
        removeDashedFrame: function () {
            if (this.jq_dashedframe) {
                this.fakeIdx = -1;
                this.jq_dashedframe.remove();
            }
        },

        /**
         * 获取位置顺序
         * @param {object} 当前鼠标位移
         * @return {number} 位置顺序
         */   
        getDropIdx: function () {
            if (this.fakeIdx > this.jq_dashedframe.index()) {
                return -- this.fakeIdx;
            } else {
                return this.fakeIdx;
            }

            return this.fakeIdx;
        },

        /**
         * 获取位置顺序
         * @return {object} 虚线框大小
         */  
        getDashedFrameSize: function () {
            return {
                height: this.jq_dashedframe.outerHeight(),
                width: this.jq_dashedframe.outerWidth()
            };
        }
    };

    /**
     * 初始化拖放对象
     * @param {object} 放下对象的可配置项
     * @param {string} 可放置区域标识
     * @return none
     */   
    $.fn.drop = function (options, identifier) {
        this.each(function (idx, ele){
            var _options = {
                ele: jquery(ele),
                handleDrop: options.handleDrop,
                handleDroppable: options.handleDroppable,
                handleRemovable: options.handleRemovable
            };

            Drop.dropObj.push(new Drop(_options, identifier));
        });
    };

    Drop.dropObj = [];

    return Drop;
});