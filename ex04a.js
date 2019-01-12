var createPlot = function(){
    vlSpec = {
        "data": {
            "url": "house_prices.json",
        },
        "transform": [{
          "fold": ["AZ-Phoenix", "CA-Los Angeles", "CA-San Diego", "CA-San Francisco", "CO-Denver", "Composite-10", "Composite-20", "DC-Washington", "FL-Miami", "FL-Tampa", "GA-Atlanta", "IL-Chicago", "MA-Boston", "MI-Detroit", "MN-Minneapolis", "NC-Charlotte", "NV-Las Vegas", "NY-New York", "National-US", "OH-Cleveland", "OR-Portland", "TX-Dallas", "WA-Seattle"],
          "as": ["city", "cs_index"]
        }],
        "mark": "line",
        "encoding": {
          "x": {"field": "Date", "type": "temporal"},
          "y": {"field": "cs_index", "type": "quantitative","title":"Case–Shiller index"},
          "color": {"field": "city", "type": "nominal","title":"City:"}
        }
    };
    vlOpts = {width:1000, height:400, actions:true};
    console.log(vlSpec);
    console.log(vlOpts);
    vegaEmbed("#ts", vlSpec, vlOpts);
};
