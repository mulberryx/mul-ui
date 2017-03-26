/**
 * 拖拽
 * @author Mulb
 */

define(['jquery', 'scripts/pages/form-design/directives/widgets/drop'], function (jquery, Drop) {


    var currZoneObj = null;

    /**
     * 拖拽类
     * @constructor
     * @param { object } 配置项
     * @eg: ele {element} 可拖动元素
     *      createclone {boolean} 是否创建克隆
     *      data {object} 传递给放置对象的函数
     */    
    var Drag = function (options) {
        this.jq_ele = options.ele;

        this.createclone = options.createclone;
        this.data = options.data;

        this.init();
    };

    Drag.prototype = {
        /**
         * 初始化
         * @return none
         */         
        init: function () {
            var self = this;
            var jq_ele = this.jq_ele;

            var jq_body = jquery('body');
            var jq_document = jquery(document);

            var mask = null;

            var offsetX = null;
            var offsetY = null;

            var distanceX = null;

            var begin = false;
            var bp = {
                x: 0,
                y: 0
            };

            /**
             * 鼠标抬起
             * @param { object } 事件对象
             * @return none
             */
            var onmouseup = function (e) {
                e.preventDefault();
                e.stopPropagation();

                jq_document.unbind('mouseup');
                jq_document.unbind('mousemove');

                if (begin) {
                    begin = false;
                    mask.remove();

                    if (currZoneObj) {
                        var pageX = e.pageX;
                        var pageY = e.pageY;

                        if (currZoneObj.active) {
                            currZoneObj.handleDrop(self.data);
                        }
                    }

                    jquery.each(Drop.dropObj, function (i, item) {
                        item.removeDashedFrame();
                    });                        
                }            
            };  

            /**
             * 鼠标移动
             * @param { object } 事件对象
             * @return none
             */
            var onmousemove = function (e) {
                e.preventDefault();
                e.stopPropagation();

                if (!begin) {
                    if (bp.x === e.pageX && bp.y === e.pageY) {
                        return;
                    } else {
                        begin = true;
                        createCloneDom(e);                        
                    }
                }

                var pageX = e.pageX;
                var pageY = e.pageY;

                var offset = mask.offset();

                offset.left = pageX + offsetX;
                offset.top = pageY + offsetY;

                mask.css({
                    left: offset.left,
                    top: offset.top
                });

                var offset = {
                    left: e.pageX,
                    top: e.pageY
                };

                currZoneObj = null;

                var currZoneObjArr = [];

                jquery.each(Drop.dropObj, function (i, item) {
                    var inZone = item.inZone(offset, self.data);
                    
                    if (inZone) {
                        currZoneObjArr.push(item);
                        currZoneObj = item;          
                    } else {
                        item.active = false;
                    }
                });

                if (currZoneObj) {
                    currZoneObj.createDashedFrame(offset);
                    currZoneObj.active = true;
                }

                if (!self.createclone && currZoneObj) {
                    jq_ele.remove();

                    var size = currZoneObj.getDashedFrameSize();
                    var mask_width = mask.outerWidth();
                    var mask_left = mask.offset().left;

                    if (size.width / mask_width !== 1) {
                        var _offsetX = 0;

                        if (size.width - mask_width < 0) {
                            _offsetX = distanceX * ( 1 - (size.width / mask_width));
                        } else {
                            _offsetX = - ((size.width / mask_width) -1 ) * distanceX;
                            
                        }

                        mask.css({
                            width: size.width,
                            left: mask_left + _offsetX
                        });

                        offsetX = offsetX * size.width / mask_width;
                        distanceX = - offsetX;
                    }
                }                                
            };

            /**
             * 鼠标移动
             * @param { object } 事件对象
             * @return none
             */
            var createCloneDom = function (e) {

                var pageX = e.pageX;
                var pageY = e.pageY;

                mask = jq_ele.clone();
                jq_body.append(mask);

                var width = jq_ele.outerWidth();
                var height = jq_ele.outerHeight();
                var offset = jq_ele.offset();

                offsetX = offset.left - pageX;
                offsetY = offset.top - pageY;

                distanceX = pageX - offset.left;

                if (!self.createclone) {
                    jq_ele.css({
                        visibility: 'hidden'
                    });
                }  

                mask.css({
                    position: 'absolute',
                    left: offset.left,
                    top: offset.top,
                    width: width,
                    height: height,
                    zIndex: 999,
                    margin: 0,
                    background: '#f5f5f5',
                    border: '1px dashed #999',
                    opacity: 0.9,
                    overflow: 'hidden'
                });
            };

            jq_ele.bind('mousedown', function (e) {
                e.preventDefault();
                e.stopPropagation();
                
                bp.x = e.pageX;
                bp.y = e.pageY;

                begin = false;
                
                jq_document.bind('mousemove', onmousemove);
                jq_document.bind('mouseup', onmouseup);
            });
        }
    };

    /**
     * 初始化拖拽对象
     * @param { object } 配置对象     
     * @return none
     */    
    jquery.fn.drag = function (options) {
        this.each(function(idx, ele){
            var _options = {
                ele: jquery(ele),
                data: options.data,
                createclone: options.createclone
            };

            Drag.dragObj.push(new Drag(_options));
        });
    };

    Drag.dragObj = [];

    return Drag;
});