!(function() {
    if(!PIXI||!PIXI.animate)return;

    /**
     * 改写PIXI.animate.MovieClip的导出代码的实现
     * @param callback
     * @param startFrame
     * @returns {PIXI.animate.MovieClip}
     */
    PIXI.animate.MovieClip.prototype.addAction = function(callback,startFrame){
        if (typeof startFrame === 'string') {
            var index = this._labelDict[startFrame];
            if (index === undefined) {
                console.warn('The label '+startFrame+' does not exist on this timeline');
                return;
            }
            startFrame = index;
        }

        var actions = this._actions;
        //ensure that the movieclip timeline is long enough to support the target frame
        if (actions.length <= startFrame) {
            actions.length = startFrame + 1;
        }
        if (this._totalFrames < startFrame) {
            this._totalFrames = startFrame;
        }
        console.log('PIXI.animate.MovieClip addAction1:',startFrame);
        //add the action
        if (actions[startFrame]) {
            actions[startFrame].push(callback);
        } else {
            actions[startFrame] = [callback];
        }
        //添加了如果是第一帧执行的代码，那就初始化时候必须执行一次，这样确保在手机上渲染会正确停止
        if(startFrame===0){
            callback.call(this);
        }
        return this;
    }

})();