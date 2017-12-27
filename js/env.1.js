((window) => {
  const _DrawCanvas = Symbol('drawCanvas');
  const _LoadBgForCanvas = Symbol('loadBgForCanvas');
  const _DrawSvg = Symbol('drawSvg');
  const _DrawNodes = Symbol('drawNodes');
  const _CallAttr = Symbol('callAttr');
  const _SelectDom = Symbol('selectDom');
  const _GetDomForSelecter = Symbol('getDomforSelecter');
  const _DrawImgOnCanvas = Symbol('drawImgOnCanvas');
  const _Clear = Symbol('clear');
  const _ViewModel = Symbol('viewModel');
  const _SetBgImg = Symbol('setBgImg');
  const _AddZoomEvent = Symbol('addZoomEvent');
  const _DataInit = Symbol('dataInit');
  const _DataClear = Symbol('clearData');
  const _Log = Symbol('Log');
  const _ModeSelect = Symbol("modelSelect");
  let _only = ['only'];
  let _unit = new Unit();
  let _bgImg = {};

  class MapsModel {
    constructor(labelid) {
      this.model = {};

      this.model.selecter = {
        "box": d3.select('#' + labelid)
      };

      this.model.dom = {
        "box": this[_GetDomForSelecter](this.model.selecter.box)
      }

      this.model.layout = {
        boxWidth: _unit.getAttr(this.model.dom.box, "width"),
        boxHeight: _unit.getAttr(this.model.dom.box, "height")
      };

      this.model.option = {
        "canvas": {
          "attr": {
            "width": this.model.layout.boxWidth,
            "height": this.model.layout.boxHeight
          },
          "style": {
            "position": "absolute",
            "z-index": 100
          }
        },
        "svg": {
          "attr": {
            "width": this.model.layout.boxWidth,
            "height": this.model.layout.boxHeight
          },
          "style": {
            "position": "absolute",
            "z-index": 200,
            "pointer-events": "none"
          }
        },
        "nodes": {
          "attr": {
            "r": "5px",
            "cx": function (d) {

            },
            "cy": function (d) {

            },
            "fill": "red"
          },
          "style": {
            "opacity": 1,
            "pointer-events": "fill"
          }
        }
      };

      this[_DataInit]();

      this.model.status = {
        bg: false
      }

      this.model.translate = {
        x: 0,
        y: 0,
        k: 1,
      }

      this.model.viewModel = {
        viewProt: new ViewModel([this.model.layout.boxWidth, this.model.layout.boxHeight]),
        imgProt: new ViewModel(),
        canvasProt: new ViewModel()
      }

      this.model.tool = {};

      let _ = this;
      let model = this.model;

      this.model.tool.zoom = d3.zoom()
        .scaleExtent([1, 10])
        .on('start', zoomStart)
        .on('zoom', zooming)
        .on('end', zoomEnd);

      function zoomStart() { }

      function zooming() {
        let transform = d3.event.transform;
        crossTheBorder();
        model.translate = transform;
        _[_LoadBgForCanvas]();

        function crossTheBorder() {
          var canvasProt = model.viewModel.canvasProt;
          var viewProt = model.viewModel.viewProt;

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

      }

      function zoomEnd() { }

      function ViewModel(size) {
        var model = {
          width: undefined,
          height: undefined,
          aspectRatiol: undefined
        };

        model.Size = function (size) {
          model.width = size ? size[0] : undefined;
          model.height = size ? size[1] : undefined;
          model.aspectRatiol = size ? size[0] / size[1] : undefined;
          return model;
        }

        size && model.Size(size);

        return model;
      }
    }

    [_SelectDom](uuid) {
      var _selecter = d3.selectAll(uuid)
      let isExist = !!this[_GetDomForSelecter](_selecter);
      if (!isExist) {
        console.info('d3.selectAll(', uuid, ') is null;');
      }
      return isExist ? _selecter : null;
    }

    [_GetDomForSelecter](selecter, num) {
      let nodes = selecter.nodes();
      if (!nodes) return null;
      num = num || 0;
      if (nodes.length > 1) {
        return num ? nodes[num] : nodes;
      } else {
        return nodes[num]
      }
    }

    [_DataInit]() {
      this.model.data = {
        "bg": [],
        "nodes": [],
        "links": []
      }
    }
    [_DataClear](key) {
      this.model.data[key].length = 0;
    }

  }

  class MapsView extends MapsModel {
    constructor(labelid) {
      super(labelid);
      let maps = this;
      this.View = {
        "bgObj": new Image()
      }
    }

    [_CallAttr](selecter, options) {
      function _call(_attr, _obj) {
        const key = Object.keys(_obj)[0];
        const value = Object.values(_obj)[0];
        selecter[_attr](key, value);
      }

      function strikeAttr() {
        for (const attr in options) {
          if (options.hasOwnProperty(attr)) {
            const option = options[attr];
            strikeOption(attr, option);
          }
        }
      }

      function strikeOption(attr, option) {
        for (const key in option) {
          if (option.hasOwnProperty(key)) {
            const obj = { [key]: option[key] };
            _call(attr, obj);
          }
        }
      }

      strikeAttr()
    }

    [_AddZoomEvent]() {
      this.model.status.bg ? this.model.selecter.canvas.call(this.model.tool.zoom) : setTimeout(() => {
        this[_AddZoomEvent]();
      }, 1);
    }

    [_DrawCanvas]() {
      let selecter = this.model.selecter.box.selectAll('canvas').data(_only);

      selecter
        .enter()
        .append("canvas")
        .attr('id', 'canvas')
        .call(this[_CallAttr], this.model.option.canvas);

      selecter
        .call(this[_CallAttr], this.model.option.canvas)

      selecter.exit().remove();
      this[_AddZoomEvent].call(this);
      this.model.selecter.canvas = this.model.selecter.box.select('canvas');
      this.model.selecter.ctx = this[_GetDomForSelecter](this.model.selecter.canvas).getContext("2d");

    }

    [_DrawSvg]() {
      let selecter = this.model.selecter.box.selectAll("svg").data([_only]);

      selecter
        .enter()
        .append('svg')
        .attr("id", 'svg')
        .call(this[_CallAttr], this.model.option.svg);

      selecter
        .call(this[_CallAttr], this.model.option.svg);

      selecter.exit().remove();

      this.model.selecter.svg = this.model.selecter.box.select('svg');
      this.model.selecter.svg.append("g").attr("class", "linksGroup");
      this.model.selecter.svg.append("g").attr("class", "nodesGroup");
      this.model.selecter.linksGroup = this.model.selecter.svg.select(".linksGroup");
      this.model.selecter.nodesGroup = this.model.selecter.svg.select(".nodesGroup");

    }

    [_DrawImgOnCanvas](img, x, y, width, height) {
      this.model.selecter.ctx.drawImage(img, x, y, width, height);
    }

    [_Clear]() {
      this.model.selecter.ctx.clearRect(0, 0, this.model.layout.boxWidth, this.model.layout.boxHeight);
    }

    [_LoadBgForCanvas]() {
      this.View.bgObj.src = this.model.data.bg[2];
      let maps = this;
      this.View.bgObj.onload = function () {
        maps[_Clear].call(maps);
        maps[_DrawImgOnCanvas].call(maps, maps.View.bgObj, maps.model.translate.x, maps.model.translate.y, maps.model.viewModel.canvasProt.width * maps.model.translate.k, maps.model.translate.k * maps.model.viewModel.canvasProt.height);
        maps.model.status.bg = true;
      }
    }

    [_DrawNodes]() {
      let nodes = this.model.selecter.nodesGroup.selectAll(".nodes").data(this.model.data.nodes);
      nodes.enter()
        .append("circle")
        .attr("class", 'nodes')
        .call(this[_CallAttr], this.model.option.nodes);
      nodes
        .call(this[_CallAttr], this.model.option.nodes);
      nodes.exit().remove();

      this.model.selecter.nodes = this.model.selecter.nodesGroup.select('.nodes');
    }
  }

  class MapsController extends MapsView {
    constructor(labelid) {
      // this.labelid = new Maps(labelid);
      super(labelid);
    }

    [_Log]() {
      console.log('log');
    }

    [_SetBgImg](option) {
      // _bgImg = option;
      this.model.data.bg = option;
      var [width, height] = option;
      this.model.viewModel.imgProt.Size([width, height])
      writeCanvasProt.call(this);
      function writeCanvasProt() {
        let arr = [];
        let viewProt = this.model.viewModel.viewProt;
        let imgProt = this.model.viewModel.imgProt;

        if (viewProt.aspectRatiol > imgProt.aspectRatiol) {
          arr[0] = viewProt.width;
          arr[1] = viewProt.width / imgProt.aspectRatiol;
        } else {
          arr[1] = viewProt.height;
          arr[0] = viewProt.height * imgProt.aspectRatiol;
        }
        this.model.viewModel.canvasProt.Size(arr);
        this.model.defaultImgScale = this.model.viewModel.canvasProt.width / this.model.viewModel.imgProt.width;
      }

    }

    FloorOption(option) {
      this[_SetBgImg](option);

      return this;
    }

    Init() {
      this[_DrawCanvas].call(this);
      this[_LoadBgForCanvas].call(this);
      this[_DrawSvg].call(this);

      return this;
    }


  }
  window.test = MapsController;
})(window)