
((window, MapEnv, Sign, elmTable) => {
  console.log(this, d3.version, $(".view"));

  class Ctrl {
    constructor(dataManager) {
      var url = "1f";
      this.imgUrl = "./img/" + url + "f.jpg";
      this.dataManager = dataManager;
      this.bind()
      this.floorNum = 1;
    }

    bind() {
      floors.onclick = this.jumpFloor.bind(this);
      dataSource.onclick = this.Import.bind(this);
      // edit.onclick = this.Edit.bind(this);
    }

    jumpFloor(e) {
      let target = e.target;
      let siblings = target.parentNode.children;
      this.removeActiveClass();

      [...siblings].forEach(obj => {
        if (obj === target) {
          obj.classList.add("active");
          let floorNum = target.getAttribute("data-num");
          this.floorNum = floorNum;
          let floorUrl = "./img/" + floorNum + "f.jpg";
          env.SetDataImg([5378, 2174, floorUrl, 1])
          this.dataManager.clear('prompt');
          this.dataManager.clear('ibeacon');
          this.dataManager.clear("node");
          this.dataManager.clear('links');
          env.SetData("dataPrompt", this.dataManager.prompt)
          env.SetData("dataIbeacon", this.dataManager.ibeacon)
          env.SetData("dataNode", this.dataManager.node)
          env.SetData("dataLinks", this.dataManager.links)
          this.SYNC();
          env.Init()
          env.Draw()
        } else {
          obj.classList.remove("active");
        }
      })
    }

    Edit(e) {
      let target = e.target;
      let siblings = target.parentNode.children;
      console.log("edit")
      target === [...siblings][0] && console.log("add")
      target === [...siblings][1] && console.log("del")
    }

    Import(e) {
      function draw(key) {
        let [a, ...b] = key;
        let type = "data" + a.toUpperCase() + [...b].join('');
        env.SetData(type, o.dataManager[key])
        env.Draw();
      }

      let target = e.target;
      let siblings = target.parentNode.children;
      let o = this;
      [...siblings].forEach((obj, index) => {
        if (obj === target) {
          let dataUrl;
          let s = obj.classList[0] == 'active';
          switch (index) {
            case 0:
              if (!s) {
                obj.classList.add("active");
                getData.call(this, 0);
                promptview.classList.add('active');

              } else {
                obj.classList.remove("active");
                o.dataManager.clear('prompt');
                draw('prompt')
                promptview.classList.remove('active');
              }

              break;
            case 1:
              if (!s) {
                obj.classList.add("active");
                getData.call(this, 1)
                ibeaconview.classList.add('active')
              } else {
                obj.classList.remove("active");
                o.dataManager.clear('ibeacon');
                draw('ibeacon')
                ibeaconview.classList.remove('active')
              }
              break;
            case 2:
              if (!s) {
                obj.classList.add("active");
                getData.call(this, 2);
                nodeview.classList.add('active')
              } else {
                obj.classList.remove("active");
                o.dataManager.clear('node');
                draw('node')
                nodeview.classList.remove('active')
              }
              break;
            case 3:
              if (!s) {
                obj.classList.add("active");
                getData.call(this, 3);
                linksview.classList.add('active')
              } else {
                obj.classList.remove("active");
                o.dataManager.clear('links');
                draw('links')
                linksview.classList.remove('active')
              }
              break;
            default:

              break;
          }

          function getData(index) {
            switch (index) {
              case 0:
                dataUrl = target.getAttribute("data-num") + this.floorNum;
                d3.json(dataUrl, function (err, json) {
                  if (!err) {
                    switch (json.status) {
                      case 0:
                        o.dataManager.SetData('prompt', json.result);
                        o.SYNC();
                        break;
                      default:
                        o.dataManager.clear('prompt');
                        o.SYNC();
                        break;
                    }

                    draw('prompt');
                    if (!o.dataManager.prompt.length) alert("数据为空")
                  } else {
                    o.dataManager.clear('prompt');
                    o.SYNC();
                    draw('prompt');


                  }
                });
                break;
              case 1:
                dataUrl = target.getAttribute("data-num") + this.floorNum + "f.tsv";
                d3.tsv(dataUrl, function (err, json) {
                  if (!err) {
                    o.dataManager.SetData('ibeacon', json);
                    o.SYNC();
                    draw('ibeacon');
                  } else {
                    o.dataManager.clear('ibeacon');
                    o.SYNC();
                    draw('ibeacon');
                  }
                })
                break;
              case 2:
                dataUrl = target.getAttribute("data-num") + this.floorNum + 'f.json';
                d3.json(dataUrl, function (err, json) {
                  if (!err) {
                    o.dataManager.SetData("node", json);
                    o.SYNC();
                    draw('node')
                  } else {
                    o.dataManager.clear('node');
                    o.SYNC();
                    draw('node')
                  }
                })

                break;
              case 3:
                dataUrl = target.getAttribute("data-num") + this.floorNum + 'f.json';
                d3.json(dataUrl, function (err, json) {
                  if (!err) {
                    o.dataManager.SetData('links', json);
                    o.SYNC();
                    draw('links');
                  } else {
                    o.dataManager.clear('links');
                    o.SYNC();
                    draw('links')
                  }
                })
                break;
              default:
                break;
            }
          }

        }
      })


    }

    SYNC() {
      table1.em.tableData = dataManager.prompt;
      table2.em.tableData = dataManager.ibeacon;
      table3.em.tableData = dataManager.node;
      table4.em.tableData = dataManager.links;
    }



    GetCoordinate() {

    }

    removeActiveClass() {
      $("li").removeClass("active");
      $(".active").removeClass("active")
    }


  }

  window.dataManager = new Sign();
  window.table1 = elmTable.Create('prompt');
  window.table2 = elmTable.Create('ibeacon');
  window.table3 = elmTable.Create('node');
  window.table4 = elmTable.Create('links')
  window.n = new Ctrl(dataManager);
  window.env = new MapEnv('views');
}
)(window, MapEnv, Sign, elmTable);