var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __slice = [].slice;

(function($, window, document) {
  "use strict";
  var closest, defaults, getLevelDepth, hasParent, isFromMobile, pluginName;
  pluginName = 'offScreen';
  defaults = {
    type: 'overlap',
    levelSpacing: 40,
    backClass: 'navigation-back'
  };
  getLevelDepth = function(level, id, waypoint, cnt) {
    if (cnt == null) {
      cnt = 0;
    }
    if (level.id.indexOf(id) >= 0) {
      return cnt;
    }
    if ($(level).hasClass(waypoint)) {
      ++cnt;
    }
    return level.parentNode && getLevelDepth(level.parentNode, id, waypoint, cnt);
  };
  hasParent = function(e, id) {
    var el;
    if (!e) {
      return false;
    }
    el = e.target || e.srcElement || e || false;
    while (el && el.id !== id) {
      el = el.parentNode || false;
    }
    return el !== false;
  };
  closest = function(e, classname) {
    if ($(e).hasClass(classname)) {
      return e;
    }
    return e.parentNode && closest(e.parentNode, classname);
  };
  isFromMobile = function() {
    var check;
    check = false;
    (function(a) {
      if (/(android|ipad|playbook|silk|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))) {
        return check = true;
      }
    })(navigator.userAgent || navigator.vendor || window.opera);
    return check;
  };
  Furatto.OffScreen = (function() {
    function OffScreen(el, a, options) {
      this.el = el;
      this.openMenu = __bind(this.openMenu, this);
      this._closeMenu = __bind(this._closeMenu, this);
      this.resetMenu = __bind(this.resetMenu, this);
      this._setupLevelBack = __bind(this._setupLevelBack, this);
      this._setupLevelsClosing = __bind(this._setupLevelsClosing, this);
      this._hideOnDocumentClick = __bind(this._hideOnDocumentClick, this);
      this._hideOnEsc = __bind(this._hideOnEsc, this);
      this._setupMenuItems = __bind(this._setupMenuItems, this);
      this._bindEvents = __bind(this._bindEvents, this);
      this._shouldPreventOffScreenMenuFromOpening = __bind(this._shouldPreventOffScreenMenuFromOpening, this);
      this.options = $.extend({}, defaults, options);
      this.open = false;
      this.level = 0;
      this.wrapper = document.getElementById('off-screen');
      this.levels = Array.prototype.slice.call(this.el.querySelectorAll('div.off-screen-level'));
      this._setLevels();
      this.menuItems = Array.prototype.slice.call(this.el.querySelectorAll('li'));
      this.levelBack = Array.prototype.slice.call(this.el.querySelectorAll('.navigation-back'));
      this.eventType = isFromMobile() ? 'touchstart' : 'click';
      $(this.el).addClass("off-screen-" + this.options.type);
      this.trigger = document.getElementById('trigger');
      if ($(window).width() <= 768) {
        this._bindEvents();
      }
      this._shouldPreventOffScreenMenuFromOpening();
    }

    OffScreen.prototype._setLevels = function() {
      var level, _i, _len, _ref, _results;
      _ref = this.levels;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        level = _ref[_i];
        _results.push(level.setAttribute('data-level', getLevelDepth(level, this.el.id, 'off-screen-level')));
      }
      return _results;
    };

    OffScreen.prototype._shouldPreventOffScreenMenuFromOpening = function() {
      var _this = this;
      return $(window).resize(function() {
        _this.resetMenu();
        if ($(window).width() >= 768) {
          return _this.trigger.removeEventListener(_this.eventType);
        } else {
          return _this.trigger.addEventListener(_this.eventType, function(event) {
            event.stopPropagation();
            event.preventDefault();
            if (_this.open) {
              return _this.resetMenu();
            } else {
              _this.openMenu();
              return document.addEventListener(_this.eventType, function(event) {
                if (_this.open && !hasParent(event.target, _this.el.id)) {
                  return bodyClickBinding(_this);
                }
              });
            }
          });
        }
      });
    };

    OffScreen.prototype._bindEvents = function() {
      var bodyClickBinding,
        _this = this;
      bodyClickBinding = function(el) {
        _this.resetMenu();
        return el.removeEventListener(_this.eventType, bodyClickBinding);
      };
      this.trigger.addEventListener(this.eventType, function(event) {
        event.stopPropagation();
        event.preventDefault();
        if (_this.open) {
          return _this.resetMenu();
        } else {
          _this.openMenu();
          return document.addEventListener(_this.eventType, function(event) {
            if (_this.open && !hasParent(event.target, _this.el.id)) {
              return bodyClickBinding(document);
            }
          });
        }
      });
      this._setupMenuItems();
      this._setupLevelsClosing();
      return this._setupLevelBack();
    };

    OffScreen.prototype._setupMenuItems = function() {
      var _this = this;
      return this.menuItems.forEach(function(el, i) {
        var subLevel;
        subLevel = el.querySelector('div.off-screen-level');
        if (subLevel) {
          return el.querySelector('a').addEventListener('click', function(event) {
            var level;
            event.preventDefault();
            level = closest(el, 'off-screen-level').getAttribute('data-level');
            if (_this.level <= level) {
              event.stopPropagation();
              $(closest(el, 'off-screen-level')).addClass('off-screen-level-overlay');
              return _this.openMenu(subLevel);
            }
          });
        }
      });
    };

    OffScreen.prototype._hideOnEsc = function(event) {
      if (event.keyCode === 27) {
        return this.resetMenu();
      }
    };

    OffScreen.prototype._hideOnDocumentClick = function(event) {
      return this.resetMenu();
    };

    OffScreen.prototype._setupLevelsClosing = function() {
      var levelEl, _i, _len, _ref, _results;
      _ref = this.levels;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        levelEl = _ref[_i];
        _results.push(levelEl.addEventListener(this.eventType, function(event) {
          var level;
          event.stopPropagation();
          level = levelEl.getAttribute('data-level');
          if (this.level > level) {
            this.level = level;
            return this._closeMenu();
          }
        }));
      }
      return _results;
    };

    OffScreen.prototype._setupLevelBack = function() {
      var _this = this;
      return this.levelBack.forEach(function(el, i) {
        return el.addEventListener(_this.eventType, function(event) {
          var level;
          event.preventDefault();
          level = closest(el, 'off-screen-level').getAttribute('data-level');
          if (_this.level <= level) {
            event.stopPropagation();
            _this.level = closest(el, 'off-screen-level').getAttribute('data-level') - 1;
            if (_this.level === 0) {
              return _this.resetMenu();
            } else {
              return _this._closeMenu();
            }
          }
        });
      });
    };

    OffScreen.prototype.resetMenu = function() {
      this._setTransform('translate3d(0,0,0)');
      this.level = 0;
      $(this.wrapper).removeClass('off-screen-pushed');
      this._toggleLevels();
      this.open = false;
      return $(document).unbind('keyup', this._hideOnEsc);
    };

    OffScreen.prototype._closeMenu = function() {
      var translateVal;
      translateVal = this.options.type === 'overlap' ? this.el.offsetWidth + (this.level - 1) * this.options.levelSpacing : this.el.offsetWidth;
      this._setTransform("translate3d(" + translateVal + "px, 0, 0");
      return this._toggleLevels();
    };

    OffScreen.prototype.openMenu = function(subLevel) {
      var level, levelFactor, translateVal, _i, _len, _ref;
      ++this.level;
      levelFactor = (this.level - 1) * this.options.levelSpacing;
      translateVal = this.options.type === 'overlap' ? this.el.offsetWidth + levelFactor : this.el.offsetWidth;
      this._setTransform('translate3d(' + translateVal + 'px,0,0)');
      if (subLevel) {
        this._setTransform('', subLevel);
        _ref = this.levels;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          level = _ref[_i];
          if (level !== subLevel && !$(level).hasClass('off-screen-level-open')) {
            this._setTransform("translate3d(-100%, 0, 0) translate3d(" + (-1 * levelFactor) + "px, 0, 0)", $(level));
          }
        }
      }
      if (this.level === 1) {
        $(this.wrapper).addClass('off-screen-pushed');
        this.open = true;
      }
      if (subLevel) {
        $(subLevel).addClass('off-screen-level-open');
      } else {
        $(this.levels[0]).addClass('off-screen-level-open');
      }
      $(document).bind('keyup', this._hideOnEsc);
      return $(document).on('touchstart', this._hideOnDocumentClick);
    };

    OffScreen.prototype._toggleLevels = function() {
      var level, _i, _len, _ref, _results;
      _ref = this.levels;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        level = _ref[_i];
        if (level.getAttribute('data-level') >= this.level + 1) {
          $(level).removeClass('off-screen-level-open');
          _results.push($(level).removeClass('off-screen-level-overlay'));
        } else if (Number(level.getAttribute('data-level') === this.level)) {
          _results.push($(level).removeClass('off-screen-level-overlay'));
        } else {
          _results.push(void 0);
        }
      }
      return _results;
    };

    OffScreen.prototype._setTransform = function(value, element) {
      if (element == null) {
        element = this.wrapper;
      }
      return $(element).css({
        '-webkit-transform': value,
        '-moz-transform': value,
        '-o-transform': value,
        'transform': value
      });
    };

    return OffScreen;

  })();
  $.fn[pluginName] = function(a, options) {
    var args, _;
    _ = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
    return this.each(function() {
      var plugin;
      plugin = $.data(this, "plugin_" + pluginName);
      if (!plugin) {
        return $.data(this, "plugin_" + pluginName, new Furatto.OffScreen(this, a, options));
      } else if ((plugin[_] != null) && $.type(plugin[_]) === 'function') {
        return plugin[_].apply(plugin, args);
      }
    });
  };
  $('.off-screen-navigation').offScreen();
  $(document).click(function() {
    return $('.off-screen-navigation').offScreen('resetMenu');
  });
  return Furatto.OffScreen.version = "1.0.0";
})(jQuery, window, document);
