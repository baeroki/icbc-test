(function() {
    'use strict';

    angular.module('testApp')
        .controller('TestController', ['$scope', '$rootScope', '$location', '$routeParams', '$anchorScroll', 'TestFactory',
        function ($scope, $rootScope, $location, $routeParams, $anchorScroll, TestFactory) {
            $rootScope.bodyClass = 'test';
            $rootScope.content = null;

            var localStorageNamespace = 'ICBC.Test',
                language,
                questions,
                questionStartTime,
                test;

            $scope.test = null;

            $scope.currentQuestion = null;
            $scope.answeredQuestions = null;
            $scope.correctQuestions = null;
            $scope.incorrectQuestions = null;

            $scope.question = null;
            $scope.nextQuestionImage = null;

            $scope.submitOption = function () {
                var correct = $scope.question.answer == $scope.question.choice;

                if (correct) {
                    $scope.question.status = 'correct';
                    $scope.correctQuestions++;
                } else {
                    $scope.question.status = 'incorrect';
                    $scope.incorrectQuestions++;
                }

                if (ga && gtag) {
                    var id = $scope.question._id;
                    var page = '/' + test + '/' + language + '/' + id;
                    var fields = {
                        'page': page
                    };

                    if (correct) {
                        ga('send', 'event', 'Question', 'Question Complete', 'Correct', 1, fields);
                        gtag('event', 'questions', { 'category': 'question_complete_result', 'result': 'correct' });
                    } else {
                        ga('send', 'event', 'Question', 'Question Complete', 'Incorrect', 0, fields);
                        gtag('event', 'questions', { 'category': 'question_complete_result', 'result': 'incorrect' });
                    }

                    var answer = getKeyByValue($scope.question.originalAnswers, $scope.question.choice);
                    ga('send', 'event', 'Question', 'Question Selected Answer', answer, fields);
                    gtag('event', 'questions', { 'category': 'question_selected_answer', 'answer': answer });

                    var time = Math.round((Date.now() - questionStartTime) / 1000);

                    setTimeout(function () {
                        ga('send', 'event', 'Question', 'Question Elapsed Time', id, time, fields);
                        gtag('event', 'questions', { 'category': 'question_elapsed_time', 'question_id': id, 'event_value': time });
                    }, 1000);
                }

                TestFactory.setResult($scope.question, $scope.question.choice, correct);

                $scope.answeredQuestions++;
            };

            $scope.nextQuestion = function () {
                // If we've finished the test
                if ($scope.currentQuestion >= $scope.test._totalQuestions) {
                    if ($routeParams.language) {
                        $location.path($routeParams.test + '/' + $routeParams.language + '/results');
                    } else {
                        $location.path($routeParams.test + '/results');
                    }

                    return;
                }

                $scope.currentQuestion++;

                $scope.question = questions[$scope.currentQuestion - 1];
                $scope.question.status = 'unanswered';
                $scope.question.answer = $scope.question.answers.answer;

                // Pre-load the next question's image
                var nextQuestion = questions[$scope.currentQuestion];
                if (nextQuestion && nextQuestion.image) {
                    $scope.nextQuestionImage = nextQuestion.image;
                }

                if ($scope.test._randomizeAnswers === 'true') {
                    $scope.question.originalAnswers = $scope.question.answers;
                    $scope.question.answers = shuffleAnswers($scope.question.answers);
                }

                // Scroll to the top of the next question, since this is not automatic
                $anchorScroll.yOffset = 0;
                $anchorScroll();

                questionStartTime = Date.now();
            };

            function getKeyByValue(obj, value) {
                for (var prop in obj) {
                    if (obj.hasOwnProperty(prop)) {
                        if (obj[prop] === value) {
                            return prop;
                        }
                    }
                }
            }

            function getRandomQuestionIndex() {
                return Math.floor(Math.random() * (questions.length));
            }

            function getStartingQuestions(questions, total, randomizeQuestions) {
                var json,
                    previousQuestions = [];

                // If our browser supports localstorage, use it to save previous question data
                if (Modernizr.localstorage) {
                    json = localStorage.getItem(localStorageNamespace + '.PreviousQuestions');

                    if (json && json !== 'null') {
                        previousQuestions = angular.fromJson(json);
                    }

                    // If we've gone through all of the questions, reset, otherwise remove the previou questions
                    // from the latest set.
                    if (previousQuestions.length && previousQuestions.length <= (questions.length - previousQuestions.length)) {
                        for (var i = 0; i < previousQuestions.length; i++) {
                            removeItemFromArrayById(questions, previousQuestions[i]);
                        }
                    } else {
                        previousQuestions = [];
                        localStorage.removeItem(localStorageNamespace + '.PreviousQuestions');
                    }
                }

                var index = 0;
                var newQuestions;

                if (randomizeQuestions === 'false') {
                    newQuestions = questions;
                } else {
                    index = Math.floor(Math.random() * (questions.length - total));
                    newQuestions = shuffleArray(questions);
                }

                newQuestions = newQuestions.splice(index, total);

                // Save these new questions back into localstorage
                if (Modernizr.localstorage) {
                    for (var j = newQuestions.length; j--; j > -1) {
                        previousQuestions.push(newQuestions[j]._id);
                    }

                    if (previousQuestions.length) {
                        localStorage.setItem(localStorageNamespace + '.PreviousQuestions', angular.toJson(previousQuestions));
                    }
                }

                return newQuestions;
            }

            function removeItemFromArrayById(array, id) {
                for (var i = array.length; i--; i > -1) {
                    if (array[i]._id === id) {
                        array.splice(i, 1);
                    }
                }
            }

            function shuffleAnswers(answers) {
                var array = [],
                    temporaryValue,
                    randomIndex;

                // Turn answer object into an array
                for (var key in answers) {
                    if (answers.hasOwnProperty(key)) {
                        array.push(answers[key]);
                    }
                }

                return shuffleArray(array);
            }

            function shuffleArray(array) {
                var temporaryValue,
                    randomIndex;

                for (var i = 10; i--; i > 0) {
                    // Randomly swap array items
                    for (var j = array.length; j--; j > 0) {
                        randomIndex = Math.floor(Math.random() * (j + 1));

                        temporaryValue = array[j];
                        array[j] = array[randomIndex];
                        array[randomIndex] = temporaryValue;
                    }
                }

                return array;
            }

            function init() {
                test = $routeParams.test;
                language = $routeParams.language || 'english';

                TestFactory.getTestQuestions(test, language, function (data) {
                    localStorageNamespace += '.' + data._shortTitle + '.' + data._language;

                    if (angular.isArray(data.questions.question)) {
                        // Use slice to deep copy array
                        data._totalQuestions = data.questions.question.length;
                        questions = getStartingQuestions(data.questions.question, data._totalQuestions, data._randomizeQuestions);

                        // Remove question array so it doesn't end up in $scope
                        delete data.questions.question;
                    } else {
                        questions = [data.questions.question];
                    }

                    if (ga) {
                        var page = '/' + test + '/' + language;
                        ga('set', 'page', page);
                    }
                    if (gtag) {
                        var pageLocation = location.protocol + '//' + location.host + '/' + test + '/' + language;
                        gtag('set', { 'page_location': pageLocation });
                    }

                    $rootScope.content = data.content;

                    $scope.currentQuestion = 0;
                    $scope.answeredQuestions = 0;
                    $scope.correctQuestions = 0;
                    $scope.incorrectQuestions = 0;

                    $scope.test = data;
                    $scope.nextQuestion();
                });
            }

            init();
    }]);
  })();