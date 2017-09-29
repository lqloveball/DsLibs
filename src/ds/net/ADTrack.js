//这个类使用老js方法，有可能直接插入html标签内使用
!(function (factory) {

    var root = (typeof window !== 'undefined' ? window : (typeof process === 'object' && typeof require === 'function' && typeof global === 'object') ? global : this);


    if (typeof define === 'function' && define.amd) {

        define(['exports'], function (exports) {

            module.exports = factory(root, exports);

        });
    } else if (typeof exports !== 'undefined') {

        module.exports = factory(root, exports);

    } else {

        factory(root, {});

    }

}(function (root, ADTrack) {

    var ds = root.ds = root.ds || {};
    ds.net = ds.net || {};

    /**
     * 快速添加监测代码
     * @module ds/net/ADTrack
     *
     */
    ADTrack;

    /**
     * 快速添加监测代码
     * @member ds.net.ADTrack
     * @type module:ds/net/ADTrack
     */
    ds.net.ADTrack = ADTrack;


    Object.assign(ADTrack, /** @lends module:ds/net/ADTrack */ {

        /**
         * 百度虚拟PV
         * @alias module:ds/net/ADTrack.baiduPV
         * @param  {string} pageurl [如 '/virtual/login']
         */
        baiduPV: function (pageurl) {

            if (window['_hmt'] === undefined) return;

            if (pageurl.indexOf('/') !== 0) pageurl = '/' + pageurl;

            _hmt.push(['_trackPageview', pageurl]);
            // console.log('baiduPV:', pageurl);

        },
        /**
         * 百度监测事件
         * @alias module:ds/net/ADTrack.baiduEvent
         * @param  {string} opt_label [必填【百度描述】事件的一些额外信息，通常可以是歌曲的名称、软件的名称、链接的名称等等。该项选填，不填、填"-"代表此项为空。。]
         * @param  {string} [opt_value='1'] [默认one【百度描述】事件的一些数值信息，比如权重、时长、价格等等，在报表中可以看到其平均值等数据。该项可选。]
         * @param  {string} [category='Event']  [默认Event【百度描述】要监控的目标的类型名称，通常是同一组目标的名字，比如"视频"、"音乐"、"软件"、"游戏"等等。该项必填，不填、填"-"的事件会被抛弃。]
         * @param  {string} [action='Click']    [默认Click【百度描述】用户跟目标交互的行为，如"播放"、"暂停"、"下载"等等。该项必填，不填、填"-"的事件会被抛弃。]
         */
        baiduEvent: function (opt_label, opt_value, category, action) {

            if (window['_hmt'] === undefined) return;
            if (!category) category = 'Event';
            if (!action) action = 'Click';
            if (!opt_value) opt_value = '1';
            if (!opt_label) return;
            _hmt.push(['_trackEvent', category, action, opt_label, opt_value]);
            // console.log('baiduEvent:', opt_label);

        },
        /**
         * Google的PV
         * @alias module:ds/net/ADTrack.gaPV
         * @param  {string} pageurl [如 '/virtual/login']
         */
        gaPV:function (pageurl) {

            if (window['ga'] === undefined) return;
            if (pageurl.indexOf('/') !== 0) pageurl = '/' + pageurl;
            ga('send', 'pageview', pageurl);

        },
        /**
         * Google的监测事件
         * @param  {string} opt_label [必填【百度描述】事件的一些额外信息，通常可以是歌曲的名称、软件的名称、链接的名称等等。该项选填，不填、填"-"代表此项为空。。]
         * @param  {number} [opt_value=1] [默认one【百度描述】事件的一些数值信息，比如权重、时长、价格等等，在报表中可以看到其平均值等数据。该项可选。]
         * @param  {string} [category='Event']  [默认Event【百度描述】要监控的目标的类型名称，通常是同一组目标的名字，比如"视频"、"音乐"、"软件"、"游戏"等等。该项必填，不填、填"-"的事件会被抛弃。]
         * @param  {string} [action='Click']    [默认Click【百度描述】用户跟目标交互的行为，如"播放"、"暂停"、"下载"等等。该项必填，不填、填"-"的事件会被抛弃。]
         */
        gaEvent:function (opt_label, opt_value, category, action) {

            if (window['ga'] === undefined) return;
            if (!category) category = 'Event';
            if (!action) action = 'Click';
            if (!opt_value) opt_value = 1;
            if (!opt_label) return;

            ga('send', {
                hitType: 'event',
                eventCategory: category,
                eventAction: action,
                eventLabel: opt_label,
                eventValue: Number(opt_value),
            });

        },
        /**
         * 虚拟pv(同时加百度与Google)
         * @alias module:ds/net/ADTrack.pv
         * @param  {string} pageurl [如 '/virtual/login']
         */
        pv:function (pageurl) {

            ds.net.baiduPV(pageurl);
            ds.net.gaPV(pageurl);

        },
        /**
         * 事件监测(同时加百度与Google)
         * @param  {string} opt_label [必填【百度描述】事件的一些额外信息，通常可以是歌曲的名称、软件的名称、链接的名称等等。该项选填，不填、填"-"代表此项为空。。]
         * @param  {number} [opt_value=1] [默认one【百度描述】事件的一些数值信息，比如权重、时长、价格等等，在报表中可以看到其平均值等数据。该项可选。]
         * @param  {string} [category='Event']  [默认Event【百度描述】要监控的目标的类型名称，通常是同一组目标的名字，比如"视频"、"音乐"、"软件"、"游戏"等等。该项必填，不填、填"-"的事件会被抛弃。]
         * @param  {string} [action='Click']    [默认Click【百度描述】用户跟目标交互的行为，如"播放"、"暂停"、"下载"等等。该项必填，不填、填"-"的事件会被抛弃。]
         */
        event:function (opt_label, opt_value, category, action) {

            ds.net.baiduEvent(opt_label, opt_value, category, action);
            ds.net.gaEvent(opt_label, opt_value, category, action);

        }
    });

    /**
     * @member ds.net.baiduPV
     * @function
     * @see 详细请见： {@link module:ds/net/ADTrack.baiduPV}
     */
    ds.net.baiduPV = ds.net.ADTrack.baiduPV;

    /**
     * @member ds.net.baiduEvent
     * @function
     * @see 详细请见： {@link module:ds/net/ADTrack.baiduEvent}
     */
    ds.net.baiduEvent = ds.net.ADTrack.baiduEvent;

    /**
     * @member ds.net.gaPV
     * @function
     * @see 详细请见： {@link module:ds/net/ADTrack.gaPV}
     */
    ds.net.gaPV = ds.net.ADTrack.gaPV;

    /**
     * @member ds.net.gaEvent
     * @function
     * @see 详细请见： {@link module:ds/net/ADTrack.gaEvent}
     */
    ds.net.gaEvent = ds.net.ADTrack.gaEvent;

    /**
     * @member ds.net.pv
     * @function
     * @see 详细请见： {@link module:ds/net/ADTrack.pv}
     */
    ds.net.pv = ds.net.ADTrack.pv;

    /**
     * @member ds.net.event
     * @function
     * @see 详细请见： {@link module:ds/net/ADTrack.pv}
     */
    ds.net.event = ds.net.ADTrack.event;


    return ds.net.ADTrack;
}));