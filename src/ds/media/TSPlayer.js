import EventDispatcher from '../core/EventDispatcher';

/**
 *  视频交互类
 *  @class
 *  @memberof ds.media
 */
class TSPlayer extends EventDispatcher{

    constructor(){
        super();
    }
}

let root = (typeof window !== 'undefined' ? window : (typeof process === 'object' && typeof require === 'function' && typeof global === 'object') ? global : this);

let ds = root.ds = root.ds || {};
ds.media = ds.media || {};
ds.media.TSPlayer=TSPlayer;

export default TSPlayer;