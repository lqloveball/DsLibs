/*
Based on the krpano iOS 4.2 gyroscope script
by Aldo Hoeben / fieldofview.com
contributions by Sjeiti / ronvalstar.nl

Port for Pano2VR
Thomas Rauscher / gardengnomesoftware.com

This software can be used free of charge and the source code is available under a Creative Commons Attribution license:
http://creativecommons.org/licenses/by/3.0/

*/
window.pano2vrGyro=pano2vrGyro;
function pano2vrGyro(panoObject,containerId) {
	var _self=this;
	var _IsOnleyInteractive=false;
	Object.defineProperty(this, "IsOnleyInteractive", {get: function() {return _IsOnleyInteractive;},});
	var _IsOnlyTouch=false;
	Object.defineProperty(this, "IsOnlyTouch", {get: function() {return _IsOnlyTouch;},});
	//只有陀螺仪
	this.onlyDevice=function(){
		_IsOnleyInteractive=true;
		_IsOnlyTouch=false;
		diffPan = panoObj.getPan();
		diffTilt = panoObj.getTilt();
		panoObj.setLockedMouse(true);
		console.log('onlyDevice');
	};

	//只有touch
	this.onlyTouch=function(){
		_IsOnleyInteractive=true;
		_IsOnlyTouch=true;
		panoObj.setLockedMouse(false);
		console.log('onlyTouch');
	};

	/**
	 * 两种炒作兼顾
	 * @return {[type]} [description]
	 */
	this.interactiveByTouchAndDevice=function(){
		_IsOnleyInteractive=false;
		diffPan = panoObj.getPan();
		diffTilt = panoObj.getTilt();
		panoObj.setLockedMouse(false);
		// panoObj.moveTo(diffPan ,diffTilt,panoObj.getFov(),10);
	};


	this.enable=function() {
		if (isDeviceEnabled && !isEnabled) {
			window.addEventListener("deviceorientation", handleDeviceOrientation, true);
			container.addEventListener("touchstart", handleTouchStart, true);
			container.addEventListener("touchmove", handleTouchMove, true),
			container.addEventListener("touchend", handleTouchEnd, true);
			container.addEventListener("touchcancel", handleTouchEnd, true);
			container.addEventListener("MSPointerDown", handleTouchStart, true);
			container.addEventListener("mousedown", handleTouchStart, true);
			container.addEventListener("mousemove", handleTouchStart, true);
			container.addEventListener("mouseup", handleTouchEnd, true);
			isEnabled = true;
		}
		return isEnabled;
	}

	this.disable=function() {
		if (isDeviceEnabled && isEnabled) {
			window.removeEventListener("deviceorientation", handleDeviceOrientation);
			container.removeEventListener("touchstart", handleTouchStart);
			container.removeEventListener("touchend", handleTouchEnd);
			container.removeEventListener("touchcancel", handleTouchEnd);
			isEnabled = false;
		}
		return isEnabled;
	}

	this.toggle=function() {
		if(isEnabled)
			return this.disable();
		else
			return this.enable();
	}

	this.setAdaptiveVOffset=function(arg) {
		if(arg==undefined || arg === null || arg == "")
			isAdaptiveDiffTilt = !isAdaptiveDiffTilt;
		else
			isAdaptiveDiffTilt = Boolean(arg);
	}

	this.setTrueNorth=function(arg) {
		if(arg==undefined || arg === null || arg == "")
			isTrueNorth = !isTrueNorth;
		else
			isTrueNorth = Boolean(arg);
	}

	////////////////////////////////////////////////////////////
	var _oldObj,startX,startY,endY = 0,
	endX = 0,
	diffY = 0,
	diffX = 0;
	var _touchid=null;
	var limit = 15; //判断方向的最小滑动距离

	function handleTouchStart(event) {
		if(!_IsOnlyTouch&&_IsOnleyInteractive)return;
		isTouching = true;

		var _targetTouches = event.targetTouches || event.originalEvent.targetTouches;
		if(_targetTouches){
			var touch = _targetTouches[0];

			if(_touchid===null)_touchid=touch.identifier;
			if(_touchid!==touch.identifier)return;

			startY = touch.pageY;
			startX = touch.pageX;
			endY = 0;
			endX = 0;
			diffY = 0;
			diffX = 0;
			_oldObj={
				pan:panoObject.getPanNorth(),
				tilt:panoObject.getTilt(),
			};
		}

		// $('#debug').html('handleTouchStart:'+JSON.stringify(_oldObj));
	}



	function handleTouchMove(event){
		if(!_IsOnlyTouch)return;
		var _targetTouches = event.targetTouches || event.originalEvent.targetTouches;
		var touch = _targetTouches[0];

		if(_touchid===null)return;
		if(_touchid!==touch.identifier)return;


		endX = touch.pageX;
		endY = touch.pageY;

		diffX = endX - startX;
		diffY = endY - startY;

		diffY = diffY > 0 ? (diffY - limit) : (diffY + limit);
		diffX = diffX > 0 ? (diffX - limit) : (diffX + limit);

		var _w=window.innerWidth;
		var _h=window.innerHeight;

		diffX=diffX/_w;
		diffY=diffY/_h;




		// var _pan=_oldObj.pan+90*diffX;
		var _pan=_oldObj.pan+90*diffX;
		var _tilt=_oldObj.tilt+90*diffY;
		// panoObj.setPanNorth(_pan);
		// panoObj.setTilt(_tilt);

		panoObj.moveTo(_pan,_tilt,panoObj.getFov(),10);
		//  $('#debug').html('move:'+JSON.stringify(
		// 	 {
		// 		 diffX:diffX,
		// 		 diffY:diffY,
		// 	 }
		//  ));
	}

	function handleTouchEnd(event) {
		if(!_IsOnlyTouch&&_IsOnleyInteractive)return;
		isTouching = false;
		// $('#debug').html('handleTouchEnd');
		// panoObject.setPan(_oldObj.pan+10)
		// panoObject.setTilt(_oldObj.tilt+10);

		var _targetTouches = event.targetTouches || event.originalEvent.targetTouches;
		if(_targetTouches){
			var touch = _targetTouches[0];
			if(touch&&touch.identifier&&_touchid!==touch.identifier){
				return;
			}
			_touchid=null;
		}

		diffPan = panoObj.getPanNorth();
		diffTilt = panoObj.getTilt();

	}

	var lastYaw=0;
	var lastPitch=0;
	var lastTouch=0;

	var ignoreInit=10;

	function handleDeviceOrientation(event) {
		if(_IsOnlyTouch&&_IsOnleyInteractive)return;
		if ((!event["alpha"]) || (!event["beta"]) || (!event["gamma"])) return;

		var d = new Date();
		// var isTouching=(panoObj.isTouching());

		// $('#debug').html('isTouching:',isTouching);
		if (isTouching) {
			lastTouch = d.getTime();
		}
		if ( !isTouching && isEnabled && (d.getTime()-lastTouch)>1000) {

			// process event.alpha, event.beta and event.gamma
			var orientation = rotateEuler( new Object( {
					yaw: event["alpha"] * degRad,
					pitch: event["beta"] * degRad,
					roll: event["gamma"] * degRad
				} ) ),
				yaw = orientation.yaw / degRad,
				pitch = orientation.pitch / degRad,
				altyaw = yaw,
				factor;


			// fix gimbal lock
			if( Math.abs(pitch) > 70 ) {
				altyaw = event.alpha;

				switch(window.orientation) {
					case 0:
						if ( pitch>0 )
							altyaw += 180;
						break;
					case 90:
						altyaw += 90;
						break;
					case -90:
						altyaw += -90;
						break;
					case 180:
						if ( pitch<0 )
							altyaw += 180;
						break;
				}

				altyaw = altyaw % 360;
				if( Math.abs( altyaw - yaw ) > 180 )
					altyaw += ( altyaw < yaw ) ? 360 : -360;

				factor = Math.min( 1, ( Math.abs( pitch ) - 70 ) / 10 );
				yaw = yaw * ( 1-factor ) + altyaw * factor;
			}
			// isTrueNorth=true;
			if (isTrueNorth) {

				var panoHeading = panoObj.getPanNorth() - panoObj.getPanN();
				// $('#debug').html('ignoreInit:'+panoObj.getPanNorth()+'   '+panoObj.getPanN());
				var deviceHeading=-event["alpha"];
				if ((event.webkitCompassHeading) && ((!event.webkitCompassAccuracy) || (event.webkitCompassAccuracy>=0))) {
					deviceHeading = event.webkitCompassHeading;
				}
				if (window.orientation) {
					deviceHeading+=window.orientation;
				}
				diffPan= - (deviceHeading + panoHeading + yaw);
			}

			if (ignoreInit==0) {
				panoObj.moveTo(diffPan + yaw ,diffTilt - pitch,panoObj.getFov(),10);
			}
			lastYaw = yaw;
			lastPitch = -pitch;
			if (ignoreInit>0) {
				diffPan = panoObj.getPan() - lastYaw;
				diffTilt = panoObj.getTilt() - lastPitch;
				ignoreInit--;
			}
			adaptDiffTilt();
		} else {
			diffPan = panoObj.getPan() - lastYaw;
			diffTilt = panoObj.getTilt() - lastPitch;
		}
	}

	function adaptDiffTilt() {
		if( diffTilt != 0 && isAdaptiveDiffTilt ) {
				diffTilt *= 0.98;
				if( Math.abs( diffTilt ) < 0.1 ) {
					diffTilt = 0;
				}
		}
	}

	function rotateEuler( euler ) {
		// based on http://www.euclideanspace.com/maths/geometry/rotations/conversions/eulerToMatrix/index.htm
		// and http://www.euclideanspace.com/maths/geometry/rotations/conversions/matrixToEuler/index.htm

		var heading, bank, attitude,
			ch = Math.cos(euler.yaw),
			sh = Math.sin(euler.yaw),
			ca = Math.cos(euler.pitch),
			sa = Math.sin(euler.pitch),
			cb = Math.cos(euler.roll),
			sb = Math.sin(euler.roll);

		// note: includes 90 degree rotation around z axis
		matrix = new Array(
			sh*sb - ch*sa*cb,   -ch*ca,    ch*sa*sb + sh*cb,
			ca*cb,              -sa,      -ca*sb,
			sh*sa*cb + ch*sb,    sh*ca,   -sh*sa*sb + ch*cb
		);

		/* [m00 m01 m02] 0 1 2
		 * [m10 m11 m12] 3 4 5
		 * [m20 m21 m22] 6 7 8 */

		if (matrix[3] > 0.9999) { // singularity at north pole
			heading = Math.atan2(matrix[2],matrix[8]);
			attitude = Math.PI/2;
			bank = 0;
		} else if (matrix[3] < -0.9999) { // singularity at south pole
			heading = Math.atan2(matrix[2],matrix[8]);
			attitude = -Math.PI/2;
			bank = 0;
		} else {
			heading = Math.atan2(-matrix[6],matrix[0]);
			bank = Math.atan2(-matrix[5],matrix[4]);
			attitude = Math.asin(matrix[3]);
		}

		return new Object( { yaw:heading, pitch:attitude, roll:bank } )
	}

	///////////////////////////////////////////////////

	var isDeviceEnabled = !!window.DeviceOrientationEvent,
		panoObj,

		isEnabled = false,
		isAdaptiveDiffTilt = false,
		isTrueNorth = false,
		isEasing = 0.5;

		isTouching = false,

		diffPan = 0, diffTilt = 0,
		hlookat = 0, vlookat = 0,

		degRad = Math.PI/180;

	panoObj=panoObject;
	// turn on "auto level"
	isAdaptiveDiffTilt=true;
	isTrueNorth=false;
	var container = document.getElementById(containerId);

	diffPan = panoObj.getPan();
	diffTilt = panoObj.getTilt();

	this.enable();

	////////////////////////////////////////////////////////////
}
