;
/* Created by seonki on 14. 10. 11. / email : webseon@gmail.com */
(function() {
	'use strict';
	var glList = [], uuid = 0, GL = function() {
		this.__uuid = uuid++
		this.init.apply( this, arguments ? arguments : [] )
		glList.push( this )
	}, trim = /^\s*|\s*$/g, GLfn = GL.prototype, fn
	fn = function( k, v ) {
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
			}, fn = glCLS.prototype, fn.__clsName = t0
			GLfn[t0] = v( glCLS, fn ), GLfn[t0].fn = fn
		} ),
		GL.fn = fn, GL.cls = GLfn.cls, GL.obj = GLfn.obj,
		GLfn.renderMode = 'webgl', GLfn.rendering = 1
	GLfn.S = function() {
		var i = 0, j = arguments.length, k, v;
		while( i < j ){
			k = arguments[i++];
			if( i == j ){
				if( k == 'this' ) return this;
				return typeof this[k] == 'function' ? this[k]() : this[k]
			}
			else{
				v = arguments[i++]
				if( v === null ) delete this[k];
				typeof this[k] == 'function' ? this[k]( v ) : this[k] = v
			}
		}
	},
		/////////////////////////////////////////////////////////
		// CORE
		fn( 'init', function() {
			var gl, keys = 'webgl,experimental-webgl,webkit-3d,moz-webgl'.split( ',' ), keys2 = {antialias: 1}, arg = arguments[0] ? arguments[0] : [], i = 1, j = arg.length, check = arg[0], t0, t1
			while( i < j ) keys2[arg[i++]] = arg[i]
			i = keys.length;
			t0 = (check ? check.instanceOf == bs.Dom ? check : bs.Dom( '<canvas></canvas>' ) : bs.Dom( '<canvas></canvas>' )), t1 = t0[0]
			t0.S( 'position', 'absolute' )
			while( i-- ) if( gl = t1.getContext( keys[i], keys2 ) ) break
			if( gl ){
				this.cvs = t0, this.__gl = gl
				this._bgColor = {r: Math.random(), g: Math.random(), b: Math.random()}
				this._width = 300, this._height = 300
			}
			else return console.log( 'fail gl initialize' )
		} ),
		/////////////////////////////////////////////////////////
		// Render
		fn( 'render_gl', function() {
			if( !this.rendering ) return
			var gl = this.__gl
			gl.clearColor( this._bgColor.r, this._bgColor.g, this._bgColor.b, 1 )
			gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT )
		} ),
		fn( 'render_2d', function() {
			if( !this.rendering ) return
			console.log( '2d 모드 지원 준비중' )
		} )

	function render() {
		var i = glList.length, t
		while( i-- ) t = glList[i], t ? t.renderMode == 'webgl' ? t.render_gl() : t.render_2d() : 0
	}

	(function tick() {render(), requestAnimationFrame( tick )})();
	// END CORE
	/////////////////////////////////////////////////////////
	/////////////////////////////////////////////////////////
	// TEST
	GLfn.cls( 'Mesh', function( cls, fn ) {
		fn.NEW = function() {}
		return function() {
			return new cls( arguments )
		}
	} ),
		/////////////////////////////////////////////////////////
		// EXTEND
		fn( 'background', function( v ) { this.hex_rgb( v ), this.renderMode == 'webgl' ? this.render_gl() : this.render_2d() } ),
		// 프로퍼티 입력장치도 맹그러야하나..
		fn( 'width', function( v ) {
				if( v ) this.cvs.S( 'width', v )
				else return this.cvs.S( 'width' )
			}
		),
		fn( 'height', function( v ) {
				if( v ) this.cvs.S( 'height', v )
				else return this.cvs.S( 'height' )
			}
		),
		fn( 'hex_rgb', (function() {
			var t0, r, g, b, r1 = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i, r2 = /^#?([a-f\d]{1})([a-f\d]{1})([a-f\d]{1})$/i;
			return function( v ) {
				(t0 = r1.exec( v )) ? (r = parseInt( t0[1], 16 ), g = parseInt( t0[2], 16 ), b = parseInt( t0[3], 16 )) : (t0 = r2.exec( v ), r = parseInt( t0[1] + t0[1], 16 ), g = parseInt( t0[2] + t0[2], 16 ), b = parseInt( t0[3] + t0[3], 16 ))
				this._bgColor.r = r, this._bgColor.g = g, this._bgColor.b = b, this._bgColor.hex = t0
			}
		})() )
	return exports.GL = bs.GL = GL
})();
