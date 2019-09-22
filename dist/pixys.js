"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Pixys =
/*#__PURE__*/
function () {
  function Pixys(src) {
    var _this = this;

    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    _classCallCheck(this, Pixys);

    var defaultOptions = {
      headers: {},
      crossOrigin: 'anonymous'
    };
    this.options = Object.assign({}, defaultOptions, options);
    this.canvas = document.createElement('canvas');
    this.context = this.canvas.getContext('2d');
    this.loaded = false;

    var setImage = function setImage(img) {
      _this.canvas.width = img.width;
      _this.canvas.height = img.height;

      _this.context.drawImage(img, 0, 0);

      _this.loaded = true;
    };

    if (typeof src === 'string') {
      var img = new Image();
      var xhr = new XMLHttpRequest();

      xhr.onreadystatechange = function () {
        if (xhr.readyState == 4 && xhr.status == 200) {
          img.src = URL.createObjectURL(xhr.response);
          img.crossOrigin = _this.options.crossOrigin;

          img.onload = function () {
            setImage(img);
          };
        }
      };

      xhr.open('GET', src);
      xhr.responseType = 'blob';

      for (var _i = 0, _Object$keys = Object.keys(this.options.headers); _i < _Object$keys.length; _i++) {
        var key = _Object$keys[_i];
        xhr.setRequestHeader(key, this.options.headers[key]);
      }

      xhr.send(null);
    } else if (src instanceof HTMLElement && src.tagName.toLocaleLowerCase() === 'img') {
      console.log(src);
      setImage(src);
    }

    if (this.options.parent instanceof HTMLElement) {
      this.options.parent.appendChild(this.canvas);
    } else if (typeof this.options.parent === 'string') {
      document.getElementById(this.options.parent).appendChild(this.canvas);
    }
  }

  _createClass(Pixys, [{
    key: "getValue",
    value: function getValue(x, y) {
      var pixel = this.context.getImageData(x, y, 1, 1);
      return pixel.data;
    }
  }, {
    key: "setValue",
    value: function setValue(x, y) {
      var value = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
      console.log(this);
      var pixel = this.context.getImageData(x, y, 1, 1);
      if (value.hasOwnProperty('r')) pixel.data[0] = value.r;
      if (value.hasOwnProperty('g')) pixel.data[1] = value.g;
      if (value.hasOwnProperty('b')) pixel.data[2] = value.b;
      if (value.hasOwnProperty('a')) pixel.data[3] = value.a;
      this.context.putImageData(pixel, x, y);
    }
  }, {
    key: "setPicker",
    value: function setPicker(cb) {
      var _this2 = this;

      var pick = function pick(event) {
        var x = event.layerX;
        var y = event.layerY;

        var value = _this2.getValue(x, y);

        cb(x, y, value);
      };

      this.canvas.addEventListener('touchstart', function (event) {
        event.preventDefault();
        pick(event);
      });
      this.canvas.addEventListener('click', pick);
    }
  }]);

  return Pixys;
}();