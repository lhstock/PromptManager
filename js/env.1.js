((window) => {
  function C() {
    console.log('ccc:', this, this.C)
  }
  // M == V == C
  let _DrawCanvas = Symbol();
  let _DrawSvg = Symbol();
  let _CallAttr = Symbol();


  let _SetBgImg = Symbol();
  let _Log = Symbol();
  let _only = ['only'];
  let _unit = new Unit();
  let _bgImg = {};

  class Maps {

    constructor(labelid) {
      let maps = this;
      this.labelid = labelid;
      this.selecter = {
        "box": d3.select('#' + labelid)
      };
      this.Init.call(this);
    }

    [_CallAttr](selecter, options) {
      function _call(_attr,_obj) {
        console.log(_obj)
        const key = Object.keys(_obj)[0];
        const value = Object.values(_obj)[0];
        selecter[_attr](key,value);
      }

      function strikeAttr() {
        for (const attr in options) {
          if (options.hasOwnProperty(attr)) {
            const option = options[attr];           
            strikeOption(attr, option);
          }
        }
      }

      function strikeOption(attr,option) {
        for (const key in option) {
          if (option.hasOwnProperty(key)) {
            const obj = { [key]: option[key] };
            _call(attr, obj);
          }
        }
      }

      strikeAttr()
    }

    [_DrawCanvas]() {
      let dom = this.selecter.box.node();
      let width = _unit.getAttr(dom, 'width');
      let height = _unit.getAttr(dom, 'height');
      let option = {
        attr: {
          width,
          height
        }
      }

      this.selecter.canvas = this.selecter.box.selectAll('canvas').data(_only);

      this.selecter.canvas
        .enter()
        .append("canvas")
        .attr('id', 'canvas')
        .call(this[_CallAttr],option);

     this.selecter.canvas = this.selecter.box.selectAll('canvas');
      this.selecter.canvas
       .call(this[_CallAttr],option)

      this.selecter.canvas.exit().remove();
    }

    


    Init() {
      this[_DrawCanvas].call(this);
    }

    getDomforSelecter(selecter, num) {
      if (!num) {
        return selecter.nodes();
      } else {
        return typeof selecter == 'string' ? d3.selectAll(selecter).nodes()[num] : selecter.nodes()[num];
      }
    }

  }

  class MapEnva extends Maps {
    constructor(labelid) {
      // this.labelid = new Maps(labelid);
      super(labelid);
    }

    [_Log]() {
      console.log("log", _bgImg, _only);
    }

    [_SetBgImg](option) {
      _bgImg = option;
      this[_Log]();
    }

    FloorOption(option) {
      this[_SetBgImg](option);
    }


  }
  window.test = MapEnva;
})(window)