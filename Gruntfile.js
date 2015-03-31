module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        qunit: {
            files: ['tests/index.html']
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

    grunt.registerTask('server', ['express', 'open', 'watch']);
    grunt.registerTask('build', ['copy']);
    grunt.registerTask('test', ['build', 'express', 'qunit']);
    grunt.registerTask('default', ['build','server']);
};