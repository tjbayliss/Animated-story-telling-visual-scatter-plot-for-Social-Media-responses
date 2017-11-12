	/*

	Name: SENTENCING ATTITUDES - VISUAL INTERACTIVE NUMBER 2
	Developer: J BAYLISS
	From/to: Nov 2016 to Dec 2016
	Technologies: D3, Javascript, D3, Chosen, Bootstrap

	*/


	console.log("VISUAL INTERACTIVE NUMBER 2 - DEVELOPMENT / LABS PORTAL");
	
	
	
	
	
	
	// http://stackoverflow.com/questions/14167863/how-can-i-bring-a-circle-to-the-front-with-d3
	d3.selection.prototype.moveToFront = function() {
	  return this.each(function(){
		this.parentNode.appendChild(this);
	  });
	};
	d3.selection.prototype.moveToBack = function() { 
		return this.each(function() { 
			var firstChild = this.parentNode.firstChild; 
			if (firstChild) { 
				this.parentNode.insertBefore(this, firstChild); 
			} 
		}); 
	};


	// initialise global variables.
	var graphic = $('#graphic'); // set variable to DOM element to contain graphic
	var deadspace  = $('#deadspace'); // set variable to DOM element to contain graphic
	var footer = $('#footer'); // set variable to DOM element to contain graphic
	var buttons = $("#buttons"); // global variable to #buttons DOM DIV item
	var vis = {}; // global object variable to contain all variables prefixed with 'vis.'	
	var svg; // svg container          
	var svgBottom; // svg container 
	var circleScale = d3.scale.sqrt().domain([0, 1]).range([0, 15]);
	
	var callOutHeightArray = [];

	var View1_bars = {};
	var View2_dots = {};
	var View3_dots = {};
	var View4_dots = {};
	var View5_dots = {};
	var View5a_dots = {};
	var View6_dots = {};
	var View6a_dots = {};/*
	var View7_dots = {};*/
	var dots = {};
	
	var View2_articleIndex = {};
	var View3_articleIndex = {};
	var View4_articleIndex = {};
	var View5_articleIndex = {};
	var View5a_articleIndex = {};
	var View6a_articleIndex = {};
	var View6_articleIndex = {};
	
	var view2_nested_data = {};
	
	var coloumnWidth = -1;

	var pymChild = null; // initial Pym variable
	var height; // height of graphic container. Updated on resizing.
	
	var auto = false;
	
	var screenResolution = {
								'thunderbolt' : { width:2000 , height:1440 } ,
								'node' : { width:1080 , height:1920 } ,
								'supernodeA' : { width:5760 , height:4320 } ,
								'supernodeB' : { width:5760 , height:4320 } ,
								'supernodeC' : { width:7680 , height:4320 } ,
								'supernodeD' : { width:5760 , height:4320 } ,
								'supernodeE' : { width:5760 , height:4320 } ,
								'full' : { width:30270 , height:4320 }
							};	
	var titles = [ 
					'News Analysis: Sentiment of Articles - Rotherham Child Abuse',
					'News Analysis: Recurring National and Local News',
					'News Analysis: Articles Relevant to Child Abuse',
					'News Analysis: Specific Entities Related to Police',
					'News Analysis: Specific Entities Related to Criminal Justice' 
				];
			
	var calloutIndexes = [ 
							[ 70 , 248 , 340 ],
							[  ],
							[  ],
							[ 9 , 28 , 41 , 79 ],
							[ 15 , 17 , 23 ]
						];
			

			
	var calloutTimeOffsets = [ 
								[ 55 , 55 , 55 ],
								[  ],
								[  ],
								[ -207.5 , 0 , -207.5 , 0 ],
								[ -207.5 , 0 , -207.5 ]
							];
							
	var calloutTexts = [
							[
								"Star (Sheffield): Police 'arrested wrong man in Rotherham child abuse investigation' - court",
								"Daily Telegraph (UK): Nearly 200 child abuse cases for one police force",
								"Guardian (UK): Child sex abuse in Rotherham - 'I was treated as a criminal, never as a victim'"
							],
							[  ],
							[  ],
							[ 
								"Police and Crime Panel",
								"Police Commissioner",
								"South Yorkshire Police",
								"Independent Police Complaints Commission"
							],
							[
								"Crime Prosecution Service",
								"National Crime Agency",
								"Sheffield Crown Court"
							]
						];
		
	var callOutHeight = [ 
							[ 1 , 1 , 0.6 ],
							[  ],
							[  ],
							[ 0.5 , 1.0 , -0.6 , 1.0 ],
							[ 1.0, 1.0 , 1.0 ]
						];
						
	var callOutHeightBottom = [ 
								[ 20 , 20 , 20 ],
								[  ],
								[  ],
								[ 20 , 17 , 20 , 20 ],
								[ 20 , 20 , 20 ],
							];
			
	var marginDeadspace = { top:0, right:0, bottom:0, left:0 };
					
	var yAxisRanges = {
						top : { minimum:-1 , maximum:1 },
						bottom : { minimum:0 , maximum:20 }
					}
					
	var ratios = { topRatio:0.75 , bottomRatio:0.45 }
		
	var margin = { 
				top : { top:25, right:200, bottom:25, left:50 } ,
				bottom : { top:40, right:200, bottom:25, left:50 } 
			}
			 
			
		
	var requiredResolution = 'thunderbolt';
	var graphSpace = {};
	var deadSpace = {};
		     

	// broswer use checking ... need this to resovle issue with tooltip not locating precisely in FireFox.			
	var isOpera = !!window.opera || navigator.userAgent.indexOf(' OPR/') >= 0; // Opera 8.0+ (UA detection to detect Blink/v8-powered Opera)
	var isFirefox = typeof InstallTrigger !== 'undefined';   // Firefox 1.0+
	var isSafari = Object.prototype.toString.call(window.HTMLElement).indexOf('Constructor') > 0; // At least Safari 3+: "[object HTMLElementConstructor]"
	var isChrome = !!window.chrome && !isOpera;              // Chrome 1+
	var isIE = /*@cc_on!@*/false || !!document.documentMode;   // At least IE6		

	var output = 'Detecting browsers by ducktyping:		';
		output += 'isFirefox: ' + isFirefox + '		';
		output += 'isChrome: ' + isChrome + '		';
		output += 'isSafari: ' + isSafari + '		';
		output += 'isOpera: ' + isOpera + '		';
		output += 'isIE: ' + isIE + '		';
	   		
	var dateFormat = "%Y%m%d";     // 01/01/2000
	var view1 = {};
	var view2 = {};
	var view3 = {};
	var view4 = {};
	var view5 = {};
	var view6 = {};
					
	var viewCounter = 0;
	
	/*
		name: 			drawGraphic
		DESCRIPTION:	Main drawing function to draw to DOM initial scarter plot view. 	
		CALLED FROM:	Pym in 	
		CALLS:			
		REQUIRES: 		n/a
		RETURNS: 		n/a
	*/
	function drawGraphic()
	{
			
		var w = window.innerWidth;
		var h = window.innerHeight;	
		
			
		// clear out existing graphics and footer
		graphic.empty();
		deadspace.empty();
		footer.empty();
								
		//var requiredResolution = 'thunderbolt';
/*
		graphSpace = {
						width:screenResolution[requiredResolution].width ,
						height:screenResolution[requiredResolution].height*0.75
					}
						
		deadSpace= {
						width:screenResolution[requiredResolution].width ,
						height:screenResolution[requiredResolution].height*0.0
					}
*/

		var aspectRatio = [ 16, 9 ];

		graphSpace = {
						width : graphic.width() ,
						height : Math.ceil(((graphic.width() - margin.top.left - margin.top.right) * aspectRatio[1]) / aspectRatio[0]) - margin.top.top - margin.top.bottom
					}
						
		deadSpace= {
						width:graphic.width() ,
						height:0.0
					}
					
		console.log(graphSpace.width + " : " + graphSpace.height);
		
		
		/* TOP BAR CHART */
		
		d3.select("#graphic").append("h1").attr("id" , "viewCounter").style("text-align" , "center").text(titles[viewCounter]);
		
		
		svg = d3.select("#graphic")
			.append("svg")
			.attr("class" , "svg")
			.attr("id" , "svg")
			.attr("width" , graphSpace.width )
			.attr("height" , graphSpace.height*ratios.topRatio )
			.attr("x" , 0 )
			.attr("y" , 0 );
			
		
								 
		// define and construct y axis domain and ranges
		vis.yTop = d3.scale.linear().domain([yAxisRanges.top.minimum , yAxisRanges.top.maximum]).range([ ((graphSpace.height*ratios.topRatio)-margin.top.top-margin.top.bottom) , margin.top.top ]);
		vis.yAxisTop = d3.svg.axis().scale(vis.yTop).orient("left").ticks(10).tickFormat(d3.format(",.1f"));						
		d3.select("#svg")
			.append("g")
			.attr("class", "y axis")
			.attr("id", "topYAxis")
			.attr("transform", "translate(" + margin.top.left + "," + margin.top.top + ")")
			.call(vis.yAxisTop);
			
		vis.yticksTop = svg.selectAll('#topYAxis').selectAll('.tick');					 
		vis.yticksTop.append('svg:line')
			.attr( 'id' , "yAxisTicksTop" )
			.attr( 'y0' , 0 )
			.attr( 'y1' , 0 )
			.attr( 'x1' , 0 )
			.attr( 'x2', graphSpace.width-margin.bottom.left*2)
			.style("opacity" , 0.15);
											 
		// define and construct y axis domain and ranges				
		vis.xTop = d3.time.scale().range([margin.top.left, (graphSpace.width - margin.top.left/* - margin.top.right*/)]);
		vis.xTop.domain(d3.extent(view1, function(d) { return d.formattedDate; }));
		vis.xAxisTop = d3.svg.axis().scale(vis.xTop).orient("bottom");	
			
/*						
		vis.xAxisTop = d3.svg.axis()
			.scale(vis.xTop)
			.orient("bottom")
			.tickFormat(function(d,i) {
				var fmt = d3.time.format("%m/%Y");
				str = fmt(d);
				returnstr;
			})
			.tickPadding(5);					
*/

		
		d3.select("#svg")
			.append("text")
			.attr( "class" , "yAxisLabels")
			.attr( "id" , function(d,i){ return "yAxisLabel"; })
			.attr("x" , margin.top.left)
			.attr("y" , 25)
			.style("font-size" , "1.0em")
			.style("fill" , "white")
			.text("Sentiment");
				 
		var dots = svg.selectAll(".dots")
			.data(View2_dots['sentiment'])
			.enter()
			.append("circle");
			
		var circleAttributes = dots
			.attr("class", function (d,i) {
				var classStr = "dots article_index"+d.article_index;
				if ( d.callout_flag == 1 ) { classStr = classStr + " view0"; }
				return classStr/*"dots article_index"+d.article_index*/;
			})
			.attr("id", function (d,i) { return "dot-" + d.index; })
			.attr("cx", function (d,i) { return vis.xTop(d.formattedDate); })
			.attr("cy", function (d,i) { return margin.top.top+vis.yTop(d.sentiment); })
			.attr("r", function (d,i) { return 5; })
			.style("opacity", function(d,i) { return 1.0; })
			.style("fill" , "#888888")
			.style("stroke" , function(d,i){
				if ( calloutIndexes[0].indexOf(+d.index) != -1 ) { return "#FFFFFF"; }
				else { return "#888888"; }
			})
			.style("stroke-width" , "2px")
			.style("fill-opacity" , 0.75);
			
		
			
			
		var dots2 = svg.selectAll(".dots2")
			.data(View5_dots['index'])
			.enter()
			.append("circle");
	
		var circleAttributes2 = dots2
			.attr("class", function (d,i) {
				var classStr = "dots2 article_index"+d.article_index;
				if ( d.callout_flag == 1 ) { classStr = classStr + " view1"; }
				
				if ( calloutIndexes[3].indexOf(d.index) != -1 ) {
					classStr = classStr + " pulse";
				}
				
				return classStr;
			})
			.attr("id", function (d,i) {		
				return "dot2-" + d.index;
			})
			.attr("cx", function (d,i) { return vis.xTop(d.formattedDate); })
			.attr("cy", function (d,i) { return margin.top.top+vis.yTop(d.sentiment_score); })
			.attr("r", function (d,i) { return 0; })
			.style("fill" , "#005DA2")
			.style("stroke" , "#005DA2")
			.style("stroke-width" , "2px")
			.style("fill-opacity" , 0.00);
			
			
			
			
			
		var dots2a = svg.selectAll(".dots2a")
			.data(View5a_dots['index'])
			.enter()
			.append("circle");
	
		var circleAttributes2a = dots2a
			.attr("class", function (d,i) {
				var classStr = "dots2a article_index"+d.article_index;
				return classStr;
			})
			.attr("id", function (d,i) { return "dot2a-" + d.index; })
			.attr("cx", function (d,i) { return vis.xTop(d.formattedDate); })
			.attr("cy", function (d,i) { return margin.top.top+vis.yTop(d.sentiment_score); })
			.attr("r", function (d,i) { return 0; })
			.style("fill" , "#005DA2")
			.style("stroke" , "#005DA2")
			.style("stroke-width" , "2px")
			.style("fill-opacity" , 1.00);
			
			
			
			
			
		var dots3a = svg.selectAll(".dots3a")
			.data(View6a_dots['index'])
			.enter()
			.append("circle");
	
		var circleAttributes3a = dots3a
			.attr("class", function (d,i){
				var classStr = "dots3a article_index"+d.article_index;
				if ( d.callout_flag == 1 ) { classStr = classStr + " view2"; }
				return classStr ;
			})
			.attr("id", function (d,i) { return "dot3a-" + d.index; })
			.attr("cx", function (d,i) { return vis.xTop(d.formattedDate); })
			.attr("cy", function (d,i) { return margin.top.top+vis.yTop(d.sentiment_score); })
			.attr("r", function (d,i) { return 0; })
			.style("fill" , "#005DA2")
			.style("stroke" , "#005DA2")
			.style("stroke-width" , "2px")
			.style("fill-opacity" , 0.00);
			
			
			
			
			
		var dots3 = svg.selectAll(".dots3")
			.data(View6_dots['index'])
			.enter()
			.append("circle");
	
		var circleAttributes3 = dots3
			.attr("class", function (d,i){
				var classStr = "dots3 article_index"+d.article_index;
				if ( d.callout_flag == 1 ) { classStr = classStr + " view2"; }
				return classStr ;
			})
			.attr("id", function (d,i) { return "dot3-" + d.index; })
			.attr("cx", function (d,i) { return vis.xTop(d.formattedDate); })
			.attr("cy", function (d,i) { return margin.top.top+vis.yTop(d.sentiment_score); })
			.attr("r", function (d,i) { return 0; })
			.style("fill" , "#005DA2")
			.style("stroke" , "#005DA2")
			.style("stroke-width" , "2px")
			.style("fill-opacity" , 0.00);
			 
			
			
			
/*
		var dots4 = svg.selectAll(".dots4")
			.data(View7_dots['index'])
			.enter()
			.append("circle");
	
		var circleAttributes4 = dots4
			.attr("class", function (d,i) {
				var classStr = "dots4 article_index"+d.article_index;
				if ( d.callout_flag == 1 ) { classStr = classStr + " view3"; }
				return classStr;
			})
			.attr("id", function (d,i) { return "dot4-" + d.index; })
			.attr("cx", function (d,i) { return vis.xTop(d.formattedDate); })
			.attr("cy", function (d,i) { return margin.top.top+vis.yTop(d.sentiment_score); })
			.attr("r", function (d,i) { return 0; })
			.style("fill" , "#005DA2")
			.style("stroke" , "#005DA2")
			.style("stroke-width" , "2px")
			.style("fill-opacity" , 0.00);
*/

		//create x axis
		d3.select("#svg")
			.append('g')
			.attr('class', 'x axis')
			.attr('id', 'topXAxis')
			.attr('transform', function(d, i){ return "translate(" + (0) + "," + (margin.top.top + vis.yTop(0)) + ")"; })
			.call(vis.xAxisTop);
		
				
				
		
		
		/* BOTTOM BAR CHART */
			
		svgBottom = d3.select("#graphic")
			.append("svg")
			.attr("class" , "svg")
			.attr("id" , "svgBottom")
			.attr("width" , graphSpace.width )
			.attr("height" , graphSpace.height*ratios.bottomRatio )
			.attr("x" , 0 )
			.attr("y" , 0 ); 
			
		


		
		// define clipPath around scatter plot frame
		svgBottom.append("defs").append("clipPath")
			.attr("id", "clip")
			.append("rect")
			.attr("x", margin.bottom.left )
			.attr("y", 0 )
			.attr("width", graphSpace.width - margin.bottom.left*2 )
			.attr("height", graphSpace.height*ratios.bottomRatio );
			
						
		vis.xBottom = d3.time.scale().range([margin.top.left, (graphSpace.width - margin.top.left/* - margin.top.right*/)]);
		vis.xBottom.domain(d3.extent(view1, function(d) { return d.formattedDate; }));
		vis.xAxisBottom = d3.svg.axis().scale(vis.xBottom).orient("bottom");	
		
				
/*
		vis.xAxisBottom = d3.svg.axis()
			.scale(vis.xBottom)
			.orient("bottom")
			.tickFormat(function(d,i) {
				var fmt = d3.time.format("%m/%Y");
				str = fmt(d);
				return str;
			})
			.tickPadding(5);
*/			
														 
		// define and construct y axis domain and ranges
		vis.yBottom = d3.scale.linear().domain([yAxisRanges.bottom.minimum , yAxisRanges.bottom.maximum]).range([ ((graphSpace.height*ratios.bottomRatio)-margin.bottom.top/*-margin.bottom.bottom*/) , margin.bottom.top ]);
		vis.yAxisBottom = d3.svg.axis().scale(vis.yBottom).orient("left").ticks(5).tickFormat(d3.format(",.0f"));	
		
								
		
		var bars = svgBottom.selectAll("rect")
			.data(View1_bars['number_of_articles_per_date'])
			.enter()
			.append("rect");
			
		var numberDates = View1_bars['date'].length;
		coloumnWidth =  ((vis.xBottom.range()[1] - vis.xBottom.range()[0])/numberDates)/2;
	
		var barAttributes = bars
			.attr("class", function (d,i) { return "bars"; })
			.attr("id", function (d,i) { return "bar-" + i; })				
			.attr("x", function(d) { return vis.xBottom(d.formattedDate) - coloumnWidth/2; })
			.attr("y", function(d) { return vis.yBottom(+d.number_of_articles_per_date); })
			.attr("width", coloumnWidth )
			.attr("height", function(d) { return vis.yBottom(0) - vis.yBottom(+d.number_of_articles_per_date); })
			.style("fill" , "#005DA2")
			.style("stroke" , "#005DA2" )
			.style("stroke-width" , "1px")
			.style("fill-opacity" , 0.75)
			.attr("clip-path", "url(#clip)");	
									
		d3.select("#svgBottom")
			.append("g")
			.attr("class", "y axis")
			.attr("id", "bottomYAxis")
			.attr("transform", "translate(" + margin.bottom.left + "," + (0)  + ")")
			.call(vis.yAxisBottom);
	
		d3.select("#svgBottom")
			.append("text")
			.attr( "class" , "yAxisLabels")
			.attr( "id" , function(d,i){ return "yAxisLabel"; })
			.attr("x" , margin.bottom.left)
			.attr("y" , 20)
			.style("font-size" , "1.0em")
			.style("fill" , "white")
			.text("Number of articles per day");
			
		
			
			
			
		// draw tick grid lines extending from y-axis ticks on axis across scatter graph
			
		vis.yticksBottom = svgBottom.selectAll('#bottomYAxis').selectAll('.tick');					 
		vis.yticksBottom.append('svg:line')
			.attr( 'id' , "yAxisTicksBottom" )
			.attr( 'y0' , 0 )
			.attr( 'y1' , 0 )
			.attr( 'x1' , 0 )
			.attr( 'x2', graphSpace.width-margin.bottom.left*2)
			.style("opacity" , 0.15);
			
		//create brush x axis
		d3.select("#svgBottom")
			.append('g')
			.attr('class', 'x axis')
			.attr('id', 'bottomXAxis')
			.attr('transform', function(d, i){ return "translate(" + (0) + "," + ( + vis.yBottom(0)) + ")"; })
			.call(vis.xAxisBottom);	
			
		svgDeadSpace = d3.select("#deadspace")
			.append("svg")
			.attr("class" , "svg")
			.attr("id" , "svgDeadSpace")
			.attr("width" , deadSpace.width )
			.attr("height" , deadSpace.height )
			.attr("x" , 0 )
			.attr("y" , 0 ); 			
			 
		d3.select("#footer")
			.append("a")
			  .attr("href", "http://innovation.thomsonreuters.com/en/labs.html")
			  .attr("target" , "_blank")
			  .html("</br>Data visualisation by Thomson Reuters Labs");
		  
		 var sel = d3.selectAll(".dots.view0");
		 sel.moveToFront();
			
		callOuts();
		drawLegend();
		
		if ( auto == true ){
			
		  myInterval = setInterval(function () {
			  
				transitionData();
				viewCounter++;
				if (viewCounter === 5) {
					clearInterval(myInterval);
				}
			}, 5000);
		}
			 
		//use pym to calculate chart dimensions	
		if (pymChild) { pymChild.sendHeight(); }

		return;

	} // end function drawGraphic()






	/*
		NAME: 			buildUI
		DESCRIPTION: 	function to build intitial UI interface.
		CALLED FROM:	Modernizr.inlinesvg
		CALLS:			n/a
		REQUIRES: 		n/a	
		RETURNS: 		n/a		
	*/
	function buildUI(){	
		
		return;
		
	} // end function buildUI()



	/*
	NAME: 			transitionData
	DESCRIPTION: 	
	CALLED FROM:	
					
	CALLS:			
					
	REQUIRES: 		n/a
	RETURNS: 		n/a
	*/
	function transitionData()
	{
		var index = 0;
		d3.select("#viewCounter").text(titles[viewCounter]);
		
		if ( viewCounter == 0 ) {
			drawLegend();
		}
		else if ( viewCounter == 1 ) {
			
			$(".callOutgroups").remove();
			
			// 'national versus local' page ... 
			
			for(var i=0; i<view2.length; i++){
				
				index = i;
				
				if ( View3_articleIndex[view2[i].article_index] != undefined ){
					
					d3.selectAll(".dots.article_index"+view2[i].article_index)
						.transition()
						.duration(2500)
						.attr("r" , function(d,i){
							if ( View3_articleIndex[view2[index].article_index].color_grp == "National" ) { return circleScale(View3_articleIndex[view2[index].article_index].size); }
							else if ( View3_articleIndex[view2[index].article_index].color_grp == "Local" ) { return circleScale(View3_articleIndex[view2[index].article_index].size); }
						})
						.style("fill" , function(d,i){
							if ( View3_articleIndex[view2[index].article_index].color_grp == "National" ) { return "#005DA2"; }
							else if ( View3_articleIndex[view2[index].article_index].color_grp == "Local" ) { return "#387C2B"; }
						})
						.style("stroke" , function(d,i){
							if ( View3_articleIndex[view2[index].article_index].color_grp == "National" ) { return "#005DA2"; }
							else if ( View3_articleIndex[view2[index].article_index].color_grp == "Local" ) { return "#387C2B"; }
						});	
				}
				else { 
					d3.selectAll(".dots.article_index"+view2[i].article_index)
						.transition()
						.duration(2500)
						.attr("r" , 5)
						.style("fill" , "#888888" )
						.style("stroke" , "#888888" )
						.style("stroke-width" , "0px")
						.style("fill-opacity" , 0.50);	
				}
			}

			var sel = d3.selectAll(".dots2.view1");
			sel.moveToFront();
				
			callOuts();
					
		}// end else if ... 
		
		
		else if ( viewCounter == 2 ) {
			
			$(".callOutgroups").remove();
		
			for(var i=0; i<view2.length; i++){
				
				index = i;
				
				if ( View4_articleIndex[view2[i].article_index] != undefined ){
					
					d3.selectAll(".dots.article_index"+view2[i].article_index)
						.transition()
						.duration(2500)
						.attr("r" , function(d,i){ return circleScale(View4_articleIndex[view2[index].article_index].size); })
						.style("fill" , "#005DA2" )
						.style("stroke" , "#005DA2" );	
				}
				else { 
					d3.selectAll(".dots.article_index"+view2[i].article_index)
						.transition()
						.duration(2500)
						.attr("r" , 5)
						.style("fill" , /*"#888888"*/ "#FF5900" )
						.style("stroke" , /*"#888888"*/ "#FF5900" )
						.style("stroke-width" , "0px")
						.style("fill-opacity" , 0.50);	
				}
			}
			
			callOuts();
			
		}// end else if ... 	
		
		else if ( viewCounter == 3 ) {
			
			$(".callOutgroups").remove();
			
			d3.selectAll(".dots")
				.transition()
				.duration(2500)
				.attr("r" , 5)
				.style("fill" , /*"#888888"*/ "#FF5900" )
				.style("stroke" , /*"#888888"*/ "#FF5900" )
				.style("stroke-width" , "0px")
				.style("fill-opacity" , 0.50);
				
			setTimeout(function(){
								
				d3.selectAll(".dots2a")
					.transition()
					.duration(2500)
					.attr("r" , function(d,i){ return circleScale(d.relevance); })
					.style("fill-opacity" , 0.75);
												
				d3.selectAll(".dots2")
					.transition()
					.duration(2500)
					.attr("r" , function(d,i){ return circleScale(d.relevance); })
					.attr("cy", function (d,i) { return margin.top.top+vis.yTop(d.sentiment_score_alchemy); })
					.style("fill" , "#387C2B")
					.style("stroke" , function(d,i){
						if ( calloutIndexes[3].indexOf(d.index) != -1 ) { return "#FFFFFF"; }
						else { return "#387C2B"; }
					})
					.style("fill-opacity" , 0.75);
					
				callOuts();
					
			 }, 1500);
			/*
			callOuts();*/
			
		} // end else if ... 		
		
		else if ( viewCounter == 4 ) {
			
			$(".callOutgroups").remove();
			
			d3.selectAll(".dots2")
				.transition()
				.duration(2500)
				.attr("r" , 5)
				.style("fill" , /*"#888888"*/ "#FF5900" )
				.style("stroke" , /*"#888888"*/ "#FF5900" )
				.style("stroke-width" , "0px")
				.style("fill-opacity" , 0.50);
							
			d3.selectAll(".dots2a")
				.transition()
				.duration(2500)
				.attr("r" , 5)
				.style("fill" , /*"#888888"*/ "#FF5900" )
				.style("stroke" , /*"#888888"*/ "#FF5900" )
				.style("stroke-width" , "0px")
				.style("fill-opacity" , 0.50);
				
			setTimeout(function(){
								
				d3.selectAll(".dots3a")
					.transition()
					.duration(2500)
					.attr("r" , function(d,i){ return circleScale(d.relevance); })
					.style("fill-opacity" , 0.75);
				
				d3.selectAll(".dots3")
					.transition()
					.duration(2500)
					.attr("r" , function(d,i){ return circleScale(d.relevance); })
					.attr("cy", function (d,i) { return margin.top.top+vis.yTop(d.sentiment_score_alchemy); })
					.style("fill" , "#387C2B")
				/*	.style("stroke" , "#387C2B")	*/
					.style("stroke" , function(d,i){
						if ( calloutIndexes[4].indexOf(d.index) != -1 ) { return "#FFFFFF"; }
						else { return "#387C2B"; }
					})
					.style("fill-opacity" , 0.75);
	
				var sel = d3.selectAll(".dots3.view2");
				sel.moveToFront();
				
				callOuts();
					
			 }, 1500);
			
		} // end else if ... 		
		
		else {
			
		}
		
		drawLegend();
		
		return;
	 
	}// end transitionData()
	
	
	
	
	
	function getDotData(){

		// parse data into columns
		View1_bars = {};
		View2_dots = {};
		View3_dots = {};
		View4_dots = {};
		View5_dots = {};
		View6_dots = {};
		
		for (var field in view1[0]) {
		
			View1_bars[field] = view1.map(function(d,i) {
			
				return { 'index': d["index"], 'number_of_articles_per_date': d["number_of_articles_per_date"], 'date': d["date"], 'formattedDate': d.formattedDate };
			
			});
		}// end for ...
		
		
		view2_nested_data = d3.nest()
			.key(function(d) { return d.index; })
			.entries(view2);
		
		for (var field in view2[0]) {
		
			View2_dots[field] = view2.map(function(d,i) {
				
				View2_articleIndex[d.index] = { 
						'index': d["index"],
						'article_index': d["article_index"],
						'date': d["date"],
						'formattedDate': d["formattedDate"],
						'sentiment': +d["sentiment"],
						'article_title': d["article_title"],
						"callout_flag":	d["callout_flag"],
						"callout_text": d["callout_text"]
				};
				
				return { 
							'index': d["index"],
							'article_index': d["article_index"],
							'date': d["date"],
							'sentiment': +d["sentiment"],
							'article_title': d["article_title"],
							'formattedDate': d.formattedDate,
							"callout_flag":	d["callout_flag"],
							"callout_text": d["callout_text"]
						};
					});
		}// end for ...
		
		
		
		
		View3_dots = {};
		
		
		for (var field in view3[0]) {
			
			if ( field == "index" || field == "date" || field == "sentiment" || field == "size" || field == "color_grp" ) { continue; }
		
			View3_dots[field] = view3.map(function(d,i) {
				View3_articleIndex[d.article_index] =  { 'index': d["index"], 'article_index': d["article_index"], 'date': d["date"], 'size': d["size"], 'sentiment': +d["sentiment"], "color_grp" : d["color_grp"] };
			});
			
		}// end for ...
		
		
		View4_dots = {};
		
		/*  initial dots */
		
		for (var field in view4[0]) {
			
			if ( field == "index" || field == "date" || field == "sentiment" || field == "size" ) { continue; }
		
			View4_dots[field] = view4.map(function(d,i) {
				
				View4_articleIndex[d.article_index] =  { 
						'index': +d["index"],
						'article_index': +d["article_index"],
						'date': d["date"],
						'size': +d["size"],
						'sentiment': +d["sentiment"]
				};
			});
			
		}// end for ...
		
		
		
		
		
		View5_dots = {};
		View5a_dots = {};
		
		for (var field in view5[0]) {
			
			if ( 	field == "article_index" || 
					field == "date" || 
					field == "emotion_anger" || 
					field == "emotion_disgust" || 
					field == "emotion_fear" || 
					field == "emotion_joy" || 
					field == "emotion_sadness" || 
					field == "entity" || 
					field == "relevance" || 
					field == "sentiment_score_alchemy" ||
					field == "formattedDate" ||
					field == "sentiment_score" ||
					field == "callout_flag" ||
					field == "callout_text" ) { continue; } 
						
			View5a_dots[field] = view5.map(function(d,i) {
				
				View5a_articleIndex[d.index] = { 
						'index': +d["index"],
						'article_index': +d["article_index"],
						'formattedDate': d["formattedDate"],
						'sentiment_score': d["sentiment_score"],
						'date': d["date"],
						'emotion_anger': +d["emotion_anger"],
						'emotion_disgust': +d["emotion_disgust"],
						'emotion_fear': +d["emotion_fear"],
						'emotion_joy': +d["emotion_joy"],
						'emotion_sadness': +d["emotion_sadness"],
						'entity': d["entity"],
						'relevance': +d["relevance"],
						'sentiment_score_alchemy': +d["sentiment_score_alchemy"],
						"callout_flag":	d["callout_flag"],
						"callout_text": d["callout_text"]
				};
				
				return {
						'index': +d["index"],
						'article_index': +d["article_index"],
						'formattedDate': d["formattedDate"],
						'sentiment_score': +d["sentiment_score"],
						'date': d["date"],
						'emotion_anger': +d["emotion_anger"],
						'emotion_disgust': +d["emotion_disgust"],
						'emotion_fear': +d["emotion_fear"],
						'emotion_joy': +d["emotion_joy"],
						'emotion_sadness': +d["emotion_sadness"],
						'entity': d["entity"],
						'relevance': +d["relevance"],
						'sentiment_score_alchemy': +d["sentiment_score_alchemy"],
						"callout_flag":	d["callout_flag"],
						"callout_text": d["callout_text"]
				};
			});
				
				
						
			View5_dots[field] = view5.map(function(d,i) {
				
				View5_articleIndex[d.index] = { 
						'index': +d["index"],
						'article_index': +d["article_index"],
						'formattedDate': d["formattedDate"],
						'sentiment_score': d["sentiment_score"],
						'date': d["date"],
						'emotion_anger': +d["emotion_anger"],
						'emotion_disgust': +d["emotion_disgust"],
						'emotion_fear': +d["emotion_fear"],
						'emotion_joy': +d["emotion_joy"],
						'emotion_sadness': +d["emotion_sadness"],
						'entity': d["entity"],
						'relevance': +d["relevance"],
						'sentiment_score_alchemy': +d["sentiment_score_alchemy"],
						"callout_flag":	d["callout_flag"],
						"callout_text": d["callout_text"]
				};
				
				return {
						'index': +d["index"],
						'article_index': +d["article_index"],
						'formattedDate': d["formattedDate"],
						'sentiment_score': +d["sentiment_score"],
						'date': d["date"],
						'emotion_anger': +d["emotion_anger"],
						'emotion_disgust': +d["emotion_disgust"],
						'emotion_fear': +d["emotion_fear"],
						'emotion_joy': +d["emotion_joy"],
						'emotion_sadness': +d["emotion_sadness"],
						'entity': d["entity"],
						'relevance': +d["relevance"],
						'sentiment_score_alchemy': +d["sentiment_score_alchemy"],
						"callout_flag":	d["callout_flag"],
						"callout_text": d["callout_text"]
				};
			});
			
		}// end for ...
		
		for (var field in view6[0]) {
			
			if ( 	field == "article_index" || 
					field == "date" || 
					field == "sentiment_score" ||
					field == "sentiment_score_alchemy" ||
					field == "relevance" || 
					field == "entity" ||  
					field == "emotion_anger" || 
					field == "emotion_disgust" || 
					field == "emotion_fear" || 
					field == "emotion_joy" || 
					field == "emotion_sadness" || 
					field == "formattedDate" ||
					field == "callout_flag" ||
					field == "callout_text" ) { continue; } 
						
			View6a_dots[field] = view6.map(function(d,i) {
				
				View6a_articleIndex[d.index] = { 
						'index': +d["index"],
						'article_index': +d["article_index"],
						'formattedDate': d["formattedDate"],
						'sentiment_score': d["sentiment_score"],
						'date': d["date"],
						'emotion_anger': +d["emotion_anger"],
						'emotion_disgust': +d["emotion_disgust"],
						'emotion_fear': +d["emotion_fear"],
						'emotion_joy': +d["emotion_joy"],
						'emotion_sadness': +d["emotion_sadness"],
						'entity': d["entity"],
						'relevance': +d["relevance"],
						'sentiment_score_alchemy': +d["sentiment_score_alchemy"],
						"callout_flag":	d["callout_flag"],
						"callout_text": d["callout_text"]
				};
				
				return {
						'index': +d["index"],
						'date': d["date"],
						'formattedDate': d["formattedDate"],
						'article_index': +d["article_index"],
						'formattedDate': d["formattedDate"],
						'sentiment_score': +d["sentiment_score"],
						'sentiment_score_alchemy': +d["sentiment_score_alchemy"],
						'relevance': +d["relevance"],
						'entity': d["entity"],
						'emotion_anger': +d["emotion_anger"],
						'emotion_disgust': +d["emotion_disgust"],
						'emotion_fear': +d["emotion_fear"],
						'emotion_joy': +d["emotion_joy"],
						'emotion_sadness': +d["emotion_sadness"],
						"callout_flag":	d["callout_flag"],
						"callout_text": d["callout_text"]
				};
			});
						
			View6_dots[field] = view6.map(function(d,i) {
				
				View6_articleIndex[d.index] = { 
						'index': +d["index"],
						'article_index': +d["article_index"],
						'formattedDate': d["formattedDate"],
						'sentiment_score': d["sentiment_score"],
						'date': d["date"],
						'emotion_anger': +d["emotion_anger"],
						'emotion_disgust': +d["emotion_disgust"],
						'emotion_fear': +d["emotion_fear"],
						'emotion_joy': +d["emotion_joy"],
						'emotion_sadness': +d["emotion_sadness"],
						'entity': d["entity"],
						'relevance': +d["relevance"],
						'sentiment_score_alchemy': +d["sentiment_score_alchemy"],
						"callout_flag":	d["callout_flag"],
						"callout_text": d["callout_text"]
				};return {
						'index': +d["index"],
						'date': d["date"],
						'formattedDate': d["formattedDate"],
						'article_index': +d["article_index"],
						'formattedDate': d["formattedDate"],
						'sentiment_score': +d["sentiment_score"],
						'sentiment_score_alchemy': +d["sentiment_score_alchemy"],
						'relevance': +d["relevance"],
						'entity': d["entity"],
						'emotion_anger': +d["emotion_anger"],
						'emotion_disgust': +d["emotion_disgust"],
						'emotion_fear': +d["emotion_fear"],
						'emotion_joy': +d["emotion_joy"],
						'emotion_sadness': +d["emotion_sadness"],
						"callout_flag":	d["callout_flag"],
						"callout_text": d["callout_text"]
				};
			});
			
		}// end for ...
/*		
		for (var field in view7[0]) {
			
			if ( 	field == "article_index" || 
					field == "date" || 
					field == "sentiment_score" ||
					field == "sentiment_score_alchemy" ||
					field == "relevance" || 
					field == "entity" ||  
					field == "emotion_anger" || 
					field == "emotion_disgust" || 
					field == "emotion_fear" || 
					field == "emotion_joy" || 
					field == "emotion_sadness" || 
					field == "formattedDate" ||
					field == "callout_flag" ||
					field == "callout_text" ) { continue; } 
						
			View7_dots[field] = view7.map(function(d,i) {
				
				return {
						'index': +d["index"],
						'date': d["date"],
						'formattedDate': d["formattedDate"],
						'article_index': +d["article_index"],
						'formattedDate': d["formattedDate"],
						'sentiment_score': +d["sentiment_score"],
						'sentiment_score_alchemy': +d["sentiment_score_alchemy"],
						'relevance': +d["relevance"],
						'entity': d["entity"],
						'emotion_anger': +d["emotion_anger"],
						'emotion_disgust': +d["emotion_disgust"],
						'emotion_fear': +d["emotion_fear"],
						'emotion_joy': +d["emotion_joy"],
						'emotion_sadness': +d["emotion_sadness"]
				};
			});
			
		}// end for ...*/
		
		return;
	} // end function getDotData()
	
	
	
	
	function ready(error, data1, data2, data3, data4, data5, data6/*, data7*/){
			
		  view1 = data1;
		  view2 = data2;
		  view3 = data3;
		  view4 = data4;
		  view5 = data5;
		  view6 = data6;/*
		  view7 = data7;*/
		  		
		// date format for Sentencing Attitudes ... 20160106
		data1.forEach(function(d) { d.formattedDate = d3.time.format("%Y%m%d").parse(d.date); });
		data2.forEach(function(d) { d.formattedDate = d3.time.format("%Y%m%d").parse(d.date); });
		data3.forEach(function(d) { d.formattedDate = d3.time.format("%Y%m%d").parse(d.date); });
		data4.forEach(function(d) { d.formattedDate = d3.time.format("%Y%m%d").parse(d.date); });
		data5.forEach(function(d) { d.formattedDate = d3.time.format("%Y%m%d").parse(d.date); });
		data6.forEach(function(d) { d.formattedDate = d3.time.format("%Y%m%d").parse(d.date); });
		
		getDotData();
		
		pymChild = new pym.Child({renderCallback: drawGraphic});
		
		return;
		
	}// end function ready()

			


				
							

	//then, onload, check to see if the web browser can handle 'inline svg'
	if (Modernizr.inlinesvg)
	{

		// open and load configuration file. 					
		d3.json("data/config.json", function(error, json)
		{	
						
			// store read in json data from config file as as global vis. variable ...	
			vis.config = json;
			
			// call function to draw initial UI on load.
			buildUI();
			readFile();
			

		})// end 


	} // end if ... 
	else {


		//use pym to create iframe containing fallback image (which is set as default)
		pymChild = new pym.Child();
		if (pymChild) { pymChild.sendHeight(); }


	}	
	
	
	
	function readFile(){
		
		queue()
			.defer(d3.csv, "./data/news_data_plot_0_lowerbarchart.csv")
			.defer(d3.csv, "./data/news_data_plot_1_scatterplot.csv")
			.defer(d3.csv, "./data/news_data_plot_2_sizeBasedOnNewspaper.csv")
			.defer(d3.csv, "./data/news_data_plot_3_sizeBasedOnRelevance.csv")
			.defer(d3.csv, "./data/news_data_plot_4_1_police.csv")
			.defer(d3.csv, "./data/news_data_plot_4_2_crime.csv")
			.await(ready);


		
		return;
		
	}// end function readFile()
	
	
	
	// event.type must be keypress
	$(function(){
		$('html').keydown(function(e){
			
			if ( auto == false ){
				
				if ( e.keyCode == 13 /* RETURN */ ) {
					viewCounter++;
					
					if ( viewCounter < 5 ) {
						transitionData();
					}
				}// end inner IF .. 
			}
		});
	});
	
	
	
	
	
	//var dotInfo = {};
	
	
	
	
	
	
	
	
	function wrap(text , width , callOutCount) {
		
		var lineCount = 0;
		//var callOutCount = 0;
		//callOutHeightArray = [];
		var lineHeight = 1.50;
		var boxHeight = -1;
			 
		text.each(function(d,i) {
		  
			lineCount = 0;
			var text = d3.select(this),
				words = text.text().split(/\s+/).reverse(),
				word,
				newWord,
				line = [],  
				lineNumber = 0, 
//				lineHeight = 1.5,   // ems
				y = text.attr("y"),
				dy = parseFloat(text.attr("dy"));
				
			console.log(text);
			
			//if ( callOutCount == 0 ) {
			//	tspan = text.text(null).append("tspan").style("font-weight","bold").style("font-size","1.25em").attr("x", 5).attr("y", y).attr("dy", dy + "em");
			//}
			//else {
			var tspan = text.text(null).append("tspan")/*.style("font-weight","bold")*/.style("font-size","1.50em").attr("x", 5).attr("y", y).attr("dy", dy + "em");
		 	//} 
			
			
			while (word = words.pop()) {
			  	line.push(word);
				
				tspan.text(line.join(" "));
			  
				if (tspan.node().getComputedTextLength() > width) {
			  
					line.pop();
					tspan.text(line.join(" "));
					line = [word];
					tspan = text.append("tspan").attr("x", 5).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(" " + word);
					lineCount++;
				}
			
			}
		});
			
		//if ( thumbnail === undefined ) {
		//	callOutHeightArray[callOutCount] = ((lineCount+1) * (lineHeight*30));
		//}
		//else {
			callOutHeightArray.push((lineCount+1) * (lineHeight*30)/* + 75*/);
		//}
		callOutCount++;
		//callOutHeightArray.forEach(function(d,i){ d3.select("#callOutRect" + i).attr("height" , callOutHeightArray[i]); })
		
		return;
	
	}// end function wrap()
	
	
	
	

	function callOuts(){
		
		$(".callOutgroups").remove();
		$(".markers").remove();
		
		var all = document.getElementsByTagName("*");
		for (var i=0, max=all.length; i < max; i++) { $(all[i]).removeClass("pulse"); }
		
		if ( calloutIndexes.length != 0 ) {
		
			calloutIndexes[viewCounter].forEach(function(d,i){
					
				if ( viewCounter < 3 ) {
					
					var index = i;
					var dotInfo = View2_articleIndex[d];
					
					$("#dot-" + dotInfo.index).addClass("pulse");
				
					var g = svg.append("g") 
						.attr("class" , "callOutgroups")
						.attr("id" , "callOutgroup"+i)
						.attr("transform", function(d,i){ return "translate(" + vis.xTop(dotInfo.formattedDate) + "," + (vis.yTop(1)) + ")" });
						
					g.append("line")
						.attr("class",  "callOutLines")
						.attr("id", "callOutLine" + i)
						.attr("x1", 0)
						.attr("y1", function(d,i){ return vis.yTop(callOutHeight[viewCounter][index]); })
						.attr("x2", 0)
						.attr("y2", function(d,i){ return vis.yTop(dotInfo.sentiment); })
						.style("display" , "inline")
						.style("stroke" ,  /*"#FFFFFF"*/ "#FCF8DA")
						.style("stroke-width" , "3px")
						.style("display" , "inline")
						.style("opacity" , 0.0);
					
					g.append("rect")
						.attr("class" , "callOutRects")
						.attr("id" , "callOutRect" + i)/*
						.attr("x", -5)*/
						.attr("y", function(d,i){ return vis.yTop(callOutHeight[viewCounter][index])-d3.select(this).attr("height"); })
						.attr("width" , 150) 
						.attr("height" , 100) 
						.style("fill" ,  /*"#FFFFFF"*/ "#FCF8DA")
						.style("fill-opacity" , 1.0)
						.style("stroke" ,  /*"#FFFFFF"*/ "#FCF8DA")
						.style("stroke-width" , "0px")
						.style("display" , "inline")
						.style("opacity" , 0.0);		
						
						
					var colonIndex = calloutTexts[viewCounter][index].indexOf(":");
					var title = calloutTexts[viewCounter][index].substring(0,colonIndex);
										
					g.append("text")
						.attr("class" , "callOutTexts")
						.attr("id" , "callOutText"+i)
						.attr("x", 5)
						.attr("y", function(d,i){ return 15+vis.yTop(callOutHeight[viewCounter][index]); })
						.attr("dy", ".35em")
						.attr("font-size", "15px")
						.attr("font-weight", "bold")
						.style("display" , "inline")
						.style("fill","#A00000")
						.style("opacity" , 0.0)
						.text(title);
						
					//d3.selectAll("#callOutText"+i).call(wrap, 200 , i);
														
					var calloutTextContent = [
												[
													["Police 'arrested wrong man in" , "Rotherham child abuse" , "investigation' - court"],
													["Nearly 200 child abuse cases" , "for one police force"],
													["Child sex abuse in Rotherham:" , "'I was treated as a criminal," , "never as a victim'"]
												],
												[],
												[],
												[]
											];
											
					
					var count = 0;	
											
					calloutTextContent[viewCounter][index].forEach(function(d,i){
							
						g.append("text")
							.attr("class" , "calloutTextContents")
							.attr("id" , "calloutTextContent"+i)
							.attr("x", 5)
							.attr("y", function(d,i){ return 30+vis.yTop(callOutHeight[viewCounter][index])+(15*count); })
							.attr("dy", "1.0em")
							.attr("font-size", "10px")
							.attr("font-weight", "normal")
							.style("display" , "inline")
							.style("opacity" , 0.0)
							.text(d);
							count++;
					})
					
					
					//wrap(remainder, 200 , i);
						
				} // end if ... 
				
				else {
					
					var index = i;
					var dotInfo;
					
					if ( viewCounter == 3 ) { dotInfo = View5_articleIndex[d]; }
					if ( viewCounter == 4 ) { dotInfo = View6_articleIndex[d]; }
					
					var g = svg.append("g") 
						.attr("class" , "callOutgroups")
						.attr("id" , "callOutgroup"+i)
						.attr("transform", function(d,i){ return "translate(" + vis.xTop(dotInfo.formattedDate) + "," + (vis.yTop(1)) + ")" });
						
					g.append("line")
						.attr("class",  "callOutLines")
						.attr("id", "callOutLine" + i)
						.attr("x1", 0)
						.attr("y1", function(d,i){ return vis.yTop(callOutHeight[viewCounter][index]); })
						.attr("x2", 0)
						.attr("y2", function(d,i){ return vis.yTop(dotInfo.sentiment_score_alchemy); })
						.style("display" , "inline")
						.style("stroke" , "white")
						.style("stroke-width" , "3px")
						.style("display" , "inline")
						.style("opacity" , 0.0);
					
					g.append("rect")
						.attr("class" , "callOutRects")
						.attr("id" , "callOutRect" + i)
						.attr("x", calloutTimeOffsets[viewCounter][index] )
						.attr("y", function(d,i){ return vis.yTop(callOutHeight[viewCounter][index]); })
						.attr("width" , 210) 
						.attr("height" , 130) 
						.style("fill" , "#999999")
						.style("fill-opacity" , 1.0)
						.style("stroke" , "red")
						.style("stroke-width" , "0px")
						.style("display" , "inline")
						.style("opacity" , 0.0);
							
					g.append("svg")
						.attr('class', 'callOutSVG')
						.attr('id', 'callOutSVG'+i)
						.attr("x", calloutTimeOffsets[viewCounter][index] )
						.attr("y", function(d,i){ return vis.yTop(callOutHeight[viewCounter][index]); })
						.attr("width" , 210)
						.attr("height" , 130)
						.style("fill" , "white")
						.style("stroke" , "white")
						.style("stroke-width" , "2px")
						.style("fill-opacity" , 1.0)
						.style("display" , "inline");
					
					// define and construct y axis domain and ranges				
					vis.callOutX = d3.scale.linear().range([10, 190]);
					vis.callOutX.domain([0,1]);
					vis.xAxisCallOut = d3.svg.axis().scale(vis.callOutX).orient("bottom");	
							
					g.append('g')
						.attr('class', 'callOutXAxis')
						.attr('id', 'callOutXAxis'+i)
						.style("stroke-width" , "1px")
						.style('stroke', 'none')
						.style('fill', '#7F7F7F')
						.style('font-size', '10px')
						.style("opacity" , 0.0)
						.style("display" , "none")
						.attr('transform', function(d, i){ return "translate(" + (5) + "," + (vis.yTop(callOutHeight[viewCounter][index])) + ")"; })
						.call(vis.xAxisCallOut);
							
					var sentiments = ["anger" , "disgust" , "fear" , "joy" , "sadness"];
					var barWidth = 90/sentiments.length;
										  
					d3.select('#callOutSVG'+i)
						.append("text")
						.attr("class" , "callOutEntityLabels")
						.attr("id" , "callOutEntityLabel"+i)
						.attr("y", 15 )
						.attr("x", function(d) { return vis.callOutX(0)+5; })
						.attr("dy", "0.25em")
						.style("stroke-width" , "1px")
						.style('stroke', 'none')
						.style('fill', 'white')
						.style("text-anchor" , "start")
						.style("font-weight" , "bold")
						.style("font-size" , "10px")
						.style("opacity" , 0.0)
						.text(function(d,i){ return dotInfo.callout_text; });
							
					var bar = d3.selectAll("#callOutSVG"+i)
						.selectAll("g")
						.data(sentiments)
						.enter()
						.append("g")
						.attr("transform", function(d, i) { return "translate(0," + (30+(i * barWidth)) + ")"; });
								
					bar.append("rect")
						.attr("class" , "callOutRectBars")
						.attr("id" , "callOutRectBar"+i)
						.attr("x", function(d) { return vis.callOutX(0); })
						.attr("height", barWidth - 1)
						.style("stroke-width" , "2px")
						.style('stroke', 'none')
						.style('fill', '#621F95')
						.attr("width", function(d) { return vis.callOutX(dotInfo["emotion_"+d]) - vis.callOutX(0); })
						.style("opacity" , 0.0);
					  
					bar.append("text")
						.attr("class" , "callOutRectAxisValueLabels")
						.attr("id" , "callOutRectAxisValueLabel"+i)
						.attr("y", barWidth/2 )
						.attr("x", function(d) { return vis.callOutX(0.01); })
						.attr("dy", "0.25em")
						.style("stroke-width" , "1px")
						.style('stroke', 'none')
						.style('fill', 'white')
						.style("font-size" , "10px")
						.style("text-anchor" , "start")
						.style("opacity" , 0.0)
						.text(function(d) { return dotInfo["emotion_" + d].toFixed(2); });
					  
					bar.append("text")
						.attr("class" , "callOutRectAxisLabels")
						.attr("id" , "callOutRectAxisLabel"+i)
						.attr("y", barWidth/2 )
						.attr("x", function(d) { return vis.callOutX(1); })
						.attr("dy", "0.25em")
						.style("stroke-width" , "2px")
						.style('stroke', 'none')
						.style('fill', 'white')
						.style("font-size" , "10px")
						.style("text-anchor" , "end")
						.style("opacity" , 0.0)
						.text(function(d) { return d; });
					}
						
				svgBottom
					.append("rect")
					.attr("class" , "markers")
					.attr("id" , "marker" + index)
					.attr("x", function(d,i){ return vis.xBottom(dotInfo.formattedDate)-coloumnWidth/2; })
					.attr("y", function(d,i){ return vis.yBottom(callOutHeightBottom[viewCounter][index]) })
					.attr("width" , coloumnWidth) 
					.attr("height" ,  vis.yBottom(0) - vis.yBottom(callOutHeightBottom[viewCounter][index])) 
					.style("display" , "inline")
					.style("stroke" ,  /*"#FFFFFF"*/ "#FCF8DA")
					.style("fill" , "none")
					.style("stroke-width" , "0.5px")
					.style("display" , "inline")
					.attr("clip-path", "url(#clip)")
					.style("opacity" , 0.0);
					
				d3.select("#svgBottom").append("text")
					.attr("class" , "markers")
					.attr("id" , "markerLabel" + index)
					.attr("x", function(d,i){ return vis.xBottom(dotInfo.formattedDate)+10; })
					.attr("y", function(d,i){ return vis.yBottom(callOutHeightBottom[viewCounter][index]-2) })
					.style("display" , "inline")
					.style("stroke" , "none")
					.style("fill" ,  /*"#FFFFFF"*/ "#FCF8DA")
					.style("stroke-width" , "1px")
					.style("display" , "inline")
					.style("font-size" , "15px")
					.style("opacity" , 0.0)
					.text(dotInfo.date.substring(6,8)+ "/" +dotInfo.date.substring(4,6) + "/"+ dotInfo.date.substring(0,4));
			
					setTimeout(function(){
						
						d3.selectAll(".callOutRects").transition().duration(1500).style("opacity" , 1.0);
						d3.selectAll(".callOutTexts").transition().duration(1500).style("opacity" , 1.0);
						d3.selectAll(".callOutLines").transition().duration(1500).style("opacity" , 1.0);
						d3.selectAll(".callOutSVG").transition().duration(1500).style("opacity" , 1.0);
						d3.selectAll(".callOutXAxis").transition().duration(1500).style("opacity" , 1.0);
						d3.selectAll(".callOutRectAxisLabels").transition().duration(1500).style("opacity" , 1.0);
						d3.selectAll(".callOutRectAxisValueLabels").transition().duration(1500).style("opacity" , 1.0);
						d3.selectAll(".callOutRectBars").transition().duration(1500).style("opacity" , 1.0);
						/*d3.selectAll(".thumbnails").transition().duration(1500).style("opacity" , 1.0);*/
						d3.selectAll(".callOutEntityLabels").transition().duration(1500).style("opacity" , 1.0);
						d3.selectAll(".markers").transition().duration(1500).style("opacity" , 1.0);
						d3.selectAll(".calloutTextContents").transition().duration(1500).style("opacity" , 1.0);
						
						
						
						
						//$("#dot-" + dotInfo.index).addClass("pulse");
						//pulse();
							
					}, 1500);
			})
		}
		
		return;
		
	}// end function callOuts();
	
	
	
	

	function pulse() {
		
		var circle; 
		
		circle = svg.selectAll(".pulse");
		
		(function repeat() {
			circle = circle.transition()
				.duration(500)
			/*	.style("stroke-width", 20) */
				.style("stroke", "#621F95")/*
				.style("fill", "#621F95") */
			/*	.attr("r", 5) */
				.transition()
				.duration(500) 
			/*	.style('stroke-width', 0.5) */
				.style("stroke",   /*"#FFFFFF"*/ "#FCF8DA")/*
				.style("fill",  "#FFFFFF") */
			/*	.attr("r", 5) */
				.ease('sine')
				.each("end", repeat);
		})();
	}
	
	
	
	
	
	function drawLegend(){
		
		console.log("viewCounter: " + viewCounter);
		d3.selectAll(".legend").remove();
								
		var legendArray = [
							 [
								[ "All articles" , "#888888" , 10 , 0.75, 2 , "#888888" ]
							],
							 [
								[ "National" , "#005DA2", 10 , 0.75, 2 , "#005DA2" ],
								[ "Local" , "#387C2B", 10 , 0.75 , 2 , "#387C2B" ],
								[ "Non-recurring" , "#888888", 10 , 0.75, 0 , "#888888" ]
							],
							 [
								[ "High relevance article" , "#005DA2", 10 , 0.75, 2 , "#005DA2" ],
								[ "Low relevance article" , "#FF5900", 10, 0.75, 2 , "#FF5900" ] 
							],
							 [
								[ "Original articles" , "#005DA2", 10 , 0.75, 2 , "#005DA2" ],
								[ "Specific entities" , "#387C2B", 10 , 0.75, 2 , "#387C2B" ],
								[ "Low relevance article" , "#FF5900", 10, 0.75, 2 , "#FF5900" ] 
							],
							 [
								[ "Original articles" , "#005DA2", 10 , 0.75, 2 , "#005DA2" ],
								[ "Specific entities" , "#387C2B", 10 , 0.75, 2 , "#387C2B" ],
								[ "Low relevance article" , "#FF5900", 10, 0.75, 2 , "#FF5900" ] 
							]
						];
					
		var legendArrayFooter = [ false , "Symbols scaled based on number of recurring articles" , "Symbols scaled based on relevance" , false , false ];
		
		var lineCounter = 0;
			
		if ( legendArrayFooter[viewCounter] != false ) {
			
			d3.select("#svg")
				.append("text")
				.attr("class" , "legend legendTextFooters")
				.attr("id" , "legendTextFooter")
				.attr("x" , graphSpace.width-margin.top.left)
				.attr("y" , 50+(30*(lineCounter)))
				.style("fill" ,  "white")
				.style("stroke" , "none")
				.style("dy" , "1.0em")
				.style("stroke-width" , 2)
				.style("font-size" , "1.5em")
				.style("font-weight" , "bold")
				.style("text-anchor" , "end")
				.style("fill-opacity" , 0.75)
				.text(legendArrayFooter[viewCounter]);
		}
		else {
		}
		
		lineCounter++;
		
		legendArray[viewCounter].forEach(function(d,i){
			
			d3.select("#svg")
				.append("circle")
				.attr("class" , "legend legendCircles")
				.attr("id" , "legendCircle"+i)
				.attr("r" , d[2])
				.attr("cx" , graphSpace.width-margin.top.left)
				.attr("cy" , 50+(30*lineCounter))
				.style("fill" , d[1])
				.style("stroke" , d[5])
				.style("stroke-width" , d[4])
				.style("fill-opacity" , d[3]);
				
			d3.select("#svg")
				.append("text")
				.attr("class" , "legend legendTextLabels")
				.attr("id" , "legendTextLabel"+i)
				.attr("x" , graphSpace.width-margin.top.left - 25)
				.attr("y" , 50+(30*lineCounter)+(d[2]/2) ) 
				.style("fill" , "white")
				.style("stroke" , "none")
				.style("stroke-width" , 2)
				.style("font-size" , "1.0em")
				.style("font-weight" , "bold")
				.style("text-anchor" , "end")
				.style("fill-opacity" , 0.75)
				.text(d[0]);
			
			lineCounter++;
		})
		
		return;
		
	}// end function drawLegend()

		
	