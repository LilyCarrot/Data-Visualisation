var ctx = {
    w: 1200,
    h: 400,
    timeParser: d3.timeParse("%Y-%m-%d"),
};

var createViz = function(){
    var svgEl = d3.select("#main").append("svg");
    svgEl.attr("width", ctx.w);
    svgEl.attr("height", ctx.h);
    loadData(svgEl);
};

var createDateArray = function(data){
  return (data.map(function(d){return (d.Date);}));
};

var populateTimeSeriesForCity = function(cityName, data)
{
  return data.map(function(e){return (e[cityName]);});
};

var getListOfCityNames = function(data){
  //return (["AZ-Phoenix", "CA-Los Angeles", "CA-San Diego", "CA-San Francisco", "CO-Denver", "Composite-10", "Composite-20", "DC-Washington", "FL-Miami", "FL-Tampa", "GA-Atlanta", "IL-Chicago", "MA-Boston", "MI-Detroit", "MN-Minneapolis", "NC-Charlotte", "NV-Las Vegas", "NY-New York", "National-US", "OH-Cleveland", "OR-Portland", "TX-Dallas", "WA-Seattle"]);
  d = data[0];
  l = [];
  for (var key in d){
    l.push(key);
  }
  return (l);
};

var distFunction = function(a, b){
  return Math.abs( a - b );
};

var calculateDTW = function(timeSeries, nationalTimeSeries){
  var dtw = new DynamicTimeWarping(nationalTimeSeries, timeSeries, distFunction);
  return (dtw.getDistance());
};

var createSeriesObject = function(data){
  names = getListOfCityNames(data);
  nationalTimeSeries = populateTimeSeriesForCity("National-US", data);
  series = names.map(function(d){
    timeSeries = populateTimeSeriesForCity(d,data);
    return {
      "name": d,
      "values": timeSeries,
      "dtw": calculateDTW(timeSeries, nationalTimeSeries)};
  });
  series = series.sort(function(a, b){
    if (a.name == "National-US")
      return -1;
    else if (b.name == "National-US")
      return 1;
    else if (a.name == "Composite-10")
      return -1;
    else if (b.name == "Composite-10")
      return 1;
    else if (a.name == "Composite-20")
      return -1;
    else if (b.name == "Composite-20")
      return 1;
    else
      return (a.dtw - b.dtw);
  });
  return series;
};

var createOneBand = function(city,i, g)
{
  scaleColorWithoutNull = d3.scaleLinear().domain([0,100,300]).range(["red", "white", "blue"]);
  scaleColor = function(v) { if (v === null) return "gray"; else return scaleColorWithoutNull(v);};
  lines = g.selectAll("line")
    .data(city.values)
    .enter()
    .append("line");
  lines.attr("i", function(d,i){return(i);})
    .attr("value", function(d){return(d);})
    .attr("x1", function(d,i){return(i);})
    .attr("y1", function(d,i){return(0);})
    .attr("x2", function(d,i){return(i);})
    .attr("y2", function(d,i){return(10);})
    .attr("stroke", function(d){return(scaleColor(d));});
  return(lines);
};

var createBands = function(svgEl, citiesData)
{
  bands = svgEl.selectAll("g")
    .data(citiesData)
    .enter()
    .append("g");
  numberOfBands = bands.size();
  translateBand = d3.scaleLinear().domain([0, numberOfBands])
                                 .range([0, ctx.h-20]);
  bands.attr("name", function(d){return d.name;});
  bands.attr("transform", function(d, i){ return( "translate(0 " + translateBand(i) + ")");});
  bands.each(function(city,i){return(createOneBand(city,i, d3.select(this)));});
  /*
  bands.each(function(city,i){
    d3.select(this).selectAll("line")
      .data([city])
      .enter()
      .append("line")
      .attr("hello", function(d){return(d.name);});
  });
  */
};

var loadData = function(svgEl){
    d3.json("house_prices.json").then(function(data){
        dates = createDateArray(data);
        console.log(dates);
        newCitiesData = createSeriesObject(data);
        console.log(newCitiesData);
        createBands(svgEl, newCitiesData);
    }).catch(function(error){console.log(error)});
};
