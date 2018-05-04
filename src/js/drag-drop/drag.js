/**
 * 可拖拽
 * @Class
 */
export default class Drag {
    /**
     * 浮层遮罩
     * @constructor
     * @param { object } 配置对象   
     *  ele {element}
     *  type {string} 将会作为参数传递给drop  
     */    
    constructor (options) {
        this.ele = options.ele;

        if (typeof this.ele === 'string') {
            this.ele = document.getElementById(ele);
        }

        this.init();
    }

    /**
     * 初始化
     * @returns none
     */
    init () {
        let ontouchstart = function () {
            
        };

        let ontouchmove = function () {

        };

        let ontouchend = function () {

        };

        this.ele.addEventListener();
    }
}