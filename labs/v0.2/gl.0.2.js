;
/* Created by seonki on 14. 10. 11. / email : webseon@gmail.com */
(function() {
	'use strict';
	var glList = [], uuid = 0, GL = function() {
		this.__uuid = uuid++, this.VS = {}, this.FS = {}, this.PROGRAMS = {}, this.GEO = {}, this.currentProgram = null, this.currentGeo = null,
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
		GLfn.renderMode = 'webgl', GLfn.rendering = 1,
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
			t0.S( 'position', 'absolute', 'width', 300, 'height', 150 )
			while( i-- ) if( gl = t1.getContext( keys[i], keys2 ) ) break
			if( gl ){
				this.cvs = t0, this.__gl = gl
				this._background = {r: Math.random(), g: Math.random(), b: Math.random()}
				this.viewportWidth = t0.S( 'width' ), this.viewportHeight = t0.S( 'height' )

				this.make_vshader( 'vTest', 'gl_Position = vec4(aVertexPosition, 1.0);' )
				this.make_fshader( 'fTest', 'gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);' )
				this.make_program( 'color', 'vTest', 'fTest' )
				this.make_geomety( 'tri', [
					0.0, 1.0, 0.0,
					-1.0, -1.0, 0.0,
					1.0, -1.0, 0.0
				], 3, 3 )
				this.make_vshader( 'vTest', 'gl_Position = vec4(aVertexPosition, 1.0);' )
				this.make_fshader( 'fTest', 'gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);' )
				this.make_program( 'color', 'vTest', 'fTest' )
				this.make_geomety( 'rect', [
					0.5, 0.5, 0.0,
					-0.5, 0.5, 0.0,
					0.5, -0.5, 0.0,
					-0.5, -0.5, 0.0
				], 3, 4 )
			}
			else return console.log( 'fail gl initialize' )
		} ),
		fn( 'make_vshader', function( k, v ) {
			var str = 'precision highp float;' +
				'attribute vec3 aVertexPosition;' +
				'void main(void) {' +
				v +
				'}'
			this.VS[k] = this['compile_shader']( k, str, 'v' )
		} ),
		fn( 'make_fshader', function( k, v ) {
			var str = 'precision highp float;' +
				'void main(void) {' +
				v +
				'}'
			this.FS[k] = this['compile_shader']( k, str )
		} ),
		fn( 'compile_shader', function( k, str, type ) {
			var gl = this.__gl, shader = (type == 'v' ? gl.createShader( gl.VERTEX_SHADER ) : gl.createShader( gl.FRAGMENT_SHADER ));
			gl.shaderSource( shader, str ), gl.compileShader( shader )
			if( !gl.getShaderParameter( shader, gl.COMPILE_STATUS ) ){
				alert( gl.getShaderInfoLog( shader ) );
				return null;
			} else return shader.name = k, shader
		} ),
		fn( 'make_program', function( k, v, f ) {
				var gl = this.__gl, program = gl.createProgram();
				gl.attachShader( program, this.VS[v] ), gl.attachShader( program, this.FS[f] ), gl.linkProgram( program );
				if( !gl.getProgramParameter( program, gl.LINK_STATUS ) ) alert( "Could not initialise shaders" );
				else{
					gl.useProgram( this.currentProgram = this.PROGRAMS[k] = program )
					program.vertexPositionAttr = gl.getAttribLocation( program, "aVertexPosition" )
					gl.enableVertexAttribArray( program.vertexPositionAttr )
				}
			}
		),
		fn( 'make_geomety', function( k, v, itemSize, numItems ) {
			var gl = this.__gl, buffer = gl.createBuffer();
			gl.bindBuffer( gl.ARRAY_BUFFER, this.currentGeo = this.GEO[k] = buffer ),
				gl.bufferData( gl.ARRAY_BUFFER, new Float32Array( v ), gl.STATIC_DRAW ),
				buffer.size = itemSize, buffer.num = numItems, this.currentGeo = null
		} ),
		/////////////////////////////////////////////////////////
		// Render
		fn( 'render_gl', function() {
			var gl = this.__gl, p, buffer;
			if( !this.rendering ) return
			gl.clearColor( this._background.r, this._background.g, this._background.b, 1 ),
				gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT )
			if( (p = this.currentProgram) && (buffer = this.currentGeo) ){
				gl.bindBuffer( gl.ARRAY_BUFFER, buffer ), gl.vertexAttribPointer( p.vertexPositionAttr, buffer.size, gl.FLOAT, false, 0, 0 ),
					gl.drawArrays( gl.TRIANGLE_STRIP, 0, buffer.num );
			}
		} ),
		fn( 'render_2d', function() {
			if( !this.rendering ) return
			console.log( '2d 모드 지원 준비중' )
		} ),
		(function() {
			function render() {
				var i = glList.length, t
				while( i-- ) t = glList[i], t ? t.renderMode == 'webgl' ? t.render_gl() : t.render_2d() : 0
			};
			(function tick() {
				render(), requestAnimationFrame( tick )
			})()
		})(),
		// END CORE
		/////////////////////////////////////////////////////////
		/////////////////////////////////////////////////////////
		// TEST
		GLfn.cls( 'Mesh', function( cls, fn ) {
			fn.NEW = function() {
			}
			return function() {
				return new cls( arguments )
			}
		} ),
		/////////////////////////////////////////////////////////
		// EXTEND
		fn( 'background', function( v ) {
			this.hex_rgb( v ), this.renderMode == 'webgl' ? this.render_gl() : this.render_2d()
		} ),
		// 프로퍼티 입력장치도 맹그러야하나..
		fn( 'width', (function() {
				GLfn._width = 300
				return function( v ) {
					if( v ) this.cvs.S( 'width', this.viewportWidth = v ), this.__gl.viewport( 0, 0, this.viewportWidth, this.viewportHeight );
					else return this.cvs.S( 'width' )
				}
			})()
		),
		fn( 'height', (function() {
				GLfn._height = 150
				return function( v ) {
					if( v ) this.cvs.S( 'height', this.viewportHeight = v ), this.__gl.viewport( 0, 0, this.viewportWidth, this.viewportHeight );
					else return this.cvs.S( 'height' )
				}
			})()
		),
		fn( 'hex_rgb', (function() {
			var t0, r, g, b, r1 = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i, r2 = /^#?([a-f\d]{1})([a-f\d]{1})([a-f\d]{1})$/i;
			return function( v ) {
				(t0 = r1.exec( v )) ? (r = parseInt( t0[1], 16 ), g = parseInt( t0[2], 16 ), b = parseInt( t0[3], 16 )) : (t0 = r2.exec( v ), r = parseInt( t0[1] + t0[1], 16 ), g = parseInt( t0[2] + t0[2], 16 ), b = parseInt( t0[3] + t0[3], 16 ))
				this._background.r = r, this._background.g = g, this._background.b = b, this._background.hex = t0
			}
		})() )

	return exports.GL = bs.GL = GL
})();
