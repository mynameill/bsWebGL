;
/* Created by seonki on 14. 10. 11. / email : webseon@gmail.com */
(function() {
	'use strict';
	var glList = [], uuid = 0, GL = function() {
		this.__uuid = uuid++
		this.renderMode = 'webgl'
		this.rendering = 1
		this.init.apply( this, arguments ? arguments : [] )
		glList.push( this )
	}, trim = /^\s*|\s*$/g, GLfn = GL.prototype, fn
	fn = GLfn.fn = function( k, v ) {
		var t = k.replace( trim, '' ).toLowerCase();
		GLfn[t] = v
	},
		fn( 'obj', function( k, v ) {
			var t = k.replace( trim, '' ).toUpperCase();
			GLfn[t] = v
		} ),
		fn( 'cls', function( k, v ) {
			var t0 = k.replace( trim, '' ).toLowerCase(), glCLS, fn;
			t0 = t0.charAt( 0 ).toUpperCase() + t0.substr( 1 )
			glCLS = function() {
				this['NEW'] ? this.NEW.apply( this, arguments ) : 0
			}, fn = glCLS.prototype, fn.__clsName = k
			GLfn[t0] = v( glCLS, fn ), GLfn[t0].fn = fn
		} ),
		// CORE
		fn( 'init', function() {
			var gl, keys = 'webgl,experimental-webgl,webkit-3d,moz-webgl'.split( ',' ), keys2 = {antialias: 1}, arg = arguments[0] ? arguments[0] : [], i = 1, j = arg.length, check = arg[0], t0, t1
			while( i < j ) keys2[arg[i++]] = arg[i]
			i = keys.length;
			t0 = (check ? check.instanceOf == bs.Dom ? check : bs.Dom( '<canvas></canvas>' ) : bs.Dom( '<canvas></canvas>' )), t1 = t0[0]
			t0.S( 'position', 'absolute' )
			while( i-- ) if( gl = t1.getContext( keys[i], keys2 ) ) break
			if( gl ) this.cvs = t0, this.__gl = gl
			else return console.log( 'fail gl initialize' )
		} ),
		// Render
		fn( 'render_gl', function() {
			if(!this.rendering) return
			var gl = this.__gl
			gl.clearColor( Math.random(), Math.random(), Math.random(), 1 )
			gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT )
		} ),
		fn( 'render_2d', function() {
			if(!this.rendering) return
			console.log( '2d 모드 지원 준비중' )
		} )
	function render() {
		var i = glList.length, t
		while( i-- ) t = glList[i], t ? t.renderMode == 'webgl' ? t.render_gl() : t.render_2d() : 0
	}
	(function tick() {render(), requestAnimationFrame( tick )})(),
		/////////////////////////////////////////////////////////
		/////////////////////////////////////////////////////////
		/////////////////////////////////////////////////////////
		// TEST
		GLfn.cls( 'Mesh', function( cls, fn ) {
			fn.NEW = function() {}
			return function() {
				return new cls( arguments )
			}
		} )
	return exports.GL = bs.GL = GL
})();
