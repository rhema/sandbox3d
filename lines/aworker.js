self.importScripts("../libs/optimization.js");


var do_optimize = function(x0,y0,tx,ty,totalSegments,lengthPerSegment,segmentRotations,vertices)
{
	var oldRotations = segmentRotations;
	var costfunc = function(segmentRotations)
	{
		//also add error for changes in other positions..
		
		var angleGross = 0;
		var error = 0;
		var serr = 0;
		var anew = 0;
		var x=x0;
		var y=y0;
		var trot = 0;
		
		
		for(var i=0;i<totalSegments; i+=1)
		{
			rot = segmentRotations[i];
			if(i != 0)
			{
				angleGross += Math.abs(rot - segmentRotations[i-1]);
				 
			} 
			anew +  (segmentRotations[i] - oldRotations[i])*(segmentRotations[i] - oldRotations[i]);
			trot += rot;
			x += Math.sin(trot)*lengthPerSegment;
			y += Math.cos(trot)*lengthPerSegment;
			
			//error += Math.abs( theObject.geometry.vertices[i+1].x - x );
			//error += Math.abs( theObject.geometry.vertices[i+1].y - y );
			xerr = Math.abs( vertices[i+1].x - x );
			yerr = Math.abs( vertices[i+1].y - y );
			serr += (xerr*xerr + yerr*yerr);
		}
		
		xerr = Math.abs( tx - x );
		yerr = Math.abs( ty - y );
		gerr = (xerr*xerr + yerr*yerr);
		error = gerr*5 + serr*.1 + angleGross*.1+anew*0;
		error = gerr*7.5 + angleGross*10+anew*0;
		return error;
	};

	return optimjs.minimize_Powell(costfunc,segmentRotations)['argument'];
};


//TBD encapsualte optimizatoin shiz and make it work...
self.onmessage = function (msg) {
	// console.log("Got a message!!!");
	// console.log(msg.data);
	var d = msg.data;
	var ret = do_optimize(d[0],d[1],d[2],d[3],d[4],d[5],d[6],d[7]);
	// console.log(ret);
	self.postMessage(ret);
};

console.log("worker loaded...");