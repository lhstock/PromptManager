!function () {
  function Sign() {
    // 判断是否存在实例
    if (typeof Sign.instance === 'object') {
      return Sign.instance;
    }

    // 其它内容
    // this.start_time = 0;
    // this.bang = "Big";
    this.prompt = [];
    
    this.ibeacon=[];
    this.node=[];
    this.links=[];
    this.SetData = function (key, value) {
      // this[key] = value;
      this[key].length = 0;
      var [...a] = value;
      var [...b] = [...a].map(d => {
        d.status = 'init';
        return d;
      })
      this[key].push(...b);
    }
    this.clear = function (key) {
      this[key] = []//.length=0;
    }
    this.add = function (key) {
      var num = this[key].length;
      switch (key) {
        case 'prompt':
          var obj = this[key][num-1];
          var id = obj ? obj.id + 1 : 1;
          var json = '{"id":' + id + ',"exhibitsTitle":"","exhibitsAddress":"","exhibitsAuthor":"无锡博物院","exhibitsSummary":"","panoramaUrl":"","imgUrl":"","coverImg":"","uuid":"","exhibitsSubtitle":"","coorx":"900","coory":"900","mediaUrl":"","exhibitionId":"","exhibitsType":"5","mapId":"","beaconId":"","tag":"0","major":"","minor":"","x":100,"y":100,"status":"init"}'
          var o = JSON.parse(json);
          this[key].push(o);
          break;
        case 'ibeacon':
          var obj = this[key][num - 1];
          var id = obj ? +obj.id + 1 : 1;
          var json = '{"id":' + id + ',"coorx":900,"coory":900,"status":"init"}';
          var o = JSON.parse(json);
          this[key].push(o);
 
          break;  
        case 'node':
          var obj = this[key][num - 1];
          var id = obj ? +obj.id + 1 : 1;
          var json = '{"id":' + id + ',"coorx":900,"coory":900,"status":"init"}';
          var o = JSON.parse(json);
          this[key].push(o);
 
          break;  
        case 'links':
          var obj = this[key][num - 1];
          var id = obj ? +obj.id + 1 : 1;
          var json = '{"id":' + id + ',"source":0,"target":1,"status":"add"}';
          var o = JSON.parse(json);
          this[key].push(o);

          break;  

        default:
          break;
      }
      var id = obj ? obj.id + 1 : 1;
    }
    // this.add.call(this,'prompt')
    this.remove = function (key,index) {
      if (!index) {
        index = this[key].length - 1;
      }

      if (index >= 0) {
        this[key].splice(index, 1);
      }
    }

    

    // 缓存
    Sign.instance = this;

    // 隐式返回this
  }
  window.Sign = Sign;
}()