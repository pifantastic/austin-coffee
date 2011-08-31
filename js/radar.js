(function(window, doc, d3, $, undefined) {

var Radar = function(opts) {
  this.init(opts);
};

Radar.prototype = {

  defaults: {
    width: 600,
    height: 400,
    scale: 5,
    labels: []
  },

  init: function(opts) {
    this.settings = {}

    // Required.
    this.selector = opts.selector

    // Optional
    this.width = opts.width || defaults.width
    this.height = opts.height || defaults.height
    this.scale = opts.scale || defaults.scale
    this.labels = opts.labels || []
    this.polygons = {}

    this.originX = Math.floor(this.width / 2)
    this.originY = Math.floor(this.height / 2)
    this.radius = Math.floor((this.width > this.height ? this.height : this.width) / 2)

    this.svg = d3.select(this.selector)
      .append("svg:svg")
        .attr("width", this.width)
        .attr("height", this.height)

    // Render graph.
    var coords = []
      , graph = this.svg.append('svg:g').attr('id', 'graph')
      , self = this

    $.each(this.labels, function(i, label) {
      var a = (Math.round(360 / self.labels.length) * i) * (Math.PI / 180)
        , x = Math.round(self.originX + self.radius * Math.cos(a))
        , y = Math.round(self.originY + self.radius * Math.sin(a))

      coords.push([x, y].join(','))

      graph.append('svg:line')
        .attr("class", "graph")
        .attr("x1", self.originX)
        .attr("y1", self.originY)
        .attr("x2", x)
        .attr("y2", y)

      for (var n = 0, k = 0; n <= self.radius; n += (self.radius / self.scale), k++) {
        graph.append('svg:circle')
          .attr("class", "dot")
          .attr("cx", Math.round(self.originX + n * Math.cos(a)))
          .attr("cy", Math.round(self.originY + n * Math.sin(a)))
          .attr("r", 2)
      }

      var label = graph.append('svg:text')
          .attr("class", "label")
          .attr("x", x)
          .attr("y", y)
          .text(label)

      if (x > self.width / 2)
        label.attr("dx", 10).attr("dy", 5)
      else
        label.attr("dx", -50).attr("dy", 5)
    });

    graph.append('svg:polygon')
      .data(coords)
      .attr("class", "graph")
      .attr("points", coords.join(' '))
  },

  addPolygon: function(id, polygon) {
    this.polygons[id] = polygon

    var coords = []
      , shop = this.svg.append('svg:g').attr("id", id)
      , self = this

    this.hidePolygon(id)

    $.each(this.labels, function(i, attr) {
      var r = Math.round(self.radius / self.scale) * polygon.data[attr]
        , a = (Math.round(360 / self.labels.length) * i) * (Math.PI / 180)
        , x = Math.round(self.originX + r * Math.cos(a))
        , y = Math.round(self.originY + r * Math.sin(a))
      coords.push([x, y].join(','))

      shop.append('svg:circle')
        .attr("class", "dot")
        .attr("cx", x)
        .attr("cy", y)
        .attr("r", 3)
    })

    shop.append('svg:polygon')
      .attr("class", "shop")
      .data(coords)
      .attr('opacity', 0.5)
      .attr("fill", polygon.color)
      .attr("stroke", polygon.stroke)
      .attr("points", (new Array(coords.length + 1)).join(self.originX + ',' + self.originY + ' '))
      .transition(750)
        .attr("points", coords.join(' '))
  },

  showPolygon: function(id, delay) {
    delay = delay || 0
    $('#' + id).show()
  },

  hidePolygon: function(id, delay) {
    delay = delay || 0
    $('#' + id).hide()
  },

  tween: function(fromID, toID) {
    var from = d3.select("#" + fromID + ' polygon')
      , to = d3.select("#" + toID + ' polygon')

    var startPoints = from.attr('points')
      , startColor = from.attr('fill')
      , endPoints = to.attr('points')
      , endColor = to.attr('fill')

    to.attr('points', startPoints).attr('fill', startColor)
    this.hidePolygon(fromID)
    this.showPolygon(toID)

    to.transition(1000)
      .attr('points', endPoints)
      .attr('fill', endColor)
  },

  drawGraph: function() {

  },

  showAll: function() {

  }

};

window.Radar = Radar;

})(window, document, d3, jQuery);
