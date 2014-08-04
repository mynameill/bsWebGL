var GL=(function(){ /*  Created by seonki on 14. 5. 1. /  email : webseon@gmail.com /  webGL의 bs 플러그인화 */
	'use strict';
	var trim=/\s/g, hex=/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i, hex_s=/^#?([a-f\d]{1})([a-f\d]{1})([a-f\d]{1})$/i
	var cvs, gl, IDs={},VBs={}, UVBs={}, VNBs={}, IBs={}, VSs={}, FSs={}, VB_VNBs={}, Ps={}, TEXTURES={}, FT={}, FB={}, perspectMTX, D_tri=0, D_par=0, D_parType=0, D_mouseCalls=0, mat4;
	var render, draw, mobile=bs.DETECT.device == 'tablet' || bs.DETECT.device == 'mobile', mC=Math.cos, mS=Math.sin, PI=Math.PI, pickSet={}, setUniqueColor, mouseMNG={event:null, checkInterval:2, checkPoint:0, target:null};
	(function(){
		var color=1677215, r=0, g=0, b=0, r1=/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i, r, g, b, t0;
		setUniqueColor=function(){return t0=r1.exec(color.toString(16)), color--, r=parseInt(t0[1], 16), g=parseInt(t0[2], 16), b=parseInt(t0[3], 16), pickSet[r+'::'+g+'::'+b]={r:r, g:g, b:b, r2:(r/255), g2:(g/255), b2:(b/255)}}
	})(), window.GLMAT_EPSILON=0.000001, window.Float32Array=Float32Array ? Float32Array : Array;
	(function(){
		var M, TEX, TEXN, P, PID, gt, vb, uvb, ib, vnb, vb_vnb, ctl , mode, cList, pList, renderPass, dColor=new Float32Array( 4 ), aColor=new Float32Array( 4 ), sColor=new Float32Array( 4 );
		var p_src, p_normal, p_vb, p_vnb, p_uvb, p_ib, p_vb_vnb, d_vb, d_vnb, d_uvb, d_ib, d_vb_vnb, d_P, p_backFace, p_parentMTX;
		draw=function( $cList, $num, $parentMTX ){
			var i=$num, j=0, t=$cList, t0, t1, result, ro=mat4.create(), pos=mat4.create(), mClone=mat4.clone, mIdentity=mat4.identity, mMultiply=mat4.matrixMultiply, mXRotation=mat4.makeXRotation, mYRotation=mat4.makeYRotation, mZRotation=mat4.makeZRotation, mTranslate=mat4.translate;
			var G_FLOAT=gl.FLOAT, G_AB=gl.ARRAY_BUFFER, G_EAB=gl.ELEMENT_ARRAY_BUFFER, G_BPE=Float32Array.BYTES_PER_ELEMENT, G_TEX2D=gl.TEXTURE_2D, G_TEX0=gl.TEXTURE0;
			P= null;
			while(i--){
				t0=t[j++], d_vb=d_vnb=d_ib=d_vb_vnb=d_uvb=d_P=0, renderPass=1, gt=t0.geoType, (p_backFace != t0.backFace) ? t0.backFace ? gl.enable( gl.CULL_FACE ) : gl.disable( gl.CULL_FACE ) : 0, p_backFace=t0.backFace
				if( gt == 'particle' ) pList.push( t0 )
				else{
					p_vb != VBs[gt] ? (vb=VBs[gt], d_vb=1) : 0, p_vnb != VNBs[gt] ? (vnb=VNBs[gt], d_vnb=1) : 0, p_ib != IBs[gt] ? (ib=IBs[gt], d_ib=1) : 0, p_vb_vnb != VB_VNBs[gt] ? (vb_vnb=VB_VNBs[gt], d_vb_vnb=1) : 0, p_uvb != UVBs[gt] ? (uvb=UVBs[gt], d_uvb=1) : 0
					M=t0._material, mode=t0.renderMode, TEX=M.texture, TEXN=M.textureNormal,
					P != M.program ? ( P=M.program, gl.useProgram( P ), gl.enableVertexAttribArray( P.aVer ), PID=P.pid, d_P=1) : 0,
					gl.uniformMatrix4fv( P.uParentMTX, false, $parentMTX ), gl.uniform3fv( P.uP, [t0.x, t0.y, t0.z] ), gl.uniform3fv( P.uR, [t0.rotationX, t0.rotationY, t0.rotationZ] ), gl.uniform3fv( P.uS, [t0.scaleX, t0.scaleY, t0.scaleZ] ), gl.uniform1f( P.uAlpha, t0.alpha )
					if( P.useLight ){
						sColor[0]=M.specularColor.r/255, sColor[1]=M.specularColor.g/255, sColor[2]=M.specularColor.b/255, sColor[4]=1.0,
						d_P ? gl.enableVertexAttribArray( P.aVerN ) : 0, gl.uniform1f( P.uSpecular, M.specular ), gl.uniform4fv( P.uSpecularColor, sColor ),
						d_P || d_vb_vnb ? (gl.bindBuffer( G_AB, vb_vnb ), gl.vertexAttribPointer( P.aVer, 3, G_FLOAT, false, 6*G_BPE, 0 ), gl.vertexAttribPointer( P.aVerN, 3, G_FLOAT, false, 6*G_BPE, 3*G_BPE )) : 0
					}else d_P || d_vb ? (gl.bindBuffer( G_AB, vb ), gl.vertexAttribPointer( P.aVer, 3, G_FLOAT, false, 3*G_BPE, 0 )) : 0
					if( PID == 8 ) TEX && TEX.loaded ? ((p_src != TEX ? (gl.activeTexture( G_TEX0 ), gl.bindTexture( gl.TEXTURE_CUBE_MAP, TEX ), gl.uniform1i( P.uSamC, 0 )) : 0), p_src=TEX) : renderPass=0
					else if( PID == 81 ) gl.uniform1i( P.uUseNormal, 0 ),
						TEX && TEX.loaded ? ((p_src != TEX ? (gl.activeTexture( G_TEX0 ), gl.bindTexture( gl.TEXTURE_CUBE_MAP, TEX ), gl.uniform1i( P.uSamC, 0 )) : 0), p_src=TEX) : renderPass=0,
						TEXN && TEXN.loaded ? (gl.uniform1i( P.uUseNormal, 1 ), gl.uniform1i( P.uSamN, 1 ), (p_normal != TEXN ? (gl.activeTexture( gl.TEXTURE1 ), gl.bindTexture( gl.TEXTURE_CUBE_MAP, TEXN )) : 0), p_normal=TEXN) : 0
					else if( PID == 9 )
						d_uvb ? (  d_P ? gl.enableVertexAttribArray( P.aTexC ) : 0, gl.bindBuffer( G_AB, uvb ), gl.vertexAttribPointer( P.aTexC, 2, G_FLOAT, false, 0, 0 )) : 0,
						TEX && TEX.loaded ? ((p_src != TEX ? (gl.activeTexture( G_TEX0 ), gl.bindTexture( G_TEX2D, TEX ), gl.uniform1i( P.uSam, 0 ), gl.pixelStorei( gl.UNPACK_FLIP_Y_WEBGL, true ), gl.texImage2D( G_TEX2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, TEX.video )) : 0), p_src=TEX) : renderPass=0,
						TEXN ? (gl.uniform1i( P.uUseNormal, 1 ), gl.uniform1i( P.uSamN, 1 )) : 0, TEXN && TEXN.loaded ? ((p_normal != TEXN ? (gl.activeTexture( gl.TEXTURE1 ), gl.bindTexture( G_TEX2D, TEXN )) : 0), p_normal=TEXN) : 0
					else if( PID > 3 ){
						gl.uniform1i( P.uUseNormal, 0 ),
						d_uvb ? (  d_P ? gl.enableVertexAttribArray( P.aTexC ) : 0, gl.bindBuffer( G_AB, uvb ), gl.vertexAttribPointer( P.aTexC, 2, G_FLOAT, false, 0, 0 )) : 0,
						TEX && TEX.loaded ? ((p_src != TEX ? (gl.activeTexture( G_TEX0 ), gl.bindTexture( G_TEX2D, TEX ), gl.uniform1i( P.uSam, 0 )) : 0), p_src=TEX) : renderPass=0
						if( PID == 5 ) TEXN ? (gl.uniform1i( P.uUseNormal, 1 ), gl.uniform1i( P.uSamN, 1 )) : 0, TEXN && TEXN.loaded ? ((p_normal != TEXN ? (gl.activeTexture( gl.TEXTURE1 ), gl.bindTexture( G_TEX2D, TEXN )) : 0), p_normal=TEXN) : 0
						if( PID >= 6 ) M.useAni ? (M._cGap+=16 , M._cGap >= M._gap ? (M._dirty=1, M._cGap=0, M._cCol++, M._cCol == M.col ? ( M._cCol=0, M._cRow++) : 0, M._cRow == M.row ? M._cRow=0 : 0) : M._dirty=0) : 0,
						gl.uniform1f( P.uCol, M._cCol/M.col ), gl.uniform1f( P.uPerCol, 1/M.col ), gl.uniform1f( P.uRow, M._cRow/M.row ), gl.uniform1f( P.uPerRow, 1/M.row )
						// 현재 row값이 제대로 안되는데...텍스쳐 uv에 대한 뭔가 이해가 잘못되었음....공부해!
					}else gl.uniform3fv( P.uColor, [M.r/255, M.g/255, M.b/255] )
					renderPass ? (D_tri+=ib.num/3, mode != 'POINTS' ? ( gl.bindBuffer( G_EAB, ib ), gl.drawElements( gl[mode], ib.num, gl.UNSIGNED_SHORT, 0 )) : (vb=VBs[gt], gl.uniform1f( P.uPointSize, 1 ), gl.bindBuffer( G_AB, vb ), gl.drawArrays( gl.POINTS, 0, vb.num ))) : 0
					// TODO 부모매트릭스와 자기 매트릭스 캐시해야됨
					t1=t0.children, t1.length ? (result=mClone( $parentMTX ), mIdentity( ro ), mIdentity( pos ), ro=mMultiply( ro, mXRotation( -t0.rotationX ) ), ro=mMultiply( ro, mYRotation( -t0.rotationY ) ), ro=mMultiply( ro, mZRotation( -t0.rotationZ ) ), mTranslate( pos, pos, [t0.x, t0.y, t0.z] ), draw( t1, t1.length, mMultiply( mMultiply( ro, result ), pos ) )) : 0
				}
				p_vb=VBs[gt], p_vnb=VNBs[gt], p_ib=IBs[gt], p_vb_vnb=VB_VNBs[gt]
			}
		}
		render=function(){
			var i, t0, G_FLOAT=gl.FLOAT, G_AB=gl.ARRAY_BUFFER, G_EAB=gl.ELEMENT_ARRAY_BUFFER, G_BPE=Float32Array.BYTES_PER_ELEMENT, G_TEX2D=gl.TEXTURE_2D, G_TEX0=gl.TEXTURE0, parentMTX=mat4.create()
			// 이렇게 하면 빨라지는건지 체크해야함...상수 캐쉬하는게 더느릴수도 -_-
			if( !(ctl=GL.controller) ) return console.log( '컨트롤러가 존재하지않습니다' )
			cList=GL.children, pList=[], D_tri=0, GL.PostEffect.use ? (gl.bindFramebuffer( gl.FRAMEBUFFER, null ), gl.bindFramebuffer( gl.FRAMEBUFFER, FB['pre'] )) : 0,
			gl.viewport(0, 0, GL._w, GL._h), gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT),
			dColor[0]=GL.directionalLight.r/255, dColor[1]=GL.directionalLight.g/255, dColor[2]=GL.directionalLight.b/255, dColor[3]=GL.directionalLight.alpha, aColor[0]=GL.ambientLight.r/255, aColor[1]=GL.ambientLight.g/255, aColor[2]=GL.ambientLight.b/255, aColor[3]=GL.ambientLight.alpha
			for( var k in Ps ) gl.useProgram( P=Ps[k] ), gl.uniformMatrix4fv( P.uPerspectMTX, false, perspectMTX ), gl.uniformMatrix4fv( P.uCameraMTX, false, ctl.cameraMTX ), gl.uniformMatrix4fv( P.uParentMTX, false, parentMTX ),
				GL.fog.use ? (gl.uniform1i( P.uFog, 1 ), gl.uniform1f( P.uFogDensity, GL.fog.density ), gl.uniform3fv( P.uFogColor, [GL.fog.r/255, GL.fog.g/255, GL.fog.b/255] ) ) : 0,
				P.useLight ? (gl.uniform4fv( P.uDLightColor, dColor ), gl.uniform4fv( P.uALightColor, aColor ), gl.uniform3fv( P.uDLightD, [GL.directionalLight.x, GL.directionalLight.y, GL.directionalLight.z] ), gl.uniform1f( P.uDIntensity, GL.directionalLight.intensity ), gl.uniform1f( P.uAIntensity, GL.ambientLight.intensity ),
				GL.pointLight ? (gl.uniform3fv( P.uPLightPos, [GL.pointLight.x, GL.pointLight.y, GL.pointLight.z] )) : 0
				) : 0
			if( GL.skyBox ) gl.disable( gl.DEPTH_TEST ), gl.disable( gl.BLEND ), t0=GL.skyBox.obj, M=t0._material,
				M.texture.loaded ? (gl.enableVertexAttribArray( P.aVer ), gt=t0.geoType, ib=IBs[gt], vb_vnb=VB_VNBs[gt], uvb=UVBs[gt], vb=VBs[gt],
				gl.useProgram( P=M.program ), gl.uniform3fv( P.uP, [0, 0, 0] ), gl.uniform3fv( P.uR, [0, 0, 0] ), gl.uniform3fv( P.uS, [t0.scaleX, t0.scaleY, t0.scaleZ] ), gl.uniform1f( P.uAlpha, 1 ),
				gl.uniform1i( P.uSamC, 0 ), gl.activeTexture( gl.TEXTURE0 ), gl.bindTexture( gl.TEXTURE_CUBE_MAP, M.texture ),
				gl.bindBuffer( G_AB, vb ), gl.vertexAttribPointer( P.aVer, 3, G_FLOAT, false, 0, 0 ), gl.bindBuffer( G_EAB, ib ), gl.drawElements( gl[t0.renderMode], ib.num, gl.UNSIGNED_SHORT, 0 ), D_tri+=8 ) : 0;
			if( cList.length == 0 ) return;
			i=GL.children.length, gl.enable( gl.BLEND ), gl.blendFunc( gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA ), gl.enable( gl.DEPTH_TEST ), gl.depthFunc( gl.LESS )
			draw( cList, i, parentMTX ), p_src=null, p_normal=null, gl.depthMask( false ), i=pList.length, D_par=i, D_parType=0
			if( i > 0 ){// TODO 이것도 텍스쳐랑 컬러랑 분기시켜야하..,TODO 지오메트리 파티클을 지원해야하나;;;// 거리에 따른 포인트 크기 도 계산해야됨...어찌하지;;
				var pTList={}, pT, kList, check, pv
				while( i-- ) pTList[pT=pList[i]._geoTypeP] ? pTList[pT].push( pList[i] ) : (pTList[pT]=[], pTList[pT].push( pList[i] ))
				gl.useProgram( P=Ps['particle'] ), gl.enableVertexAttribArray( P.aPage ), gl.enableVertexAttribArray( P.aPalpha ), gl.enableVertexAttribArray( P.aPscale ), gl.enableVertexAttribArray( P.aVer )
				for( var k in pTList ){
					i=pTList[k].length, kList=pTList[k], check={}
					while( i-- ) t0=kList[i], M=t0._material, TEX=M.texture,
						!check[t0._geoTypeP] ? (t0.update(), D_parType++, check[gt=t0._geoTypeP]=1, gl.bindBuffer( G_AB, vb=VBs[gt] ), gl.vertexAttribPointer( P.aVer, 3, G_FLOAT, false, 0, 0 ),
						pv=VBs[gt+'_p'], pv ? (gl.bindBuffer( G_AB, pv ), gl.vertexAttribPointer( P.aPage, 1, G_FLOAT, false, 3*G_BPE, 0 ), gl.vertexAttribPointer( P.aPalpha, 1, G_FLOAT, false, 3*G_BPE, 1*G_BPE ), gl.vertexAttribPointer( P.aPscale, 1, G_FLOAT, false, 3*G_BPE, 2*G_BPE )) : 0) : 0,
						t0.zSort ? (gl.enable( gl.DEPTH_TEST ), gl.depthFunc( gl.LESS )) : gl.disable( gl.DEPTH_TEST ),
						gl.blendFunc( gl.SRC_ALPHA, gl.ONE ), // TODO 블렌드 분기 // gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);// gl.blendFunc(gl.SRC_ALPHA,gl.ONE);//
						TEX && TEX.loaded ? (gl.activeTexture( G_TEX0 ), gl.bindTexture( G_TEX2D, TEX ), gl.uniform1i( P.uSam, 0 )) : 0,
						gl.uniform3fv( P.uP, [t0.x, t0.y, t0.z] ), gl.uniform3fv( P.uR, [t0.rotationX, t0.rotationY, t0.rotationZ] ), gl.uniform3fv( P.uS, [t0.scaleX, t0.scaleY, t0.scaleZ] ), gl.uniform1f( P.uAlpha, t0.alpha ), gl.uniform1f( P.uPointSize, t0.pointSize ),
						gl.drawArrays( gl.POINTS, 0, vb.num )
				}
			}
			gl.depthMask( true ), p_vb=p_vnb=p_ib=p_vb_vnb=null
			if( GL.PostEffect.use ){
				gl.bindFramebuffer( gl.FRAMEBUFFER, null ), gl.clear( gl.COLOR_BUFFER_BIT ),
				gl.useProgram( P=Ps['last'] ), gl.uniformMatrix4fv( P.uPerspectMTX, false, mat4.create() ), gl.uniformMatrix4fv( P.uCameraMTX, false, mat4.create() ),
				P['aVerN'] > -1 ? gl.disableVertexAttribArray( P.aVerN ) : 0, gl.activeTexture( G_TEX0 ), gl.bindTexture( G_TEX2D, FT['pre'] ), gl.uniform1i( P.uSam, 0 ), gl.bindBuffer( G_AB, vb=VBs['rect'] ),
				gl.vertexAttribPointer( P.aVer, 3, G_FLOAT, false, 3*G_BPE, 0 ), gl.bindBuffer( G_AB, uvb=UVBs['rect'] ), gl.vertexAttribPointer( P.aTexC, 2, G_FLOAT, false, 2*G_BPE, 0 ),
				gl.uniform3fv( P.uP, [0, 0, 0] ), gl.uniform3fv( P.uR, [0, 0, 0] ), gl.uniform3fv( P.uS, [2, 2, 1] ), gl.uniform1f( P.uAlpha, 1 ), gl.uniform2fv( P.uResolution, [+GL._w, +GL._h] )
				//TODO 음 순차처리를 어케해야할지 고민좀 해봐야할듯 -_- 가능한 한방에 해결하고픈데..
				var t0=GL.PostEffect.__list, t1, effectList=GL.PostEffect.list, i=t0.length, j=effectList.length
				while( i-- ) t1=t0[i].split( '_' ), t1=t1[1].charAt( 0 ).toUpperCase()+t1[1].substr( 1, t1[1].length-1 ), gl.uniform1i( P['u'+t1], 0 )
				while( j-- ) gl.uniform1i( P[effectList[j].uniform], 1 )
				gl.uniform1i( P.uFXAA, GL.PostEffect.fxaa ), gl.uniform1i( P.uAnaglyph, GL.PostEffect.anagraphy ), gl.bindBuffer( G_EAB, ib=IBs['rect'] ), gl.drawElements( gl['TRIANGLES'], ib.num, gl.UNSIGNED_SHORT, 0 );
			}
		}
	})();
	///////////////////////////////////////////
	// 마우스는 척결대상이고..아예다시짜야함
	function drawMouse(){
		var t0, t=GL.children, i=t.length, cont=bs.GL.controller, P, gt, vb, ib, p_vb, p_ib, dirty_vb, dirty_ib
		if( i == 0 || !cont ) return
		D_mouseCalls=0, gl.bindFramebuffer( gl.FRAMEBUFFER, FB['mouse'] )
		if( gl.checkFramebufferStatus( gl.FRAMEBUFFER ) != gl.FRAMEBUFFER_COMPLETE ) return mouseMNG.checkPoint=0, gl.bindFramebuffer( gl.FRAMEBUFFER, null );
		gl.viewport( 0, 0, GL._w*FT['mouse'].wScale, GL._h*FT['mouse'].hScale ), gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT ), gl.useProgram( P=Ps['color'] ), gl.enable( gl.DEPTH_TEST ), gl.depthFunc( gl.LESS ), gl.disable( gl.BLEND )
		while( i-- ) t0=t[i], gt=t0.geoType, p_vb != VBs[gt] ? (vb=VBs[gt], dirty_vb=1) : 0, p_ib != IBs[gt] ? (ib=IBs[gt], dirty_ib=1) : 0,
			(gt != 'particle' && t0.evt.num) ? (
			gl.uniform3fv( P.uP, [t0.x, t0.y, t0.z] ), gl.uniform3fv( P.uR, [t0.rotationX, t0.rotationY, t0.rotationZ] ), gl.uniform3fv( P.uS, [t0.scaleX, t0.scaleY, t0.scaleZ] ), gl.uniform1f( P.uAlpha, t0.alpha ), gl.uniform3fv( P.uColor, [t0._pickColor.r2, t0._pickColor.g2, t0._pickColor.b2] ),
			dirty_vb ? (gl.bindBuffer( gl.ARRAY_BUFFER, vb ), gl.vertexAttribPointer( P.aVer, 3, gl.FLOAT, false, 0, 0 )) : 0,
			dirty_ib ? gl.bindBuffer( gl.ELEMENT_ARRAY_BUFFER, ib ) : 0,
			gl.drawElements( gl.TRIANGLES, ib.num, gl.UNSIGNED_SHORT, 0 ), D_mouseCalls++, p_vb=VBs[gt], p_ib=IBs[gt]) : 0;
		p_vb=null, p_ib=null, gl.bindFramebuffer( gl.FRAMEBUFFER, null )
	}
	var mouseFireList=[]
	function checkMouse(){
		gl.bindFramebuffer( gl.FRAMEBUFFER, FB['mouse'] );
		if( gl.checkFramebufferStatus( gl.FRAMEBUFFER ) != gl.FRAMEBUFFER_COMPLETE ) return  mouseMNG.checkPoint=0, gl.bindFramebuffer( gl.FRAMEBUFFER, null );
		var m=mouseMNG, t0, t1;
		if( m['event'] ){
			t0=new Uint8Array( 1*1*4 ), t0[3]=1, gl.readPixels( m.event.x*FT['mouse'].wScale, (GL._h-m.event.y)*FT['mouse'].hScale, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, t0 ), t1=pickSet[t0[0]+"::"+t0[1]+"::"+t0[2]]
			if( t1 ){
				if( t1['mesh'] ){
					var target=m.target
					if( target && target != t1['mesh'] )  mouseFireList.push( target )
					var ct=m.target=t1['mesh'], evt=ct.evt, type=m.event.type
					if( evt.overed == 0 && type == 'mousemove' && evt['mouseover'] ) evt['mouseover'].apply( ct ), document.body.style.cursor='pointer'
					else if( evt.overed > 0 && type == 'mousedown' ){ if( evt['mousedown'] ) evt[type].apply( ct ), document.body.style.cursor='pointer'}
					else if( evt[type] ) evt[type].apply( ct )
					evt.overed++, m.event=null
				}
			}
			else{
				var t=m.target
				if( t && t.evt.overed > 0 ) t.evt['mouseout'] ? (t.evt['mouseout'].apply( t ), document.body.style.cursor='pointer') : 0 , t.evt.overed=0, t=null
				m.event=null, document.body.style.cursor='default'
			}
			for( var i=0, len=mouseFireList.length; i < len; i++ )mouseFireList[i].evt['mouseout'] ? mouseFireList[i].evt['mouseout'].apply( mouseFireList[i] ) : 0, mouseFireList[i].evt.overed=0, mouseFireList.shift()
		}
		m.checkPoint=0, gl.bindFramebuffer( gl.FRAMEBUFFER, null );
	}
	///////////////////////////////////////////
	function mkBuffer( BO, k, d, size ){
		var t=gl.createBuffer(), t0=k.indexOf('particle') > -1 ? 'DYNAMIC_DRAW' : 'STATIC_DRAW';
		BO == VBs || BO == UVBs || BO == VNBs ? (gl.bindBuffer(gl.ARRAY_BUFFER, t), gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(d), gl[t0])) : (gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, t), gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(d), gl[t0]))
		t.size=size, t.num=d.length/size, BO[k]=t
	}
	function mkBuffer2( BO, k, v, n, size ){
		var t=gl.createBuffer(), t1=[], t2, i, j, len
		for(i=0, len=v.length/size; i < len; i++){for(j=0; j < size; j++) t1.push(v[i*size+j]);for(j=0; j < size; j++) t1.push(n[i*size+j])}
		t2=new Float32Array(t1), gl.bindBuffer(gl.ARRAY_BUFFER, t), gl.bufferData(gl.ARRAY_BUFFER, t2, gl.STATIC_DRAW), t.size=size*2, t.num=t1.length, BO[k]=t
	}
	function makeBufferSet( k, v, i, c/*etcBuffer, size */ ){
		var ns=calculateNormals(v, i), j, len;
		mkBuffer(VBs, k, v, 3), mkBuffer(IBs, k, i, 1), mkBuffer(UVBs, k, c, 2), mkBuffer(VNBs, k, ns, 3), mkBuffer2(VB_VNBs, k, v, ns, 3)
		for(j=4, len=arguments.length; j < len; j=j+2) mkBuffer(VBs, k+"_p", arguments[j], arguments[j+1]);//console.log('vertices',$vs.length,'normals',ns.length,'codi',$cs.length,'indices',$is.length)
	}
	function calculateNormals( v, i ){var x=0, y=1, z=2, j, k, len, mSqt=Math.sqrt, ns=[], v1=[], v2=[], n0=[], n1=[];for(j=0, len=v.length; j < len; j++) ns[j]=0.0;for(j=0, len=i.length; j < len; j=j+3){v1=[], v2=[], n0=[], v1[x]=v[3*i[j+1]+x]-v[3*i[j]+x], v1[y]=v[3*i[j+1]+y]-v[3*i[j]+y], v1[z]=v[3*i[j+1]+z]-v[3*i[j]+z], v2[x]=v[3*i[j+2]+x]-v[3*i[j+1]+x], v2[y]=v[3*i[j+2]+y]-v[3*i[j+1]+y], v2[z]=v[3*i[j+2]+z]-v[3*i[j+1]+z], n0[x]=v1[y]*v2[z]-v1[z]*v2[y], n0[y]=v1[z]*v2[x]-v1[x]*v2[z], n0[z]=v1[x]*v2[y]-v1[y]*v2[x];for(k=0; k < 3; k++) ns[3*i[j+k]+x]=ns[3*i[j+k]+x]+n0[x], ns[3*i[j+k]+y]=ns[3*i[j+k]+y]+n0[y], ns[3*i[j+k]+z]=ns[3*i[j+k]+z]+n0[z]};for(var i=0, len=v.length; i < len; i=i+3){n1=[], n1[x]=ns[i+x], n1[y]=ns[i+y], n1[z]=ns[i+z];var len=mSqt((n1[x]*n1[x])+(n1[y]*n1[y])+(n1[z]*n1[z]));if(len == 0) len=0.00001;n1[x]=n1[x]/len, n1[y]=n1[y]/len, n1[z]=n1[z]/len, ns[i+x]=n1[x], ns[i+y]=n1[y], ns[i+z]=n1[z];};return ns;}
	function setBaseBuffers(){
		var vs, i, c;vs=[ -0.5,-0.5,0.0,0.5,-0.5,0.0,0.5,0.5,0.0,-0.5,0.5,0.0], i=[0,1,2,0,2,3], c=[0.0,0.0,1.0,0.0,1.0,1.0,0.0,1.0], makeBufferSet('rect',vs,i,c), vs=[0,0.5,0,-0.5,-0.5,0,0.5,-0.5,0], i=[0,1,2], c=[0.5,0,1,0,1,1,0,1], makeBufferSet('tri',vs,i,c), vs=[-0.5,0.5,-0.5,-0.5,-0.5,-0.5,-0.5,-0.5,0.5,-0.5,0.5,0.5,-0.5,0.5,0.5,-0.5,-0.5,0.5,0.5,-0.5,0.5,0.5,0.5,0.5,0.5,0.5,0.5,0.5,-0.5,0.5,0.5,-0.5,-0.5,0.5,0.5,-0.5,0.5,0.5,-0.5,0.5,-0.5,-0.5,-0.5,-0.5,-0.5,-0.5,0.5,-0.5,-0.5,0.5,-0.5,-0.5,0.5,0.5,0.5,0.5,0.5,0.5,0.5,-0.5,-0.5,-0.5,0.5,-0.5,-0.5,-0.5,0.5,-0.5,-0.5,0.5,-0.5,0.5], i=[0,1,2,0,2,3,4,5,6,4,6,7,8,9,10,8,10,11,12,13,14,12,14,15,16,17,18,16,18,19,20,21,22,20,22,23], c=[0.0,0.0,1.0,0.0,1.0,1.0,0.0,1.0,1.0,0.0,1.0,1.0,0.0,1.0,0.0,0.0,0.0,1.0,0.0,0.0,1.0,0.0,1.0,1.0,1.0,1.0,0.0,1.0,0.0,0.0,1.0,0.0,1.0,0.0,1.0,1.0,0.0,1.0,0.0,0.0,0.0,0.0,1.0,0.0,1.0,1.0,0.0,1.0], makeBufferSet('box',vs,i,c)
		var vs=[], is=[], cs=[], w=32, h=32, radius=1, t, st, ct;for(var i=0; i <= w; i++){t=i*PI/w;st=mS(t), ct=mC(t);for(var j=0; j <= h; j++){var phi=j*2*PI/h, sinPhi=mS(phi), cosPhi=mC(phi), x=cosPhi*st, y=ct, z=sinPhi*st, u=1-(j/h), v=1-(i/w);cs.push(u), cs.push(v), vs.push(radius*x), vs.push(radius*y), vs.push(-radius*z);}};for(var i=0; i < w; i++){for(var longNumber=0; longNumber < h; longNumber++){var first=(i*(h+1))+longNumber, second=first+h+1;is.push(first), is.push(second), is.push(first+1), is.push(second), is.push(second+1), is.push(first+1);}};makeBufferSet('sphere',vs,is,cs)
	}
	var attrIDX={}
	function mkProgram(k){ // 여긴어케 더 정리를 먼저 할꺼냐...쉐이더 메이커를 좀더 안정화 고도화 시킬꺼냐 -_-;;
		var _data=bs.GL._shaderData, vShader=gl.createShader( gl.VERTEX_SHADER ), fShader=gl.createShader( gl.FRAGMENT_SHADER ),
			t0="uP,uR,uS,uAlpha,uFog,uFogDensity,uFogColor,uPointSize,uPerspectMTX,uCameraMTX,uParentMTX".split( ',' ), t1, t2=k.UUId, t3, t4, t5='attribute,v_uniform,f_uniform,varying'.split( ',' ), j=t5.length, i, p, targetKey, splitKey,
			vStr="precision mediump float;\n"+_data._BASE_VERTEX_UNIFORM+_data._MTX_FUNC, fStr="precision mediump float;\n"+_data._BASE_FRAGMENT_UNIFORM+(t2 == 'last' ? _data._FXAA : '')
		while( j-- ){
			targetKey=t5[j], splitKey=targetKey.split( '_' ), i=k[targetKey].length
			while( i-- ) t1=k[targetKey][i].split( '_' ), t4=splitKey[splitKey.length-1], (splitKey[0] == 'f' || splitKey == 'varying') ? fStr+=t4+' '+t1[0]+' '+t1[1]+';\n' : 0, splitKey[0] != 'f' ? vStr+=t4+' '+t1[0]+' '+t1[1]+';\n' : 0;
		}
		vStr+='\nvoid main(void) {\n'+_data._MAKE_VERTEX+(k.useLight ? _data._BASE_VERTEX_LIGHT_CAL : '')+k.vFunc+'\n}', t2 == 'last' ? (fStr+='\nvoid main(void) {\n'+k.fFunc+'\n}') : (fStr+='\nvoid main(void) {\n'+k.fFunc+'\n'+_data._BASE_FRAGMENT_RESULT+'\n}')
		gl.shaderSource( vShader, vStr ), gl.compileShader( vShader ), VSs[t2]=vShader;if( !gl.getShaderParameter( vShader, gl.COMPILE_STATUS ) ) return alert( gl.getShaderInfoLog( vShader ) );
		gl.shaderSource( fShader, fStr ), gl.compileShader( fShader ), FSs[t2]=fShader;if( !gl.getShaderParameter( fShader, gl.COMPILE_STATUS ) ) return alert( gl.getShaderInfoLog( fShader ) );
		Ps[t2]=p=gl.createProgram(), p.UUId=t2, gl.attachShader( p, VSs[t2] ), gl.attachShader( p, FSs[t2] ), gl.linkProgram( p ),
		gl.getProgramParameter( p, gl.LINK_STATUS ) ? ( gl.useProgram( p ), p.useLight=k.useLight, p.pid=k.pid ) : alert( "쉐이더 초기화에 실패했습니다." )
		for( i in t0 ) t2=t0[i], p[t2]=gl.getUniformLocation( p, t2 );
		i=k.v_uniform.length;while( i-- ) p[t3=k.v_uniform[i].split( '_' )[1]]=gl.getUniformLocation( p, t3 );i=k.f_uniform.length;while( i-- ) p[t3=k.f_uniform[i].split( '_' )[1]]=gl.getUniformLocation( p, t3 )
		i=k.attribute.length;while( i-- ) attrIDX[k.attribute[i].split( '_' )[1]]= -1
	}
	function mkFrameBuffer( $k, $w, $h, $scaleW, $scaleH ){
		var w=$w, h=$h, t0, G_TEX2D=gl.TEXTURE_2D, G_RBF=gl.RENDERBUFFER, G_FBF=gl.FRAMEBUFFER;
		gl.bindTexture( G_TEX2D, FT[$k]=gl.createTexture() ), gl.texParameteri( G_TEX2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR ), gl.texParameteri( G_TEX2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR ), gl.texParameteri( G_TEX2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE ), gl.texParameteri( G_TEX2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE ), gl.texImage2D( G_TEX2D, 0, gl.RGBA, w, h, 0, gl.RGBA, gl.UNSIGNED_BYTE, null ), gl.bindTexture( G_TEX2D, null ),
		FT[$k].wScale=$scaleW, FT[$k].hScale=$scaleH
		gl.bindRenderbuffer( G_RBF, t0=gl.createRenderbuffer() ), gl.renderbufferStorage( G_RBF, gl.DEPTH_COMPONENT16, w, h ),
		gl.bindFramebuffer( G_FBF, FB[$k]=gl.createFramebuffer() ), gl.framebufferTexture2D( G_FBF, gl.COLOR_ATTACHMENT0, G_TEX2D, FT[$k], 0 ), gl.framebufferRenderbuffer( G_FBF, gl.DEPTH_ATTACHMENT, G_RBF, t0 ), gl.bindTexture( G_TEX2D, null ), gl.bindRenderbuffer( G_RBF, null ), gl.bindFramebuffer( G_FBF, null )
	}
	function makeTexture( src, W, MA, MI, type ){
		if( TEXTURES[src] ) return TEXTURES[src]  //type 0 : image / 1 : video / undefined : cube
		var t0=gl.createTexture(), t1=[], t2=0, G_TEX2D=gl.TEXTURE_2D, i, onLoad
		onLoad=function(){
			type == 1 ? (MA='LINEAR', MI='LINEAR', W='CLAMP_TO_EDGE') : 0, t0.loaded=1, t0.image || t0.video ? (gl.bindTexture( G_TEX2D, t0 ), gl.pixelStorei( gl.UNPACK_FLIP_Y_WEBGL, true )) : gl.bindTexture( gl.TEXTURE_CUBE_MAP, t0 ), gl.pixelStorei( gl.UNPACK_FLIP_Y_WEBGL, true )
			if( t0.image || t0.video ) gl.texImage2D( G_TEX2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, type == 1 ? t0.video : t0.image ), MA ? gl.texParameteri( G_TEX2D, gl.TEXTURE_MAG_FILTER, gl[MA] ) : 0, MI ? gl.texParameteri( G_TEX2D, gl.TEXTURE_MIN_FILTER, gl[MI] ) : 0, W ? (gl.texParameteri( G_TEX2D, gl.TEXTURE_WRAP_S, gl[W] ) , gl.texParameteri( G_TEX2D, gl.TEXTURE_WRAP_T, gl[W] )) : 0
			else{
				if( ++t2 == 6 ){ //TODO 로딩체크 개별로 해야될것 같은데?
					var j, map=[gl.TEXTURE_CUBE_MAP_POSITIVE_X, gl.TEXTURE_CUBE_MAP_NEGATIVE_X, gl.TEXTURE_CUBE_MAP_POSITIVE_Y, gl.TEXTURE_CUBE_MAP_NEGATIVE_Y, gl.TEXTURE_CUBE_MAP_POSITIVE_Z, gl.TEXTURE_CUBE_MAP_NEGATIVE_Z];
					for( j=0; j < 6; j++ ) gl.texImage2D( map[j], 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, t1[j] ), gl.texParameteri( gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE ), gl.texParameteri( gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE );
					gl.generateMipmap( gl.TEXTURE_CUBE_MAP )
				}
			}
			type == 1 ? t1.loop=true : (t0.image ? gl.generateMipmap( G_TEX2D ) : 0)
		}
		if( src.pop ) for( i=0; i < 6; i++ ) t1[i]=new Image(), t1[i].onload=onLoad, t1[i].src=src[i]
		else if( type == 0 ) t0.image=new Image(), t0.image.src=src, t0.image.onload=onLoad
		else if( type == 1 ) t1=document.createElement( 'video' ), t0.video=t1, t1.src=src, t1.style.position='absolute', t1.play(), t1.style.display='none', t1.addEventListener( "canplaythrough", onLoad, true ), document.body.appendChild( t1 );
		return t0.loaded=0, TEXTURES[src]=t0
	}
	function sMethod(){}
	sMethod.prototype.S=function(){
		var arg=arguments, k=arg[0] , v, i=0, j=arg.length-1
		while( i < j ) k=arg[i++], v=arg[i++], typeof this[k] == 'function' ? this[k]( v ) : this[k]=v
		if( arg[j] == 'this' ) return this
		if( arg.length%2 ) return k == null ? console.log( '존재하지않는 값입니다!' ) : ((typeof this[k] == 'function') ? this[k]() : this[k])
		return this
	},sMethod.prototype['material']=function( v ){
		if(v) {
			if( v['program'] ) this._material=v
			else {
				if( v['type'] ){
					if( v['type'] == 'cube' ){
						v['light'] ? (this._material=GL.Material( 'cubeLight' ).S( 'src', v.src ), v['normal'] ? this._material.S( 'normal', v['normal'] ) : 0 ) :
						this._material = GL.Material('cube').S('src',v.src)
					}else this._material=GL.Material('environment').S('src', v.src), v['normal'] ? this._material.S('normal', v['normal']) :0
				}else{
					v=v.replace( trim, '' )
					var t={}, t0=v.split( ',' ), t1=t0.length-1
					for( var i=1; i < t1-1; i++ ) t[t0[i++]]=t0[i]
					if( v.charAt( 0 ) == '#' ){
						t0[t1] == 'L' ? this._material=GL.Material( 'colorLight' ).S( 'color', t0[0] ) :
						t0[t1] == 'TL' ? this._material=GL.Material( 'toonLight' ).S( 'color', t0[0] ) :
						t0[t1] == 'T' ? this._material=GL.Material( 'toon' ).S( 'color', t0[0] ) :
						this._material=GL.Material( 'color' ).S( 'color', t0[0] )
					}else if( t0[t1].charAt( 0 ) == 'V' ){
						t0[t1] == 'V' ? this._material=GL.Material( 'video' ).S( 'src', t0[0] ) :
						this._material=GL.Material( 'videoLight' ).S( 'src', t0[0], 'normal', t0[t1-1] )
					}else if( t0[t1] == 'S' ) this._material=GL.Material( 'sprite' ).S( 'src', t0[0], 'col', t['col'], 'row', t['row'], 'time', t['time'] ? t['time'] : 1 )
					else{
						t0[t1] == 'B' ? this._material=GL.Material( 'bitmap' ).S( 'src', t0[0] ) :
						t0[t1] == 'BL' ? this._material=GL.Material( 'bitmapLight' ).S( 'src', t0[0], 'normal', t0[t1-1] ) : 0
					}
				}
			}
		}else return this._material
	}, sMethod.prototype['color']=function( v ){
        var t0
        if(v) (t0=hex.exec(v)) ? (this.r=parseInt(t0[1], 16), this.g=parseInt(t0[2], 16), this.b=parseInt(t0[3], 16)) 
			: (t0=hex_s.exec(v), this.r=parseInt(t0[1]+t0[1], 16), this.g=parseInt(t0[2]+t0[2], 16), this.b=parseInt(t0[3]+t0[3], 16))
        else return this._color
    }
	//TODO parent처리와 각종 child관련 매서드 추가해야됨
	function parent( v ){
		(v==null && this.parent) ?  (this.parent.children.splice(this.parent.children.indexOf(this),1) , this.parent = null) : 0
		if(v && v['join']) v = v.charAt(0) =='#' ? IDs[v] : v
		v == 'ROOT' ? this.parent=GL : this.parent=v, this.parent ? this.parent.children.push( this ) : 0
	}
	function child( v ){this == GL ? GL.children.push( v ) : this.children.push( v )}
	var GL, baseGeoProperty={x:0, y:0, z:0, rotationX:0, rotationY:0, rotationZ:0, scaleX:1, scaleY:1, scaleZ:1, alpha:1, _material:null, renderMode:'TRIANGLES', pointSize:1.0, userData:{}}, msgF2='WEBGL을 지원하지 않는 브라우져입니다'
	bs.GL=GL={
		init:function( $id, $shaderSrc, $end, $fail ){
			bs.js( function(){ document.getElementById( $id ) ? bs.Dom( $id ) : bs.Dom( "<canvas></canvas>" ).S( '<', 'body', 'position', 'absolute', '@id', $id.substr( 1, $id.length-1 ), 'this' ), GL._init( $id, $end, $fail )}, $shaderSrc )
		},
		_init:function( $id, $end, $fail ){
			if( cvs ) return console.log( '중복초기화 방지' );
			cvs=document.getElementById( $id.substr( 1, $id.length-1 ) )
			var keys='webgl,experimental-webgl,webkit-3d,moz-webgl'.split( ',' ), keys2={/*premultipliedAlpha:0,stencil:1,preserveDrawingBuffer:1*/}, i=keys.length
			while( i-- ) if( gl=cvs.getContext( keys[i], keys2 ) ) break
			if( gl ){
				var i, p, t0=[], m=mouseMNG, per=Date, last=0, now, delta, t=GL.debug;
				for( var k in GL._shaderData ) k.charAt( 0 ) != '_' ? t0.push( k ) : 0
				i=t0.length;while( i-- ) mkProgram( GL._shaderData[t0[i]] );
				for( i in Ps ){p=Ps[i];for( k in attrIDX ) p[k]=gl.getAttribLocation( p, k );console.log( '생성 '+p.UUId, p )}
				setBaseBuffers(), gl.clearColor( 0.0, 0.0, 0.0, 1.0 ), GL._eventDiv=bs.Dom( 'body' ),
					GL._eventDiv.S(
						'down',function($e){m.event=$e, checkMouse();if(GL.controller) GL.controller.mouseDowned=1},
						'up',function($e){m.event=$e, checkMouse();if(GL.controller) GL.controller.mouseDowned=0},
						'move',function($e){if(D_mouseCalls > 0) m.event=$e;if(GL.controller)GL.controller._updateDrag($e)}),
					bs.WIN.sizer( function( w, h ){
						perspectMTX=mat4.create(), w=w*1, h=h*1, GL._w=w, GL._h=h, cvs.width=w, cvs.height=h, cvs.style.width="100%", cvs.style.height="100%"
						gl.viewport( 0, 0, w, h ), GL._eventDiv.S( 'width', w, 'height', h ), mkFrameBuffer( 'pre', w, h, 1.0, 1.0 ), mkFrameBuffer( 'mouse', w/15, h/15, 1/15, 1/15 )
					});
				(function tick(){now=per.now(), delta=now-last, t.fps=1000/delta.toFixed( 2 ), t.frame++, t._tfps+=t.fps, t.aFps=t._tfps/t.frame, t.mouseCalls=D_mouseCalls, t.particles=D_par, t.particlesType=D_parType, t.triangles=D_tri, last=now, render(), requestAnimationFrame( tick )})(),
				(function tick(){if( m.checkPoint == m.checkInterval ) drawMouse();if( m.checkPoint == m.checkInterval+2 ) checkMouse();m.checkPoint++, requestAnimationFrame( tick )})(),
				(function tick(){if( GL.controller ) GL.controller.update( perspectMTX );requestAnimationFrame( tick )})();
//			    setInterval(function(){if(GL.controller) GL.controller.update(perspectMTX)},15) // TODO 이건 모바일일 경우 인터벌이 더나아보이긴하네 -_-;; 이유는!?
				$end()
			}
			else console.log( msgF2 ), $fail ? $fail() : 0
		},
		parserOBJ:function($d){ console.log('블렌더obj를 파싱')
			// TODO 파서는 나중에 좀더 파자.............잘몰것다 -_-
			// TODO 다중 재질 어케파싱할건가에 대한 고려필요
			// TODO 애니메이션 어케파싱할건가에 대한 고려...
			var v=[], n=[], c=[], _hi={}, _index=0, _v=[], _n=[], _c=[], _i=[], t0=$d.split('\n'), i=0, j, len, len2,t1;
			len=t0.length
			while(len--){ t1=t0[i],i++
				switch(t1.substr(0,2)){
					case "v ":t1=t1.slice(2).split(" ");len2=t1.length,j=0;while(len2--) v.push(t1[j]),j++;break;
					case "vt":t1=t1.slice(3).split(" ");len2=t1.length,j=0;while(len2--) c.push(t1[j]),j++;break
					case "f ":
						var quad=false;
						t1=t1.slice(2).split(" ");
						for(j=0; j < t1.length; j++){
							if(j === 3 && !quad) j=2, quad=true;
							if(t1[j] in _hi) _i.push(_hi[t1[j]]);
							else{
								var vt=t1[ j ].split('/');
								for(var k=0; k < 3; k++) _v.push(v[(vt[0]-1)*3+k]), _n.push(n[(vt[2]-1)*3+j]);
								_c.push(c[(vt[1]-1)*2+0]), _c.push(c[(vt[1]-1)*2+1]), _hi[t1[j]]=_index, _i.push(_index), _index+=1
							}
							if(j === 3 && quad) _i.push(_hi[t1[0]]);
						};break
				}
			}
			return {vs:_v, vns:_n, cs:_c, is:_i}
		},
		Light:(function(){ //TODO POINT,SPOT
			var t=function(){}, DLight, ALight, PLight, _fn
			_fn=t.prototype, _fn.intensity=1.0, _fn._color='#ffffff', _fn.r=255, _fn.g=255, _fn.b=255, _fn.x=0, _fn.y=0, _fn.z=0, _fn.alpha=1, _fn.S=sMethod.prototype.S, _fn.color=sMethod.prototype['color']
			DLight=function(){}, ALight=function(){}, PLight=function(){this.x=0, this.y=0, this.z=0}, DLight.prototype=ALight.prototype=PLight.prototype=_fn
			return function( k ){ return k == "directional" ? new DLight() : k == "ambient" ? new ALight() : k == "point" ? new PLight() : null}
		})(),
		Material:(function(){
			var t=function(){}, r=bs.rand, t2='uC,uL,uD,uN,useCube,video,text'.split( ',' ), kind, t1, i, k, _fn
			t.prototype.S=sMethod.prototype.S, kind={ Color:{uC:1}, ColorLight:{uC:1, uL:1}, Toon:{uC:1, uL:1}, ToonLight:{uC:1, uL:1}, Bitmap:{uD:1}, BitmapLight:{uL:1, uD:1, uN:1}, Video:{uD:1, video:1}, VideoLight:{uL:1, uD:1, uN:1, video:1}, Environment:{uL:1, useCube:1, uN:1}, Cube:{uL:0, useCube:1}, CubeLight:{uL:1, useCube:1, uN:1}, Sky:{useCube:1}, PointLightTest:{uL:1, useCube:1}}
			kind.Text={}
			for( k in kind ){ // LINEAR_MIPMAP_LINEAR, NEAREST_MIPMAP_LINEAR, LINEAR_MIPMAP_NEAREST, NEAREST_MIPMAP_NEAREST,NEAREST,LINEAR 못외우것음 -_-
				(function(){
					i=t2.length
					while( i-- ) kind[k][t2[i]] ? 0 : (kind[k][t2[i]]=0)
					var pk=k.charAt( 0 ).toLowerCase()+k.substr( 1, k.length-1 ), t6=kind[k], t3=t6['uL'], t4=t6['uN'], t5=t6['video'] ? 1 : (t6['text'] ? 2 : 0)
					if( t6['uC'] ) t6=function(){this._color='#ffffff', this.r=255, this.g=255, this.b=255, this.program=Ps[pk]}, _fn=t6.prototype=new t, _fn['color']=sMethod.prototype['color']
					else if( t6['uD'] ) t6=function(){ this.texture=this.textureNormal=null, this.program=Ps[pk]}, _fn=t6.prototype=new t, _fn['src']=function( src ){ this.texture=makeTexture( src, 'REPEAT', 'LINEAR', 'LINEAR_MIPMAP_NEAREST', t5 )}
					else if( t6['useCube'] ) t6=function(){this.texture=null, this.program=Ps[pk]}, _fn=t6.prototype=new t, _fn['src']=function( src ){ this.texture=makeTexture( src )}
					t4 ? (_fn['normal']=function( src ){ this.textureNormal=makeTexture( src, 'REPEAT', 'LINEAR', 'LINEAR_MIPMAP_NEAREST', 0 )}) : 0,
					t3 ? (_fn.specular=50, _fn.specularColor={r:255, g:255, b:255}) : 0
					kind[k]=t6
				})()
			}
			t1=kind['Sprite']=function(){this.texture=null, this.program=Ps['sprite'], this.col=this.row=0, this._cCol=this._cRow=0, this.useAni=1, this._dirty=0, this._cGap=0, this._gap=16, this._time=1000}, _fn=t1.prototype=new t
			_fn['time']=function( v ){if( !v ) return this._time;else this._time=v*1000, this._gap=this._time/(this.col*this.row)}
			_fn['src']=function( src ){ this.texture=makeTexture( src, 'REPEAT', 'LINEAR', 'LINEAR_MIPMAP_NEAREST', 0 )}
			_fn['stop']=function(){this.useAni=0}, _fn['play']=function(){this.useAni=1}, _fn['gotoAndPlay']=function( f ){this.useAni=1, this._cCol=f%this.col, this._cRow=Math.floor( f/this.row )}
			t1=kind['Text']=function(){
				this.program=Ps['text'], this.texture=gl.createTexture(), this.texture.loaded=0, this.texture.canvas=document.createElement( 'canvas' ), this.texture.context=this.texture.canvas.getContext( "2d" )
				this._lineHeight=35, this.maxWidth=512, this.maxHeight=512,
				this._align='left', this._color='#000000', this._bgColor='#ffff80', this._useBgColor=0, this._size=12, this._drawY=this._size, this._text=' ', this._textBaseline='top', this._fontWeight='', this._font, this._fontStyle='normal'
				this._updateTexture=function( t ){
					gl.pixelStorei( gl.UNPACK_FLIP_Y_WEBGL, true ), gl.bindTexture( gl.TEXTURE_2D, t ), gl.texImage2D( gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, t.canvas ),
					gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR ), gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR ), gl.bindTexture( gl.TEXTURE_2D, null ), t.loaded=1
					// TODO 밉맵생성에 대해서 고민...좀..
				}
			}, _fn=t1.prototype=new t, _fn['_draw']=function(){
				var ctx=this.texture.context, cvs=this.texture.canvas, drawText=this._text, tmp='', tmp2=[], splits=drawText.split( ' ' ), result=[], i=splits.length, j=0, pop
				ctx.clearRect( 0, 0, this.maxWidth, this.maxHeight ), this.texture.loaded=0, cvs.width=this.maxWidth, cvs.height=this.maxHeight, this._useBgColor ? (ctx.rect( 0, 0, this.maxWidth, this.maxHeight ), ctx.fillStyle=this._bgColor, ctx.fill()) : 0,
				ctx.font=this._fontStyle+' '+this._fontWeight+' '+this._size+"px "+this._font, ctx.fillStyle=this._color, ctx.textAlign=this._align, ctx.textBaseline=this._textBaseline
				while( i-- ){ // TODO 줄바꿈 처리를 어디까지 가져갈것인가!
					tmp2.push( splits[j] ), tmp+=splits[j++]
					ctx.measureText( tmp ).width >= this.maxWidth ? (pop=tmp2.pop(), result.push( tmp2.join( '' ) ), tmp2=[pop], tmp=pop) : 0
				}
				result.push( tmp2.join( '' ) ), i=result.length, j=0
				while( i-- ) ctx.fillText( result[j], this._align == 'center' ? this.maxWidth/2 : this._align == 'right' ? this.maxWidth : 0, this._drawY+(j*this._lineHeight) ), j++
				this._updateTexture( this.texture )
			}
			var textFn='text,size,color,align,textBaseline,lineHeight,fontWeight,font,fontStyle,bgColor,useBgColor'.split( ',' ), i=textFn.length
			while(i--) (function(){var k=textFn[i], k2='_'+k;_fn[k]=function(v){if(v!=undefined) this[k2]=v, this._draw(this._text);else return this[k2]}})()
			return function( k ){ return new kind[k.charAt( 0 ).toUpperCase()+k.substr( 1, k.length-1 )]()}
		})(),
		Mesh:(function(){
			var UUID=0, t0={backFace:0, blendMode:0}, evts='mousedown,mouseup,mouseover,mouseout,mousemove'.split( ',' ), i=evts.length
			var Mesh=function( k ){
				this.children=[], this.geoType=k , this.UUId='Mesh'+UUID++, t=setUniqueColor(), t.mesh=this, this._pickColor=t, this.evt={overed:0, num:0};
			}, fn=Mesh.prototype=sMethod.prototype
			for( var t in baseGeoProperty ) fn[t]=baseGeoProperty[t];for( t in t0 ) fn[t]=t0[t]
			while( i-- ) (function(){ // 마우스관련 전면 폐기하고 다시짜야함
				var t=evts[i];fn[t]=function( v ){return this.setEvent( t, v )}
			})();
			fn['id']=function(v){this.id = '#'+v,IDs['#'+v] = v==null ? null : this},
			fn['setEvent']=function( $type, v ){
				if( v ) v == null ? this.evt.num-- : (this.evt[$type]=v, this.evt.num++)
				else return this.evt[$type];
			}, fn['material']=sMethod.prototype.material, fn['<']=parent, fn['>']=child, fn['setRotationByMat4']=function( m ){this.x=m[12], this.y=m[13], this.z=m[14], this.rotationX= -Math.atan2( m[6], m[10] ), this.rotationY=Math.asin( m[2] ), this.rotationZ= -Math.atan2( m[1], m[0] )}
			// TODO fn['filter'], fn['blendMode']
			return function( $k ){ return VBs[$k] ? new Mesh( $k ) : null}
		})(),
		Particle:(function(){ //TODO 이건 다이나믹 타입인데... 향후 비애니타입의 빌보드로 나눠야할듯
			var UUID=0, t0={renderMode:'POINTS', blendMode:0, zSort:0, geoType:'particle'}, Particle=function( k ){
				for( var t in baseGeoProperty ) this[t]=baseGeoProperty[t];for( t in t0 ) this[t]=t0[t]
				this._geoTypeP=k, this.vs=[], this.changeProperty={}, this._propertyBufferData=[], this._particles=[], this.UUID='bsParticle_Instance'+UUID++
				this.addParticle=function(){
					var t={}, v=this.vs, p=this._propertyBufferData, ps=this._particles, cp=this.changeProperty, tsP=cp.sPos, tsS=cp.sScale, tsA=cp.sAlpha, tdP=cp.dPos, tdS=cp.dScale, tdA=cp.dAlpha, r=bs.randf
						t.age=0, t.sP=cp.speedPos, t.sS=cp.speedScale, t.sA=cp.speedAlpha,
						t.dX=r( tdP[0], tdP[1] ), t.dY=r( tdP[2], tdP[3] ), t.dZ=r( tdP[4], tdP[5] ), t.dS=r( tdS[0], tdS[1] ), t.dA=r( tdA[0], tdA[1] ),
						t.x=r( tsP[0], tsP[1] ), t.y=r( tsP[2], tsP[3] ), t.z=r( tsP[4], tsP[5] ), t.scale=r( tsS[0], tsS[1] ), t.alpha=r( tsA[0], tsA[1] ),
						t.addMath=cp.addMath, ps.push( t ), v.concat( [t.x, t.y, t.z] ), p.concat( [t.age, t.alpha, t.scale] ),
						t.gravity=cp.gravity, t.gravityR={x:0, y:0, z:0}
					return t
				}
			}, fn=Particle.prototype, newA=[]
			fn['material']=sMethod.prototype.material,
			fn.update=function(){
				var sP, sA, sS, o, ic, v=this.vs, p=this._propertyBufferData, ps=this._particles, cp=this.changeProperty, t0, t1, perPI=Math.PI/30, k, len=ps.length, i=ps.length
				while( i-- ){
					o=ps[i], sP=o.sP, sA=o.sA, sS=o.sS,
					o.x+=(o.dX-o.x)*sP, o.y+=(o.dY-o.y)*sP, o.z+=(o.dZ-o.z)*sP, o.scale+=(o.dS-o.scale)*sS, o.alpha+=(o.dA-o.alpha)*sA,
					ic=i*3, v[ic]=o.x, v[ic+1]=o.y, v[ic+2]=o.z, p[ic]=o.age++, p[ic+1]=o.alpha, p[ic+2]=o.scale
					if( t0=o.addMath ) for( k in t0 ) t1=t0[k], o[k]+=Math[t1[0]]( perPI*o.age*t1[2] )*t1[1] // while로 변환하는 방향으로 개선하자..
					if( t0=o.gravity ) for( k in t0 ) t1=t0[k], o.gravityR[k]+=t1*.1, o[k]+=o.gravityR[k]
				}
				len < cp.max ? this.addParticle() : (ps.shift(), v.shift(), v.shift(), v.shift(), p.shift(), p.shift(), p.shift()), makeBufferSet( this._geoTypeP, v, newA, newA, p, 3 )
			}
			return fn.S=sMethod.prototype.S, fn['<']=parent, function( _k ){ return new Particle( _k )}
		})(),
		PostEffect:(function(){
			var t0='PostEffect_mono,PostEffect_invert,PostEffect_sepia,PostEffect_bloom'.split( ',' ), R='', t1, t2, i=t0.length
			while( i-- ) t1=t0[i].split( '_' ), t2=t1[1].charAt( 0 ).toUpperCase()+t1[1].substr( 1, t1[1].length-1 ), R+='if(k == "'+t1[1]+'") return new '+new Function( '', "return this.UUId = '"+t1[1]+"', this.uniform = 'u"+t2+"';" )+'();\n'
			return R=new Function( 'k', R ), R.__list=t0, R.use=0, R.fxaa=0, R.anagraphy=0, R.list=[], R;
		})(),
		Controller:(function(){
			var camera=function(){
				var cam={data:{}, fov:55, near:1, far:15000, cameraMTX:mat4.create(), S:sMethod.prototype.S}, t0='x,y,z,rotationX,rotationY,rotationZ'.split( ',' ), i=t0.length
				while( i-- ) (function(){var t=t0[i];cam.data[t]=0, cam[t]=function( v ){if( v ) this.data[t]=v;else return this.data[t]}})()
				cam.perspectiveUpdate=function( $perspectMTX ){ mat4.perspective(cam.fov, GL._w/GL._h, cam.near, cam.far, $perspectMTX);if(!this.enable) return}
				return cam
			}
			var ISO=function(){
				var t=new camera(), t0, t1, dx, dy, d3=new Float32Array( 3 ), mC=Math.cos, mS=Math.sin, PI=Math.PI, rTilt=PI/2, rPan=PI/2, mx=GL.mobile ? 'mx0' : 'mx', my=GL.mobile ? 'my0' : 'my'
				t.distance=500, t.speed=1, t.speedDelay=0.05, t.tilt=PI/2, t.pan=PI/2, t.mouseDowned=0, t.enable=1,
				t._updateDrag=function( $e ){ this.mouseDowned*this.enable ? (dx=$e[mx], dy= -$e[my], this.tilt+=(dx)/GL._w*PI*this.speed, this.pan+=(dy)/GL._h/2*PI*this.speed ) : 0},
				t.update=function( $perspectMTX ){
					this.perspectiveUpdate( $perspectMTX ), t0=this.cameraMTX=mat4.identity( t.cameraMTX ), t1=this.distance
					rPan+=(this.pan-rPan)*this.speedDelay*2, rTilt+=(this.tilt-rTilt)*this.speedDelay // 짐벌락 보정해야됨 - 왜 라디안값이 이따우지-_-
					d3[0]=this.data.x=t1*mS( rPan )*mC( rTilt ), d3[1]=this.data.y=t1*mC( rPan ), d3[2]=this.data.z=t1*mS( rPan )*mS( rTilt ), mat4.translate( t0, t0, d3 ), mat4.lookAt( t0, d3, [0, 0, 0], [0, 1, 0] )
					this.data.rotationX= -Math.atan2( t0[6], t0[10] ), this.data.rotationY=Math.asin( t0[2] ), this.data.rotationZ= -Math.atan2( t0[1], t0[0] )
				}
				return t
			}
			var NONE=function(){
				var t=new camera(), t0, d3=new Float32Array( 3 )
				t.mouseDowned=0, t.enable=1,
				t._updateDrag=function( $e ){},
				t.update=function( $perspectMTX ){
					this.perspectiveUpdate( $perspectMTX ), t0=this.cameraMTX=mat4.identity( this.cameraMTX ), d3[0]=this.data.x, d3[1]=this.data.y, d3[2]=this.data.z,
					mat4.rotateX( t0, t0, this.data.rotationX ), mat4.rotateY( t0, t0, this.data.rotationY ), mat4.rotateZ( t0, t0, this.data.rotationZ ), mat4.translate( t0, t0, d3 )
					this.cameraMTX=t0
				}
				return t
			}
			//var SIMPLE // 프리카메라
			//var WALK // 워킹 액션
			//var AUTOCAM // 3D파일에서 카메라 애니메이션을 추출 마치 비디오처럼!
			return function( $type ){
				if( $type == 'ISO' ) return new ISO();
				else if( $type == 'NONE' ) return new NONE();
				else console.log( '지원하지 않는 타입입니다.' )
			}
		})(),
		S:sMethod.prototype.S,
		SkyBox:function(){ return GL.Mesh( 'box' ).S( 'scaleX', 10000, 'scaleY', 10000, 'scaleZ', 10000, 'geoType', 'box' )},
		makeBufferSet:makeBufferSet, makeTexture:makeTexture,
		skyBox:null, controller:null, directionalLight:null, ambientLight:null, pointLight:null,
		children:[], mobile:mobile, mat4:{},
		debug:{triangles:0, particles:0, particlesType:0, fps:0, aFps:0, _tfps:0, frame:0},
		fog:{use:0, density:1.0, r:255.0, g:255.0, b:255.0},
		getElementByID:function( v ){var t=IDs[v];if( t && t.parent ) return t ? t : 0},
		getElementsByName:function(){console.log( 'TODO' )},
		getElementsByClassName:function(){console.log( 'TODO' )}
	},
	GL['skybox']=function( $t ){GL.skyBox=$t ? {obj:$t} : GL.skyBox=null}, GL['>']=child,
	mat4=GL.mat4,
	mat4.create=function(){var r=new Float32Array(16);return r[0]=1, r[1]=0, r[2]=0, r[3]=0, r[4]=0, r[5]=1, r[6]=0, r[7]=0, r[8]=0, r[9]=0, r[10]=1, r[11]=0, r[12]=0, r[13]=0, r[14]=0, r[15]=1, r},
	mat4.identity=function( t ){return t[0]=1, t[1]=0, t[2]=0, t[3]=0, t[4]=0, t[5]=1, t[6]=0, t[7]=0, t[8]=0, t[9]=0, t[10]=1, t[11]=0, t[12]=0, t[13]=0, t[14]=0, t[15]=1, t},
	mat4.matrixMultiply=function( a, b ) {var a00=a[0 * 4 + 0], a01=a[0 * 4 + 1], a02=a[0 * 4 + 2], a03=a[0 * 4 + 3],a10=a[1 * 4 + 0], a11=a[1 * 4 + 1], a12=a[1 * 4 + 2], a13=a[1 * 4 + 3],a20=a[2 * 4 + 0], a21=a[2 * 4 + 1], a22=a[2 * 4 + 2], a23=a[2 * 4 + 3],a30=a[3 * 4 + 0], a31=a[3 * 4 + 1], a32=a[3 * 4 + 2], a33=a[3 * 4 + 3],b00=b[0 * 4 + 0], b01=b[0 * 4 + 1], b02=b[0 * 4 + 2], b03=b[0 * 4 + 3],b10=b[1 * 4 + 0], b11=b[1 * 4 + 1], b12=b[1 * 4 + 2], b13=b[1 * 4 + 3],b20=b[2 * 4 + 0], b21=b[2 * 4 + 1], b22=b[2 * 4 + 2], b23=b[2 * 4 + 3],b30=b[3 * 4 + 0], b31=b[3 * 4 + 1], b32=b[3 * 4 + 2], b33=b[3 * 4 + 3];return [a00 * b00 + a01 * b10 + a02 * b20 + a03 * b30, a00 * b01 + a01 * b11 + a02 * b21 + a03 * b31, a00 * b02 + a01 * b12 + a02 * b22 + a03 * b32, a00 * b03 + a01 * b13 + a02 * b23 + a03 * b33, a10 * b00 + a11 * b10 + a12 * b20 + a13 * b30, a10 * b01 + a11 * b11 + a12 * b21 + a13 * b31, a10 * b02 + a11 * b12 + a12 * b22 + a13 * b32, a10 * b03 + a11 * b13 + a12 * b23 + a13 * b33, a20 * b00 + a21 * b10 + a22 * b20 + a23 * b30, a20 * b01 + a21 * b11 + a22 * b21 + a23 * b31, a20 * b02 + a21 * b12 + a22 * b22 + a23 * b32, a20 * b03 + a21 * b13 + a22 * b23 + a23 * b33, a30 * b00 + a31 * b10 + a32 * b20 + a33 * b30, a30 * b01 + a31 * b11 + a32 * b21 + a33 * b31, a30 * b02 + a31 * b12 + a32 * b22 + a33 * b32, a30 * b03 + a31 * b13 + a32 * b23 + a33 * b33];},
	mat4.translate = function ( out, a, v ) {var x = v[0], y = v[1], z = v[2], a00, a01, a02, a03, a10, a11, a12, a13, a20, a21, a22, a23;a === out ? (out[12]=a[0]*x+a[4]*y+a[8]*z+a[12], out[13]=a[1]*x+a[5]*y+a[9]*z+a[13], out[14]=a[2]*x+a[6]*y+a[10]*z+a[14], out[15]=a[3]*x+a[7]*y+a[11]*z+a[15]) : (a00=a[0], a01=a[1], a02=a[2], a03=a[3], a10=a[4], a11=a[5], a12=a[6], a13=a[7], a20=a[8], a21=a[9], a22=a[10], a23=a[11], out[0]=a00, out[1]=a01, out[2]=a02, out[3]=a03, out[4]=a10, out[5]=a11, out[6]=a12, out[7]=a13, out[8]=a20, out[9]=a21, out[10]=a22, out[11]=a23, out[12]=a00*x+a10*y+a20*z+a[12], out[13]=a01*x+a11*y+a21*z+a[13], out[14]=a02*x+a12*y+a22*z+a[14], out[15]=a03*x+a13*y+a23*z+a[15]);return out;},
	mat4.clone = function( a ) {	var out = new Float32Array(16);out[0] = a[0],out[1] = a[1],out[2] = a[2],out[3] = a[3],out[4] = a[4],out[5] = a[5],out[6] = a[6],out[7] = a[7],out[8] = a[8],out[9] = a[9],out[10] = a[10],out[11] = a[11],out[12] = a[12],out[13] = a[13],out[14] = a[14],out[15] = a[15];return out},
	mat4.scale = function( out, a, v ) {var x = v[0], y = v[1], z = v[2];out[0] = a[0] * x,out[1] = a[1] * x,out[2] = a[2] * x,out[3] = a[3] * x,out[4] = a[4] * y,out[5] = a[5] * y,out[6] = a[6] * y,out[7] = a[7] * y,out[8] = a[8] * z,out[9] = a[9] * z,out[10] = a[10] * z,out[11] = a[11] * z,out[12] = a[12],out[13] = a[13],out[14] = a[14],out[15] = a[15];return out;},
	mat4.rotateX = function ( out, a, rad ) {var s = Math.sin(rad),c = Math.cos(rad),a10 = a[4],a11 = a[5],a12 = a[6],a13 = a[7],a20 = a[8],a21 = a[9],a22 = a[10],a23 = a[11];if(a !== out) out[0]=a[0], out[1]=a[1], out[2]=a[2], out[3]=a[3], out[12]=a[12], out[13]=a[13], out[14]=a[14], out[15]=a[15];out[4]=a10*c+a20*s, out[5]=a11*c+a21*s, out[6]=a12*c+a22*s, out[7]=a13*c+a23*s, out[8]=a20*c-a10*s, out[9]=a21*c-a11*s, out[10]=a22*c-a12*s, out[11]=a23*c-a13*s;return out}
	mat4.rotateY = function ( out, a, rad ) {var s=Math.sin(rad), c=Math.cos(rad), a00=a[0], a01=a[1], a02=a[2], a03=a[3], a20=a[8], a21=a[9], a22=a[10], a23=a[11];if(a !== out) out[4]=a[4], out[5]=a[5], out[6]=a[6], out[7]=a[7], out[12]=a[12], out[13]=a[13], out[14]=a[14], out[15]=a[15];out[0]=a00*c-a20*s, out[1]=a01*c-a21*s, out[2]=a02*c-a22*s, out[3]=a03*c-a23*s, out[8]=a00*s+a20*c, out[9]=a01*s+a21*c, out[10]=a02*s+a22*c, out[11]=a03*s+a23*c;return out};
	mat4.rotateZ = function ( out, a, rad ) {var s=Math.sin(rad), c=Math.cos(rad), a00=a[0], a01=a[1], a02=a[2], a03=a[3], a10=a[4], a11=a[5], a12=a[6], a13=a[7];if(a !== out) out[8]=a[8], out[9]=a[9], out[10]=a[10], out[11]=a[11], out[12]=a[12], out[13]=a[13], out[14]=a[14], out[15]=a[15];out[0]=a00*c+a10*s, out[1]=a01*c+a11*s, out[2]=a02*c+a12*s, out[3]=a03*c+a13*s, out[4]=a10*c-a00*s, out[5]=a11*c-a01*s, out[6]=a12*c-a02*s, out[7]=a13*c-a03*s;return out;}
	mat4.makeYRotation=function( a ){var c=mC(a), s=mS(a), m=[c,0,-s,0,0,1,0,0,s,0,c,0,0,0,0,1],out = new Float32Array(16);out[0] = m[0],out[1] = m[1],out[2] = m[2],out[3] = m[3],out[4] = m[4],out[5] = m[5],out[6] = m[6],out[7] = m[7],out[8] = m[8],out[9] = m[9],out[10] = m[10],out[11] = m[11],out[12] = m[12],out[13] = m[13],out[14] = m[14],out[15] = m[15];return out},
	mat4.makeXRotation=function( a ){var c=mC(a), s=mS(a), m= [1,0,0,0,0,c,s,0,0,-s,c,0,0,0,0,1],out = new Float32Array(16);out[0] = m[0],out[1] = m[1],out[2] = m[2],out[3] = m[3],out[4] = m[4],out[5] = m[5],out[6] = m[6],out[7] = m[7],out[8] = m[8],out[9] = m[9],out[10] = m[10],out[11] = m[11],out[12] = m[12],out[13] = m[13],out[14] = m[14],out[15] = m[15];return out},
	mat4.makeZRotation=function( a ){var c=mC(a), s=mS(a),m=[c,s,0,0,-s,c,0,0,0,0,1,0,0,0,0,1,],out = new Float32Array(16);out[0] = m[0],out[1] = m[1],out[2] = m[2],out[3] = m[3],out[4] = m[4],out[5] = m[5],out[6] = m[6],out[7] = m[7],out[8] = m[8],out[9] = m[9],out[10] = m[10],out[11] = m[11],out[12] = m[12],out[13] = m[13],out[14] = m[14],out[15] = m[15];return out},
	mat4.lookAt= function ( out, eye, center, up ) {var x0, x1, x2, y0, y1, y2, z0, z1, z2, len,eyex = eye[0],eyey = eye[1],eyez = eye[2],upx = up[0],upy = up[1],upz = up[2],centerx = center[0],centery = center[1],centerz = center[2];if (Math.abs(eyex - centerx) < GLMAT_EPSILON &&Math.abs(eyey - centery) < GLMAT_EPSILON &&Math.abs(eyez - centerz) < GLMAT_EPSILON) {return mat4.identity(out)};z0 = eyex - centerx,z1 = eyey - centery,z2 = eyez - centerz,len = 1 / Math.sqrt(z0 * z0 + z1 * z1 + z2 * z2),z0 *= len,z1 *= len,z2 *= len,x0 = upy * z2 - upz * z1,x1 = upz * z0 - upx * z2,x2 = upx * z1 - upy * z0,len = Math.sqrt(x0 * x0 + x1 * x1 + x2 * x2);if (!len) x0 = 0,x1 = 0,x2 = 0;else len = 1 / len,x0 *= len,x1 *= len,x2 *= len;y0 = z1 * x2 - z2 * x1,y1 = z2 * x0 - z0 * x2,y2 = z0 * x1 - z1 * x0,len = Math.sqrt(y0 * y0 + y1 * y1 + y2 * y2);if (!len)y0 = 0, y1 = 0, y2 = 0;else len = 1 / len, y0 *= len, y1 *= len, y2 *= len;return out[0] = x0, out[1] = y0, out[2] = z0, out[3] = 0, out[4] = x1, out[5] = y1, out[6] = z1, out[7] = 0, out[8] = x2, out[9] = y2, out[10] = z2, out[11] = 0, out[12] = -(x0 * eyex + x1 * eyey + x2 * eyez), out[13] = -(y0 * eyex + y1 * eyey + y2 * eyez), out[14] = -(z0 * eyex + z1 * eyey + z2 * eyez), out[15] = 1,out;},
	mat4.perspective =function ( a, b, c, d, e ) {return a=c * Math.tan(a * Math.PI / 360), b=a * b, mat4.frustum(-b, b, -a, a, c, d, e)},
	mat4.frustum =function ( a, b, c, d, e, g, f ) {var h=b - a, i=d - c, j=g - e;return f||(f=mat4.create()), f[0]=e * 2 / h, f[1]=0, f[2]=0, f[3]=0, f[4]=0, f[5]=e * 2 / i, f[6]=0, f[7]=0, f[8]=(b + a) / h, f[9]=(d + c) / i, f[10]=-(g + e) / j, f[11]= -1, f[12]=0, f[13]=0, f[14]=-(g * e * 2) / j, f[15]=0, f},
	GL.S( 'directionalLight', GL.Light( 'directional' ).S( 'color', '#ffffff', 'alpha', 0.1, 'x', 1, 'y', -1, 'z', -1, 'intensity', 0.8 ), 'ambientLight', GL.Light( 'ambient' ).S( 'color', '#333333' ), 'controller', GL.Controller( 'ISO' ) )
	return GL
})();
exports.GL = GL

