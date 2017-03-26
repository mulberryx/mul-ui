/**
 * 拖拽
 * @author Mulb
 * @eg: ms-drag
 *      data-identifier="{{拖拽对象的id}}"
 *      data-type="{{类型，将作为参数传递给dropper }}"
 *      data-fresh="{{是否是新对象}}"
 * }
 */

define(['avalon', 'scripts/pages/form-design/directives/widgets/drag'], function (avalon) {
    avalon.directive("drag", {
        priority: 1001,
        init: function (binding) {
            var elem = binding.element;
            var expr = binding.expr;

            var jq_elem = $(elem);
            var options = { data: {} };

            var fresh = jq_elem.data('fresh');

            options.data.identifier = jq_elem.data('identifier');
            options.data.type = jq_elem.data('type');
            options.data.fresh = fresh;

            options.createclone = fresh;
            
            jq_elem.drag(options);
        }
    });
});