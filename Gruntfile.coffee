module.exports = (grunt) ->
  grunt.initConfig
    sass:
      entry:
        files:
          'out/entry.css': 'entry/*.scss'
      css:
        files:
          'out/css.scss.css': 'css/*.scss'
    coffee:
      header:
        files:
          'out/header.js': 'header/*.coffee'
      footer:
        files:
          'out/footer.js': 'footer/*.coffee'
      sidebar:
        files:
          'out/sidebar.js': 'sidebar/*.coffee'
      entry:
        files:
          'out/entry.js': 'entry/*.coffee'
    concat:
      header:
        src: [
          'snippets/script-begin.html'
          'out/header.js'
          'snippets/script-end.html'
        ]
        dest: 'out/header.html'
      footer:
        src: [
          'snippets/script-begin.html'
          'out/footer.js'
          'snippets/script-end.html'
        ]
        dest: 'out/footer.html'
      sidebar:
        src: [
          'snippets/script-begin.html'
          'out/sidebar.js'
          'snippets/script-end.html'
        ]
        dest: 'out/sidebar.html'
      entry:
        src: [
          'snippets/style-begin.html'
          'out/entry.css'
          'snippets/style-end.html'
          'snippets/script-begin.html'
          'out/entry.js'
          'snippets/script-end.html'
        ]
        dest: 'out/entry.html'
      css:
        src: [
          'css/system.css'
          'out/css.scss.css'
        ]
        dest: 'out/css.css'
    watch:
      header:
        files: 'header/*'
        tasks: ['coffee:header', 'concat:header', 'clip:header']
      footer:
        files: 'footer/*'
        tasks: ['coffee:footer', 'concat:footer', 'clip:footer']
      sidebar:
        files: 'sidebar/*'
        tasks: ['coffee:sidebar', 'concat:sidebar', 'clip:sidebar']
      entry:
        files: 'entry/*'
        tasks: ['sass:entry', 'coffee:entry', 'concat:entry', 'clip:entry']
      css:
        files: 'css/*'
        tasks: ['sass:css', 'concat:css', 'clip:css']


  pkg = grunt.file.readJSON 'package.json'
  for task of pkg.devDependencies when task[0...6] is 'grunt-'
    grunt.loadNpmTasks task

  grunt.registerTask 'clip', (subtask) ->
    command = 'clip-client set < ' + grunt.config().concat[subtask].dest
    require('child_process').exec command

  grunt.registerTask 'default', ['watch']
