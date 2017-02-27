/**
 * 渐进过程
 * @author MulberryX
 */

import AnimationFrame from '../common/animation-frame';

// 渐进过程的描述函数
let easing = {
    linear: function( p ) {
        return p;
    },
    swing: function( p ) {
        return 0.5 - Math.cos( p*Math.PI ) / 2;
    }
};

// 基础easing
let baseEasings = {
    Sine: function( p ) {
        return 1 - Math.cos( p * Math.PI / 2 );
    },
    Circ: function( p ) {
        return 1 - Math.sqrt( 1 - p * p );
    },
    Elastic: function( p ) {
        return p === 0 || p === 1 ? p :
            -Math.pow( 2, 8 * (p - 1) ) * Math.sin( ( (p - 1) * 80 - 7.5 ) * Math.PI / 15 );
    },
    Back: function( p ) {
        return p * p * ( 3 * p - 2 );
    },
    Bounce: function( p ) {
        var pow2, bounce = 4;

        while ( p < ( ( pow2 = Math.pow( 2, --bounce ) ) - 1 ) / 11 ) {}
        return 1 / Math.pow( 4, 3 - bounce ) - 7.5625 * Math.pow( ( pow2 * 3 - 2 ) / 22 - p, 2 );
    }
};

// 部分基础easing生成
let grades = [ "Quad", "Cubic", "Quart", "Quint", "Expo" ];

for (var i = 0, len = grades.length; i < len; i ++) {
    var grade = grades[i];

    baseEasings[grade] = function (p) {
        return Math.pow( p, i + 2 );
    };
}

// 根据基础easing生成easing
for (var name in baseEasings) {
    var easeIn = baseEasings[name];

    easing[ "easeIn" + name ] = easeIn;

    easing[ "easeOut" + name ] = function( p ) {
        return 1 - easeIn( 1 - p );
    };

    easing[ "easeInOut" + name ] = function( p ) {
        return p < 0.5 ? easeIn( p * 2 ) / 2 : 1 - easeIn( p * -2 + 2 ) / 2;
    };
}

window.easing = easing;

/**
 * 渐变
 * @class
 */    
class Transit {
    /**
     * 构造函数
     * @constructor
     * @param { object } 配置对象
     */    
    constructor (opt) {
        this.easing = easing[opt.easing];
        this.duration = opt.duration;
        this.step = opt.step;

        this.success = null;
        this.error = null;
        this.percentage = 0;
        this.coefficient = 0;

        this.ins = 16.7 / this.duration;
        this.animationFrame = new AnimationFrame();

        this.transiting = false;

        let self = this;

        this.action = function () {
            self.step(self.coefficient, this.percentage);
        };        
    }

    /**
     * 递归
     * @param { object } 配置对象
     * @return { number } 计时器id
     */    
    recursion () {
        let self = this;

        var _run = function () {

            self.percentage = Math.min(1, self.percentage + self.ins);

            let curr = self.percentage;
            let last = self.percentage - self.ins;

            self.coefficient = self.easing(curr) - self.easing(last);


            try {
                self.action();
            } catch (e) {
                if (self.error) {
                    self.error(e);
                } else {
                    console.error(e);
                }
            }

            if (self.percentage < 1 && self.transiting) {
                self.animationFrame.request(_run);
            }
        };     

        _run();   
    }

    /**
     * 重新开始
     * @return { Transit } 当前实例
     */
    restart () {
        return this.start();
    }

    /**
     * 开始渐变
     * @return { Transit } 当前实例
     */
    start () {
        this.transiting = true;
        this.recursion();
        return this;
    }

    /**
     * 停止
     * @return { Transit } 当前实例
     */    
    stop () {
        this.animationFrame.cancel();
        this.transiting = false;

        if (this.success) {
            this.success();
        }

        return this;
    }

    /**
     * 开始渐变
     * @param { function } 成功回调
     * @param { function } 失败回调
     * @return { transit } 当前实例
     */
    then (success, error) {
        this.success = success;
        this.error = error;

        return this;
    }
}

/**
 * 渐进函数
 * @param { object } 配置对象
 * - easing 使用的 easing 函数
 * - step 动画的每一步要执行的函数
 * - duration 持续的时间
 * @return none
 */
export default function (opt) {
    return new Transit(opt).start();
}
