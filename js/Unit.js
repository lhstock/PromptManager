!function () {
  function Unit() {
    var unit = {};
    unit.deepCopy = function (o, new_) {
      /**
     * 是否需要深拷贝
     */
      if (isNotDeepCopy(o)) {
        new_ = o;
        return new_;
      } else {
        new_ = new_ || getType(o);
        for (var key in o) {
          if (isNotDeepCopy(o[key])) {
            new_[key] = o[key];
          } else {
            new_[key] = getType(o[key]);
            this.deepCopy(o[key], new_[key])
          }

        }
        return new_;
      }

      function isNotDeepCopy(obj) {

        var judge = type_('string') || type_('number') || type_('boolean');
        return judge ? true : false;

        function type_(str) {
          return typeof obj === str
        }
      }

      function BooleanOfObj(obj) {
        return Array.isArray(obj);
      }

      function getType(obj) {
        return BooleanOfObj(obj) ? new Array : new Object;
      }

    }
    unit.getAttr = function (dom,attr) {
      if (typeof dom === "string") {
          dom = window[dom];
        }
        return $(dom)[attr]();

    }
    return unit;
  }
  window.Unit = Unit;
}()