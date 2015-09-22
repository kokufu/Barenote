var Barenote = (function() {
  var VERSION = 0.1;

  var REF_CLASS = 'barenote';
  var REF_SELECTOR = '.' + REF_CLASS;
  var REF_LIST_CLASS = 'barenote_ref_list';
  var REF_LIST_SELECTOR = '.' + REF_LIST_CLASS;
  var FLOATING_NOTE_ID = 'barenote_floating_note';
  var FLOATING_NOTE_SELECTOR = '#' + FLOATING_NOTE_ID;
  var ABOUT_INDICATOR_CLASS = 'barenote_about_indicator';
  var ABOUT_INDICATOR_SELECTOR = '.' + ABOUT_INDICATOR_CLASS;
  var DEFAULT_CSS =
      FLOATING_NOTE_SELECTOR + ' {' +
      'background-color: #eeeeee;' +
      'padding: 0em 1em 0em 1em;' +
      'border: solid 1px;' +
      'font-size: 90%;' +
      'font-family: Helvetica, Sans-serif;' +
      'line-height: 1.4;' +
      '-moz-border-radius: .5em;' +
      '-webkit-border-radius: .5em;' +
      'border-radius: .5em;' +
      'opacity: 0.95;' +
      '}' +

      REF_LIST_SELECTOR + ' {' +
      'position: relative !important;' +
      '}' +

      ABOUT_INDICATOR_SELECTOR + ' {' +
      'position: absolute !important;' +
      'right: 1px !important;' +
      'top: 1px !important;' +
      'cursor: pointer !important;' +
      'background-color: #2196F3;' +
      'color: #ffffff;' +
      'width: 17px;' +
      'height: 17px;' +
      'line-height: 17px;' +
      'font-size: 10px;' +
      'text-align: center;' +
      'margin: 0;' +
      'padding: 0;' +
      '}';

  // TODO Move to another file
  var ABOUT_DIALOG = '<html><head><title>About</title></head>' +
      '<body style="text-align:center;"><h1>Barenote</h1>' +
      'version ' + VERSION + '<br />' +
      '<a href="https://github.com/kokufu/Barenote" target="_blank">https://github.com/kokufu/Barenote</a>' +
      '</body></html>';

  var style = document.createElement('style');
      $(style).attr('type', 'text/css')
      .html(DEFAULT_CSS);
  $('head').prepend(style);

  var scrollToOwnTop = function () {
    var top = $(this).offset().top;
    $('html,body').animate({
        scrollTop: top
    }, 'fast');
    return false;
  }

  var floatingNote = (function() {
      var instance = document.createElement('div');
      var timerId = false;

      $(instance)
          .attr('id', FLOATING_NOTE_ID)
          .css({'cssText': 'position: absolute !important;'})
          .appendTo(document.body);
      var opacity = $(instance).css('opacity');
      $(instance).hide();

      instance.show = function (event) {
          var offset = $(event.data.element).offset();
          var left = offset.left + $(event.data.element).width();
          var top = offset.top + $(event.data.element).height();
          var text = event.data.text;

          clearTimeout(timerId);
          $(instance).stop();

          $(instance).html(text);

          if (left + 420 > $(window).width() + $(window).scrollLeft()) {
              left = $(window).width() - 420 + $(window).scrollLeft();
          }
          if (top + $(instance).height() > $(window).height() + $(window).scrollTop()) {
              top = top - $(instance).height() - 15;
          }
          $(instance).css({
              'opacity': opacity,
              'left': left,
              'top': top
          });
          $(instance).show();
      };

      instance.hide = function () {
          timerId = setTimeout(function () {
              $(instance).animate({
                  'opacity': 0
              }, 1000, // duration 1 sec
              '',
              function () {
                  $(instance).hide();
              });
          }, 500); // delay 0.5sec
      };
      return instance;
  })();

  var refNumber = 1;
  var barenoteList = [];

  var Barenote = function(rootElement) {
    var refListLength = rootElement.find(REF_LIST_SELECTOR).length;
    if (refListLength > 1) {
      throw new Error("The rootElement contain " + refListLength + " elements whose class name is '" + REF_LIST_SELECTOR + "'");
    }
    var listExists = (refListLength != 0);

    var bareNoteRefList = $(document.createElement('ol'));
    if (listExists) {
        var ref_list = rootElement.find(REF_LIST_SELECTOR).first();
        ref_list.append(bareNoteRefList);

        // Add Aboud indicator
        var about = $(document.createElement('div'));
        about.attr('class', ABOUT_INDICATOR_CLASS);
        about.html('?')
             .click(function () {
                 var aboutWindow = window.open('', '', 'width=500, height=200');
                 aboutWindow.document.write(ABOUT_DIALOG);
                 return false;
             });
        ref_list.append(about);
    }

    var firstRefNumber = refNumber;
    var lastRefNumber;

    rootElement.find(REF_SELECTOR).each(function (i, bareNote) {
        var originalHTML = $(bareNote).html();

        // replace barenote tag with <a>
        if (!$(bareNote).is('a')) {
            var tmp = document.createElement('a');
            $(bareNote).replaceWith(tmp);
            bareNote = tmp;
        }

        // replace barenote text to the number
        $(bareNote)
            .html(i + 1)
            .attr('id', 'fnref:' + refNumber)
            .attr('href', '#fn:' + refNumber)
            .mouseover(
                { element: bareNote, text: originalHTML },
                  floatingNote.show)
            .mouseout(floatingNote.hide);

        // Add the text to the reference list
        bareNoteRefList.append($(bareNoteRef = document.createElement('li'))
                .attr('id', 'fn:' + refNumber)
                .html(originalHTML + '&nbsp;')
                .append($(document.createElement('a'))
                    .html('&#8617;')
                    .attr('href', '#fnref:' + refNumber)
                    .click($.proxy(scrollToOwnTop, bareNote)))
        );

        if (listExists) {
            $(bareNote).click($.proxy(scrollToOwnTop, bareNoteRef));
        }

        lastRefNumber = refNumber;

        refNumber++;
    });

    this.getRootElement = function() {
      return rootElement;
    }

    this.getFirstRefNumber = function() {
      return firstRefNumber;
    }

    this.getLastRefNumber = function() {
      return lastRefNumber;
    }

    barenoteList.push(this);
    return;
  }

  Barenote.apply = function(rootElements) {
    if (rootElements == null) {
      rootElements = $('body');
    } else {
      rootElements = $(rootElements);
    }

    if (rootElements.length == 1) {
      return new Barenote(rootElements);
    } else {
      var instances = [];
      rootElements.each(function() {
        instances.push(new Barenote($(this)));
      });
      return instances;
    }
  };

  Barenote.getBarenoteList = function() {
    return barenoteList;
  };

  Barenote.getFloatingNote = function() {
    return floatingNote;
  };

  return Barenote;
})();
