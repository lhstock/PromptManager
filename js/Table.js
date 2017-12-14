!function () {
  var elmTable = {};
  elmTable.Create = function (labelid) {
    return CreateElmTable(labelid);
  }
  function CreateElmTable(label) {
    var _ = {};
    _.labelid = label + 'view';
    var dataM = new Sign();

    _.data = dataM;
    var Fun = {
      "prompt": prompt
    }
    Fun[label]();
    function prompt() {
      _.em = new Vue({
        el: "#"+_.labelid,
        data: {
          tableData: _.data[label],
          multipleSelection: [],
        },
        methods: {
          indexMethod(index) {
            return index ;
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
            _.data.add('prompt');
            env.Draw();
          },
          remove() {
            _.data.remove('prompt');
            env.Draw()
          },
          formatter(row, column) {
            return row.address;
          },
          filterTag(value, row) {
            return row.status === value;
          },
          tableRowClassName({ row, rowIndex }) {
            console.log(row,rowIndex)
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
    }

  
    return _;
  }
  window.elmTable = elmTable;
}()