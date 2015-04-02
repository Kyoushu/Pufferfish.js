module.exports = function(grunt) {

    var browsers = [
        {
            "browserName": "android",
            "platform": "Linux",
            "version": "5.0"
        },
        {
            "browserName": "chrome",
            "platform": "Linux",
            "version": "41"
        },
        {
            "browserName": "chrome",
            "platform": "Mac 10.10",
            "version": "41"
        },
        {
            "browserName": "chrome",
            "platform": "Mac 10.6",
            "version": "41"
        },
        {
            "browserName": "chrome",
            "platform": "Mac 10.8",
            "version": "41"
        },
        {
            "browserName": "chrome",
            "platform": "Mac 10.9",
            "version": "41"
        },
        {
            "browserName": "chrome",
            "platform": "win7",
            "version": "41"
        },
        {
            "browserName": "chrome",
            "platform": "win8",
            "version": "41"
        },
        {
            "browserName": "chrome",
            "platform": "win8.1",
            "version": "41"
        },
        {
            "browserName": "chrome",
            "platform": "xp",
            "version": "41"
        },
        {
            "browserName": "firefox",
            "platform": "Linux",
            "version": "36"
        },
        {
            "browserName": "firefox",
            "platform": "Mac 10.10",
            "version": "36"
        },
        {
            "browserName": "firefox",
            "platform": "Mac 10.6",
            "version": "36"
        },
        {
            "browserName": "firefox",
            "platform": "Mac 10.9",
            "version": "36"
        },
        {
            "browserName": "firefox",
            "platform": "win7",
            "version": "36"
        },
        {
            "browserName": "firefox",
            "platform": "win8",
            "version": "36"
        },
        {
            "browserName": "firefox",
            "platform": "win8.1",
            "version": "36"
        },
        {
            "browserName": "firefox",
            "platform": "xp",
            "version": "36"
        },
        {
            "browserName": "iexplore",
            "platform": "win7",
            "version": "10"
        },
        {
            "browserName": "iexplore",
            "platform": "xp",
            "version": "8"
        },
        {
            "browserName": "iexploreproxy",
            "platform": "win7",
            "version": "10"
        },
        {
            "browserName": "iexploreproxy",
            "platform": "xp",
            "version": "8"
        },
        {
            "browserName": "internet explorer",
            "platform": "win7",
            "version": "11"
        },
        {
            "browserName": "internet explorer",
            "platform": "win8",
            "version": "10"
        },
        {
            "browserName": "internet explorer",
            "platform": "win8.1",
            "version": "11"
        },
        {
            "browserName": "internet explorer",
            "platform": "xp",
            "version": "8"
        },
        {
            "browserName": "ipad",
            "platform": "Mac 10.10",
            "version": "8.2"
        },
        {
            "browserName": "ipad",
            "platform": "Mac 10.6",
            "version": "5.0"
        },
        {
            "browserName": "ipad",
            "platform": "Mac 10.8",
            "version": "6.1"
        },
        {
            "browserName": "ipad",
            "platform": "Mac 10.9",
            "version": "7.1"
        },
        {
            "browserName": "iphone",
            "platform": "Mac 10.10",
            "version": "8.2"
        },
        {
            "browserName": "iphone",
            "platform": "Mac 10.6",
            "version": "5.0"
        },
        {
            "browserName": "iphone",
            "platform": "Mac 10.8",
            "version": "6.1"
        },
        {
            "browserName": "iphone",
            "platform": "Mac 10.9",
            "version": "7.1"
        }
    ];

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        qunit: {
            files: ['tests/index.html']
        },

        'saucelabs-qunit': {
            all: {
                options: {
                    urls: ['http://127.0.0.1:9000'],
                    tunnelTimeout: 5,
                    build: process.env.TRAVIS_JOB_ID,
                    concurrency: 3,
                    testname: 'Pufferfish.js',
                    tags: ['master'],
                    browsers: browsers
                }
            }
        },

        watch: {

            options: {
                livereload: true
            },

            all: {
                files: [
                    'tests/*.html',
                    'tests/js/*.js',
                    'tests/css/*.css',
                    'pufferfish.js'

                ],
                tasks: ['copy'],
                options: {
                    livereload: true
                }
            },

            grunt: { files: ['Gruntfile.js'] }

        },

        copy: {
            main: {
                files: [
                    {expand: true, flatten: true, src: ['bower_components/jquery/jquery.js'], dest: 'tests/vendor/jquery', filter: 'isFile'},
                    {expand: true, flatten: true, src: ['bower_components/qunit/qunit/qunit.js'], dest: 'tests/vendor/qunit', filter: 'isFile'},
                    {expand: true, flatten: true, src: ['bower_components/qunit/qunit/qunit.css'], dest: 'tests/vendor/qunit', filter: 'isFile'},
                    {expand: true, flatten: true, src: ['pufferfish.js'], dest: 'tests/vendor/pufferfish', filter: 'isFile'},
                ]
            }
        },

        express: {
            all: {
                options: {
                    port: 9000,
                    hostname: "0.0.0.0",
                    bases: ['tests/'],
                    livereload: true
                }
            }
        },

        open: {
            all: {
                path: 'http://localhost:<%= express.all.options.port%>'
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-express');
    grunt.loadNpmTasks('grunt-open');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-qunit');
    grunt.loadNpmTasks('grunt-saucelabs');

    grunt.registerTask('server', ['express', 'open', 'watch']);
    grunt.registerTask('build', ['copy']);
    grunt.registerTask('quick-test', ['build', 'express', 'qunit']);
    grunt.registerTask('test', ['build', 'express', 'qunit', 'saucelabs-qunit']);
    grunt.registerTask('default', ['build','server']);
};