/**
 * 动画
 * @author MulberryX
 */

let vendors = ['webkit', 'moz'];

for(let i = 0; i < vendors.length && !window.requestAnimationFrame; i ++) {
    window.requestAnimationFrame = window[vendors[i] + 'RequestAnimationFrame'];
    window.cancelAnimationFrame = window[vendors[i] + 'CancelAnimationFrame'] || window[vendors[i] + 'CancelRequestAnimationFrame'];
}

/**
 * 动画
 * @class
 */   
class AnimationFrame {
    /**
     * 构造函数
     * @constructor
     */      
    constructor () {
        this.lastTime = 0;
        this.timer = null;

        if (!window.requestAnimationFrame) {
            this.request = function (action) {
                let currTime = new Date().getTime();
                let timeToCall = Math.max(0, 16.667 - (currTime - this.lastTime));

                this.timer = window.setTimeout(function () {
                    action();
                }, timeToCall);

                this.lastTime = currTime + timeToCall;
            };
            

            this.cancel = function() {
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
    request (action) {}

    /**
     * 取消
     * @returns none
     */  
    cancel () {}
}


export default AnimationFrame