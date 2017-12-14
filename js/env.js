
((window) => {
  class MapEnv {
    constructor(labelid) {
      // let table = new PromptTable();
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
      // this.dataPromptO;
      this.dataPrompt = [];
      this.dataIbeacon = [];
      this.dataNode = [];
      this.dataLinks = [];
      this.list = [this.dataPrompt, this.dataIbeacon, this.dataNode, this.dataLinks]
      let node = [];
      this.width = getAttr(this.labelid, "width");
      this.height = getAttr(this.labelid, "height");

      let viewProt = new viewModel([this.width, this.height]);
      let imgProt = setImgProt.call(this);
      let canvasProt = new viewModel();
      writeCanvasProt.call(this);

      this.box = window[this.labelid];
      createCanvas.call(this);

      drawBackgrounImgOnCanvas.call(this);

      this.SetDataImg = function (data) {
        this.dataImg = data;
        objImgBg = new Image();
        objImgBg.src = data[2];
        // drawBackgrounImgOnCanvas.call(this);
      }
      this.SetData = function (str, data) {
        this[str] = data;
      }
      // this.SetDataPrompt = function (data) {
      //   this.dataPromptO = data;
      //   // this.dataPrompt = unit.deepCopy(this.dataPromptO);
      //   this.dataPrompt = this.dataPromptO;
      // }

      function drawBackgrounImgOnCanvas() {
        objImgBg.src = this.dataImg[2];
        objImgBg.onload = function () {
          // objImgBg.width = ;
          // objImgBg.height = ;
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
        prompts.enter()
          .append("use")
          .attr("class", c)
          .attr("width", "32px")
          .attr("height", "44px")
          .attr("x",
          // d.x = piexScale(coordToPiex(+d.coorx), 'x') - margin[0]
          function (d) {
            var x = coordToPiex(+d.coorx);
            var xx = piexScale(x, "x") - margin[0];
            d.x = xx;
            
            return xx;
          }
          )
          .attr("y",
          // d.y = piexScale(coordToPiex(+d.coory), "y") - margin[1]
          function (d) {
            var y = coordToPiex(+d.coory);
            var yy = piexScale(y, "y") - margin[1];
            d.y = yy;
            return yy;
          }
          )
          // .style("transform", function (d) {
          //   var x = coordToPiex(+d.coorx);
          //   var y = coordToPiex(+d.coory);
          //   var xx = piexScale(x, "x") - margin[0];
          //   var yy = piexScale(y, "y") - margin[1];
          //   var t = "translate(" + xx + "px," + yy + "px)";
          //   return t;
          // })
          .attr("xlink:href", "#icon-" + c)
          .style("opacity", 1)

          .style("pointer-events", "fill")
          .call(d3.drag()
            .on("start", dragStart)
            .on("drag", draged)
            .on("end", dragEnd)
          )
          ;
        prompts
          .attr("x",
          // d.x = piexScale(coordToPiex(+d.coorx), 'x') - margin[0]
          function (d) {
            var x = coordToPiex(+d.coorx);
            var xx = piexScale(x, "x") - margin[0];
            d.x = xx;
            return xx;

          }
          )
          .attr("y",
          // d.y = piexScale(coordToPiex(+d.coory), 'y') - margin[1]
          function (d) {
            var y = coordToPiex(+d.coory);
            var yy = piexScale(y, "y") - margin[1];
            d.y = yy;
            // d.coory = yy;
            return yy;
          }
          )
        // .style("transform", function (d) {
        //   var x = coordToPiex(+d.coorx);
        //   var y = coordToPiex(+d.coory);
        //   var xx = piexScale(x, "x") - margin[0];
        //   var yy = piexScale(y, "y") - margin[1];
        //   var t = "translate(" + xx + "px," + yy + "px)";
        //   return t;
        // }) 
        // d3.selectAll("use").each(function (p, j) {
        //   d3.select(this).select("svg")
        //   .style("background",'red')
        // })
        prompts.exit().remove();
        switch (c) {
          case "prompt":
          // table.data = this[str]  
            // console.log(table,this[str]);  
            // table.show();
            break;
        
          default:
            break;
        }
        // node = d3.selectAll('.prompt');
        // node.foreach(function () {
        //   console.log(this);
        // })

        // node
        // .enter()
        // .append("use");
      }
      function dragStart() {
        console.log("Start")
        d3.select(this).raise().style("opacity", 1);
      }
      function draged(dd) {
        // console.log(dd, d3.event,table)
        dd.status = 'move'
        d3.select(this)
          .attr("x", dd.x = d3.event.x)
          .attr("y", dd.y = d3.event.y);

        // var y = coordToPiex(+d.coory);
        // var yy = piexScale(y, "y") - margin[1];
        dd.coorx = diffCoordToPiex(diffPiexScale(dd.x + margin[0],"x"));
        dd.coory = diffCoordToPiex(diffPiexScale(dd.y + margin[1], "y"));
        // console.log(table, obj)
        // table.data = obj.dataPrompt
        // table.show()
        // .attr("x",function (d) {

        //     var x = coordToPiex(+d.coorx);
        //     var xx = piexScale(x, "x") - margin[0];
        //     // return xx;
        //   return d3.event.x
        //   })
        //   .attr("y", function (d) {

        //     var y = coordToPiex(+d.coory);
        //     var yy = piexScale(y, "y") - margin[1];
        //     // return yy;
        //     return d3.event.y
        //   })
        // .style("transform", function (d) {
        // return "translate("+ (d3.event.x - margin[0])+"px,"+(d3.event.y ) +"px)"
        // return "translate("+ (d3.event.x - margin[0])+"px,"+(d3.event.y - margin[1]) +"px)"
        // })
      }
      function dragEnd() {
        d3.select(this).style("opacity", .2)
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

      function diffPiexScale(coord,str) {
        if (!str) {
          return coord / translate.k
        }
        return (coord - translate[str]) / translate.k;
      }
      function diffCoordToPiex(coord) {
        return coord / defaultImgScale;
      }

      function zoomStart() {

        console.log(1)
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
          .style("pointer-events", "none")
          ;



        this.svg = d3.select(this.box).select("svg");

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
        // drawList.call(this);
      }

      // function drawList() {
      //   let _promptlist = d3.select('#promptlist').selectAll("li").data(this.dataPrompt);
      //   _promptlist.enter()
      //     .append("li");
      //   let =  _promptlist.selectAll("#promptId").data(d);

      //   // _promptlist.each(function (p, j) {
      //   //   let li = d3.select(this).select('#promptId').data(p);
      //   //   li.enter()
      //   //     .append("p")
      //   //     .attr("id", "promptId")
      //   //     .html(p.id)
      //   // })
      //   _promptlist.exit().remove()

      // }
    }





    Init() {
      drawBackgrounImgOnCanvas.call(this)
    }

    Reload() {

    }


  }
  window.MapEnv = MapEnv;
})(window);