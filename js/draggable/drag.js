/**
 * 可拖拽
 * @Class
 */
export default class Drag {
    /**
     * 浮层遮罩
     * @constructor
     * @param { object } 配置对象     
     */    
    constructor (options) {
        this.ele = options.ele;

        if (typeof this.ele === 'string') {
            this.ele = document.getElementById(ele);
        }
    }

    /**
     * 初始化
     * @returns none
     */
    init () {

    }
}