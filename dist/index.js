'use strict';

function unwrapExports (x) {
	return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
}

function createCommonjsModule(fn, basedir, module) {
	return module = {
	  path: basedir,
	  exports: {},
	  require: function (path, base) {
      return commonjsRequire(path, (base === undefined || base === null) ? module.path : base);
    }
	}, fn(module, module.exports), module.exports;
}

function commonjsRequire () {
	throw new Error('Dynamic requires are not currently supported by @rollup/plugin-commonjs');
}

var vueInViewportMixin = createCommonjsModule(function (module, exports) {

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

function _slicedToArray(arr, i) {
  return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest();
}

function _nonIterableRest() {
  throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}

function _unsupportedIterableToArray(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return _arrayLikeToArray(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
}

function _arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;

  for (var i = 0, arr2 = new Array(len); i < len; i++) {
    arr2[i] = arr[i];
  }

  return arr2;
}

function _iterableToArrayLimit(arr, i) {
  if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return;
  var _arr = [];
  var _n = true;
  var _d = false;
  var _e = undefined;

  try {
    for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
      _arr.push(_s.value);

      if (i && _arr.length === i) break;
    }
  } catch (err) {
    _d = true;
    _e = err;
  } finally {
    try {
      if (!_n && _i["return"] != null) _i["return"]();
    } finally {
      if (_d) throw _e;
    }
  }

  return _arr;
}

function _arrayWithHoles(arr) {
  if (Array.isArray(arr)) return arr;
}

function _typeof(obj) {
  "@babel/helpers - typeof";

  if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
    _typeof = function _typeof(obj) {
      return typeof obj;
    };
  } else {
    _typeof = function _typeof(obj) {
      return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    };
  }

  return _typeof(obj);
} // Generated by CoffeeScript 2.5.1
// Mixin definition


var indexOf = [].indexOf,
    slice = [].slice;
var _default2 = {
  // Public interface
  props: {
    // Add listeners and check if in viewport immediately
    inViewportActive: {
      type: Boolean,
      default: true
    },
    // Only update once by default. The assumption is that it will be used for
    // one-time buildins
    inViewportOnce: {
      type: Boolean,
      default: false
    },
    // The IntersectionObserver root margin adds offsets to when the now and
    // fully get updated.
    inViewportRootMargin: {
      type: Number | String,
      default: '0px 0px -1px 0px'
    },
    // Specify the IntersectionObserver root to use.
    inViewportRoot: {
      type: String | Function | Object,
      default: void 0
    },
    // The IntersectionObserver threshold defines the intersection ratios that
    // fire the observer callback
    inViewportThreshold: {
      type: Number | Array,
      default: function _default() {
        return [0, 1 // Fire on enter/leave and fully enter/leave
        ];
      }
    },
    inViewportRequiresRoot: {
      type: Boolean,
      default: false
    }
  },
  // Bindings that are used by the host component
  data: function data() {
    return {
      inViewport: {
        // Public props
        now: null,
        // Is in viewport
        fully: null,
        // Is fully in viewport
        above: null,
        // Is partially or fully above the viewport
        below: null,
        // Is partially or fully below the viewport
        // Internal props
        listening: false,
        maxThreshold: 1
      }
    };
  },
  // Lifecycle hooks
  mounted: function mounted() {
    return this.$nextTick(this.inViewportInit);
  },
  destroyed: function destroyed() {
    return this.removeInViewportHandlers();
  },
  computed: {
    // Add the maxThreshold to the @inViewportThreshold prop so that the handler
    // is fired for elements that are taller than the viewport
    inViewportThresholdWithMax: function inViewportThresholdWithMax() {
      var ref, threshold; // Support number and array thresholds

      threshold = _typeof(this.inViewportThreshold) === 'object' ? this.inViewportThreshold : [this.inViewportThreshold]; // Add only if not already in the threshold list

      if (ref = this.inViewport.maxThreshold, indexOf.call(threshold, ref) >= 0) {
        return threshold;
      } else {
        return threshold.concat(this.inViewport.maxThreshold);
      }
    }
  },
  // Watch props and data
  watch: {
    // Add or remove event handlers handlers
    inViewportActive: function inViewportActive(active) {
      if (active) {
        return this.addInViewportHandlers();
      } else {
        return this.removeInViewportHandlers();
      }
    },
    // If any of the Observer options change, re-init.
    inViewportRootMargin: function inViewportRootMargin() {
      return this.reInitInViewportMixin();
    },
    inViewportRoot: function inViewportRoot() {
      return function () {
        if (this.inViewportRequiresRoot && !this.inViewportRoot) {
          return this.removeInViewportHandlers();
        } else {
          return this.reInitInViewportMixin();
        }
      };
    },
    inViewportThresholdWithMax: function inViewportThresholdWithMax(now, old) {
      if (now.toString() !== old.toString()) {
        // In IE, this kept getting retriggered, so doing a manual comparison
        // of old and new before deciding whether to take action.
        return this.reInitInViewportMixin();
      }
    }
  },
  // Public API
  methods: {
    // Re-init
    reInitInViewportMixin: function reInitInViewportMixin() {
      this.removeInViewportHandlers();
      return this.inViewportInit();
    },
    // Instantiate
    inViewportInit: function inViewportInit() {
      if (this.inViewportActive) {
        return this.addInViewportHandlers();
      }
    },
    // Add listeners
    addInViewportHandlers: function addInViewportHandlers() {
      if (this.inViewportRequiresRoot && !this.inViewportRoot) {
        return;
      } // Don't add twice


      if (this.inViewport.listening) {
        return;
      }

      this.inViewport.listening = true; // Create IntersectionObserver instance

      this.inViewportObserver = new IntersectionObserver(this.updateInViewport, {
        root: function () {
          switch (_typeof(this.inViewportRoot)) {
            case 'function':
              return this.inViewportRoot();

            case 'string':
              return document.querySelector(this.inViewportRoot);

            case 'object':
              return this.inViewportRoot;
            // Expects to be a DOMElement

            default:
              return void 0;
          }
        }.call(this),
        rootMargin: this.inViewportRootMargin,
        threshold: this.inViewportThresholdWithMax
      }); // Start listening

      return this.inViewportObserver.observe(this.$el);
    },
    // Remove listeners
    removeInViewportHandlers: function removeInViewportHandlers() {
      var ref; // Don't remove twice

      if (!this.inViewport.listening) {
        return;
      }

      this.inViewport.listening = false; // Destroy instance, which also removes listeners

      if ((ref = this.inViewportObserver) != null) {
        ref.disconnect();
      }

      return delete this.inViewportObserver;
    },
    // Handle state changes.  There should only ever be one entry and we're
    // destructuring the properties we care about since they have long names.
    updateInViewport: function updateInViewport(arg) {
      var arg, root, target;

      var _slice$call = slice.call(arg, -1);

      var _slice$call2 = _slicedToArray(_slice$call, 1);

      var _slice$call2$ = _slice$call2[0];
      target = _slice$call2$.boundingClientRect;
      root = _slice$call2$.rootBounds; // Get the maximum threshold ratio, which is less than 1 when the
      // element is taller than the viewport. The height may be 0 when the
      // parent element is hidden.

      this.inViewport.maxThreshold = target.height > 0 ? Math.min(1, root.height / target.height) : 1; // Check if some part of the target is in the root box.  The isIntersecting
      // property from the IntersectionObserver was not used because it reports
      // the case where a box is immediately offscreen as intersecting, even
      // though no aprt of it is visible.

      this.inViewport.now = target.top <= root.bottom && target.bottom > root.top; // Calculate above and below.  The +1 on the bottom check co-incides with
      // the default root-margin which has a -1 on the bottom margin.

      this.inViewport.above = target.top < root.top;
      this.inViewport.below = target.bottom > root.bottom + 1; // Determine whether fully in viewport. The rules are different based on
      // whether the target is taller than the viewport.

      this.inViewport.fully = target.height > root.height ? target.top <= root.top && target.bottom >= root.bottom + 1 : !this.inViewport.above && !this.inViewport.below;

      if (this.inViewportOnce && this.inViewport.now) {
        // If set to update "once", remove listeners if in viewport
        return this.removeInViewportHandlers();
      }
    }
  }
};
exports.default = _default2;
});

var index = /*@__PURE__*/unwrapExports(vueInViewportMixin);

module.exports = index;
