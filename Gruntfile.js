module.exports = function(grunt) {

    var fs = require('fs');
    var amdclean = require('amdclean');


    // Project configuration.
    grunt.initConfig({

        pkg: grunt.file.readJSON('package.json'),

        requirejs: {
            dist: {
                options: {
                    findNestedDependencies: true,
                    baseUrl: 'src',
                    optimize: 'none',
                    mainConfigFile: 'src/config.js',
                    include: ['motherboard'],
                    out: 'dist/motherboard.js',
                    wrap: {
                        start: '',
                        end: ''
                    },
                    onModuleBundleComplete: function (data) {
                        var outputFile = data.path;

                        fs.writeFileSync(outputFile, amdclean.clean({
                            filePath: outputFile,
                            wrap: {
                                start: fs.readFileSync('src/start.frag', { encoding: 'utf8' }),
                                end: fs.readFileSync('src/end.frag', { encoding: 'utf8' })
                            }
                        }));
                    }
                }
            }
        }
    });


    // Load plugins
    grunt.loadNpmTasks('grunt-contrib-requirejs');


    // Define tasks
    grunt.registerTask('default', ['requirejs:dist']);

};