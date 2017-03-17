/**
 * 可放下
 * @Class
 */
let _default = function () {return true;};

export default class Drop {
    /**
     * 浮层遮罩
     * @constructor
     * @param { object } 配置对象   
     * ele {element}
     * handleEnter {function} 进入区域  
     * handleLeave {function} 离开区域
     * handleMove {function} 在区域内移动
     * handleDrop {function} 处理放下行为
     */    
    constructor (options) {
        this.ele = options.ele;

        if (typeof this.ele === 'string') {
            this.ele = document.getElementById(ele);
        }

        this.handleEnter = options.handleEnter || _default;
        this.handleLeave = options.handleLeave || _default;
        this.handleMove = options.handleMove || _default;
        this.handleDrop = options.handleDrop || _default;

        this.mask = null;

        this.init();
    }

    /**
     * 初始化
     * @returns none
     */
    init () {
        
    }

    /**
     * 是否在区域内
     * @returns none
     */
    isIn (offset) {
        let offsetX = this.ele.offset;
        let offsetY = this.ele.offset;

        let eleHeight = this.ele.offsetHeight;
        let eleWidth = this.ele.offsetWidth;

        let zone = {
            top: offsetY,
            bottom: offsetY + eleHeight,
            left: offsetX,
            right: offsetX + eleWidth
        };

        if (offset.x >= zone.top && offset.y <= zone.bottom && offset.x >= zone.left && offset.x <= zone.right) {

        }
    }

    /**
     * 创建表示位置的虚线框
     * @returns none
     */
    createMask () {
        this.mask = document.createElement('div');
        this.mask.className = 'ui-drop-mask';

        this.ele.appendChind(this.mask);
    }

    /**
     * 移除表示位置的虚线框
     * @returns none
     */
    removeMask () {
        this.mask.remove();
    }


}