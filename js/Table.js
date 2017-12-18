!function () {
  var elmTable = {};
  elmTable.data = new Sign();
  elmTable.Create = function (labelid) {
    // elmTable[labelid] = {};
    return CreateElmTable(labelid);
  }
  function CreateElmTable(label) {
    var _ = {};
    _.labelid = label + 'view';
    // var dataM = new Sign();

    // _.data = dataM;
    _[label] = {};
    // var Fun = {
    //   "prompt": prompt
    // }
    // Fun[label]();
    prompt.call(this, _[label])
    function prompt(obj) {
      obj.em = new Vue({
        el: "#" + _.labelid,
        data: {
          tableData: elmTable.data[label],
          multipleSelection: [],
        },
        methods: {
          indexMethod(index) {
            return index;
          },
          // toggleSelection(rows) {
          //   if (rows) {
          //     rows.forEach(row => {
          //       this.$refs.multipleTable.toggleRowSelection(row);
          //     });
          //   } else {
          //     this.$refs.multipleTable.clearSclearSelectionelection();
          //   }
          // },
          add() {
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
            // return '';
          }
        }
      })
      // return _[label];
    }
    return _[label];
  }
  window.elmTable = elmTable;
}()