var Barenote = (function() {
  var REF_SELECTOR = '.barenote';
  var REF_LIST_SELECTOR = '.barenote_ref_list';
  var FLOATING_NOTE_ID = 'barenote_floating_note';
  var FLOATING_NOTE_DEFAULT_CSS = "<!--\n" +
      "#barenote_floating_note {" +
      "background-color: #eeeeee;" +
      "padding: 0em 1em 0em 1em;" +
      "border: solid 1px;" +
      "font-size: 90%;" +
      "font-family: Helvetica, Sans-serif;" +
      "line-height: 1.4;" +
      "-moz-border-radius: .5em;" +
      "-webkit-border-radius: .5em;" +
      "border-radius: .5em;" +
      "opacity: 0.95;" +
      "}\n" +
      "// -->";

  var scrollToOwnTop = function () {
    var top = $(this).offset().top;
    $('html,body').animate({
        scrollTop: top
    }, 'fast');
    return false;
  }

  var floatingNote = (function() {
      var style = document.createElement('style');
          $(style).attr('type', 'text/css')
          .html(FLOATING_NOTE_DEFAULT_CSS);

      $('head').prepend(style);
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
              "",
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
        rootElement.find(REF_LIST_SELECTOR).first().append(bareNoteRefList);
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
