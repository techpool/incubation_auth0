module.exports = function(grunt) {

  grunt.util.linefeed = '\n';

    // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    banner:'/*!\n' +
              ' * Furatto v<%= pkg.version %> (<%= pkg.homepage %>)\n' +
              ' * Copyright 2014-<%= grunt.template.today("yyyy") %> <%= pkg.author %>\n' +
              ' * Licensed under <%= _.pluck(pkg.licenses, "type") %> (<%= _.pluck(pkg.licenses, "url") %>)\n' +
              ' */\n',

    clean: {
      dist: 'dist'
    },

    concat: {
      options: {
        banner: '<%= banner %>',
        stripBanners: false
      },
      furatto: {
        src: [
          'js/<%= pkg.name%>.tmp.js',
          'js/<%= pkg.name%>.modal.js',
          'js/<%= pkg.name%>.navigation-bar.js',
          'js/<%= pkg.name%>.off-screen.js',
          'js/<%= pkg.name%>.responsiveTables.js',
          'js/<%= pkg.name%>.suraido.js',
          'js/<%= pkg.name%>.toolbar.js',
          'js/<%= pkg.name%>.off-screen.js',
          'js/<%= pkg.name%>.tabs.js',
          'js/<%= pkg.name %>.tooltip.js',
          'js/<%= pkg.name %>.navigation-dropdown.js',
          'js/classie.js'
        ],
        dest: 'dist/js/<%= pkg.name %>.js'
      }
    },

    uglify: {
      furatto: {
        options: {
          banner: '<%= banner %>',
          report: 'min'
        },
        src: '<%= concat.furatto.dest %>',
        dest: 'dist/js/<%= pkg.name %>.min.js'
      }
    },

    compass: {
      dist: {
        options: {
          sassDir: 'scss',
          cssDir: 'dist/css',
          environment: 'development',
          outputStyle: 'expanded',
          raw: 'preferred_syntax = :scss\n'
        } 
      },
      fontAwesome: {
        options: {
          sassDir: 'fontawesome/scss',
          cssDir: 'docs/assets/css',
          environment: 'production',
          outputStyle: 'compressed',
          raw: 'preferred_syntax = :scss\n'
        }
      },
      docs: {
        options: {
          sassDir: 'docs_scss',
          cssDir: 'docs/assets/css',
          environment: 'development',
          outputStyle: 'expanded',
          raw: 'preferred_syntax = :scss\n'
        }
      }
    },

    cssmin: {
      minify: {
        expand: true,
        cwd: 'dist/css',
        src: ["furatto.css", "furatto.min.css"],
        dest: 'dist/css',
        ext: '.min.css'
      }
    },

    jekyll: {
      docs: {}
    },

    watch: {
      sass: {
        files: ['scss/furatto.scss', 'scss/furatto/*.scss', 'docs_scss/*.scss'],
        tasks: ['dist'],
        options: {
          livereload: true
        }
      },
      coffee: {
        files: 'coffee/*.coffee',
        tasks: ['coffee', 'concat', 'uglify', 'copy:docs']
      }
    },

    usebanner: {
      dist: {
        options: {
          position: 'top',
          banner: '<%= banner %>'
        },
        files: {
          src: [
            'dist/css/<%= pkg.name %>.css',
            'dist/js/<%= pkg.name %>.js'
          ]
        }
      }
    },

    copy: {
      docs: {
        expand: true,
        src: [
          'dist/css/*',
          'dist/js/*'
        ],
        dest: 'docs'
      },
      fontAwesome: {
        expand: true,
        cwd: 'fontawesome/fonts/',
        src: [
          '**'
        ],
        dest: 'docs/assets/fonts/',
        flatten: true
      },
      compressed: {
        src: ['<%= pkg.name %>_<%= pkg.version %>.zip'],
        dest: '_gh_pages/assets/'
      },
      compressed_sass: {
        src: ['<%= pkg.name %>_<%= pkg.version %>_sass.zip'],
        dest: '_gh_pages/assets/'
      } 
    },

    coffee: {
      compile: {
        options: {
          bare: true
        },
        files: {
          'js/<%= pkg.name%>.tmp.js': 'coffee/furatto.coffee',
          'js/<%= pkg.name%>.modal.js': 'coffee/modal.coffee',
          'js/<%= pkg.name%>.navigation-bar.js': 'coffee/navigation-bar.coffee',
          'js/<%= pkg.name%>.responsiveTables.js': 'coffee/responsiveTables.coffee',
          'js/<%= pkg.name%>.suraido.js': 'coffee/suraido.coffee',
          'js/<%= pkg.name%>.toolbar.js': 'coffee/toolbar.coffee',
          'js/<%= pkg.name%>.off-screen.js': 'coffee/off-screen.coffee',
          'js/<%= pkg.name%>.tabs.js': 'coffee/tabs.coffee',
          'js/<%= pkg.name%>.navigation-dropdown.js': 'coffee/navigation-dropdown.coffee'
        }
      }
    },

    compress: {
      main: {
        options: {
          archive: '<%= pkg.name %>_<%= pkg.version %>.zip'
        },
        files: [
          { src: ['dist/**'], dest: '/'},
          { src: ['robots.txt', 'humans.txt'], dest: '/'},
          { src: ['scss/**'], dest: 'src/'}
        ]
      },
      compress_sass: {
        options: {
          archive: '<%= pkg.name %>_<%= pkg.version %>_sass.zip'
        },
        files: [
        { src: ['scss/**'], dest: 'furatto/'}
        ]
      },
    }

  });

  require('load-grunt-tasks')(grunt, {scope: 'devDependencies'});

  // CSS distribution task.
  grunt.registerTask('dist-css', ['compass:dist', 'cssmin']);

  // JS distribution task
  grunt.registerTask('dist-js', ['coffee', 'concat', 'uglify']);

  // Docs distribution task
  grunt.registerTask('dist-docs', ['compass:fontAwesome', 'copy:fontAwesome', 'compass:docs', 'copy:docs']);

  // Dist compression task
  grunt.registerTask('dist-compress', ['compress', 'compress:compress_sass']);

  // Dist dev
  grunt.registerTask('dist-dev', ['dist-css', 'dist-js', 'dist-docs'])

  // Full distribution task.
  grunt.registerTask('dist', ['clean', 'dist-css', 'dist-js', 'dist-docs', 'usebanner', 'dist-compress', 'copy:compressed', 'copy:compressed_sass']);

  // Default task.
  grunt.registerTask('default', ['dist']);

};
