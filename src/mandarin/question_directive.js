(function() {
  'use strict';

  angular.module('testApp')
      .directive('question', function () {
      return {
          link: function (scope) {
              scope.answerCssClass = function (option, choice, answer, status) {
                  var cssPrefix = 'question-answer--';

                  if (status !== 'unanswered') {
                      if (status === 'correct' && answer === option) {
                          return cssPrefix + 'correct';
                      } else if (answer === option) {
                          return cssPrefix + 'answer';
                      } else if (status === 'incorrect' && option === choice) {
                          return cssPrefix + 'incorrect';
                      } else {
                          return cssPrefix + 'disabled';
                      }
                  } else if (option === choice) {
                      return cssPrefix + 'selected';
                  }
              };

              scope.chapterClick = function ($event, chapterName, href) {
                  if (href) {
                      $event.preventDefault();
                      window.open(href);
                  }

                  if (ga) {
                      ga('send', 'event', 'Test', 'Click', chapterName);
                  }
                  if (gtag) {
                      gtag('event', 'questions', { 'category': 'chapter_click', 'link_text': chapterName, 'link_url': href });
                  }
              };

              scope.selectOption = function (choice, status) {
                  if (status === 'unanswered') {
                      scope.data.choice = choice;
                  }
              };
          },
          scope: {
              content: '=',
              index: '=',
              data: '=',
              submit: '='
          },
          templateUrl: './components/question/view.html'
      };
  });
})();