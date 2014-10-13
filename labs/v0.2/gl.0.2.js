;
/* Created by seonki on 14. 10. 11. / email : webseon@gmail.com */
(function() {
	'use strict';
	var mat4 ={};
		mat4.create=function(){var r=new Float32Array(16);return r[0]=1,r[1]=0,r[2]=0,r[3]=0,r[4]=0,r[5]=1,r[6]=0,r[7]=0,r[8]=0,r[9]=0,r[10]=1,r[11]=0,r[12]=0,r[13]=0,r[14]=0,r[15]=1,r},
		mat4.identity=function( t ){return t[0]=1,t[1]=0,t[2]=0,t[3]=0,t[4]=0,t[5]=1,t[6]=0,t[7]=0,t[8]=0,t[9]=0,t[10]=1,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,t},
		mat4.translate=function ( out,a,v ) {var x=v[0],y=v[1],z=v[2],a00,a01,a02,a03,a10,a11,a12,a13,a20,a21,a22,a23;a === out ? (out[12]=a[0]*x+a[4]*y+a[8]*z+a[12],out[13]=a[1]*x+a[5]*y+a[9]*z+a[13],out[14]=a[2]*x+a[6]*y+a[10]*z+a[14],out[15]=a[3]*x+a[7]*y+a[11]*z+a[15]) : (a00=a[0],a01=a[1],a02=a[2],a03=a[3],a10=a[4],a11=a[5],a12=a[6],a13=a[7],a20=a[8],a21=a[9],a22=a[10],a23=a[11],out[0]=a00,out[1]=a01,out[2]=a02,out[3]=a03,out[4]=a10,out[5]=a11,out[6]=a12,out[7]=a13,out[8]=a20,out[9]=a21,out[10]=a22,out[11]=a23,out[12]=a00*x+a10*y+a20*z+a[12],out[13]=a01*x+a11*y+a21*z+a[13],out[14]=a02*x+a12*y+a22*z+a[14],out[15]=a03*x+a13*y+a23*z+a[15]);return out;},
		mat4.scale=function( out,a,v ) {var x=v[0],y=v[1],z=v[2];out[0]=a[0]*x,out[1]=a[1]*x,out[2]=a[2]*x,out[3]=a[3]*x,out[4]=a[4]*y,out[5]=a[5]*y,out[6]=a[6]*y,out[7]=a[7]*y,out[8]=a[8]*z,out[9]=a[9]*z,out[10]=a[10]*z,out[11]=a[11]*z,out[12]=a[12],out[13]=a[13],out[14]=a[14],out[15]=a[15];return out;},
		mat4.rotateX=function ( out,a,r ) {var s=Math.sin(r),c=Math.cos(r),a10=a[4],a11=a[5],a12=a[6],a13=a[7],a20=a[8],a21=a[9],a22=a[10],a23=a[11];if(a !== out) out[0]=a[0],out[1]=a[1],out[2]=a[2],out[3]=a[3],out[12]=a[12],out[13]=a[13],out[14]=a[14],out[15]=a[15];out[4]=a10*c+a20*s,out[5]=a11*c+a21*s,out[6]=a12*c+a22*s,out[7]=a13*c+a23*s,out[8]=a20*c-a10*s,out[9]=a21*c-a11*s,out[10]=a22*c-a12*s,out[11]=a23*c-a13*s;return out},
		mat4.perspective =function ( a,b,c,d,e ) {return a=c*Math.tan(a*Math.PI / 360),b=a*b,mat4.frustum(-b,b,-a,a,c,d,e)},
		mat4.frustum =function ( a,b,c,d,e,g,f ) {var h=b - a,i=d - c,j=g - e;return f||(f=mat4.create()),f[0]=e*2 / h,f[1]=0,f[2]=0,f[3]=0,f[4]=0,f[5]=e*2 / i,f[6]=0,f[7]=0,f[8]=(b+a) / h,f[9]=(d+c) / i,f[10]=-(g+e) / j,f[11]= -1,f[12]=0,f[13]=0,f[14]=-(g*e*2) / j,f[15]=0,f}
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
					else typeof this[k] == 'function' ? this[k]( v ) : this[k] = v
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
			while( i-- ) if( gl = t1.getContext( keys[i], keys2 ) ) break
			if( gl ){
				t0.S( 'position', 'absolute')
				this.cvs = t0, this.__gl = gl
				this._background = {r: Math.random(), g: Math.random(), b: Math.random()}

				this.make_vshader( 'vTest', 'gl_Position = uPMatrix * uMvMatrix * vec4(aVertexPosition, 1.0);' )
				this.make_fshader( 'fTest', 'gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);' )
				this.make_program( 'color', 'vTest', 'fTest' )
				this.make_geomety( 'tri', [
					0.0, 1.0, 0.0,
					-1.0, -1.0, 0.0,
					1.0, -1.0, 0.0
				], 3, 3 )
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
				'uniform mat4 uMvMatrix;'+
				'uniform mat4 uPMatrix;'+
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
					program.uPMatrix = gl.getUniformLocation(program, "uPMatrix");
					program.uMvMatrix = gl.getUniformLocation(program, "uMvMatrix");
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
				var pMatrix = mat4.create(), mvMatrix = mat4.create();
				gl.bindBuffer( gl.ARRAY_BUFFER, buffer ),
					gl.vertexAttribPointer( p.vertexPositionAttr, buffer.size, gl.FLOAT, false, 0, 0 ),


					mat4.perspective( 45, this.cvs.S('width')/this.cvs.S('height'),0.1, 1000.0, pMatrix ),
					gl.uniformMatrix4fv( p.uPMatrix, false, pMatrix ),
					mat4.translate(mvMatrix,mvMatrix, [0, 0, -7.0]),
					gl.uniformMatrix4fv( p.uMvMatrix, false, mvMatrix ),
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
		fn( 'hex_rgb', (function() {
			var t0, r, g, b, r1 = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i, r2 = /^#?([a-f\d]{1})([a-f\d]{1})([a-f\d]{1})$/i;
			return function( v ) {
				(t0 = r1.exec( v )) ? (r = parseInt( t0[1], 16 ), g = parseInt( t0[2], 16 ), b = parseInt( t0[3], 16 )) : (t0 = r2.exec( v ), r = parseInt( t0[1] + t0[1], 16 ), g = parseInt( t0[2] + t0[2], 16 ), b = parseInt( t0[3] + t0[3], 16 ))
				this._background.r = r, this._background.g = g, this._background.b = b, this._background.hex = t0
			}
		})() )

	return exports.GL = bs.GL = GL
})();
