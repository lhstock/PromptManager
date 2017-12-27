!function () {
  var elmTable = {};
  elmTable.data = new Sign();
  elmTable.Create = function (labelid) {
    return CreateElmTable(labelid);
  }
  function CreateElmTable(label) {
    var _ = {};
    _.labelid = label + 'view';
    _[label] = {};

    prompt.call(this, _[label])
    function prompt(obj) {
      obj.em = new Vue({
        el: "#" + _.labelid,
        data: {
          tableData: elmTable.data[label],
          multipleSelection: [],
        },
        methods: {
          handleSelectionChange(val) {
            console.log(val);
            this.multipleSelection = val;
          },
          indexMethod(index) {
            return index;
          },
          commit() {
            this.multipleSelection = this.multipleSelection.map(d => {
              d.status = 'done';
              return d;
            })
          },
          change(data,index,i) {
            var k = ['coorx', 'coory'];
            var c = ['input-x-lh','input-y-lh']
            data[k[i]] = + d3.select(d3.select(this.$el).selectAll("." + c[i]).select("input").nodes()[index]).node().value;
            console.log(data, index, i, this.$el);
            env.Draw();
          },
          add() {
            console.log(_, elmTable, env, this)
            elmTable.data.add(label);
            env.Draw();
          },
          remove() {
            elmTable.data.remove(label);
            env.Draw()
          },
          formatter(row, column) {
            return row.address;
          },
          filterTag(value, row) {
            return row.status === value;
          },
          tableRowClassName({ row, rowIndex }) {
            if (row.status == 'init') {
              return ''
            }
            if (rowIndex === 'move') {
              return 'warning-row';
            } else if (rowIndex === 'done') {
              return 'success-row';
            }
          }
        }
      })
    }
    return _[label];
  }
  window.elmTable = elmTable;
}()