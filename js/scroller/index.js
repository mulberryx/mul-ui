/**
 * 拖拽滚动
 */

import transit from '../common/transit';

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
export default class Scroller {
    /**
     * 构造函数
     * @constructor
     * @param {object} 配置对象
     */
    constructor (options) {
        this.container = options.container;

        this.snap = options.snap;
        this.wrapper = options.wrapper;
        this.onChange = options.onChange;
        this.$snaps = null;

        this.currMove = 0;

        this.init();
    }

    /**
     * 初始化
     * @returns none
     */
    init () {
        this.$snaps = this.getSnaps();

        this.containerHeight = this.getContainerHeight();
        this.snapHeight = this.getSnapHeight();
        this.snapNumber = this.getSnapNumber();

        let self = this;

        let lastY = null;
        let distanceY = null;

        let speed = null;

        /**
         * 触摸移动
         * @param {event} 事件对象
         * @returns none
         */
        let touchmove = function (e) {
            let touch = e.touches[0];
            let clientY = touch.clientY;

            if(lastY !== null) {
                distanceY = clientY - lastY;
                speed = distanceY / this.containerHeight;

                self.move(distanceY, true);
            }

            lastY = clientY;
        };

        /**
         * 触摸移动结束
         * @param {event} 事件对象
         * @returns none
         */
        let touchend = function (e) {
            self.container.removeEventListener('touchmove', touchmove);
            self.container.removeEventListener('touchend', touchend);

            lastY = null;

            if(speed && Math.abs(speed) > 0.1) {
                let snapHeight = 50;
                let distance = speed * snapHeight * self.snapNumber;

                self.scroll(distance, true, speed);
            } else {
                self.keepSnap();

                if (self.onChange && typeof self.onChange === 'function') {
                    self.onChange(self.getData());
                }                
            }

            speed = 0;
        };

        this.container.addEventListener('touchstart', function (e) {
            e.preventDefault();

            let touch = e.touches[0];

            lastY = touch.clientY;

            self.container.addEventListener('touchmove', touchmove);
            self.container.addEventListener('touchend', touchend);  
        });
    }    

    /**
     * 滚动位移
     * @param {number} 位移
     * @param {number} 速度        
     * @returns none
     */
    scroll (offset, transition, speed) {
        let currMove = this.currMove + offset;
        let destination = this.getSnapValue(currMove, false);

        let min = this.getMin();
        let max = this.getMax();

        let duration = Math.abs(destination * speed) * this.snapNumber;

        if (this.transitObj && this.transitObj.transiting) {
            this.transitObj.stop();
        }

        // 移除节点激活状态
        this.$snaps.removeClass('ui-picker-selected');

        let self = this;

        this.transitObj = transit({
            step: function (coe, per) {
                let offset = self.currMove + destination * coe;

                if((offset > min || offset < max) && self.transitObj) {
                    self.transitObj.stop();
                } else {
                    self.move(offset, true);

                    if (per >= 1 || coe < 0.0001) {
                        self.transitObj.stop();
                    }
                }
            },            
            duration: duration, 
            easing: 'easeOutQuad'
        }).then(function () {
            self.keepSnap();

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
    snapChange () {
        let currIdx = this.getActiveItemIdx();
        let item = this.$snaps.get(currIdx);

        this.$snaps.removeClass('ui-picker-selected');
        $(item).addClass('ui-picker-selected');
    }

    /**
     * 获取当前激活项下标
     * @returns {number} 当前栅格所在位置
     */
    getActiveItemIdx () { 
        let currIdx = parseInt((this.snapHeight - this.currMove) / this.snapHeight);
        let remainder = (this.snapHeight - this.currMove) % this.snapHeight;

        if (currIdx < 0) {
            return 0;
        } else {
            if (remainder > this.snapHeight / 2) {
                currIdx ++;
            }           

            return currIdx;
        }
    }

    /**
     * 框定栅格
     * @returns none
     */
    keepSnap () {
        let snapOffset = null;
        let isNegative = this.currMove < 0;

        snapOffset = Math.abs(this.currMove);
        snapOffset = parseInt(snapOffset / this.snapHeight) + (snapOffset % this.snapHeight >= this.snapHeight / 2 ? 1 : 0); 
        snapOffset = snapOffset * this.snapHeight;

        if (isNegative) {
            snapOffset = - snapOffset;
        }

        let min = this.getMin();
        let max = this.getMax();

        if(snapOffset > min) {
            snapOffset = min;
        } else if(snapOffset < max) {
            snapOffset = max;  
        }

        let offset = snapOffset - this.currMove;

        this.move(offset, false);        
    }

    /**
     * 获取子项数量
     * @returns {number} 子项数量
     */
    getSnapNumber () {
        return this.wrapper.children.length;
    }

    /**
     * 获取容器高度
     * @returns {number} 容器高度
     */
    getContainerHeight() {
        return this.container.offsetHeight;
    }

    /**
     * 获取项高度
     * @returns {number} 子项高度
     */
    getSnapHeight () {
        return this.wrapper.children[0].offsetHeight;
    }

    /**
     * 获取子项
     * @returns {jquery} 子项的jquery对象
     */
    getSnaps () {
        return $(this.wrapper.children);
    }

    /**
     * 获取下边界
     * @returns {number} 上边界
     */
    getMax () {
        return (this.snapHeight - (this.snapNumber - 1) * this.snapHeight);
    }

    /**
     * 获取上边界
     * @returns {number} 下边界
     */
    getMin () {
        return this.getSnapHeight();
    }

    /**
     * 移动
     * @param {number || undefined} 位移值
     * @returns none
     */
    move (offset) {
        this.currMove += offset;

        this.wrapper.style.transform = 'translateY(' + ( this.currMove + 'px' ) + ') translateZ(0px)';
        this.snapChange();
    }

    /**
     * 滚动至一个节点(snap)
     * @param {number} 节点下标
     * @returns none
     */
    scrollTo (idx) {
        this.move(( idx - 1 ) * -50, false);
    }

    /**
     * 获取当前选中值
     * @returns none
     */
    getValue () {
        return this.getData().value;
    }

    /**
     * 获取当前选中对象
     * @returns {object} 当前选中对象
     */
    getData () {
        let currIdx = this.getActiveItemIdx();
        let activeItem = $(this.$snaps.get(currIdx));

        return {
            text: activeItem.html(),
            value: activeItem.data('picker-value')
        };        
    }

    /**
     * html 产生变化
     * @returns {object} 当前选中对象
     */
    htmlChange (wrapper) {
        if (wrapper) {
            this.wrapper = wrapper;
        }

        this.$snaps = this.getSnaps();    
        this.containerHeight = this.getContainerHeight();
        this.snapHeight = this.getSnapHeight();
        this.snapNumber = this.getSnapNumber();
    }
};