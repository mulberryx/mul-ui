/**
 * 工具对象
 */

export default {
    /**
     * 缓存对象
     */           
    uidCache: {},

    /**
     * 事件映射对象
     */             
    events: {},

    /**
     * 生成uuid
     * @return none
     */           
    getUID () {
        var s = [];
        var hexDigits = "0123456789abcdefghijk";
        var characterDigits = "abcdefghijk";
        
        for (var i = 0; i < 8; i++) {
            if (i === 0) {
                s[i] = characterDigits.substr(Math.floor(Math.random() * 0x10), 1);
            } else {
                s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
            }
        }
     
        var uuid = s.join("");
            
        if (!this.uidCache[uuid]) {
            this.uidCache[uuid] = true;
            return uuid;            
        } else {
            return this.getUID();
        }
    },

    /**
     * 添加事件监听
     * @param {string} 事件名称
     * @param {function} 事件处理函数
     * @return {stirng} 时间处理函数的uuid
     */           
    addEventListener (event, handler) {
        if (!this.events[event]) {
            this.events[event] = [];
        }

        this.events[event].push(handler);

        handler.uuid = this.getUID();
        return handler.uuid;
    },

    /**
     * 移除事件监听
     * @param {string} 事件名称
     * @param {stirng} 事件处理函数的uuid
     * @return none
     */   
    removeEventListener (event, uuid) {
        var handlers = this.events[event] || [];

        for (var i = handlers.length - 1; i >= 0; i--) {
            if (handlers[i].uuid === uuid) {
                handlers.splice(i, 1);
            }
        }
    },

    /**
     * 触发事件
     * @param {string} 事件名称
     * @param {object} 传递的数据
     * @return none
     */           
    triggerEvent (event, data) {
        var handlers = this.events[event] || [];

        for (var i = 0, len = handlers.length; i < len; i ++) {
            handlers[i](data);
        }
    },

    /**
     * 数组插入元素
     * @param {array} 数组的位置
     * @param {object} 插入对象
     * @param {number} 插入位置
     * @return none
     */           
    insert (arr, item, idx) {
        var _arr = [];

        for (var i = 0, len = arr.length; i <= len; i ++) {
            if ( i === idx ) {
                _arr.push(item);
            }

            if (i !== len) {
                _arr.push(arr[i].$model || arr[i]);
            }                
        }

        return _arr;
    },

    /**
     * 数组元素移动位置
     * @param {array} 数组         
     * @param {number} 元素位置
     * @param {number} 目标位置
     * @return none
     */     
    moveTo (arr, origin, target) {
        return this.insert(arr, arr.splice(origin, 1)[0], target);            
    },

    /**
     * 获取组件名称
     * @param {string} 组件类型
     * @return none
     */     
    getComponentNameByType (type) {
        return this.componentsNameMap[type];
    },

    aop: {
        /**
         * 前包裹函数
         * @param {function} 前函数         
         * @param {function} 处理函数
         * @param {*} 上下文
         * @return none
         */
        before (before, origin, context) {
            context = context || this.noop;

            before = this.keepContext(before, context);
            origin = this.keepContext(origin, context);

            return function () {
                before.apply(this.noop, arguments);
                return origin.apply(this.noop, arguments);
            };
        },

        /**
         * 后包裹函数
         * @param {function} 后函数         
         * @param {function} 处理函数
         * @param {*} 上下文
         * @return none
         */            
        after (after, origin, context) {
            context = context || this.noop;

            after = this.keepContext(after, context);
            origin = this.keepContext(origin, context);

            return function () {
                var result = origin.apply(this.noop, arguments);
                after.apply(this.noop, arguments);

                return result;
            };                
        },

        /**
         * 前后包裹函数
         * @param {function} 前函数         
         * @param {function} 后函数
         * @param {function} 处理函数
         * @param {*} 上下文
         * @return none
         */            
        around (before, after, origin, context) {
            context = context || this.noop;

            before = this.keepContext(before, context);
            after = this.keepContext(after, context);
            origin = this.keepContext(origin, context);

            return function () {
                before.apply(this.noop, arguments);
                var result = origin.apply(this.noop, arguments);
                after.apply(this.noop, arguments);

                return result;
            };                
        },

        /**
         * 保持上下文
         * @param {function} 函数         
         * @param {*} 上下文
         * @return none
         */            
        keepContext (func, context) {
            return function () {
                return func.apply(context, arguments);
            };
        },

        /**
         * 默认的上下文
         */               
        noop: {}
    },

    /**
     * 模板缓存
     */   
    tmplCache: {},

    /**
     * 模板引擎
     * @param {string} 模板         
     * @param {object} 渲染数据
     * @return { function | string } 渲染函数 | 渲染结果
     */    
    tmpl(str, data) {
        var fn = null;

        if (!/\W/.test(str)) {
            fn = this.tmplCache[str] = this.tmplCache[str] || this.tmpl(document.getElementById(str).innerHTML);
        } else {
            fn = new Function("obj",
                    "var p=[],print=function(){p.push.apply(p,arguments);};" +
             
                    "with(obj){p.push('" +
             
                    str
                        // 去除换行制表符\t\n\r
                        .replace(/[\r\t\n]/g, " ")

                        // 将左分隔符变成 \t
                        .split("<%").join("\t") 

                        // 去掉模板中单引号的干扰
                        .replace(/((^|%>)[^\t]*)'/g, "$1\r")

                        // 为 html 中的变量变成 ",xxx," 的形式, 如：\t=users[i].url%> 变成  '，users[i].url,'  
                        // 注意这里只有一个单引号，还不配对         
                        .replace(/\t=(.*?)%>/g, "',$1,'")

                        // 这时候，只有JavaScript 语句前面才有 "\t",  将  \t  变成   '); 
                        // 这样就可把 html 标签添加到数组p中，而javascript 语句 不需要 push 到里面。        
                        .split("\t").join("');")

                        // 这时候，只有JavaScript 语句后面才有 "%>", 将 %> 变成  p.push(' 
                        // 上一步我们再 html 标签后加了 ');， 所以要把 p.push(' 语句放在 html 标签放在前面，这样就可以变成 JavaScript 语句
                        .split("%>").join("p.push('")

                        // 将上面可能出现的干扰的单引号进行转义
                        .split("\r").join("\\'")

                        // 将数组 p 变成字符串。
                        + "');}return p.join('');"
                    );
        }

        return data ? fn(data) : fn;        
    }
}