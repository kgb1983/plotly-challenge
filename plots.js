// creating data variable

var data;

// initial function to fill drop down menu and allow selecting id

function init() {
    d3.json("samples.json").then(bbData => {
        data = bbData;
        var options = bbData.names;
        var selection = d3.select("#selDataset");

    options.forEach(value => {
        selection 
        .append("option")
        .text(value)
        .attr("value", function() {
            return value
        });
    });
    });
}

// use function to fill dropdown
init()

// Create event listener and handler

d3.selectAll("#selDataset").on("change", plotData);

// create plotData function

function plotData() {
    var selector = d3.select("#selDataset").node().value;
    demographics(selector)
    bacteria(selector)
    bubbles(selector)
    washing(selector)
}

// create functions to return name and id of each bacteria

function bacName(name) {
    var baclist = []
    for (var i = 0; i < name.length; i++) {
        var stringName = name[i].toString()
        var splitValue = stringName.split(";")
        if (splitValue.length > 1) {
            baclist.push(splitValue[splitValue.length - 1])
        }
        
        else {
            baclist.push(splitValue[0])
        }
    }
    return baclist
}

function otuNumber(name){
    var otuList = []
    for (var i = 0; i < name.length; i++) {
        otuList.push(`OTU ${name[i]}`)
    }

    return otuList
}


// create first plot function filling in demo panel
function demographics(selector) {
    var filter1 = data.metadata.filter(value => value.id == selector);
    var div = d3.select(".panel-body")
    div.html("");
    div.append("p").text(`ID: ${filter1[0].id}`)
    div.append("p").text(`ETHNICITY: ${filter1[0].ethnicity}`)
    div.append("p").text(`GENDER: ${filter1[0].gender}`)
    div.append("p").text(`AGE: ${filter1[0].age}`)
    div.append("p").text(`LOCATION: ${filter1[0].location}`)
    div.append("p").text(`BELLY BUTTON TYPE: ${filter1[0].bbtype}`)
    div.append("p").text(`WASHING FREQUENCY: ${filter1[0].wfreq}`)
    
}

// create chart to show top 10 bacteria

function bacteria(selector) {
    var filter2 = data.samples.filter(value => value.id == selector)
    var otu_id = filter2.map(v => v.otu_ids)
    otu_id = otuNumber(otu_id[0].slice(0, 10));
    var x_value = filter2.map(v => v.sample_values)
    x_value = x_value[0].slice(0, 10)

    var otu_label = filter2.map(v => v.otu_labels)
    var names = bacName(otu_label[0]).slice(0, 10)

    var trace1 = {
        x: x_value,
        y: otu_id,
        text: names,
        type: "bar",
        orientation: "h"
    };

    var layout = {
        yaxis: {
            autorange: "reversed"
        }
    };

    var bac_array = [trace1]

    Plotly.newPlot("bar", bac_array, layout)
}

// create bubble chart
function bubbles(selector) {
    var filter3 = data.samples.filter(value => value.id == selector)
    var otu_id = filter3.map(v => v.otu_ids)
    otu_id = otu_id[0]
    var y_value = filter3.map(v => v.sample_values)
    y_value = y_value[0]

    var otu_label = filter3.map(v => v.otu_labels)
    otu_label = bacName(otu_label[0])

    var trace2 = {
        x: otu_id,
        y: y_value,
        mode: "markers",
        marker: {size: y_value, color: otu_id},
        text: otu_label
        
    }

    var bubble_array = [trace2]

    var layout = {
        showlegend: false,
        xaxis: { title: "OTU ID" }
    };

    Plotly.newPlot("bubble", bubble_array, layout);
} 

// Create washing gauge

function washing(selector) {
    var filter4 = data.metadata.filter(value => value.id == selector)
    var frequency = filter4[0].wfreq;

    var washing_data = [
        {
            domain: { x: [0, 1], y: [0, 1] },
            title: {
                text: "Belly Button Washing Frequency"
            },
            type: "indicator",
            mode: "gauge",
            gauge: {
                axis: {
                    range: [0, 9],
                    tickvals: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
                    ticks: "outside"
                },
            steps: [
                { range: [0, 1], color: "#F0F8FF" },
                { range: [1, 2], color: "#E6E6FA" },
                { range: [2, 3], color: "#B0E0E6" },
                { range: [3, 4], color: "#ADD8E6" },
                { range: [4, 5], color: "#87CEEB" },
                { range: [5, 6], color: "#87CEFA" },
                { range: [6, 7], color: "#00BFFF" },
                { range: [7, 8], color: "#7B68EE" },
                { range: [8, 9], color: "#6A5ACD" }
            ],
            threshold: {
                line: { color: "black", width: 4 },
                thickness: 1,
                value: frequency
            }
            }
        }
    ];

    var layout = { width: 600, height: 500, margin: { t: 0, b: 0 } };
    Plotly.newPlot("gauge", washing_data, layout)
}