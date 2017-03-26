/**
 * 拖放
 * @author Mulb
 * @eg: ms-drop=options
 */

define(['avalon', 'scripts/pages/form-design/directives/widgets/drop'], function (avalon, drop) {
    avalon.directive("drop", {
        priority: 1001,
        init: function (binding) {
            var elem = binding.element;
            var expr = binding.expr;

            var jq_elem = $(elem);
            var options = null;

            for (var i = 0, len = binding.vmodels.length; i < len; i ++) {
                var vmodel = binding.vmodels[i];

                if (vmodel[expr]) {
                    options = vmodel[expr];
                    break;
                }
            }

            options = options || {};

            var identifier = jq_elem.data('identifier');

            jq_elem.drop(options, identifier);
        }
    });
});