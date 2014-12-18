module.exports = function(grunt) {

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		cfg: grunt.file.readJSON('.couchapprc'),

		connect: {
			server: {
				options: {
					port: 9001,
					base: 'src/_attachments',
					keepalive:true
				}
			 }
		},
		'couch-compile': {
			website: {
				files: {
					'build/website.json': 'src'
				}
			}
		},
		'couch-push': {
			options: {
			  user: "<%= cfg.cloudant.username %>",
			  pass: "<%= cfg.cloudant.password %>",
			},
			cloudant: {
				files: {
					'<%= cfg.cloudant.url %>/<%= cfg.cloudant.couch %>': 'build/website.json'
				}
			}
		}
	});

	grunt.loadNpmTasks('grunt-couch');
	grunt.loadNpmTasks('grunt-contrib-connect');

	grunt.registerTask('default', ['connect']);
	grunt.registerTask('compile', ['couch-compile']);
	grunt.registerTask('deploy', ['couch-compile', 'couch-push']);

};