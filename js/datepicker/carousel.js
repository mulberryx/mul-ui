/**
 * 基础数据
 */

import transit from '../common/transit';

"use strict";

/**
 * 选择木马
 * @Class
 */
export default class Carousel {
    /**
     * 构造函数
     * @constructor
     * @param {object} 配置对象
     */
    constructor (options) {
        this.snap = options.snap;

        this.wrapper = options.wrapper;
        this.container = options.container;

        this.onScrollEnd = options.onScrollEnd;
        this.onSnapChange = options.onSnapChange;

        this.snapHeight = this.container.children[0].offsetHeight || 50;

        this.currMove = options.currMove || 0;
        this.currSnapIdx = (this.snapHeight - this.currMove) / this.snapHeight;

        this.realitySnapNumber = options.realitySnapNumber;
        this.onBeforeScroll = options.onBeforeScroll;

        this.activeItemNum = 5;

        this.init();
    }

    /**
     * 初始化
     * @return none
     */
    init () {

        let _this = this;

        let lastY = null;
        let distanceY = null;

        let speed = null;

        let touchmove = function (e) {
            let touch = e.touches[0];

            let clientY = touch.clientY;

            if(lastY !== null) {
                distanceY = clientY - lastY;
                let _speed = distanceY / _this.wrapper.offsetHeight || 50;

                speed = _speed ? _speed : speed;

                _this.scroll(distanceY, false);   
            }

            lastY = clientY;
        };

        let touchend = function () {
            _this.wrapper.removeEventListener('touchmove', touchmove);
            _this.wrapper.removeEventListener('touchend', touchend);

            lastY = null;

            if(speed && Math.abs(speed) > 0.1) {
                let snapHeight = _this.container.children[0].offsetHeight || 50;
                let distance = speed * snapHeight * _this.realitySnapNumber;

                _this.scroll(distance, true, speed);
            } else {
                if(_this.onScrollEnd && typeof _this.onScrollEnd === 'function') {
                    _this.keepSnap();

                    let idx = (_this.snapHeight - _this.currMove) / _this.snapHeight;

                    _this.onScrollEnd(idx);
                }                  
            }

            speed = 0;
        };

        this.wrapper.addEventListener('touchstart', function (e) {
            e.preventDefault();

            let touch = e.touches[0];

            lastY = touch.clientY;

            _this.wrapper.addEventListener('touchmove', touchmove);
            _this.wrapper.addEventListener('touchend', touchend);  
        });
    }    

    /**
     * 滚动位移
     * @param {number} 位移
     * @param {number} 过渡的速度
     * @param {boolean} 是否过渡        
     * @return none
     */
    scroll (offset, transition, speed) {
        let container_height = this.container.offsetHeight || 50;
        let currMove = this.currMove + offset;

        let snap_height = this.container.children[0].offsetHeight || 50;
        let snap_num = this.container.children.length;

        if(!transition) {
            this.move(currMove, true);
        } else {        
            let self = this;

            let activeItemNum = this.activeItemNum;
            let firstItemOffset = this.getFirstItemOffset();
            let destination = this.getSnapValue(currMove, false);

            let min = snap_height;
            let max = - ( activeItemNum - firstItemOffset ) * snap_height;

            let duration =  Math.abs( destination * speed ) * activeItemNum;

            if (this.transitObj && this.transitObj.transiting) {
                this.transitObj.stop();
            }

            // 移除节点激活状态
            this.onBeforeScroll();

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
                if (self.onScrollEnd && typeof self.onScrollEnd === 'function') {
                    self.keepSnap();
                    
                    self.currSnapIdx = ( self.snapHeight - self.currMove ) / self.snapHeight;
                    self.onScrollEnd(self.currSnapIdx);
                }
            });
        }
    }    

    /**
     * 移动
     * @param {number||undefined} 位移值
     * @param {boolean} 是否处理栅格变化 
     * @return none
     */
    move (distance, snapChange) {
        let _distance;
        let currMove = this.currMove;

        if(distance !== undefined) {
            _distance = Math.abs(this.currMove - distance);
        }

        this.currMove = distance !== undefined ?  distance : this.currMove;
        this.container.style.transform = 'translateY(' + ( this.currMove + 'px' ) + ') translateZ(0px)';

        if(snapChange && _distance) {
            this.snapChange(currMove);
        }
    }

    /**
     * 栅格变化
     * @param {number} 移动之前的值 
     * @return none
     */
    snapChange (currMove) {
        let idx = this.calculateSnap(currMove);

        if(idx !== false) {
            let sanpChange = this.onSnapChange(idx, this.currMove - currMove);

            if(sanpChange) {
                this.container.style.transform = 'translateY(' + ( - this.snapHeight + 'px' ) + ') translateZ(0px)';
                this.currMove = - this.snapHeight;
                this.currSnapIdx = (this.snapHeight + this.snapHeight) / this.snapHeight;
            }
        }        
    }

    /**
     * 检查栅格变化
     * @param {number} 移动之前的值 
     * @return {number} 当前栅格所在位置
     */
    calculateSnap (_currMove) { 
        let currSnapIdx = (this.snapHeight - this.currMove) / this.snapHeight;

        let offset = this.currMove - _currMove;
        let _offset = Math.abs(offset);

        let remainder = _currMove % this.snapHeight;
        let _remainder = Math.abs(remainder);

        let distance;

        if(currSnapIdx < 0) {
            return 0;
        } else {
            _currMove = this.currMove;

            if(offset < 0) {
                if(remainder <= 0) {
                    distance = this.snapHeight - _remainder;
                } else {
                    distance = _remainder;
                }

                if(distance > _offset) {
                    return false;
                } else {
                    _currMove += _offset - distance;
                    currSnapIdx = (this.snapHeight - _currMove) / this.snapHeight;
                }            
            } else if(offset > 0){
                if(remainder >= 0) {
                    distance = this.snapHeight - _remainder;
                } else {
                    distance = _remainder;
                }     
                
                if(distance <= _offset) {
                    _currMove -= _offset - distance;
                    currSnapIdx = (this.snapHeight - _currMove) / this.snapHeight;
                } else {
                    return false;
                }              
            } else {
                currSnapIdx = false;
            }

            let min = 0;
            let max = this.activeItemNum - 1;

            if(min > currSnapIdx || max < currSnapIdx ) {
                currSnapIdx = false;
            }

            if(currSnapIdx !== false) {
                if(this.currSnapIdx !== currSnapIdx) {
                    this.currSnapIdx = currSnapIdx;
                } else {
                    return false;
                }
            }

            return currSnapIdx;
        }
    }

    /**
     * 捕捉栅格
     * @return none
     */
    keepSnap () {
        this.currMove = this.getSnapValue(this.currMove, true);
        this.move(undefined, false);        
    }

    /**
     * 栅格化位移
     * @param {number} 原始位移
     * @param {boolean} 是否有边界过滤 
     * @return {number} 栅格化的位移
     */
    getSnapValue (offset, boundary) {
        let _offset = offset;
        let isNegative = offset < 0;

        _offset = Math.abs(offset);
        _offset = parseInt(_offset / this.snapHeight) + (_offset % this.snapHeight >= this.snapHeight / 2 ? 1 : 0); 
        _offset = _offset * this.snapHeight;

        if(isNegative) {
            _offset = - _offset;
        }

        let activeItemNum = this.activeItemNum;
        let firstItemOffset = this.getFirstItemOffset();
        let lastItemOffset = this.getLastItemOffset();
        let middleIndex = this.getMiddleIndex();

        if(boundary) {
            let min = this.snapHeight;
            let max = (this.snapHeight - (activeItemNum - 1) * this.snapHeight);

            if(_offset > min) {
                _offset = min;
            } else if(_offset < max) {
                _offset = max;  
            }
        }

        return _offset;
    }

    /**
     * 获取第一个节点的偏移量
     * @return {number} 第一个节点的偏移量
     */
    getFirstItemOffset () {
        return this.activeItemNum % 2 ? parseInt(this.activeItemNum / 2) : parseInt(this.activeItemNum / 2) - 1;
    }

    /**
     * 获取最后一个节点的偏移量
     * @return {number} 最后一个节点的偏移量
     */    
    getLastItemOffset () {
        return parseInt(this.activeItemNum / 2);        
    }

    /**
     * 获取最后一个节点的偏移量
     * @return {number} 最后一个节点的偏移量
     */
    getMiddleIndex () {
        return Math.ceil(this.activeItemNum / 2) - 1;
    }

    /**
     * 滚动至一个节点(snap)
     * @param {number} 节点下标
     * @return none
     */
    scrollTo (idx) {
        this.move(( idx - 1 ) * -50, false);
    }
};