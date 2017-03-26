/**
 * 维持滚动条位置
 * @author Mulb
 * @eg: ms-scrollkeeper={{ 绑定的字段 }}，用于保存当前滚动条位置
 */

define(['avalon', 'jquery'], function (avalon, $) {
    avalon.directive("scrollkeeper", {
        priority: 100,
        init: function (binding) {
            var elem = binding.element;
            var $elem = $(elem);

            var vmodel = binding.vmodels[0];
            var expr = binding.expr;
            
            var scrollLeft = parseInt($elem.data('scroll-left'));
            var componentId = $elem.data('component-id');

            $elem.scrollLeft(scrollLeft);

            $elem.on('scroll', function (e) {
                var handleScroll = vmodel[expr];
                var scrollLeft = $elem.scrollLeft();

                handleScroll(componentId, scrollLeft);
            });
        }
    });
});