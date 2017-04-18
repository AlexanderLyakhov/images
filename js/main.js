(function($ng) {

    var app = angular.module('app', ['ngMockE2E', 'ngRoute']);

    app.config(function($routeProvider, $locationProvider) {

        $locationProvider.hashPrefix('');

        console.debug($routeProvider, $locationProvider);

        $routeProvider
            .when('/manage', {
                templateUrl: '01.html'
                //template: '<div class="panel panel-default"><div class="panel-body"><h1>manage</h1></div></div>'
            })
            .when('/preview', {
                templateUrl: '02.html'
                //template: '<div class="container"><h1>preview</h1></div>'
            });
    });

    app.run(function($httpBackend) {

        console.debug('run');

        var images = [
                {
                    "id": "96860a755",
                    "url": "https://cdnb.artstation.com/p/assets/images/images/004/503/509/large/kip-kubisz-vd1s.jpg?1484145991",
                    "title": "111",
                    "description": "aaa"
                },
                {
                    "id": "147d79737e6",
                    "url": "https://cdna.artstation.com/p/assets/images/images/004/503/508/large/kip-kubisz-vd6s.jpg?1484145945",
                    "title": "",
                    "description": ""
                },
                {
                    "id": "16da483d69",
                    "url": "https://cdna.artstation.com/p/assets/images/images/004/503/510/large/kip-kubisz-vd2s.jpg?1484145953",
                    "title": "",
                    "description": ""
                },
                {
                    "id": "732de1df1f",
                    "url": "https://cdnb.artstation.com/p/assets/images/images/004/503/511/large/kip-kubisz-vd3s.jpg?1484145956",
                    "title": "",
                    "description": ""
                },
                {
                    "id": "9d6d08cd23",
                    "url": "https://cdna.artstation.com/p/assets/images/images/004/503/512/large/kip-kubisz-vd4s.jpg?1484145958",
                    "title": "",
                    "description": ""
                },
                {
                    "id": "12461d965da",
                    "url": "https://cdna.artstation.com/p/assets/images/images/004/412/818/large/bo-zolland-009.jpg?1483541047",
                    "title": "",
                    "description": ""
                },
                {
                    "id": "3c13aa6bac",
                    "url": "https://cdna.artstation.com/p/assets/images/images/004/738/594/large/bo-zolland-runabout358.jpg?1485900974",
                    "title": "222",
                    "description": "sss"
                }
        ];

        $httpBackend
            .whenGET('/images')
            .respond(200, images);

        $httpBackend
            .whenPOST('/images/add')
            .respond(function(method, url, data) {
                console.debug('add', arguments, data);
                return [200, JSON.parse(data)];
            });

        $httpBackend
            .whenPOST('/images/update')
            .respond(function(method, url, data) {
                console.debug('update', arguments, data);
                return [200, JSON.parse(data)];
            });

        $httpBackend
            .whenDELETE('/images/delete')
            .respond(function(method, url, data) {
                console.debug('delete', arguments, data);
                return [200, data];
            });
    });

    app.controller('imageListCtrl', function($scope, $element, $attrs, images, $compile) {
        /*
        this.name = 'imageListCtrl';
        $scope.images = images.getData();
        */
    });

})(angular.element)
