module.exports = function(grunt) { 
    grunt.initConfig({
        jshint: {
            options: {
                "sub": true
            },
            all: ['src/**/*.js']
        },
        connect: {
            server: {
                options: {
                    port: 8000,
                    hostname: '127.0.0.1',
                    base: '../../'
                }
            }
        },
        jasmine: {
            src: ['src/**/*.js'],
            options: {
                specs: 'tests/**/*.spec.js',
                host: 'http://127.0.0.1:8000/products/argos-saleslogix/',
                template: 'GruntRunner.tmpl'
            }
        },
        cssmin: {
            combine: {
                files: {
                    'min/css/app.min.css': ['content/css/toggle.css', 'content/css/app.css']
                }
            }
        },
        csslint: {
            options: {
                csslintrc: '.csslintrc',
                formatters: [
                    { id: 'junit-xml', dest: 'report/junit.xml' }
                ]
            },
            lax: {
                src: ['content/**/*.css']
            }
        }
    });
    
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-contrib-jasmine');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-csslint');

    grunt.registerTask('test', ['connect', 'jasmine']);
    grunt.registerTask('default', ['test', 'cssmin']);
};
