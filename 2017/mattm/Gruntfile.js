module.exports = function (grunt) {
  'use strict';

  grunt.loadNpmTasks('grunt-eslint');
  grunt.loadNpmTasks('grunt-browserify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-haml');

  grunt.registerTask('dev', ['browserify', 'eslint', 'haml', 'sass', 'watch']);
  grunt.registerTask('build', ['browserify', 'eslint', 'haml', 'sass']);

  grunt.initConfig({
    /**
     * Write ES6 today, compile it to ES5.
     */
    browserify: {
      dist: {
        options: {
          transform: [
            ['babelify', { "presets": ["es2015"] }]
          ],
          browserifyOptions: { debug: true }
        },
        files: {
          'dist/app.js': ['src/scripts/**/*.js']
        }
      }
    },
    /**
     * Validates ES6 files via ESLint.
     */
    eslint: {
      options: {
        configFile: '.eslintrc'
      },
      target: 'src/scripts/**/*.js'
    },
    haml: {
      dist: {
        files: {
          'dist/index.html' : 'src/index.haml'
        }
      }
    },

    sass: {
      dist: {
        files: {
          'dist/index.css' : 'src/styles/index.scss'
        }
      }
    },

    /**
     * Run predefined tasks whenever watched files are added,
     * modified or deleted.
     */
    watch: {
      scripts: {
        files: ['src/scripts/**/*.js', 'src/index.haml', 'src/styles/**/*.scss'],
        tasks: ['browserify', 'eslint', 'haml', 'sass'],
        options: {
          livereload: 1337
        }
      },
    }
  });
};
