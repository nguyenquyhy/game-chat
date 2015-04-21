// This file in the main entry point for defining grunt tasks and using grunt plugins.
// Click here to learn more. http://go.microsoft.com/fwlink/?LinkID=513275&clcid=0x409

module.exports = function (grunt) {
    grunt.initConfig({
        bower: {
            install: {
                options: {
                    targetDir: "wwwroot/lib",
                    layout: "byComponent",
                    cleanTargetDir: false
                }
            }
        },
        typescript: {
            base: {
                src: ['Scripts/*.ts'],
                dest: 'wwwroot/js',
                options: {
                    module: 'amd', //or commonjs 
                    target: 'es5', //or es3 
                    basePath: 'Scripts',
                    sourceMap: true,
                    declaration: false,
                    references: [
                        "Scripts/typings/tsd.d.ts"
                    ]
                }
            }
        },
        watch: {
            bower: {
                files: ['bower.json'],
                tasks: ['bower'],
                options: {
                    spawn: false,
                },
            },
            typescripts: {
                files: ['Scripts/*.ts'],
                tasks: ['typescript'],
                options: {
                    spawn: false,
                },
            },
        },
        tsd: {
            refresh: {
                options: {
                    // execute a command
                    command: 'reinstall',

                    //optional: always get from HEAD
                    latest: true,

                    // specify config file
                    config: 'tsd.json',

                    // experimental: options to pass to tsd.API
                    opts: {
                        // props from tsd.Options
                    }
                }
            }
        }
    });

    // This command registers the default task which will install bower packages into wwwroot/lib
    grunt.registerTask("default", ["bower:install"]);

    // The following line loads the grunt plugins.
    // This line needs to be at the end of this this file.
    grunt.loadNpmTasks('grunt-bower-task');
    grunt.loadNpmTasks('grunt-typescript');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-tsd');

};