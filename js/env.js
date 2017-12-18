
((window) => {
  class MapEnv {
    constructor(labelid) {
      let unit = new Unit();
      let obj = this;
      let url = './img/1f.jpg';
      let defaultImgScale;
      let ctx;
      let statusImgBg = false;
      let zoom = d3.zoom()
        .scaleExtent([1, 10])
        .on("start", zoomStart)
        .on("zoom", zooming)
        .on("end", zoomEnd);
      let translate = {
        k: 1,
        x: 0,
        y: 0
      };
      let margin = [16, 44 - 10.66];

      let objImgBg = new Image();
      this.dataImg = [5378, 2174, url, 1];
      this.labelid = labelid;
      this.dataPrompt = [];
      this.dataIbeacon = [];
      this.dataNode = [];
      this.dataLinks = [];
      this.lineTool = d3.line()
        .x(function (d) {
          var source = env.dataNode[d.id];
          var x = coordToPiex(+source.coorx);
          var xx = piexScale(x, "x") - margin[0];
          return xx;
        })
        .y(function (d) {
          var source = env.dataNode[d.id];
          var y = coordToPiex(+source.coory);
          var yy = piexScale(y, "y") - margin[1];
          return yy;
        })
      this.list = [this.dataPrompt, this.dataIbeacon, this.dataNode, this.dataLinks]
      let node = [];
      this.width = getAttr(this.labelid, "width");
      this.height = getAttr(this.labelid, "height");

      let viewProt = new viewModel([this.width, this.height]);
      let imgProt = setImgProt.call(this);
      let canvasProt = new viewModel();
      this.lineStatus = 0;
      let env = this;
      writeCanvasProt.call(this);

      this.box = window[this.labelid];
      createCanvas.call(this);

      drawBackgrounImgOnCanvas.call(this);

      this.SetDataImg = function (data) {
        this.dataImg = data;
        objImgBg = new Image();
        objImgBg.src = data[2];
      }
      this.SetData = function (str, data) {
        this[str] = data;
      }
      function drawBackgrounImgOnCanvas() {
        objImgBg.src = this.dataImg[2];
        objImgBg.onload = function () {
          clearCtx.call(this);
          drawBg.call(this);
          statusImgBg = true;
        }
      }
      function drawBg() {

        ctx.drawImage(objImgBg, translate.x, translate.y, canvasProt.width * translate.k, canvasProt.height * translate.k);
      }

      function drawPrompts(str) {
        let c = str.substring(4, str.length).toLowerCase();
        let prompts = this.svg.select('.' + c).selectAll("use").data(this[str]);
        if (c == 'node') {
          prompts.enter()
            .append("circle")
            .attr("class", c)
            // .attr("width", "30px")
            // .attr("height", "30px")
            .attr("r", '5px')
            .attr("cx",
            function (d) {
              var x = coordToPiex(+d.coorx);
              var xx = piexScale(x, "x") - margin[0];
              d.x = xx;
              return xx;
            })
            .attr("cy",
            function (d) {
              var y = coordToPiex(+d.coory);
              var yy = piexScale(y, "y") - margin[1];
              d.y = yy;
              return yy;
            })
            .attr('fill', 'red')
            // .attr("xlink:href", "#icon-" + c)
            .style("opacity", 1)
            .style("pointer-events", "fill")
            .call(d3.drag()
              .on("start", dragNodeStart)
              .on("drag", dragNodeed)
              .on("end", dragNodeEnd)
            )
            .on("click", function (d) {
              console.log("click", d, d3.event)
              // env.lineStatus = env.lineStatus ^ 1;
              if (env.lineStatus == 0) {
                d3.select('#pathBg')
                  .style('pointer-events', 'fill')
                  .style('fill-opacity', .2)
                var links = { "source": d.id - 1, "target": d.id - 1 }
                env.dataLinks.push(links);
              } else {
                d3.select('#pathBg')
                  .style('pointer-events', 'none')
                  .style('fill-opacity', 0)
                var links = env.dataLinks.pop();
                links.target = d.id - 1;
                env.dataLinks.push(links);
              }
              env.lineStatus = env.lineStatus ^ 1;
              // var path = [[d.coorx, d.coory], [d.coorx, d.coory]];
              // var line = this.svg.select('.line').selectAll("path").data(path);
              // line.enter()
              //   .append('path')
              //   .attr("d", )
            })
        } else {
          prompts.enter()
            .append("use")
            .attr("class", c)
            .attr("width", "32px")
            .attr("height", "44px")
            .attr("x",
            function (d) {
              var x = coordToPiex(+d.coorx);
              var xx = piexScale(x, "x") - margin[0];
              d.x = xx;
              return xx;
            })
            .attr("y",
            function (d) {
              var y = coordToPiex(+d.coory);
              var yy = piexScale(y, "y") - margin[1];
              d.y = yy;
              return yy;
            })
            .attr("xlink:href", "#icon-" + c)
            .style("opacity", 1)
            .style("pointer-events", "fill")
            .call(d3.drag()
              .on("start", dragStart)
              .on("drag", draged)
              .on("end", dragEnd)
            )

        }

        prompts
          .attr("x",
          function (d) {
            console.log('!!!!!!')
            var x = coordToPiex(+d.coorx);
            var xx = piexScale(x, "x") - margin[0];
            d.x = xx;
            return xx;

          }
          )
          .attr("y",
          function (d) {
            var y = coordToPiex(+d.coory);
            var yy = piexScale(y, "y") - margin[1];
            d.y = yy;
            // d.coory = yy;
            return yy;
          }
          )
        prompts.exit().remove();
        switch (c) {
          case "prompt":
            break;

          default:
            break;
        }
      }
      function dragStart() {
        console.log('drat start')
        d3.selectAll("use").style("opacity", .3);
        d3.selectAll("circle").style("opacity", .3);
        d3.select(this).raise().style("opacity", 1);
      }
      function draged(dd) {
        console.log('drag ')
        env.lineStatus = 0;
        dd.status = 'move'
        d3.select(this)
          .attr("x", dd.x = d3.event.x)
          .attr("y", dd.y = d3.event.y);

        dd.coorx = diffCoordToPiex(diffPiexScale(dd.x + margin[0], "x"));
        dd.coory = diffCoordToPiex(diffPiexScale(dd.y + margin[1], "y"));
      }
      function dragEnd() {
        console.log('drag-end')
        d3.selectAll("use").style("opacity", 1);
        d3.selectAll("circle").style("opacity", 1);
      }

      function dragNodeStart() {
        d3.selectAll("use").style("opacity", .3);
        d3.selectAll("circle").style("opacity", .3);
        d3.select(this).raise().style("opacity", 1);
      }
      function dragNodeed(dd) {
        console.log('drag ')
        env.lineStatus = 0;
        dd.status = 'move'
        d3.select(this)
          .attr("cx", dd.x = d3.event.x)
          .attr("cy", dd.y = d3.event.y);

        dd.coorx = diffCoordToPiex(diffPiexScale(dd.x + margin[0], "x"));
        dd.coory = diffCoordToPiex(diffPiexScale(dd.y + margin[1], "y"));
      }
      function dragNodeEnd() {
        console.log('drag-end')
        d3.selectAll("use").style("opacity", 1);
        d3.selectAll("circle").style("opacity", 1);
      }



      function piexScale(coord, str) {
        if (!str) {
          return coord * translate.k
        }
        return coord * translate.k + translate[str];
      }

      function coordToPiex(coord) {

        return coord * defaultImgScale;
      }

      function diffPiexScale(coord, str) {
        if (!str) {
          return coord / translate.k
        }
        return (coord - translate[str]) / translate.k;
      }
      function diffCoordToPiex(coord) {
        return coord / defaultImgScale;
      }

      function zoomStart() {

        // console.log(1)
      }

      function zooming() {
        var transform = d3.event.transform;
        crossTheBorder();
        translate = transform;
        drawBg.call(this);
        function crossTheBorder() {
          if (transform.x > 0) {
            transform.x = 0;
          }
          if (transform.y > 0) {
            transform.y = 0
          }
          if (Math.abs(canvasProt.width) * transform.k + transform.x < viewProt.width) {
            transform.x = viewProt.width - canvasProt.width * transform.k;
          }
          if (Math.abs(canvasProt.height) * transform.k + transform.y < viewProt.height) {
            transform.y = viewProt.height - canvasProt.height * transform.k;
          }
        }
        drawPrompts.call(obj, "dataPrompt")
        drawPrompts.call(obj, "dataIbeacon");
        drawPrompts.call(obj, "dataNode");
      }
      function zoomEnd() {
      }

      function addZoomEvent() {
        statusImgBg ? this.canvas.call(zoom) : setTimeout(() => {
          addZoomEvent.call(this)
        }, 1);
      }

      function createCanvas() {
        d3.select("#" + this.labelid)
          .append("canvas")
          .attr("id", "canvas")
          .attr("width", this.width + "")
          .attr("height", this.height + "")
          .style("position", "absolute")
          .style('z-index', 100)
        this.canvas = d3.select(this.box).select("canvas");
        ctx = this.canvas.node().getContext('2d');


        addZoomEvent.call(this)

        d3.select("#" + this.labelid)
          .append("svg")
          .attr("id", "svg")
          .attr("width", this.width + "")
          .attr("height", this.height + "")
          .style("position", "absolute")
          .style("z-index", 200)
          .style("pointer-events", "none");




        ;



        this.svg = d3.select(this.box).select("svg");
        this.svg.append("rect")
          .attr('id', 'pathBg')
          .attr("width", this.width + "")
          .attr('height', this.height + "")
          .style("fill", 'red')
          .style('fill-opacity', 0)
          .style('pointer-events', 'none')
          .on("mousemove", function (d) {
            if (env.lineStatus == 1) {
              console.log('svg======:', d, d3.event);
            }
          });

        this.svg.append("g")
          .attr("class", "prompt");

        this.svg.append("g")
          .attr("class", "ibeacon");

        this.svg.append("g")
          .attr("class", "node");

        this.svg.append("g")
          .attr("class", "links");

        this.g = {
          "prompt": this.svg.select('prompt'),
          "ibeacon": this.svg.select("ibeacon"),
          "nodes": this.svg.select("nodes"),
          "links": this.svg.select("links")
        };

      }


      function getAttr(dom, attr) {
        if (typeof dom === "string") {
          dom = window[dom];
        }
        return $(dom)[attr]();
      }

      function clearCtx() {
        ctx.clearRect(0, 0, viewProt.width, viewProt.height);
      }

      function setImgProt() {
        return new viewModel([this.dataImg[0], this.dataImg[1]]);
      }

      function viewModel(size) {
        this.width = size ? size[0] : undefined;
        this.height = size ? size[1] : undefined;
        this.aspectRatiol = size ? size[0] / size[1] : undefined;
        this.Size = function (size) {
          this.width = size ? size[0] : undefined;
          this.height = size ? size[1] : undefined;
          this.aspectRatiol = size ? size[0] / size[1] : undefined;
        }
      }

      function writeCanvasProt() {
        let arr = [];

        if (viewProt.aspectRatiol > imgProt.aspectRatiol) {
          arr[0] = viewProt.width;
          arr[1] = viewProt.width / imgProt.aspectRatiol;
        } else {
          arr[1] = viewProt.height;
          arr[0] = viewProt.height * imgProt.aspectRatiol;
        }
        canvasProt.Size(arr);
        defaultImgScale = canvasProt.width / imgProt.width;
      }
      this.Init = function () {
        // clearCtx()

        drawBackgrounImgOnCanvas.call(this)
      }

      this.Draw = function () {
        drawPrompts.call(this, "dataPrompt");
        drawPrompts.call(this, "dataIbeacon");
        drawPrompts.call(this, "dataNode")
      }

    }





    Init() {
      drawBackgrounImgOnCanvas.call(this)
    }

    Reload() {

    }


  }
  window.MapEnv = MapEnv;
})(window);