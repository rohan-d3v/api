/* eslint-disable prettier/prettier */
(function ($) {
  var rootPath = 'https://app.lenderprice.com/';
  var webApi = 'https://app.lenderprice.com/';
  var searchDate = '2024';

  loadCSS = function (href) {
    var cssLink = $(
      "<link rel='stylesheet' type='text/css' href='" + href + "'>",
    );
    $('head').append(cssLink);
  };

  // loadCSS(rootPath+"ang-app/js/angular-material/angular-material.min.css");
  // loadCSS("https://fonts.googleapis.com/icon?family=Material+Icons");

  loadCSS(
    'https://cdnjs.cloudflare.com/ajax/libs/semantic-ui/2.2.9/semantic.min.css',
  );

  $.getScript(
    rootPath + 'public/generatedJs/miniPricer/' + new Date().getTime(),
    function (data, textStatus, jqxhr) {
      var elementId = 'mini-price-id';

      $('#' + elementId).attr('ng-controller', 'MainController');

      PKG.root = 'https://app.lenderprice.com' + PKG.root;
      var rootPath = 'https://app.lenderprice.com/';
      loadCSS(rootPath + 'ang-app/js/mdAccordion/material-accordion.css');

      var ref = '65b2faefce8ad00001d099c2';
      var template = 'miniWidget';
      var rootPath = 'https://app.lenderprice.com/';
      var webApi = 'https://app.lenderprice.com/';
      var app = angular.module('mini-pricer', [
        'ngMaterial',
        'ngMessages',
        'internationalPhoneNumber',
        'ngAnimate',
        'mdAccordion',
      ]);

      if (template && template.length > 0)
        $('#' + elementId).attr(
          'ng-include',
          "'" +
            rootPath +
            'ang-app/view/template/widget/' +
            template +
            '/mini-pricer' +
            ".html'",
        );
      else
        $('#' + elementId).attr(
          'ng-include',
          "'" +
            rootPath +
            "ang-app/view/template/widget/default/mini-pricer.html'",
        );

      app.directive('dynamic', function ($compile) {
        return {
          restrict: 'A',
          replace: true,
          link: function (scope, ele, attrs) {
            scope.$watch(attrs.dynamic, function (html) {
              ele.html(html);
              $compile(ele.contents())(scope);
            });
          },
        };
      });
      app.config(function ($mdGestureProvider) {
        $mdGestureProvider.skipClickHijack();
      });
      app.config(function ($sceProvider) {
        // Completely disable SCE.  For demonstration purposes only!
        // Do not use in new projects.
        $sceProvider.enabled(false);
      });
      app.config(function ($mdThemingProvider) {
        $mdThemingProvider.theme('default');
      });
      app.directive(
        PKG.directives.lang.Format.key,
        PKG.directives.lang.Format.func,
      );
      Package('enum.com.cre8techlabs.entity.rate').VaraiableLoanType = [
        { code: '_1_1', name: '_1_1', description: '1/1' },
        { code: '_2_1', name: '_2_1', description: '2/1' },
        { code: '_3_1', name: '_3_1', description: '3/1' },
        { code: '_3_5', name: '_3_5', description: '3/5' },
        { code: '_5_1', name: '_5_1', description: '5/1' },
        { code: '_5_2', name: '_5_2', description: '5/2' },
        { code: '_5_5', name: '_5_5', description: '5/5' },
        { code: '_7_1', name: '_7_1', description: '7/1' },
        { code: '_7_2', name: '_7_2', description: '7/2' },
        { code: '_10_1', name: '_10_1', description: '10/1' },
      ];
      app.controller(
        'MainController',
        function ($scope, $http, $compile, $mdDialog, $timeout, $sce, $filter) {
          $scope.miniPricerElementId = elementId;
          $scope.rootPath = 'https://app.lenderprice.com/';

          $scope.pricingResultHtml =
            $scope.rootPath +
            'ang-app/view/template/widget/miniWidget/tabs/pricing_result.html';
          $scope.rateAlertHtml =
            $scope.rootPath +
            'ang-app/view/template/widget/miniWidget/tabs/rate_alert.html';

          $scope.dayLocksList = [15, 30, 45, 60];
          $scope.today = new Date();

          $scope.webApi = 'https://app.lenderprice.com/';
          $scope.varaiableLoanTypes =
            PKG['enum'].com.cre8techlabs.entity.rate.VaraiableLoanType;
          $scope.results = [];
          $scope.searching = false;
          $scope.vars = {
            matchingZipList: [],
            zipSelected: {},
            countySelected: {},
            showDetails: {},
            showMoreDetails: {},
            city: '',
            county: '',
            state: '',
            tableResult: {},
            tableResultTab: {},
            showMorePricing: false,
            showZipError: false,
            loadingCounty: false,
          };
          $scope.counties = [];
          $scope.tableResultClick = function (id) {
            $scope.vars.tableResult[id] = $scope.vars.tableResult[id]
              ? false
              : true;
            $timeout(function () {
              $('#' + id + ' .menu .item').tab();
            });
          };
          $scope.selectedIndex = 0;
          $scope.$watch('selectedIndex', function (newValue, oldValue) {
            if ($scope.shareRate) {
              if (newValue == 0) {
                $scope.shareRate.miniPricerPref.search.loanPurpose = 'Purchase';
              } else {
                $scope.shareRate.miniPricerPref.search.loanPurpose =
                  'Refinance';
              }
              $scope.searchFunction();
            }
          });
          $scope.loanPurposeTypes = [
            { key: 'Purchase', label: 'Purchase' },
            { key: 'Refinance', label: 'Refinance (R&T)' },
            { key: 'CashoutRefinance', label: 'Cashout refinance' },
            { key: 'StreamLineRefinance', label: 'StreamLine Refinance' },
          ];

          $scope.years = [
            { key: 30, label: '30 Years' },
            { key: 15, label: '15 Years' },
          ];

          $scope.mortgageTypes = [
            { key: 'Conventional', label: 'Conventional' },
            { key: 'FHA', label: 'FHA' },
            { key: 'VA', label: 'VA' },
          ];
          $scope.loanTypes = [
            { key: 'Fixed', label: 'Fixed' },
            { key: 'Variable', label: 'Variable' },
          ];
          $scope.propertyUseTypes = [
            { key: 'PrimaryResidence', label: 'Primary Residence' },
            { key: 'SecondaryVacation', label: 'Secondary Residence' },
            { key: 'Investment', label: 'Investment (NOO)' },
          ];

          $scope.searchBy = [
            { key: 'Points', label: 'Points' },
            { key: 'ClosingCost', label: 'Closing Cost' },
          ];

          $scope.propertyUnitDwelling_2_4 = [2, 3, 4];
          $scope.propertyMultiFamily = [2, 3, 4];

          $scope.unitCounter = [1, 2, 3, 4];
          $scope.propertiesOwned = [0, 1, 2, 3, 4, 5];

          $scope.loadSemantic = function () {
            console.log('--- Load semantic-ui');
            setTimeout(function () {
              var newScript = document.createElement('script');
              newScript.src =
                'https://cdnjs.cloudflare.com/ajax/libs/semantic-ui/2.2.9/semantic.min.js';
              $('#' + elementId)[0].appendChild(newScript);
            });
          };

          $scope.initStickyHeader = function () {
            setTimeout(function () {
              function stickyHeader() {
                var header = document.getElementById('ratesHeader');
                var sticky = header.offsetTop;
                header.classList.add('sticky');
              }

              window.onscroll = function () {
                myFunction();
              };

              var header = document.getElementById('ratesHeader');
              var sticky = header.offsetTop;

              function myFunction() {
                //console.log('Windows Scrolling')
                if (window.pageYOffset > sticky) {
                  header.classList.add('sticky');
                } else {
                  header.classList.remove('sticky');
                }
              }
            }, 100);
          };

          /**
                    $scope.checkPropertyType = function(){
                        console.log("hit", $scope.shareRate.miniPricerPref.search.unit, $scope.shareRate.miniPricerPref.search.propertyType)
                        
                        if ($scope.shareRate.miniPricerPref.search.unit > 1){
                            console.log("we got 2, 3, 4")
                            $scope.shareRate.miniPricerPref.search.propertyType = 'UnitDwelling_2_4';
                        }
                        if ($scope.shareRate.miniPricerPref.search.unit == 1){
                            console.log("we got 1")
                            $scope.shareRate.miniPricerPref.search.propertyType = 'SingleFamily';
                        }
                        //console.log( $scope.shareRate.miniPricerPref.search.unit, $scope...miniPricerPref.search.propertyType)
                    }
                    */
          $scope.checkUnits = function () {
            if (
              $scope.shareRate.miniPricerPref.search.propertyType !=
                'UnitDwelling_2_4' ||
              $scope.shareRate.miniPricerPref.search.propertyType !=
                'MultiFamily'
            ) {
              $scope.shareRate.miniPricerPref.search.unit = 1;
            }
            if (
              ($scope.shareRate.miniPricerPref.search.propertyType ==
                'UnitDwelling_2_4' &&
                $scope.shareRate.miniPricerPref.search.unit == 1) ||
              ($scope.shareRate.miniPricerPref.search.propertyType ==
                'MultiFamily' &&
                $scope.shareRate.miniPricerPref.search.unit == 1)
            ) {
              $scope.shareRate.miniPricerPref.search.unit = 2;
            }
            console.log(
              'hit',
              $scope.shareRate.miniPricerPref.search.unit,
              $scope.shareRate.miniPricerPref.search.propertyType,
            );
          };

          $scope.propertyTypes = [
            { key: 'SingleFamily', label: 'Single Family SFR' },
            { key: 'Condos', label: 'Low Rise Attached Condo' },
            { key: 'PlannedUnitDevelopment', label: 'PUD' },
            { key: 'UnitDwelling_2_4', label: '2-4 Unit' },
            { key: 'Modular', label: 'Modular' },
            { key: 'Townhouse', label: 'Townhouse' },
            { key: 'DetachedCondominium', label: 'Detached Condo' },
            { key: 'HighRiseCondo', label: 'High Rise Condo' },
            { key: 'SiteCondo', label: 'Site Condo' },
            {
              key: 'ManufacturedHousingDoubleWide',
              label: 'Manufactured Home Double Wide',
            },
            {
              key: 'ManufacturedHousingSingleWide',
              label: 'Manufactured Home Single Wide',
            },
            { key: 'Cooperative', label: 'Cooperative' },
          ];
          $scope.ficoRange = [
            { key: 760, label: '760+' },
            { key: 740, label: '740 - 759' },
            { key: 720, label: '720 - 739' },
            { key: 700, label: '700 - 719' },
            { key: 680, label: '680 - 699' },
            { key: 660, label: '660 - 679' },
            { key: 640, label: '640 - 659' },
            { key: 620, label: '620 - 639' },
            { key: 600, label: '600 - 619' },
            { key: 580, label: '580 - 599' },
            { key: 560, label: '560 - 579' },
          ];
          $scope.durationInDays = [
            { key: 90, label: '3 Months' },
            { key: 60, label: '2 Months' },
            { key: 30, label: '1 Month' },
          ];

          $scope.varaiableLoanTypes = [
            { key: '_1_1', label: '1/1' },
            { key: '_2_1', label: '2/1' },
            { key: '_3_1', label: '3/1' },
            { key: '_3_5', label: '3/5' },
            { key: '_5_1', label: '5/1' },
            { key: '_5_2', label: '5/2' },
            { key: '_5_5', label: '5/5' },
            { key: '_7_1', label: '7/1' },
            { key: '_7_2', label: '7/2' },
            { key: '_10_1', label: '10/1' },
          ];

          $scope.states = [
            { name: 'Alabama', code: 'AL' },
            { name: 'Alaska', code: 'AK' },
            { name: 'Arizona', code: 'AZ' },
            { name: 'Arkansas', code: 'AR' },
            { name: 'California', code: 'CA' },
            { name: 'Colorado', code: 'CO' },
            { name: 'Connecticut', code: 'CT' },
            { name: 'Delaware', code: 'DE' },
            { name: 'District Of Columbia', code: 'DC' },
            { name: 'Florida', code: 'FL' },
            { name: 'Georgia', code: 'GA' },
            { name: 'Hawaii', code: 'HI' },
            { name: 'Idaho', code: 'ID' },
            { name: 'Illinois', code: 'IL' },
            { name: 'Indiana', code: 'IN' },
            { name: 'Iowa', code: 'IA' },
            { name: 'Kansas', code: 'KS' },
            { name: 'Kentucky', code: 'KY' },
            { name: 'Louisiana', code: 'LA' },
            { name: 'Maine', code: 'ME' },
            { name: 'Maryland', code: 'MD' },
            { name: 'Massachusetts', code: 'MA' },
            { name: 'Michigan', code: 'MI' },
            { name: 'Minnesota', code: 'MN' },
            { name: 'Mississippi', code: 'MS' },
            { name: 'Missouri', code: 'MO' },
            { name: 'Montana', code: 'MT' },
            { name: 'Nebraska', code: 'NE' },
            { name: 'Nevada', code: 'NV' },
            { name: 'New Hampshire', code: 'NH' },
            { name: 'New Jersey', code: 'NJ' },
            { name: 'New Mexico', code: 'NM' },
            { name: 'New York', code: 'NY' },
            { name: 'North Carolina', code: 'NC' },
            { name: 'North Dakota', code: 'ND' },
            { name: 'Ohio', code: 'OH' },
            { name: 'Oklahoma', code: 'OK' },
            { name: 'Oregon', code: 'OR' },
            { name: 'Pennsylvania', code: 'PA' },
            { name: 'Rhode Island', code: 'RI' },
            { name: 'South Carolina', code: 'SC' },
            { name: 'South Dakota', code: 'SD' },
            { name: 'Tennessee', code: 'TN' },
            { name: 'Texas', code: 'TX' },
            { name: 'Utah', code: 'UT' },
            { name: 'Vermont', code: 'VT' },
            { name: 'Virginia', code: 'VA' },
            { name: 'Washington', code: 'WA' },
            { name: 'West Virginia', code: 'WV' },
            { name: 'Wisconsin', code: 'WI' },
            { name: 'Wyoming', code: 'WY' },
          ];

          $scope.displayResultBaseEmpty = function (s, r) {
            if (r !== undefined && r != null) {
              if (s.showWhenEmpty && (r == null || r.length == 0)) return true;

              return r.length > 0;
            }
            return false;
          };
          $scope.displayResultBaseVA = function (s, r) {
            if ($scope.shareRate) {
              if (r !== undefined) {
                if (!s.showOnlyIfVASelected) {
                  return true;
                }
                if (
                  s.showOnlyIfVASelected &&
                  $scope.shareRate.miniPricerPref.search.showVA
                )
                  return true;
              }
            }
            return false;
          };
          $scope.displayResultBase2ndLoan = function (s, r) {
            if (r !== undefined && $scope.shareRate) {
              if (!s.showOnlyIfSecondLoan) {
                return true;
              }
              if (
                s.showOnlyIfSecondLoan &&
                $scope.shareRate.miniPricerPref.search.secondLoanOption &&
                $scope.shareRate.miniPricerPref.search.secondLoanAmount > 0
              )
                return true;
            }
            return false;
          };
          $scope.displayResultBaseLTV = function (loanCriteria) {
            if (!$scope.shareRate) return false;
            var ltv =
              $scope.shareRate.miniPricerPref.search.amount /
              $scope.shareRate.miniPricerPref.search.homeValue;
            ltv = ltv * 100;
            if (
              loanCriteria.ltvRange.from == null &&
              loanCriteria.ltvRange.to == null
            )
              return true;
            var ok = true;
            if (
              loanCriteria.ltvRange.from != null &&
              loanCriteria.ltvRange.from > ltv
            ) {
              ok = ok && false;
            }
            if (
              loanCriteria.ltvRange.to != null &&
              loanCriteria.ltvRange.to < ltv
            ) {
              ok = ok && false;
            }
            return ok;
          };

          $scope.computeDownPayemnt = function (percent) {
            return percent * $scope.shareRate.miniPricerPref.homeValue;
          };
          $scope.computeDownPayemntPercent = function (loanAmount) {
            return loanAmount / $scope.shareRate.miniPricerPref.homeValue;
          };
          $scope.downPayments = [];
          for (var i = 5; i < 100; i += 5) {
            $scope.downPayments.push({ value: i, label: i + ' %' });
          }

          $scope.changeFico = function (fico) {
            console.log('Change Fico');
          };
          $scope.changePropertyUse = function (propertyUse) {};
          $scope.changeLoanAmount = function (search, price, downPayment) {
            search.amount = price - downPayment;
          };
          $scope.setLoanAmounts = function () {};
          $scope.initDefaultPricing = function () {
            $scope.setLoanAmounts();
          };
          $scope.computeLtv = function () {
            try {
              var ltv =
                $scope.shareRate.miniPricerPref.search.amount /
                $scope.shareRate.miniPricerPref.search.homeValue;
              $scope.shareRate.miniPricerPref.search.ltv = ltv;
              console.log('LTV', ltv);
            } catch (e) {
              console.log(e);
            }
          };
          $scope.computeLoanAmount = function () {
            console.log(
              'Compute loan amount here',
              $scope.shareRate.miniPricerPref.search,
            );
            try {
              var loanAmount =
                $scope.shareRate.miniPricerPref.search.ltv *
                $scope.shareRate.miniPricerPref.search.homeValue;
              console.log('Loan Amount', loanAmount);
              $scope.shareRate.miniPricerPref.search.amount = loanAmount;
              console.log('LTV', ltv);
            } catch (e) {
              console.log(e);
            }
          };
          $scope.isFieldEnabled = function (item) {
            console.log(
              'search fiedls',
              $scope.shareRate.miniPricerPref.searchFields,
              item,
            );
            try {
              var itemFound = _.where(
                $scope.shareRate.miniPricerPref.searchFields,
                {
                  key: item,
                },
              );
              console.log('item Found ', itemFound);
              if (!_.isEmpty(itemFound)) {
                return true;
              }
              return false;
            } catch (e) {
              console.log(e);
            }
          };
          $scope.$watch(
            function () {
              if (!$scope.shareRate) return '';
              return angular.toJson($scope.shareRate.miniPricerPref);
            },
            function () {
              $scope.displayNoRateMessage = false; // LP-683 Removes the "no programs" html
              $scope.results = [];
            },
          );

          $scope.displayNoRateMessage = false;

          // LP-683 START
          //Pushed the lone criteria names to an array called noResultProgramNames, pushes it to  error holder and is utilized by pricing_result.html

          $scope.postShareRate = function () {
            console.log('Post rate share here');
            $http
              .post(
                $scope.webApi + 'public/rest/share/rate/search?noSpin',
                angular.toJson($scope.shareRate),
              )
              .success(function (results) {
                $scope.results = results;
                $scope.errorMessage = '';
                $scope.errorHolder = [];

                var dayLocksList = {};
                var noResultProgramNames = [];
                var idx = 0;
                for (var k in results) {
                  var rList = results[k];
                  if (!rList) {
                    if (
                      $scope.shareRate.miniPricerPref.search.loanCriterias[idx]
                        .showWhenEmpty
                    ) {
                      $scope.errorHolder.push(
                        $scope.shareRate.miniPricerPref.search.loanCriterias[
                          idx
                        ].name,
                      );
                      noResultProgramNames.push(
                        $scope.shareRate.miniPricerPref.search.loanCriterias[
                          idx
                        ].name,
                      );
                    }
                  }
                  for (var j in rList) {
                    var r = rList[j];
                    for (var i in r.dayLocksList) {
                      dayLocksList[r.dayLocksList[i]] = r.dayLocksList[i];
                    }
                  }
                  idx++;
                }
                /* 
                         if(results[k] == null){
                              $scope.displayNoRateMessage = true;
                          } */
                if (noResultProgramNames.length > 0) {
                  $scope.displayNoRateMessage = true;
                  $scope.errorMessage = noResultProgramNames.join(', ');
                }

                // LP-683 END

                if (dayLocksList.length > 0) {
                  $scope.dayLocksList = [];
                  for (var k in dayLocksList) {
                    $scope.dayLocksList.push(dayLocksList[k]);
                  }
                  $scope.dayLocksList.sort(function (a, b) {
                    return a - b;
                  });
                }
                $scope.searching = false;
              })
              .error(function (data, status, headers, config) {
                PKG.common.ui.JNotify.ShowError(data.message);
                $scope.searching = false;
              });
          };

          $scope.updateSearch = function (field, value) {
            $scope.shareRate.miniPricerPref.search[field] = value;
          };

          $scope.generateDynamicId = function (elementId) {
            return $scope.miniPricerElementId + '-' + elementId;
          };

          $scope.lpModalThanksSubmitContact = $scope.generateDynamicId(
            'lpModalThanksSubmitContact',
          );
          $scope.lpModalContact = $scope.generateDynamicId('lpModalContact');
          $scope.lpShareModalContact = $scope.generateDynamicId(
            'lpShareModalContact',
          );
          $scope.lpModalSubscribe =
            $scope.generateDynamicId('lpModalSubscribe');
          $scope.lpModalResult = $scope.generateDynamicId('lpModalResult');
          $scope.errorModal = $scope.generateDynamicId('errorModal');

          $scope.searchFunction = function () {
            $scope.updateSearch('city', $scope.vars.city);
            $scope.updateSearch('state', $scope.vars.state);
            $scope.updateSearch('countyFips', $scope.vars.county);
            $scope.updateSearch('countyName', $scope.vars.zipSelected.county);

            $scope.searching = true;
            $scope.displayNoRateMessage = false;
            $scope.setLoanAmounts();

            $scope.shareRate.miniPricerPref.originalSearch.loanPurposeCriteria[0] =
              $scope.shareRate.miniPricerPref.search.loanPurpose;

            if (
              ($scope.shareRate.miniPricerPref.search.propertyType ==
                'UnitDwelling_2_4' &&
                $scope.shareRate.miniPricerPref.search.unit == null) ||
              ($scope.shareRate.miniPricerPref.search.propertyType ==
                'MultiFamily' &&
                $scope.shareRate.miniPricerPref.search.unit == null)
            ) {
              $scope.shareRate.miniPricerPref.search.unit = 2;
            }

            if ($scope.shareRate.miniPricerPref.search.ownProperties == null) {
              $scope.shareRate.miniPricerPref.search.ownProperties = 0;
            }

            $('.ui.modal').modal({ allowMultiple: true });
            $('#' + $scope.lpModalResult)
              .modal({
                onVisible: function () {
                  $('.menu .item').tab();
                  $('.ui.dropdown').dropdown();
                },
              })
              .modal('show')
              .modal('refresh');

            $scope.postShareRate();
          };
          var getParameter = function (sParam) {
            var sPageURL = window.location.search.substring(1);
            var sURLVariables = sPageURL.split('&');
            for (var i = 0; i < sURLVariables.length; i++) {
              var sParameterName = sURLVariables[i].split('=');
              if (sParameterName[0] == sParam) {
                return sParameterName[1];
              }
            }
          };

          $scope.init = function () {
            $scope.receiveDailyEmail = false;
            var isSet = 'blue' == null;
            if (isSet) {
              $scope.dynamicTheme = 'blue';
            }
            if (!$scope.dynamicTheme) {
              $scope.dynamicTheme = getParameter('theme') || 'blue';
            }
            console.log('INIT FUNCTION');

            $http
              .get($scope.webApi + 'public/rest/share/rate/byRef/' + ref)
              .success(function (shareRate) {
                $scope.shareRate = shareRate; //important!
                if (
                  $scope.shareRate.miniPricerPref.search.propertyType ==
                  'UnitDwelling_2_4'
                ) {
                  $scope.shareRate.miniPricerPref.search.unit = 2;
                }
                if (
                  $scope.shareRate.miniPricerPref.search.loanPurpose ==
                  'Purchase'
                ) {
                  //console.log("Loan Purpose is Purchase!!!")
                  $scope.selectedIndex = 0;
                } else {
                  //console.log("Loan Purpose is not Purchase!!!: " + $scope.shareRate.miniPricerPref.search.loanPurpose);
                  //$scope.selectedIndex = 1;
                }
                //console.log($scope.shareRate.miniPricerPref)

                $scope.initDefaultPricing();
                $scope.changeZip();
                $scope.loanCriteriaMap = {};
                for (var k in $scope.shareRate.miniPricerPref.search
                  .loanCriterias) {
                  var lc =
                    $scope.shareRate.miniPricerPref.search.loanCriterias[k];
                  $scope.loanCriteriaMap[lc.id] = lc;
                }
                $http
                  .get(
                    $scope.webApi +
                      'rest/rateAlertSetup/newRateAlertSetup' +
                      $scope.shareRate.company.id,
                  )
                  .success(function (data) {
                    $scope.rateAlert = data;
                    $scope.rateAlert.rateAlertOrigin.reference =
                      $scope.shareRate.miniPricerPref.id;
                    $scope.scheduleOptions = [];

                    $http
                      .get(
                        rootPath +
                          'new/com.cre8techlabs.entity.rate.alert.scheduleOption.PriceEventScheduleOption?noSpin',
                      )
                      .success(function (data) {
                        $scope.priceEventScheduleOption = data;
                        $scope.scheduleOptions.push({
                          label: 'Target Rate',
                          value: data,
                        });
                        $http
                          .get(
                            rootPath +
                              'new/com.cre8techlabs.entity.rate.alert.scheduleOption.RecurringScheduleOption?noSpin',
                          )
                          .success(function (data) {
                            $scope.rateAlert.scheduleOption = data;
                            $scope.recurringScheduleOption = data;
                            $scope.scheduleOptions.push({
                              label: 'Recurring',
                              value: data,
                            });

                            $scope.ensurePriceEventLogic();
                          });
                      });
                  });

                //                              $scope.searchFunction();
              });
            $scope.ucFirstAllWords = function (str) {
              str = str.toLowerCase();
              var pieces = str.split(' ');
              for (var i = 0; i < pieces.length; i++) {
                var j = pieces[i].charAt(0).toUpperCase();
                pieces[i] = j + pieces[i].substr(1);
              }
              return pieces.join(' ');
            };
            $scope.updateCountyOnStateChange = function () {
              if (!$scope.vars.state) {
                return;
              }
              $scope.vars.loadingCounty = true;
              var year = $scope.searchDate
                ? $scope.searchDate.getFullYear()
                : new Date().getFullYear();
              $http
                .get(
                  rootPath +
                    'constant/countys?stateCode=' +
                    $scope.vars.state +
                    '&year=' +
                    year +
                    '&noSpin=true',
                )
                .success(function (data) {
                  $scope.counties = [];
                  var mapTest = {};
                  for (var k in data) {
                    var o = data[k];
                    if (
                      mapTest[
                        (o.stateFips.length == 1
                          ? '0' + o.stateFips
                          : o.stateFips) + o.countyFips
                      ]
                    ) {
                      continue;
                    }
                    mapTest[
                      (o.stateFips.length == 1
                        ? '0' + o.stateFips
                        : o.stateFips) + o.countyFips
                    ] = true;
                    var c = {
                      code:
                        (o.stateFips.length == 1
                          ? '0' + o.stateFips
                          : o.stateFips) + o.countyFips,
                      name: $scope.ucFirstAllWords(o.countyName),
                      displayName: $scope.ucFirstAllWords(o.countyDisplayName),
                    };
                    if ($scope.vars.zipSelected.countyFps == c.code) {
                      $scope.vars.countySelected = c;
                    }
                    $scope.counties.push(c);
                  }
                  $scope.vars.loadingCounty = false;
                });
            };

            $scope.changeCounty = function () {
              $scope.vars.county = $scope.vars.countySelected.code;
              if ($scope.vars.county) {
                $http
                  .get(
                    $scope.webApi +
                      'constant/countyFps/' +
                      $scope.vars.county +
                      '/zip',
                  )
                  .then(function (response) {
                    $scope.vars.zipSelected = response.data;
                    if ($scope.vars.zipSelected) {
                      $scope.vars.matchingZipList = [$scope.vars.zipSelected];
                      $scope.shareRate.miniPricerPref.search.zip =
                        $scope.vars.zipSelected.zip;
                      $scope.vars.city = $scope.vars.zipSelected.primary_city;
                    }
                  });
              }
            };

            $scope.changeZip = function () {
              if ($scope.shareRate === undefined) return;
              if (!$scope.shareRate.miniPricerPref.search) return;

              if ($scope.shareRate.miniPricerPref.search.zip.length == 5) {
                $http
                  .get(
                    $scope.webApi +
                      'constant/zip/listMiniPricer/' +
                      $scope.shareRate.miniPricerPref.search.zip,
                  )
                  .then(function (response) {
                    $scope.vars.matchingZipList = response.data;

                    if (
                      !$scope.vars.matchingZipList ||
                      $scope.vars.matchingZipList.length == 0
                    ) {
                      $scope.vars.zipSelected = '';
                      $scope.vars.city = '';
                      $scope.vars.state = '';
                      $scope.vars.county = '';
                      $scope.model.propertyAddress.city = '';
                      $scope.model.propertyAddress.state = '';
                      $scope.model.propertyAddress.matchingZipList = [];
                      $scope.vars.showZipError = true;
                    } else {
                      $scope.vars.showZipError = false;
                      $scope.vars.zipSelected = $scope.vars.matchingZipList[0];
                      $scope.updateLocation();
                    }
                  });
              }
            };

            $scope.updateLocation = function (evt) {
              if ($scope.vars.zipSelected) {
                $scope.vars.city = $scope.vars.zipSelected.primary_city;
                $scope.vars.state = $scope.vars.zipSelected.state;
                $scope.updateCountyOnStateChange();
                for (var k in $scope.counties) {
                  var o = $scope.counties[k];
                  if ($scope.vars.zipSelected.countyFps == o.code) {
                    $scope.vars.countySelected = o;
                  }
                }
                if ($scope.shareRate != undefined)
                  $scope.shareRate.miniPricerPref.search.zip =
                    $scope.vars.zipSelected.zip;
              }
            };

            $scope.userPropertyAddressZipChange = function () {
              if (!$scope.model.propertyAddress) return;

              if ($scope.model.propertyAddress.zip.length == 5) {
                $http
                  .get(
                    $scope.webApi +
                      'constant/zip/listMiniPricer/' +
                      $scope.model.propertyAddress.zip,
                  )
                  .then(function (response) {
                    var matchingZipList =
                      ($scope.model.propertyAddress.matchingZipList =
                        response.data);

                    if (!matchingZipList || matchingZipList.length == 0) {
                      $scope.model.propertyAddress.city = '';
                      $scope.model.propertyAddress.state = '';
                      $scope.model.propertyAddress.matchingZipList = [];
                      $scope.vars.showZipError = true;
                    } else {
                      $scope.vars.showZipError = false;

                      $scope.model.propertyAddress.city =
                        matchingZipList[0].primary_city;
                      $scope.model.propertyAddress.state =
                        matchingZipList[0].state;
                      $scope.model.propertyAddress.matchingZipList =
                        matchingZipList;
                      $scope.model.propertyAddress.zipSelected =
                        matchingZipList[0];
                      $scope.updateUserPropertyAddressFields();
                    }
                  });
              }
            };

            $scope.updateUserPropertyAddressFields = function () {
              if (
                $scope.model.propertyAddress &&
                $scope.model.propertyAddress.zipSelected
              ) {
                $scope.vars.city = $scope.vars.zipSelected.primary_city;
                $scope.vars.state = $scope.vars.zipSelected.state;
                if ($scope.shareRate != undefined)
                  $scope.shareRate.miniPricerPref.search.zip =
                    $scope.vars.zipSelected.zip;

                if ($scope.model.propertyAddress) {
                  $scope.model.propertyAddress.city =
                    $scope.model.propertyAddress.zipSelected.primary_city;
                  $scope.model.propertyAddress.state =
                    $scope.model.propertyAddress.zipSelected.state;
                  $scope.model.propertyAddress.zip =
                    $scope.model.propertyAddress.zipSelected.zip;
                }
              }
            };

            $scope.hours = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
            $scope.minutes = [];
            for (var i = 0; i < 60; i++) {
              $scope.minutes.push(i);
            }

            $http
              .get($scope.webApi + 'rest/holidayDate/timeZones/US')
              .success(function (data) {
                $scope.timeZones = data;
              });
          };

          $scope.showAlert = function (ev, title, message) {
            alert(message);
          };

          $scope.onTabSelected = function (lp) {
            $scope.shareRate.miniPricerPref.search.loanPurpose = lp;
            $scope.searchFunction();
          };

          $scope.model = {};
          $scope.chooseRate = function (ev, search, loanCriteria, result) {
            $scope.currentLoanCriteria = loanCriteria;
            $scope.currentResult = result;
            $scope.currentSearch = search;

            $('.ui.modal').modal({ allowMultiple: true });
            $('#' + $scope.lpModalContact).modal('show');
          };
          $scope.shareRates = function (ev, search, loanCriteria, result) {
            $scope.currentLoanCriteria = loanCriteria;
            $scope.currentResult = result;
            $scope.currentSearch = search;

            $('.ui.modal').modal({ allowMultiple: true });
            $('#' + $scope.lpShareModalContact).modal('show');
          };

          $scope.closeSelectedModal = function (modalSelector) {
            $('#' + modalSelector).modal('hide');
          };
          $scope.sendRates = function (wantEmail) {
            if (
              !$scope.model.firstname ||
              !$scope.model.email ||
              !$scope.model.lastname ||
              !$scope.model.phone ||
              $scope.model.firstname == '' ||
              $scope.model.email == '' ||
              $scope.model.lastname == '' ||
              $scope.model.phone == ''
            ) {
              $scope.error = true;
            } else {
              if (wantEmail == true) var monthSelected = 365;

              $scope.error = false;
              $http
                .post(
                  $scope.rootPath + 'public/rest/share/rate/records',
                  angular.toJson({
                    ref: $scope.shareRate.id,
                    contact: $scope.model,
                    search: $scope.currentSearch,
                    loanCriteria: $scope.currentLoanCriteria,
                    results: $scope.currentResult,
                    durationInDays: monthSelected,
                  }),
                )
                .then(
                  function successCallback(response) {
                    $scope.closeSelectedModal($scope.lpModalResult);
                    $scope.closeSelectedModal($scope.lpShareModalContact);
                    $('#' + $scope.lpModalThanksSubmitContact).modal('show');
                  },
                  function errorCallback(response) {},
                );
            }
          };

          $scope.send = function (wantEmail) {
            if (
              !$scope.model.firstname ||
              !$scope.model.email ||
              !$scope.model.lastname ||
              !$scope.model.phone ||
              $scope.model.firstname == '' ||
              $scope.model.email == '' ||
              $scope.model.lastname == '' ||
              $scope.model.phone == ''
            ) {
              $scope.error = true;
            } else {
              if (wantEmail == true) var monthSelected = 365;

              $scope.error = false;
              $http
                .post(
                  $scope.rootPath + 'public/rest/share/rate/record',
                  angular.toJson({
                    ref: $scope.shareRate.id,
                    contact: $scope.model,
                    search: $scope.currentSearch,
                    loanCriteria: $scope.currentLoanCriteria,
                    result: $scope.currentResult,
                    durationInDays: monthSelected,
                  }),
                )
                .then(
                  function successCallback(response) {
                    $scope.closeSelectedModal($scope.lpModalResult);
                    $scope.closeSelectedModal($scope.lpModalContact);

                    $('#' + $scope.lpModalThanksSubmitContact).modal('show');
                  },
                  function errorCallback(response) {},
                );
            }
          };

          $scope.showSubscribe = function () {
            $scope.monthSelected = null;
            //searchPointTarget.rateAlertSubscriptionConfig.durationInDays

            if (
              !$scope.model.firstname ||
              !$scope.model.email ||
              !$scope.model.lastname ||
              !$scope.model.phone ||
              $scope.model.firstname == '' ||
              $scope.model.email == '' ||
              $scope.model.lastname == '' ||
              $scope.model.phone == ''
            ) {
              $scope.error = true;
            } else {
              $scope.error = false;
              $('.ui.modal').modal({ allowMultiple: true });
              $($scope.lpModalSubscribe).modal('show');
            }
          };

          /* $scope.subscribe = function (monthSelected) {
                        
                        console.log("monthSelected", monthSelected)
                        
                          $http.post($scope.rootPath + "public/rest/share/rate/record", angular.toJson({
                              ref: $scope.shareRate.id,
                              contact: $scope.model,
                              search: $scope.currentSearch,
                              loanCriteria: $scope.currentLoanCriteria,
                              result: $scope.currentResult,
                              durationInDays: monthSelected
                           })).then(
                                   function successCallback(response) {
                                       $('#lpModalSubscribe').modal('hide');
                                       $('#lpModalResult').modal('hide');
                                       $('#lpModalContact').modal('hide');
                                       $('#lpModalThanksSubmitContact').modal('show');
                                   }, function errorCallback(response) {
    
                                   }
                           );
                  
                    } */

          $scope.deliberatelyTrustDangerousSnippet = function (Html) {
            return $sce.trustAsHtml(Html);
          };

          $scope.openNewWindow = function (url, b = '') {
            if (b.sendMiniPricingInfo) {
              if (url.indexOf('?') < 0) {
                url += '?time=0';
              }

              window.open(
                url +
                  '&' +
                  b.miniPricingInfoParamName +
                  '=' +
                  encodeURI(
                    angular.toJson({
                      scope: {
                        contact: $scope.model,
                        user: {
                          email: $scope.shareRate.user.email,
                          nmlsId: $scope.shareRate.user.nmlsId,
                          firstname: $scope.shareRate.user.person.firstname,
                          lastname: $scope.shareRate.user.person.lastname,
                        },
                        search: $scope.shareRate.miniPricerPref.search,
                        date: $scope.shareRate.miniPricerPref.createdDate,
                      },
                    }),
                  ),
              );
            } else {
              window.open(url);
            }
          };

          $scope.mapping = function (s, cd) {
            if (cd.amount === undefined || cd.amount == null) {
              return '';
            }
            var str = cd.description;
            str = str.replace(/^[0-9]+] /, '');

            if (str.indexOf(' (Points) x ') >= 0) {
              if (cd.amount > 0) {
                if (s.lenderCostOveride != null) {
                  if (s.lenderCostOveride.length > 0) {
                    return s.lenderCostOveride;
                  }
                  return 'Lender Cost';
                } else return 'Lender Cost';
              } else {
                if (s.lenderCreditOveride != null) {
                  if (s.lenderCreditOveride.length > 0) {
                    return s.lenderCreditOveride;
                  }
                  return 'Lender Credit';
                } else return 'Lender Credit';
              }
            }
            return str;
          };
          $scope.showAdjInLenderCredit = function (s, cd, r) {
            console.log('debug data', s, cd, r);
            if (s.showAdjAsLenderCredit) {
              var str = cd.description;
              str = str.replace(/^[0-9]+] /, '');

              if (str.indexOf(' (Points) x ') >= 0) {
                var adjustedAmount =
                  cd.amount +
                  $scope.creditAdjutsmentView(
                    s,
                    r.borrowerPaidDetails,
                    r.finalClosingCost,
                  );
                return adjustedAmount;
              } else {
                return cd.amount;
              }
            } else {
              return cd.amount;
            }
          };
          $scope.creditAdjutsmentView = function (s, cd, finalClosingCost) {
            var value = $scope.creditAdjutsment(s, cd, finalClosingCost);

            if (value != null) {
              if (value < 0) {
                return Math.abs(value);
              } else {
                return Math.abs(value);
              }
            } else return null;
          };

          $scope.creditAdjutsment = function (s, cd, finalClosingCost) {
            var amount = 0;
            for (var i = 0; i < cd.length; i++) {
              amount = amount + cd[i].amount;
            }
            if (s.maxCreditThreshold == null) return null;
            else {
              var threshold = $scope.applyCreditThreshold(s, finalClosingCost);
              return amount - threshold;
            }

            return amount;
          };

          $scope.isAdjustmentNeeded = function (s, cd, finalClosingCost) {
            if (s.showAdjAsLenderCredit) return false;
            var threshold = $scope.creditAdjutsment(s, cd, finalClosingCost);
            if (threshold < 0) return true;
            else return false;
          };

          $scope.displayAmount = function (amount, useDecimalValue) {
            if (useDecimalValue) {
              return $filter('currency')(amount);
            } else {
              return $filter('currency')(amount, '$', 0);
            }
          };

          //CreditAdjustment LP-308
          $scope.applyCreditThreshold = function (s, finalClosingCost) {
            return finalClosingCost;
            var total = finalClosingCost;

            if (s.maxCreditThreshold == null) return total;

            if (finalClosingCost > 0) return total;

            if (finalClosingCost < s.maxCreditThreshold) {
              if (s.maxCreditThreshold == 0) {
                return 0;
              } else {
                if (s.maxCreditThreshold < 0) {
                  return s.maxCreditThreshold;
                } else {
                  var val = s.maxCreditThreshold * -1;
                  return val;
                }
              }
            }
          };

          $scope.specialAdjust = function (s, finalClosingCost) {
            if (!s.maxCreditThreshold) return finalClosingCost;

            if (s.maxCreditThreshold && finalClosingCost < 0) {
              if (Math.abs(finalClosingCost) > s.maxCreditThreshold) {
                $scope.diff = Math.abs(finalClosingCost) - s.maxCreditThreshold;
                return $scope.diff;
              }
            }
          };

          $scope.checkPointThreshold = function (s, r) {
            return r.adjustedPoints;
            var maxCreditDollar = s.maxCreditThreshold;

            if (maxCreditDollar == null) return r.adjustedPoints;

            var newPoint = (maxCreditDollar * 100) / r.loanAmount;

            if (r.adjustedPoints < 0) {
              if (newPoint < 0) {
                return newPoint;
              } else {
                var pt = newPoint * -1;
                return pt;
              }
            }

            return r.adjustedPoints;
          };

          //////
          $scope.init();

          ///

          $scope.togglePrgInRateAlert = function (id) {
            var idx =
              $scope.rateAlert.alertDataContent.loanCriteriaIds.indexOf(id);
            if (idx >= 0) {
              $scope.rateAlert.alertDataContent.loanCriteriaIds.splice(idx, 1);
              $scope.ensurePriceEventLogic();
            } else {
              $scope.rateAlert.alertDataContent.loanCriteriaIds.push(id);
              $scope.ensurePriceEventLogic();
            }
          };

          $scope.ensurePriceEventLogic = function () {
            return;
            if (!$scope.rateAlert || !$scope.rateAlert.scheduleOption) return;
            $scope.rateAlert.scheduleOption.priceEventScheduleOptionItems = [];
            for (var k in $scope.rateAlert.alertDataContent.loanCriteriaIds) {
              $http
                .get(
                  rootPath +
                    'new/com.cre8techlabs.entity.rate.alert.scheduleOption.PriceEventScheduleOptionItem?noSpin',
                )
                .success(function (data) {
                  data.loanCriteriaId =
                    $scope.rateAlert.alertDataContent.loanCriteriaIds[k];
                  $scope.rateAlert.scheduleOption.priceEventScheduleOptionItems.push(
                    data,
                  );
                });
            }
          };

          $scope.addNewPriceEventScheduleOptionItem = function () {
            $http
              .get(
                rootPath +
                  'new/com.cre8techlabs.entity.rate.alert.scheduleOption.PriceEventScheduleOptionItem?noSpin',
              )
              .success(function (data) {
                $scope.rateAlert.scheduleOption.priceEventScheduleOptionItems.push(
                  data,
                );
              });
          };
          $scope.deletePriceEventScheduleOptionItem = function (item) {
            var idx = _.indexOf(
              $scope.rateAlert.scheduleOption.priceEventScheduleOptionItems,
              item,
            );
            if (idx >= 0) {
              $scope.rateAlert.scheduleOption.priceEventScheduleOptionItems.splice(
                idx,
                1,
              );
            }
          };
          $scope.newRateAlert = true;
          $scope.transormRateAlert = function () {
            $scope.rateAlert.owner.firstname = $scope.model.firstname;
            $scope.rateAlert.owner.lastname = $scope.model.lastname;
            $scope.rateAlert.owner.contactDetails.email = $scope.model.email;
            $scope.rateAlert.owner.contactDetails.phone = $scope.model.phone;
            $scope.rateAlert.owner.contactDetails.mobile = $scope.model.phone;
            $scope.rateAlert.alertDataContent.search = $scope.model.search;

            $scope.rateAlert.alertDataContent.search =
              $scope.shareRate.miniPricerPref.search;
            $scope.rateAlert.alertDataContent.search.city = $scope.vars.city;
            $scope.rateAlert.alertDataContent.search.state = $scope.vars.state;
            $scope.rateAlert.alertDataContent.search.countyFips =
              $scope.vars.county;
          };

          $scope.submitRateAlert = function () {
            var message = 'Alert Created successfully';
            if ($scope.newRateAlert) {
              $scope.newRateAlert = false;
            } else {
              message = 'Alert updated successfully';
            }
            $scope.transormRateAlert();

            $http
              .post(
                $scope.webApi + 'public/rest/share/rate/recordRateAlert?noSpin',
                angular.toJson($scope.rateAlert),
              )
              .success(function (results) {
                //$scope.rateAlert = data;
                alert(message);
                PKG.common.ui.JNotify.ShowSuccess(message);
              })
              .error(function (data, status, headers, config) {
                PKG.common.ui.JNotify.ShowError(data.message);
              });
          };
          $scope.isContactOkForAlert = function () {
            var contactOk = true;
            if (
              !$scope.model.firstname ||
              !$scope.model.email ||
              !$scope.model.lastname ||
              $scope.model.firstname == '' ||
              $scope.model.email == '' ||
              $scope.model.lastname == ''
            ) {
              contactOk = false;
            }

            return contactOk;
          };

          $scope.isPriceScheduleEventOk = function () {
            if (
              $scope.rateAlert.scheduleOption.priceEventScheduleOptionItems == 0
            )
              return false;
            for (var k in $scope.rateAlert.scheduleOption
              .priceEventScheduleOptionItems) {
              var item =
                $scope.rateAlert.scheduleOption.priceEventScheduleOptionItems[
                  k
                ];
              var checkPoints =
                item.pointRange.from != null && item.pointRange.to != null;
              var checkClosingCost =
                item.closingCostRange.from != null &&
                item.closingCostRange.to != null;
              if (
                !item.loanCriteriaId ||
                !item.rate ||
                (!checkPoints && !checkClosingCost)
              )
                return false;
            }
            return true;
          };
          $scope.okToShowSubmitRateAlert = function () {
            var contactOk = $scope.isContactOkForAlert();
            var scheduleOptionOk =
              $scope.rateAlert &&
              $scope.rateAlert.scheduleOption != null &&
              ($scope.rateAlert.scheduleOption['@class'] ==
                'com.cre8techlabs.entity.rate.alert.scheduleOption.RecurringScheduleOption' ||
                ($scope.rateAlert.scheduleOption['@class'] ==
                  'com.cre8techlabs.entity.rate.alert.scheduleOption.PriceEventScheduleOption' &&
                  $scope.isPriceScheduleEventOk()));

            return (
              $scope.rateAlert &&
              $scope.rateAlert.alertDataContent &&
              $scope.rateAlert.alertDataContent.loanCriteriaIds &&
              $scope.rateAlert.alertDataContent.loanCriteriaIds.length > 0 &&
              contactOk &&
              scheduleOptionOk
            );
          };
        },
      );

      angular.bootstrap(document.getElementById(elementId), ['mini-pricer']);
    },
  );
})(jQuery);
