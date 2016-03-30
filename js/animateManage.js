/**
 * Created by liuheng on 16/3/23.
 */
;(function(window){
    var aniQueue = [];
    var baseUID = 0;
    var aniUpdateTimer = 13;
    var aniID = -1;
    var isTicking = false;
    window.animateManage = function(options){
        this.context = options;
    };
    animateManage.prototype = {
        init : function(){
            this.start(this.context);
        },
        stop : function(){
            clearInterval(aniID);
            isTicking = false;
        },
        start : function(options){
            if(options){
                this.pushQueue(options);
            }
            if(isTicking || aniQueue.length === 0){
                return false;
            }
            this.tick();
            return true;
        },
        tick : function(){
            var self = this;
            isTicking = true;
            aniID = setInterval(function(){
                if(aniQueue.length === 0){
                    self.stop();
                }
                else{
                    for(var i = 0; i < aniQueue.length; i ++){
                        aniQueue[i] && self.go(aniQueue[i],i);
                    }
                }
            },aniUpdateTimer)
        },
        go : function(options,i){
            var n = this.now();
            var st = options.startTime;
            var ting = options.time;
            var e = options.context;
            var t =st + ting;
            var name = options.name;
            var tPos = options.value;
            var sPos = options.startValue;
            var effect = options.effect;
            if(n >= t){
                aniQueue[i] = null;
                this.delQueue();
            }else{
                tPos = this.aniEffect({
                    e : e,
                    ting : ting,
                    n : n,
                    st : st,
                    sPos : sPos,
                    tPos : tPos
                },effect)
            }
            e.style[name] = (name == "zIndex") ? tPos : tPos + "px";
            this.goCallBack(options.callback,options.uid);
        },
        aniEffect : function(options,effect){
            var effect = effect || "linear";
            var _effect = {
                "linear" : function(_options){
                    var scale = (_options.n - _options.st) / _options.ting;
                    var tPos = _options.sPos + (_options.tPos - _options.sPos) * scale;
                    return tPos;
                }
            };
            return _effect[effect](options);
        },
        goCallBack : function(callback,u){
            var isCallback = true;
            for(var i = 0; i < aniQueue.length; i ++){
                if(aniQueue[i].uid == u){
                    isCallback = false;
                }
            }
            if(isCallback){
                callback && callback();
            }
        },
        pushQueue : function (options){
            var con = options.context;
            var t = options.time || 1000;
            var callback = options.callback;
            var effect = options.effect;
            var starCss = options.starCss;
            var c = options.css;
            var name = "";
            var u = this.setUID(con);
            for(name in c){
                aniQueue.push({
                    "context" : con,
                    "time" : t,
                    "name" : name,
                    "value" : parseInt(c[name],10),
                    "startValue" : parseInt((starCss[name] || 0)),
                    "effect" : effect,
                    "uid" : u,
                    "callback" : callback,
                    "startTime" : this.now()
                })
            }
        },
        delQueue : function(){
            for(var i = 0; i < aniQueue.length; i ++){
                if(aniQueue[i] === null){
                    aniQueue.splice(i,1);
                }
            }
        },
        now : function (){
            return new Date().getTime();
        },
        getUID : function(_e){
            return _e.getAttribute("aniUID");
        },
        setUID : function(_e,v){
            var u = this.getUID(_e);
            if(u){
                return u;
            }
            u = v || baseUID ++;
            _e.setAttribute("aniUID",u);
            return u;
        }

    };
})(window,document);