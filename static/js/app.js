console.log("In app.js");

var data;
var dropdown = d3.select("#selDataset");

function populateDemographicInfo(id) {
    var metadata = data.metadata;
    var sample_metadata = d3.select("#sample-metadata");
    sample_metadata.selectAll("p").remove();
    var sample = metadata.filter(row => row.id === parseInt(id))[0];
    Object.entries(sample).forEach(([key, value]) => {
        sample_metadata.append("p").text(key + ": " + value);
    
    });
}

function populateBarChart(id) {
    var sample = data.samples.filter(sample => sample.id === id)[0];
    var cut_point = sample.sample_values.length;
    if (cut_point > 10) {
        cut_point = 10;
    console.log("samples", sample)
    }
    var plot_data_bar = [{
        x: sample.sample_values.slice(0, cut_point).reverse(),
        y: sample.otu_ids.slice(0, cut_point).map(id => "otu " + id).reverse(),
        text: sample.otu_labels.slice(0, cut_point).reverse(), 
        type: "bar",
        orientation: "h"
    }];
    var layout = {
        title: "Top 10 Bacteria Culture Found",
        margin: {1: 100, r: 100, t: 35, b:35}
    
    };
    Plotly.newPlot("bar", plot_data_bar, layout);
}

function populateBubbleChart(id) {
    var sample = data.samples.filter(sample => sample.id === id)[0];
    var plot_data_bubble = [{
        x: sample.otu_ids,
        y: sample.sample_values,
        text: sample.otu_labels,
        marker: {size: sample.sample_values, color: sample.otu_ids},
        mode: 'markers'
    }];

    var layout = {title: "Bacteria Cultures Per Sample"}
    Plotly.newPlot("bubble", plot_data_bubble, layout);
}

function optionChanged(id) {
    // Take the id and show correspond info and chart
    populateDemographicInfo(id);
    populateBarChart(id);
    populateBubbleChart(id);
}

function init() {
    d3.json("./data/samples.json").then(json_data =>  {
        data = json_data;
        console.log(data);
        var names = data.names;
        names.forEach(name => {
            dropdown.append("option").text(name).property("value", name);
        });
        // Take the first value from the dropdown and show corresponding info and chart
        if (names.length > 0) {
            var id = names[0];
        populateDemographicInfo(id);
        populateBarChart(id);
        populateBubbleChart(id);
        }
    });
}

init();