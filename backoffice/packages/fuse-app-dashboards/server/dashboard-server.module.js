(function() {
    'use strict';

    angular
        .module('app.dashboards.server', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, msApiProvider) {
        // State
        $stateProvider.state('app.dashboards_server', {
            url: '/dashboard-server',
            views: {
                'content@app': {
                    templateUrl: 'client/main/apps/dashboards/serve/dashboard-server.html',
                    controller: 'DashboardServerController as vm'
                }
            },
            resolve: {
                DashboardData: function(msApi) {
                    // return msApi.resolve('dashboard.server@get');
                    return {
                        "widget1": {
                            "title": "Memory Usage",
                            "chart": [{
                                "key": "Physical Memory",
                                "values": [
                                    { "x": 1, "y": 0 },
                                    { "x": 2, "y": 1 },
                                    { "x": 3, "y": 4 },
                                    { "x": 4, "y": 7 },
                                    { "x": 5, "y": 7 },
                                    { "x": 6, "y": 20 },
                                    { "x": 7, "y": 21 },
                                    { "x": 8, "y": 40 },
                                    { "x": 9, "y": 50 },
                                    { "x": 10, "y": 48 },
                                    { "x": 11, "y": 63 },
                                    { "x": 12, "y": 59 },
                                    { "x": 13, "y": 43 },
                                    { "x": 14, "y": 54 },
                                    { "x": 15, "y": 56 },
                                    { "x": 16, "y": 73 },
                                    { "x": 17, "y": 71 },
                                    { "x": 18, "y": 85 },
                                    { "x": 19, "y": 77 },
                                    { "x": 20, "y": 95 },
                                    { "x": 21, "y": 107 },
                                    { "x": 22, "y": 127 },
                                    { "x": 23, "y": 122 },
                                    { "x": 24, "y": 126 },
                                    { "x": 25, "y": 132 },
                                    { "x": 26, "y": 120 },
                                    { "x": 27, "y": 118 },
                                    { "x": 28, "y": 107 },
                                    { "x": 29, "y": 110 },
                                    { "x": 30, "y": 117 },
                                    { "x": 31, "y": 141 },
                                    { "x": 32, "y": 159 },
                                    { "x": 33, "y": 167 },
                                    { "x": 34, "y": 185 },
                                    { "x": 35, "y": 184 },
                                    { "x": 36, "y": 195 },
                                    { "x": 37, "y": 207 },
                                    { "x": 38, "y": 230 },
                                    { "x": 39, "y": 239 },
                                    { "x": 40, "y": 241 },
                                    { "x": 41, "y": 239 },
                                    { "x": 42, "y": 260 },
                                    { "x": 43, "y": 276 },
                                    { "x": 44, "y": 258 },
                                    { "x": 45, "y": 250 },
                                    { "x": 46, "y": 226 },
                                    { "x": 47, "y": 227 },
                                    { "x": 48, "y": 218 },
                                    { "x": 49, "y": 232 },
                                    { "x": 50, "y": 253 },
                                    { "x": 51, "y": 235 },
                                    { "x": 52, "y": 229 },
                                    { "x": 53, "y": 225 },
                                    { "x": 54, "y": 189 },
                                    { "x": 55, "y": 149 },
                                    { "x": 56, "y": 131 },
                                    { "x": 57, "y": 135 },
                                    { "x": 58, "y": 122 },
                                    { "x": 59, "y": 97 },
                                    { "x": 60, "y": 113 },
                                    { "x": 61, "y": 141 },
                                    { "x": 62, "y": 142 },
                                    { "x": 63, "y": 139 },
                                    { "x": 64, "y": 177 },
                                    { "x": 65, "y": 194 },
                                    { "x": 66, "y": 209 },
                                    { "x": 67, "y": 198 },
                                    { "x": 68, "y": 222 },
                                    { "x": 69, "y": 234 },
                                    { "x": 70, "y": 228 },
                                    { "x": 71, "y": 248 },
                                    { "x": 72, "y": 270 },
                                    { "x": 73, "y": 292 },
                                    { "x": 74, "y": 265 },
                                    { "x": 75, "y": 237 },
                                    { "x": 76, "y": 265 },
                                    { "x": 77, "y": 248 },
                                    { "x": 78, "y": 278 },
                                    { "x": 79, "y": 292 },
                                    { "x": 80, "y": 300 },
                                    { "x": 81, "y": 326 },
                                    { "x": 82, "y": 337 },
                                    { "x": 83, "y": 339 },
                                    { "x": 84, "y": 346 },
                                    { "x": 85, "y": 347 },
                                    { "x": 86, "y": 342 },
                                    { "x": 87, "y": 333 },
                                    { "x": 88, "y": 323 },
                                    { "x": 89, "y": 295 },
                                    { "x": 90, "y": 251 },
                                    { "x": 91, "y": 295 },
                                    { "x": 92, "y": 294 },
                                    { "x": 93, "y": 295 },
                                    { "x": 94, "y": 325 },
                                    { "x": 95, "y": 340 },
                                    { "x": 96, "y": 345 },
                                    { "x": 97, "y": 337 },
                                    { "x": 98, "y": 318 },
                                    { "x": 99, "y": 317 },
                                    { "x": 100, "y": 318 },
                                    { "x": 101, "y": 332 },
                                    { "x": 102, "y": 337 },
                                    { "x": 103, "y": 350 },
                                    { "x": 104, "y": 349 }
                                ]
                            }, {
                                "key": "Virtual Memory",
                                "values": [
                                    { "x": 1, "y": 0 },
                                    { "x": 2, "y": 1 },
                                    { "x": 3, "y": 1 },
                                    { "x": 4, "y": 2 },
                                    { "x": 5, "y": 3 },
                                    { "x": 6, "y": 13 },
                                    { "x": 7, "y": 13 },
                                    { "x": 8, "y": 24 },
                                    { "x": 9, "y": 34 },
                                    { "x": 10, "y": 36 },
                                    { "x": 11, "y": 46 },
                                    { "x": 12, "y": 43 },
                                    { "x": 13, "y": 32 },
                                    { "x": 14, "y": 41 },
                                    { "x": 15, "y": 40 },
                                    { "x": 16, "y": 54 },
                                    { "x": 17, "y": 49 },
                                    { "x": 18, "y": 61 },
                                    { "x": 19, "y": 56 },
                                    { "x": 20, "y": 71 },
                                    { "x": 21, "y": 78 },
                                    { "x": 22, "y": 90 },
                                    { "x": 23, "y": 87 },
                                    { "x": 24, "y": 87 },
                                    { "x": 25, "y": 87 },
                                    { "x": 26, "y": 76 },
                                    { "x": 27, "y": 72 },
                                    { "x": 28, "y": 63 },
                                    { "x": 29, "y": 66 },
                                    { "x": 30, "y": 75 },
                                    { "x": 31, "y": 93 },
                                    { "x": 32, "y": 106 },
                                    { "x": 33, "y": 116 },
                                    { "x": 34, "y": 129 },
                                    { "x": 35, "y": 123 },
                                    { "x": 36, "y": 129 },
                                    { "x": 37, "y": 132 },
                                    { "x": 38, "y": 148 },
                                    { "x": 39, "y": 157 },
                                    { "x": 40, "y": 155 },
                                    { "x": 41, "y": 155 },
                                    { "x": 42, "y": 159 },
                                    { "x": 43, "y": 166 },
                                    { "x": 44, "y": 159 },
                                    { "x": 45, "y": 151 },
                                    { "x": 46, "y": 132 },
                                    { "x": 47, "y": 121 },
                                    { "x": 48, "y": 112 },
                                    { "x": 49, "y": 122 },
                                    { "x": 50, "y": 133 },
                                    { "x": 51, "y": 120 },
                                    { "x": 52, "y": 123 },
                                    { "x": 53, "y": 125 },
                                    { "x": 54, "y": 103 },
                                    { "x": 55, "y": 85 },
                                    { "x": 56, "y": 71 },
                                    { "x": 57, "y": 71 },
                                    { "x": 58, "y": 65 },
                                    { "x": 59, "y": 43 },
                                    { "x": 60, "y": 57 },
                                    { "x": 61, "y": 77 },
                                    { "x": 62, "y": 73 },
                                    { "x": 63, "y": 70 },
                                    { "x": 64, "y": 102 },
                                    { "x": 65, "y": 117 },
                                    { "x": 66, "y": 128 },
                                    { "x": 67, "y": 119 },
                                    { "x": 68, "y": 139 },
                                    { "x": 69, "y": 149 },
                                    { "x": 70, "y": 144 },
                                    { "x": 71, "y": 161 },
                                    { "x": 72, "y": 180 },
                                    { "x": 73, "y": 199 },
                                    { "x": 74, "y": 180 },
                                    { "x": 75, "y": 158 },
                                    { "x": 76, "y": 177 },
                                    { "x": 77, "y": 162 },
                                    { "x": 78, "y": 183 },
                                    { "x": 79, "y": 194 },
                                    { "x": 80, "y": 201 },
                                    { "x": 81, "y": 222 },
                                    { "x": 82, "y": 233 },
                                    { "x": 83, "y": 231 },
                                    { "x": 84, "y": 237 },
                                    { "x": 85, "y": 235 },
                                    { "x": 86, "y": 232 },
                                    { "x": 87, "y": 226 },
                                    { "x": 88, "y": 219 },
                                    { "x": 89, "y": 198 },
                                    { "x": 90, "y": 168 },
                                    { "x": 91, "y": 202 },
                                    { "x": 92, "y": 203 },
                                    { "x": 93, "y": 204 },
                                    { "x": 94, "y": 229 },
                                    { "x": 95, "y": 239 },
                                    { "x": 96, "y": 242 },
                                    { "x": 97, "y": 234 },
                                    { "x": 98, "y": 221 },
                                    { "x": 99, "y": 216 },
                                    { "x": 100, "y": 218 },
                                    { "x": 101, "y": 229 },
                                    { "x": 102, "y": 230 },
                                    { "x": 103, "y": 243 },
                                    { "x": 104, "y": 244 }
                                ]
                            }, {
                                "key": "Swap Area",
                                "values": [
                                    { "x": 1, "y": 0 },
                                    { "x": 2, "y": 1 },
                                    { "x": 3, "y": 2 },
                                    { "x": 4, "y": 2 },
                                    { "x": 5, "y": 3 },
                                    { "x": 6, "y": 3 },
                                    { "x": 7, "y": 4 },
                                    { "x": 8, "y": 5 },
                                    { "x": 9, "y": 9 },
                                    { "x": 10, "y": 6 },
                                    { "x": 11, "y": 9 },
                                    { "x": 12, "y": 7 },
                                    { "x": 13, "y": 4 },
                                    { "x": 14, "y": 8 },
                                    { "x": 15, "y": 9 },
                                    { "x": 16, "y": 13 },
                                    { "x": 17, "y": 12 },
                                    { "x": 18, "y": 13 },
                                    { "x": 19, "y": 11 },
                                    { "x": 20, "y": 15 },
                                    { "x": 21, "y": 15 },
                                    { "x": 22, "y": 19 },
                                    { "x": 23, "y": 19 },
                                    { "x": 24, "y": 21 },
                                    { "x": 25, "y": 22 },
                                    { "x": 26, "y": 19 },
                                    { "x": 27, "y": 19 },
                                    { "x": 28, "y": 19 },
                                    { "x": 29, "y": 22 },
                                    { "x": 30, "y": 24 },
                                    { "x": 31, "y": 29 },
                                    { "x": 32, "y": 31 },
                                    { "x": 33, "y": 33 },
                                    { "x": 34, "y": 35 },
                                    { "x": 35, "y": 33 },
                                    { "x": 36, "y": 34 },
                                    { "x": 37, "y": 40 },
                                    { "x": 38, "y": 45 },
                                    { "x": 39, "y": 43 },
                                    { "x": 40, "y": 38 },
                                    { "x": 41, "y": 40 },
                                    { "x": 42, "y": 45 },
                                    { "x": 43, "y": 48 },
                                    { "x": 44, "y": 41 },
                                    { "x": 45, "y": 40 },
                                    { "x": 46, "y": 32 },
                                    { "x": 47, "y": 28 },
                                    { "x": 48, "y": 27 },
                                    { "x": 49, "y": 33 },
                                    { "x": 50, "y": 36 },
                                    { "x": 51, "y": 25 },
                                    { "x": 52, "y": 23 },
                                    { "x": 53, "y": 25 },
                                    { "x": 54, "y": 14 },
                                    { "x": 55, "y": 13 },
                                    { "x": 56, "y": 12 },
                                    { "x": 57, "y": 11 },
                                    { "x": 58, "y": 18 },
                                    { "x": 59, "y": 23 },
                                    { "x": 60, "y": 20 },
                                    { "x": 61, "y": 12 },
                                    { "x": 62, "y": 8 },
                                    { "x": 63, "y": 7 },
                                    { "x": 64, "y": 0 },
                                    { "x": 65, "y": 2 },
                                    { "x": 66, "y": 6 },
                                    { "x": 67, "y": 4 },
                                    { "x": 68, "y": 10 },
                                    { "x": 69, "y": 13 },
                                    { "x": 70, "y": 9 },
                                    { "x": 71, "y": 12 },
                                    { "x": 72, "y": 19 },
                                    { "x": 73, "y": 22 },
                                    { "x": 74, "y": 12 },
                                    { "x": 75, "y": 6 },
                                    { "x": 76, "y": 13 },
                                    { "x": 77, "y": 8 },
                                    { "x": 78, "y": 18 },
                                    { "x": 79, "y": 23 },
                                    { "x": 80, "y": 23 },
                                    { "x": 81, "y": 31 },
                                    { "x": 82, "y": 34 },
                                    { "x": 83, "y": 39 },
                                    { "x": 84, "y": 40 },
                                    { "x": 85, "y": 44 },
                                    { "x": 86, "y": 42 },
                                    { "x": 87, "y": 40 },
                                    { "x": 88, "y": 37 },
                                    { "x": 89, "y": 29 },
                                    { "x": 90, "y": 19 },
                                    { "x": 91, "y": 33 },
                                    { "x": 92, "y": 32 },
                                    { "x": 93, "y": 34 },
                                    { "x": 94, "y": 40 },
                                    { "x": 95, "y": 46 },
                                    { "x": 96, "y": 51 },
                                    { "x": 97, "y": 50 },
                                    { "x": 98, "y": 41 },
                                    { "x": 99, "y": 46 },
                                    { "x": 100, "y": 48 },
                                    { "x": 101, "y": 51 },
                                    { "x": 102, "y": 55 },
                                    { "x": 103, "y": 52 },
                                    { "x": 104, "y": 49 }
                                ]
                            }]
                        },
                        "widget2": {
                            "title": "Storage",
                            "value": {
                                "used": "74.2Gb",
                                "total": "110Gb",
                                "percentage": 67.45
                            },
                            "detail": "This is the back side. You can show detailed information here."
                        },
                        "widget3": {
                            "title": "Bandwidth",
                            "value": {
                                "used": "221Gb",
                                "total": "3.5Tb",
                                "percentage": 6.31
                            },
                            "detail": "This is the back side. You can show detailed information here."
                        },
                        "widget4": {
                            "title": "Latency",
                            "value": "21ms",
                            "footnote": "Higher than average",
                            "detail": "This is the back side. You can show detailed information here.",
                            "chart": [{
                                "key": "Latency",
                                "values": [
                                    { "x": 1, "y": 1 },
                                    { "x": 2, "y": 4 },
                                    { "x": 3, "y": 1 },
                                    { "x": 4, "y": 2 },
                                    { "x": 5, "y": 3 },
                                    { "x": 6, "y": 4 },
                                    { "x": 7, "y": 3 },
                                    { "x": 8, "y": 2 },
                                    { "x": 9, "y": 3 },
                                    { "x": 10, "y": 1 },
                                    { "x": 11, "y": 1 },
                                    { "x": 12, "y": 4 },
                                    { "x": 13, "y": 1 },
                                    { "x": 14, "y": 2 },
                                    { "x": 15, "y": 3 },
                                    { "x": 16, "y": 4 },
                                    { "x": 17, "y": 3 },
                                    { "x": 18, "y": 2 },
                                    { "x": 19, "y": 3 },
                                    { "x": 20, "y": 1 },
                                    { "x": 21, "y": 1 },
                                    { "x": 22, "y": 4 },
                                    { "x": 23, "y": 1 },
                                    { "x": 24, "y": 2 },
                                    { "x": 25, "y": 3 }
                                ]
                            }]
                        },
                        "widget5": {
                            "title": "Cluster Load",
                            "value": "75%",
                            "detail": "This is the back side. You can show detailed information here.",
                            "footnote": "Lower than average"
                        },
                        "widget6": {
                            "title": "Average CPU Usage (Live)",
                            "chart": [{
                                "key": "Average CPU Usage",
                                "values": [
                                    { "x": 5, "y": 72 },
                                    { "x": 10, "y": 26 },
                                    { "x": 15, "y": 51 },
                                    { "x": 20, "y": 36 },
                                    { "x": 25, "y": 66 },
                                    { "x": 30, "y": 69 },
                                    { "x": 35, "y": 50 },
                                    { "x": 40, "y": 35 },
                                    { "x": 45, "y": 49 },
                                    { "x": 50, "y": 64 },
                                    { "x": 55, "y": 37 },
                                    { "x": 60, "y": 78 },
                                    { "x": 65, "y": 54 },
                                    { "x": 70, "y": 8 },
                                    { "x": 75, "y": 52 },
                                    { "x": 80, "y": 50 },
                                    { "x": 85, "y": 56 },
                                    { "x": 90, "y": 71 },
                                    { "x": 95, "y": 31 },
                                    { "x": 100, "y": 37 },
                                    { "x": 105, "y": 15 },
                                    { "x": 110, "y": 45 },
                                    { "x": 115, "y": 35 },
                                    { "x": 120, "y": 28 },
                                    { "x": 125, "y": 7 },
                                    { "x": 130, "y": 36 },
                                    { "x": 135, "y": 7 },
                                    { "x": 140, "y": 79 },
                                    { "x": 145, "y": 12 },
                                    { "x": 150, "y": 5 }
                                ]
                            }]
                        },
                        "widget7": {
                            "title": "Process Explorer",
                            "table": {
                                "columns": [{
                                    "title": "Name"
                                }, {
                                    "title": "User"
                                }, {
                                    "title": "Avg. IO"
                                }, {
                                    "title": "Avg. CPU"
                                }, {
                                    "title": "Avg. Mem"
                                }],
                                "rows": [
                                    [{
                                            "value": "anvil",
                                            "classes": "text-bold"
                                        }, {
                                            "value": "dovecot",
                                            "classes": "text-boxed m-0 green-bg white-fg"
                                        },
                                        { "value": 0 },
                                        { "value": 0 },
                                        { "value": 2 }
                                    ],
                                    [{
                                            "value": "cpdavd-accept",
                                            "classes": "text-bold"
                                        }, {
                                            "value": "root",
                                            "classes": "text-boxed m-0 grey-400-bg white-fg"
                                        },
                                        { "value": 0 },
                                        { "value": 0 }, {
                                            "value": 23,
                                            "classes": "amber-700-fg"
                                        }
                                    ],
                                    [{
                                            "value": "cpsrvd-ssl",
                                            "classes": "text-bold"
                                        }, {
                                            "value": "root",
                                            "classes": "text-boxed m-0 grey-400-bg white-fg"
                                        },
                                        { "value": 1 },
                                        { "value": 27 }, {
                                            "value": 28,
                                            "classes": "amber-700-fg"
                                        }
                                    ],
                                    [{
                                            "value": "crond",
                                            "classes": "text-bold"
                                        }, {
                                            "value": "root",
                                            "classes": "text-boxed m-0 grey-400-bg white-fg"
                                        },
                                        { "value": 30 },
                                        { "value": 0 },
                                        { "value": 1 }
                                    ],
                                    [{
                                            "value": "dnsadmin",
                                            "classes": "text-bold"
                                        }, {
                                            "value": "root",
                                            "classes": "text-boxed m-0 grey-400-bg white-fg"
                                        },
                                        { "value": 0 },
                                        { "value": 0 }, {
                                            "value": 21,
                                            "classes": "amber-700-fg"
                                        }
                                    ],
                                    [{
                                            "value": "httpd",
                                            "classes": "text-bold"
                                        }, {
                                            "value": "root",
                                            "classes": "text-boxed m-0 grey-400-bg white-fg"
                                        },
                                        { "value": 4 },
                                        { "value": 0 },
                                        { "value": 8 }
                                    ],
                                    [{
                                            "value": "httpd",
                                            "classes": "text-bold"
                                        }, {
                                            "value": "nobody",
                                            "classes": "text-boxed m-0 indigo-bg white-fg"
                                        },
                                        { "value": 4 },
                                        { "value": 0.05 }, {
                                            "value": 77,
                                            "classes": "red-fg"
                                        }
                                    ],
                                    [{
                                            "value": "init",
                                            "classes": "text-bold"
                                        }, {
                                            "value": "root",
                                            "classes": "text-boxed m-0 grey-400-bg white-fg"
                                        },
                                        { "value": 305 },
                                        { "value": 0 }, {
                                            "value": 188,
                                            "classes": "red-fg"
                                        }
                                    ],
                                    [{
                                            "value": "leechprotect",
                                            "classes": "text-bold"
                                        }, {
                                            "value": "root",
                                            "classes": "text-boxed m-0 grey-400-bg white-fg"
                                        },
                                        { "value": 0.59 },
                                        { "value": 0 },
                                        { "value": 13 }
                                    ],
                                    [{
                                            "value": "mysqld",
                                            "classes": "text-bold"
                                        }, {
                                            "value": "mysql",
                                            "classes": "text-boxed m-0 deep-orange-bg white-fg"
                                        },
                                        { "value": 7 },
                                        { "value": 0.13 }, {
                                            "value": 186,
                                            "classes": "red-fg"
                                        }
                                    ],
                                    [{
                                            "value": "mysqld_safe",
                                            "classes": "text-bold"
                                        }, {
                                            "value": "root",
                                            "classes": "text-boxed m-0 grey-400-bg white-fg"
                                        },
                                        { "value": 0 },
                                        { "value": 0 },
                                        { "value": 1 }
                                    ],
                                    [{
                                            "value": "named",
                                            "classes": "text-bold"
                                        }, {
                                            "value": "named",
                                            "classes": "text-boxed m-0 teal-bg white-fg"
                                        },
                                        { "value": 0.29 },
                                        { "value": 0 }, {
                                            "value": 19,
                                            "classes": "amber-700-fg"
                                        }
                                    ],
                                    [{
                                            "value": "ntpd",
                                            "classes": "text-bold"
                                        }, {
                                            "value": "ntp",
                                            "classes": "text-boxed m-0 light-blue-bg white-fg"
                                        },
                                        { "value": 0.49 },
                                        { "value": 0 },
                                        { "value": 2 }
                                    ],
                                    [{
                                            "value": "pop3-login",
                                            "classes": "text-bold"
                                        }, {
                                            "value": "dovenull",
                                            "classes": "text-boxed m-0 amber-700-bg white-fg"
                                        },
                                        { "value": 0 },
                                        { "value": 0 },
                                        { "value": 10 }
                                    ],
                                    [{
                                            "value": "pure-authd",
                                            "classes": "text-bold"
                                        }, {
                                            "value": "root",
                                            "classes": "text-boxed m-0 grey-400-bg white-fg"
                                        },
                                        { "value": 137 },
                                        { "value": 0 }, {
                                            "value": 88,
                                            "classes": "red-fg"
                                        }
                                    ],
                                    [{
                                            "value": "queueprocd",
                                            "classes": "text-bold"
                                        }, {
                                            "value": "root",
                                            "classes": "text-boxed m-0 grey-400-bg white-fg"
                                        },
                                        { "value": 410 },
                                        { "value": 0 },
                                        { "value": 8 }
                                    ],
                                    [{
                                            "value": "rsyslogd",
                                            "classes": "text-bold"
                                        }, {
                                            "value": "root",
                                            "classes": "text-boxed m-0 grey-400-bg white-fg"
                                        },
                                        { "value": 57 },
                                        { "value": 0 },
                                        { "value": 4 }
                                    ],
                                    [{
                                            "value": "spamd",
                                            "classes": "text-bold"
                                        }, {
                                            "value": "root",
                                            "classes": "text-boxed m-0 grey-400-bg white-fg"
                                        },
                                        { "value": 0 },
                                        { "value": 0 }, {
                                            "value": 56,
                                            "classes": "red-fg"
                                        }
                                    ],
                                    [{
                                            "value": "sshd",
                                            "classes": "text-bold"
                                        }, {
                                            "value": "root",
                                            "classes": "text-boxed m-0 grey-400-bg white-fg"
                                        },
                                        { "value": 0 },
                                        { "value": 0 },
                                        { "value": 1 }
                                    ],
                                    [{
                                            "value": "tailwatchd",
                                            "classes": "text-bold"
                                        }, {
                                            "value": "root",
                                            "classes": "text-boxed m-0 grey-400-bg white-fg"
                                        },
                                        { "value": 37 },
                                        { "value": 0.03 }, {
                                            "value": 18,
                                            "classes": "amber-700-fg"
                                        }
                                    ]
                                ]
                            }
                        },
                        "widget8": {
                            "title": "I/O Activity",
                            "activities": [{
                                "process": "queueprocd",
                                "type": "Input",
                                "value": "50KB"
                            }, {
                                "process": "queueprocd",
                                "type": "Input",
                                "value": "24.5Mb"
                            }, {
                                "process": "queueprocd",
                                "type": "Output",
                                "value": "887Kb"
                            }, {
                                "process": "sshd",
                                "type": "Output",
                                "value": "441B"
                            }, {
                                "process": "queueprocd",
                                "type": "Input",
                                "value": "6.27Kb"
                            }, {
                                "process": "init",
                                "type": "Output",
                                "value": "13.8Kb"
                            }, {
                                "process": "queueprocd",
                                "type": "Output",
                                "value": "5.6Mb"
                            }, {
                                "process": "init",
                                "type": "Output",
                                "value": "44.6Kb"
                            }, {
                                "process": "queueprocd",
                                "type": "Input",
                                "value": "5Mb"
                            }, {
                                "process": "tailwatchd",
                                "type": "Output",
                                "value": "1.1Kb"
                            }, {
                                "process": "pure-authd",
                                "type": "Input",
                                "value": "5.3Kb"
                            }, {
                                "process": "init",
                                "type": "Output",
                                "value": "176Kb"
                            }]
                        }
                    }
                }
            },
            bodyClass: 'dashboard-server'
        });

        // Api
        msApiProvider.register('dashboard.server', ['client/data/dashboard/server/data.json']);
    }

})();
