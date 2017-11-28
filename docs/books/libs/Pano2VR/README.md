源连接
http://ggnome.com/doc/pano2vr/5/javascript-api/

### JavaScript API
The HTML5 and Flash Pano2VR player has an external API so that it can be controlled with Javascript.
The HTML5 Skin uses exactly this API by itself. As the skin files are not minified you can simply peek into a skin file to figure out how some things are done internally.
Special notes on Flash
If you want to use the javascript Flash interface, you need to enable it. To do this you need to set the FlashVars parameter externalinterface to 1. Also you need to assign a name/id to the Flash object within the HTML page.
If you enable the option “JavaScript interface” in the normal.ggt HTML template, the code will be created for you.
✭ Note: Not all API calls are implemented in Flash.

---

### Setup 初始化

```js
pano.readConfigUrl(url:String,base:String="")
```
Read the node/tour configuration from a url. The base parameter defines a different base path.
- 从URL读取节点/访问配置。基本参数定义了不同的基路径。

```js
pano.readConfigUrlAsync(url:String,callback:Function,base:String="")
```

Same as readConfigUrl but asynchronous
- 从配置里面异步读取

```js
pano.readConfigString(xml:String)
```

Read the node/tour configuration from a string
- 读取配置通过xml的string类型

```js
pano.readConfigXml(xml:Document)
```

Read the node/tour configuration from a XML Document object
- 读取配置同xml文件

```js
pano.getBasePath()
pano.setBasePath(path:string)
```
Get/set the base path. The base path is added to relative file names and urls. This is useful, if the HTML file has a different base then the xml configuration file.
- 进行设置配置文件相对路径

---

### Virtual Tour  虚拟场景切换


```js
pano.getNodeIds():Array<String>
//["node1", "node2", "node3"]
```

Get a list of all node ids


```js
pano.getNodeUserdata(id:String):Object
```

Get the user data for node id. If the id is empty the current node data is returned


```js
pano.getNodeLatLng(id:String):Object
```

Get the GPS data for node id. If the id is empty the current node data is returned


```js
pano.getNodeTitle(id:String):String
```

Get the node title for node id. If the id is empty the current node data is returned


```js
pano.getCurrentNode():String//返回当前场景名称
```

Get the node id of the current node


```js
pano.getNextNode()//进入到下一个场景
```

Get the node id of the next node in the tour list. If the current node is the last node, the first node id is returned.


```js
pano.getPrevNode()//进入到上一个场景
```

Get the node id of the previous node in the tour list. If the current node is the first node, the last node id is returned.


```js
pano.nodeVisited(id:String):Boolean
```

Returns true if the node has been visited. For the current node false is returned on the first visit.


```js
pano.openNext(url:String,parameter:String)
//切换到制定场景，如node3 ，但记住需要包在{}内，如{node3}
pano.openNext('{node3}')
```

Open next panorama, if the url is in the from of {nodeid} it will change the node in the tour.

---
### Hotspots 交互热点

```js
pano.addHotspot(id:String,pan:Number,tilt:Number,div:DomElement)
```

Add a DomElement as hotspot to the panorama


```js
pano.updateHotspot(id:String,pan:Number,tilt:Number)
```

Update the hotspot position


```js
pano.removeHotspot(id:String)
```

Remove a single hotspot


```js
pano.removeHotspots()
```

Remove all hotspots


```js
pano.getPointHotspotIds():Array<String>
```

Get all hotspot Ids as array of strings


```js
pano.getHotspot(id:String):Object
```

Get the position of a hotspot

##### Example code:

```js
pano.addHotspot("myid",0,90,document.getElementById("test"));
console.log(pano.getPointHotspotIds());
pano.updateHotspot("myid",0,-90);
console.log(pano.getHotspot("myid"));
pano.removeHotspot("myid");
console.log(pano.getPointHotspotIds());
```

---

### Viewing direction 观察方向的控制


```js
pano.getPan()
```

Return the current pan angle


```js
pano.getPanNorth()
```

Return the current pan angle including the nodes north offset

```js
pano.setPan(angle_in_degrees:Number)
```

Sets the current pan angle

```js
pano.setPanNorth(angle_in_degrees:Number)
```

Sets the current pan angle, taking the nodes north offset into account


```js
pano.changePan(offset_in_degrees:Number)
```

Change the current pan angle


```js
pano.getTilt()
```

Returns the current tilt angle


```js
pano.setTilt(angle_in_degrees:Number)
```

Sets the current tilt angle


```js
pano.changeTilt(offset_in_degrees:Number)
```

Change the current tilt angle


```js
pano.getFov()
```

Return the current Field of View, depending on the FoV mode


```js
pano.setFov(angle_in_degrees:Number)
```

Set the current Field of View, depending on the FoV mode


```js
pano.changeFov(offset_in_degrees:Number)
```

Change the current Field of View, depending on the FoV mode


```js
pano.getVFov()
```

Return the current vertical Field of View


```js
pano.setVFov(angle_in_degrees:Number)
```

Set the current vertical Field of View


```js
pano.getRoll()
```

Return the current roll angle


```js
pano.setRoll(angle_in_degrees:Number)
```

Set the current roll angle


```js
player.setPanTilt(pan:Number,tilt:Number)
player.setPanTiltFov(pan:Number,tilt:Number,fov:Number)
```

Convenience functions


```js
player.setDefaultView(pan:Number,tilt:Number,fov:Number)
```

Changes the default view for this node


```js
pano.moveTo(pan:Number,tilt:Number,fov:Number,speed:Number);
```

Move the view to a position


```js
pano.moveToDefaultView()
```

Move the view to the default position


```js
pano.setAutorotate(speed:Number,delay:Number,rth:Number)
```

Set the autorotation parameters


```js
pano.startAutorotate(speed:Number,delay:Number,rth:Number)
```

Start autorotation


```js
pano.toggleAutorotate(speed:Number,delay:Number,rth:Number)
```

Toggle autorotation


```js
pano.stopAutorotate()
```

Stop autorotation


```js
pano.stop()
```

Stop automatic movement


```js
pano.changeProjection(projection:Number, speed:Number)
```

Change the project of the view.
The projection can have the following values:

- 4 = rectilinear
- 9 = stereographic
- 12 = fisheye

---

#### Media elements 多媒体元素

```js
pano.playSound(id:String)
```

Start the sound with this media id


```js
pano.pauseSound(id:String)
```

Pause the sound with this media id


```js
pano.playPauseSound(id:String)
```

Toggle between play and play the sound with this media id


```js
pano.activateSound(id:String)
```

Pop out the image or video


```js
pano.stopSound(id:String)
```

Stop the sound with this media id


```js
pano.isPlaying(id:String):Boolean
```

Check if this media element is currently playing


```js
pano.setVolume(id:String,volume:Number)
```

Set the volume (between 0.0 and 1.0) for this element to a fixed value. The id _ main changes the global volume.


```js
pano.changeVolume(id:String,volumen:Number)
```

---

Change the volume for this element. The id _ main changes the global volume.




#### Fullscreen 全屏
The method names speak for themselves.

```js
pano.setFullscreen(flag:Boolean)
pano.enterFullscreen()
pano.exitFullscreen()
pano.toggleFullscreen()
pano.getIsFullscreen()
```

---

#### Video panorama

```js
pano.videoPanoPlay(), pano.videoPanoStop(), pano.videoPanoPause()
```

Play/Stop/Pause the video panorama


```js
pano.getVideoPanoTime():Number, pano.setVideoPanoTime(t:Number)
```

Get/set the current time for the play head of the video panorama


```js
pano.getVideoPanoObject():DomVideoElement
```

Get a reference to the DOM video element

---

### Miscellaneous 其他


```js
pano.isComplete()
```

Check if the panorama is loaded completely


```js
pano.setLocked(value:Boolean)
```

Disable all interaction with the panorama


```js
pano.setLockedMouse(value:Boolean)
```

Disable mouse interaction with the panorama


```js
pano.setLockedKeyboard(value:Boolean)
```

Disable keyboard interaction with the panorama


```js
pano.setLockedWheel(value:Boolean)
```

Disable mouse wheel interaction with the panorama


```js
pano.getPositionAngles(x:Number,y:Number):Object
```

Returns an object with the pan and tilt values for a given screen position.


```js
pano.getPositionRawAngles(x:Number,y:Number):Object
```

Same as getPositionAngles but the current position of the panorama is ignored, so the angles are as if pan=0 and tilt=0.


# 我对pano2VR 的改造

```js

//改造切换到下一个场景
pano._openNext=pano.openNext;
pano.openNext=function (a,b) {
	this._openNext(a,b)
	console.log('openNext');
}
//改造帧触发update
pano._update=pano.update;
pano.update=function (){
    if(arguments.length==1){
        this._update(arguments[0]);
        console.log('show update 跳转场景时候');
    }
    else {
        this._update();
        console.log('show update 场景运动时候');
    }
}
```
获取加载进度
```js
pano.getPercentLoaded()
```

获取热点

```js
//查询源代码内 大约1632行 var J = [];
var J = [];

```
由此可见 热点列表是在J这个变量里面存储，那我们来改造下
```js
//在函数体内，添加一个获取热点的list Arrary 名字叫b._DsHotspots
b._DsHotspots=J;
```

热点更新时候 方法改造

```js
pano._addHotspotElements=pano.addHotspotElements;
pano.addHotspotElements=function (){
   this._addHotspotElements();
   console.log('热点更新：',this._DsHotspots);

}
```
改造场景切换后的

```js
pano._Ca_=pano.Ca;
pano.Ca=function (a,b){
   this._Ca_(a,b);
   //console.log('场景更新：',this._DsHotspots);
}
```
