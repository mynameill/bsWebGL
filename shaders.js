;(function(){
	bs.GL._shaderData={}
	function addShader($obj){bs.GL._shaderData[$obj.UUId]=$obj}
	bs.GL._shaderData._BASE_VERTEX_UNIFORM = ''+
		'uniform mat4 uPerspectMTX;\n'+'uniform mat4 uCameraMTX;\n'+'uniform mat4 uParentMTX;\n'+
		'uniform vec3 uP;\n'+'uniform vec3 uR;\n'+'uniform vec3 uS;\n'+
		'uniform float uAlpha;\n'+
		'uniform float uPointSize;\n'

	bs.GL._shaderData._BASE_FRAGMENT_UNIFORM = 'uniform bool uFog;\n' +'uniform float uFogDensity;\n' +'uniform vec3 uFogColor;\n'
	bs.GL._shaderData._BASE_FRAGMENT_RESULT = ''+
		//Fog
//		'if(uFog){\n'+
//		'   float far = 15000.0;\n'+
//		'   float height = 2000.0;\n'+
//		'   float fog_cord=(gl_FragCoord.z/gl_FragCoord.w)/far;\n'+
////		'   float fog = fog_cord*uFogDensity*((height-gl_FragCoord.y)/height);\n'+
//		'   float fog = fog_cord*uFogDensity;\n'+
//		'   vec4 fog_color = vec4(uFogColor,0.0);\n'+
//		//TODO 높이에 따른 안개 처리도 유니폼화해야할듯
//		'   gl_FragColor = mix(fog_color,src,clamp(1.0-fog,0.0,1.0));\n' +
//		'   gl_FragColor = vec4(gl_FragColor.rgb * alpha, alpha*vAlpha);\n'+
//		'}else{' +
//		'   gl_FragColor = vec4(src.rgb * alpha, alpha*vAlpha);'+
//		'};\n'
		'   gl_FragColor = vec4(src.rgb * alpha, alpha*vAlpha);\n'
	bs.GL._shaderData._MTX_FUNC = ''+
		'\nmat4 rotationMTX(vec3 t)\n'+
		'{\n'+
		'   float s = sin(t[0]);float c = cos(t[0]);\n'+
		'   mat4 m1 = mat4( 1,0,0,0, 0,c,-s,0, 0,s,c,0, 0,0,0,1);s = sin(t[1]);c = cos(t[1]);\n'+
		'   mat4 m2 = mat4(c,0,s,0, 0,1,0,0, -s,0,c,0, 0,0,0,1);s = sin(t[2]);c = cos(t[2]);\n'+
		'   mat4 m3 = mat4(c,-s,0,0, s,c,0,0, 0,0,1,0, 0,0,0,1);\n'+
		'   return m3*m2*m1;\n'+
		'}\n'+
		'mat4 positionMTX(vec3 t){ return mat4(1,0,0,0, 0,1,0,0, 0,0,1,0, t[0], t[1], t[2], 1);}\n'+
		'mat4 scaleMTX(vec3 t){ return mat4(t[0],0,0,0, 0,t[1],0,0, 0,0,t[2],0, 0,0,0, 1); }\n\n'

	bs.GL._shaderData._MAKE_VERTEX=''+
		' mat4 rot = rotationMTX(uR);\n'+' mat4 pos = positionMTX(uP);\n'+' mat4 mv = uParentMTX*pos *rot *  scaleMTX(uS);\n'+
		' vec4 vertex =  mv *vec4(aVer, 1.0);\n'

	bs.GL._shaderData._BASE_VERTEX_LIGHT_CAL=''+
		'// 고라이드 베이직\n'+
		' vec3 LD = normalize(uDLightD);\n'+
		' vec3 N = normalize(vec3(mv *  vec4(aVerN, 0.0) ));\n'+
		' lambertDirection = clamp(dot(N,-LD),0.0,1.0);\n'+
		'// 고라이드 퐁처리\n'+
		' vSpecular=pow( max(lambertDirection,0.0), uSpecular);\n'

	bs.GL._shaderData._FXAA=''+
		'#define FXAA_REDUCE_MIN   (1.0/ 128.0)\n'+
		'#define FXAA_REDUCE_MUL   (1.0 / 8.0)\n'+
		'#define FXAA_SPAN_MAX     8.0\n'+
		'vec4 applyFXAA(vec2 fragCoord, sampler2D tex, vec2 resol)\n'+
		'{\n'+
		'vec4 color;\n'+
		'vec2 inverseVP = vec2(1.0 / resol[0], 1.0 / resol[1]);\n'+
		'vec3 rgbNW = texture2D(tex, (fragCoord + vec2(-1.0, -1.0)) * inverseVP).xyz;\n'+
		'vec3 rgbNE = texture2D(tex, (fragCoord + vec2(1.0, -1.0)) * inverseVP).xyz;\n'+
		'vec3 rgbSW = texture2D(tex, (fragCoord + vec2(-1.0, 1.0)) * inverseVP).xyz;\n'+
		'vec3 rgbSE = texture2D(tex, (fragCoord + vec2(1.0, 1.0)) * inverseVP).xyz;\n'+
		'vec3 rgbM  = texture2D(tex, fragCoord  * inverseVP).xyz;\n'+
		'vec3 luma = vec3(0.299, 0.587, 0.114);\n'+
		'float lumaNW = dot(rgbNW, luma);\n'+
		'float lumaNE = dot(rgbNE, luma);\n'+
		'float lumaSW = dot(rgbSW, luma);\n'+
		'float lumaSE = dot(rgbSE, luma);\n'+
		'float lumaM  = dot(rgbM,  luma);\n'+
		'float lumaMin = min(lumaM, min(min(lumaNW, lumaNE), min(lumaSW, lumaSE)));\n'+
		'float lumaMax = max(lumaM, max(max(lumaNW, lumaNE), max(lumaSW, lumaSE)));\n'+
		'vec2 dir;\n'+
		'dir.x = -((lumaNW + lumaNE) - (lumaSW + lumaSE));\n'+
		'dir.y =  ((lumaNW + lumaSW) - (lumaNE + lumaSE));\n'+
		'float dirReduce = max((lumaNW + lumaNE + lumaSW + lumaSE) *(0.25 * FXAA_REDUCE_MUL), FXAA_REDUCE_MIN);\n'+
		'float rcpDirMin = 1.0 / (min(abs(dir.x), abs(dir.y)) + dirReduce);\n'+
		'dir = min(vec2(FXAA_SPAN_MAX,   FXAA_SPAN_MAX),\n'+
		'max(vec2(-FXAA_SPAN_MAX, -FXAA_SPAN_MAX),dir * rcpDirMin)) * inverseVP;\n'+
		'vec3 rgbA = 0.5 * (\n'+
		'texture2D(tex, fragCoord * inverseVP + dir * (1.0 / 3.0 - 0.5)).xyz +\n'+
		'texture2D(tex, fragCoord * inverseVP + dir * (2.0 / 3.0 - 0.5)).xyz);\n'+
		'vec3 rgbB = rgbA * 0.5 + 0.25 * (\n'+
		'texture2D(tex, fragCoord * inverseVP + dir * -0.5).xyz +\n'+
		'texture2D(tex, fragCoord * inverseVP + dir * 0.5).xyz);\n'+
		'float lumaB = dot(rgbB, luma);\n'+
		'if ((lumaB < lumaMin) || (lumaB > lumaMax)) color = vec4(rgbA, 1.0);\n'+
		'else color = vec4(rgbB, 1.0);\n'+
		'return color;\n'+
		'}\n'+
		'const mat3 sepiaMatrix = mat3(0.3588, 0.7044, 0.1368, 0.2990, 0.5870, 0.1140, 0.2392, 0.4696, 0.0912);\n';

	var color={
		UUId:'color',useLight:0,pid:0,
		attribute:['vec3_aVer'],
		v_uniform:['vec3_uColor'],
		f_uniform:[],
		varying : ['vec4_vColor','float_vAlpha'],
		vFunc:''+
			' gl_PointSize = uPointSize;\n'+
			' vColor = vec4(uColor,1.0);\n'+
			' vAlpha = uAlpha;\n'+
			' gl_Position = uPerspectMTX * uCameraMTX * vertex;',
		fFunc:''+
			'vec4 src = vColor;\n'+
			'float alpha = src.a;\n'
	}
	addShader(color)
	var colorLight={
		UUId:'colorLight',useLight:1,pid:1,
		attribute:['vec3_aVer','vec3_aVerN'],
		v_uniform:['vec3_uColor','vec3_uDLightD','float_uSpecular','mat4_test'],
		f_uniform:['float_uAIntensity','vec4_uDLightColor', 'float_uDIntensity','vec4_uALightColor','vec4_uSpecularColor'],
		varying : ['vec4_vColor','float_vAlpha','float_lambertDirection','float_vSpecular'],
		vFunc:''+
			' gl_PointSize = uPointSize;\n'+
			' vColor = vec4(uColor,1.0);\n'+
			' vAlpha = uAlpha;\n'+
			' gl_Position = uPerspectMTX * uCameraMTX * vertex;\n',
		fFunc:''+
			'vec4 src  = vColor;\n'+
			'float alpha = src.a;\n'+

			' vec4 ia = vec4(0.0, 0.0, 0.0, 0.0);\n'+
			' vec4 id = vec4(0.0, 0.0, 0.0, 0.0);\n'+
			' vec4 is = vec4(0.0, 0.0, 0.0, 0.0);\n'+
			' ia =src*uALightColor*uAIntensity;\n'+
			' id =src*uDLightColor*lambertDirection*uDIntensity;\n'+
			' is =uSpecularColor*vSpecular*lambertDirection*uDIntensity;\n'+
			' src = ia+id+is;\n'
	}
	addShader(colorLight)
	var toon={
		UUId:'toon',useLight:1,pid:2,
		attribute:['vec3_aVer','vec3_aVerN'],
		v_uniform:['vec3_uColor','vec3_uDLightD','float_uSpecular'],
		f_uniform:['vec4_uSpecularColor'],
		varying : ['vec4_vColor','float_vAlpha','float_lambertDirection','float_vSpecular'],
		vFunc:''+
			' gl_PointSize = uPointSize;\n'+
			' vColor = vec4(uColor,1.0);\n'+
			' vAlpha = uAlpha;\n'+
			' gl_Position = uPerspectMTX * uCameraMTX *  vertex;\n',
		fFunc:''+
			'vec4 src  = vColor;\n'+
			'float alpha = src.a;\n'+
			' if(lambertDirection>0.95) src.rgb*=0.95;\n'+
			' else if(lambertDirection>0.6) src.rgb*=0.5;\n'+
			' else if(lambertDirection>0.3) src.rgb*=0.3;\n'+
			' else src.rgb*=0.0;\n'
	}
	addShader(toon)
	var toonLight={
		UUId:'toonLight',useLight:1,pid:3,
		attribute:['vec3_aVer','vec3_aVerN'],
		v_uniform:['vec3_uColor','vec3_uDLightD','float_uSpecular'],
		f_uniform:['float_uAIntensity','vec4_uDLightColor', 'float_uDIntensity','vec4_uALightColor','vec4_uSpecularColor'],
		varying : ['vec4_vColor','float_vAlpha','float_lambertDirection','float_vSpecular'],
		vFunc:''+
			' gl_PointSize = uPointSize;\n'+
			' vColor = vec4(uColor,1.0);\n'+
			' vAlpha = uAlpha;\n'+
			' gl_Position = uPerspectMTX * uCameraMTX *  vertex;\n',
		fFunc:''+
			'vec4 src  = vColor;\n'+
			'float alpha = src.a;\n'+
			' if(lambertDirection>0.95) src.rgb*=0.95;\n'+
			' else if(lambertDirection>0.6) src.rgb*=0.5;\n'+
			' else if(lambertDirection>0.3) src.rgb*=0.3;\n'+
			' else src.rgb*=0.0;\n'+

			' vec4 ia = vec4(0.0, 0.0, 0.0, 0.0);\n'+
			' vec4 id = vec4(0.0, 0.0, 0.0, 0.0);\n'+
			' vec4 is = vec4(0.0, 0.0, 0.0, 0.0);\n'+
			' ia =src*uALightColor*uAIntensity;\n'+
			' id =src*uDLightColor*lambertDirection*uDIntensity;\n'+
			' is =uSpecularColor*vSpecular*lambertDirection*uDIntensity;\n'+
			' src = ia+id+is;\n'
	}
	addShader(toonLight)
	var bitmap={
		UUId:'bitmap',useLight:0,pid:4,
		attribute:['vec3_aVer','vec2_aTexC'],
		v_uniform:[],
		f_uniform:['sampler2D_uSam'],
		varying : ['vec2_vTexC','float_vAlpha'],
		vFunc:''+
			' gl_PointSize = uPointSize;\n'+

			' vTexC = aTexC;\n'+
			' vAlpha = uAlpha;\n'+
			' gl_Position = uPerspectMTX * uCameraMTX * vertex;',
		fFunc:''+
			'vec4 src = texture2D(uSam, vec2(vTexC.s, vTexC.t));\n'+
			' float alpha = src.a;\n'+
			' if(alpha<0.8) discard;\n'
	}
	addShader(bitmap)

	var video={
		UUId:'video',useLight:0,pid:9,
		attribute:['vec3_aVer','vec2_aTexC'],
		v_uniform:[],
		f_uniform:['sampler2D_uSam'],
		varying : ['vec2_vTexC','float_vAlpha'],
		vFunc:''+
			' gl_PointSize = uPointSize;\n'+

			' vTexC = aTexC;\n'+
			' vAlpha = uAlpha;\n'+
			' gl_Position = uPerspectMTX * uCameraMTX * vertex;',
		fFunc:''+
			'vec4 src = texture2D(uSam, vec2(vTexC.s, vTexC.t));\n'+
			'float alpha = src.a;\n'
	}
	addShader(video)
	var videoLight={
		UUId:'videoLight',useLight:1,pid:9,
		attribute:['vec3_aVer','vec3_aVerN','vec2_aTexC'],
		v_uniform:['vec3_uDLightD','float_uSpecular'],
		f_uniform:['sampler2D_uSam','sampler2D_uSamN','float_uAIntensity','vec4_uDLightColor', 'float_uDIntensity','vec4_uALightColor','bool_uUseNormal','vec4_uSpecularColor'],
		varying : ['vec2_vTexC','float_vAlpha','float_lambertDirection','float_vSpecular'],
		vFunc:''+
			' gl_PointSize = uPointSize;\n'+

			' vTexC = aTexC;\n'+
			' vAlpha = uAlpha;\n'+
			' gl_Position = uPerspectMTX * uCameraMTX * vertex;',
		fFunc:''+
			'vec4 src = texture2D(uSam, vec2(vTexC.s, vTexC.t));\n'+
			'float alpha = src.a;\n'+

			' vec4 ia = vec4(0.0, 0.0, 0.0, 1.0);\n'+
			' vec4 id = vec4(0.0, 0.0, 0.0, 1.0);\n'+
			' vec4 is = vec4(0.0, 0.0, 0.0, 1.0);\n'+
			' ia =src*uALightColor*uAIntensity;\n'+
			' id =src*uDLightColor*lambertDirection*uDIntensity;\n'+
			' is =uSpecularColor*vSpecular*lambertDirection*uDIntensity;\n'+

			'if(uUseNormal){\n'+
			'  vec4 normal = texture2D(uSamN, vec2(vTexC.s, vTexC.t));\n'+
			'  src = (ia+id)*0.5+is+(ia*normal.r+id*normal.g+is*normal.b);\n'+
			'}else{\n'+
			'  src = ia+id+is;\n'+
			'}\n'
	}
	addShader(videoLight)

	var bitmapLight={
		UUId:'bitmapLight',useLight:1,pid:5,
		attribute:['vec3_aVer','vec3_aVerN','vec2_aTexC'],
		v_uniform:['vec3_uDLightD','float_uSpecular'],
		f_uniform:['sampler2D_uSam','sampler2D_uSamN','float_uAIntensity','vec4_uDLightColor', 'float_uDIntensity','vec4_uALightColor','bool_uUseNormal','vec4_uSpecularColor'],
		varying : ['vec2_vTexC','float_vAlpha','float_lambertDirection','float_vSpecular'],
		vFunc:''+
			' gl_PointSize = uPointSize;\n'+

			' vTexC = aTexC;\n'+
			' vAlpha = uAlpha;\n'+
			' gl_Position = uPerspectMTX * uCameraMTX * vertex;',
		fFunc:''+
			'vec4 src = texture2D(uSam, vec2(vTexC.s, vTexC.t));\n'+
			'float alpha = src.a;\n'+

			' vec4 ia = vec4(0.0, 0.0, 0.0, 1.0);\n'+
			' vec4 id = vec4(0.0, 0.0, 0.0, 1.0);\n'+
			' vec4 is = vec4(0.0, 0.0, 0.0, 1.0);\n'+
			' ia =src*uALightColor*uAIntensity;\n'+
			' id =src*uDLightColor*lambertDirection*uDIntensity;\n'+
			' is =uSpecularColor*vSpecular*lambertDirection*uDIntensity;\n'+

			'if(uUseNormal){\n'+
			'  vec4 normal = texture2D(uSamN, vec2(vTexC.s, vTexC.t));\n'+
			'  src = (ia+id)*0.5+is+(ia*normal.r+id*normal.g+is*normal.b);\n'+

			'}else{\n'+
			'  src = ia+id+is;\n'+
			'}\n'+

			' if(alpha<0.1) discard;\n'
	}
	addShader(bitmapLight)


	var sprite={
		UUId:'sprite',useLight:0,pid:6,
		attribute:['vec3_aVer','vec2_aTexC'],
		v_uniform:[],
		f_uniform:['sampler2D_uSam','float_uCol','float_uRow','float_uPerCol','float_uPerRow'],
		varying : ['vec2_vTexC','float_vAlpha'],
		vFunc:''+
			' gl_PointSize = uPointSize;\n'+

			' vTexC = aTexC;\n'+
			' vAlpha = uAlpha;\n'+
			' gl_Position = uPerspectMTX * uCameraMTX * vertex;',
		fFunc:''+
			'vec4 src = texture2D(uSam, vec2(vTexC.s*uPerCol+uCol, vTexC.t*uPerRow+uRow));\n'+
			'float alpha = src.a;\n'+
			' if(alpha<0.1) discard;\n'
	}
	addShader(sprite)


	var pointLightTest={
		UUId:'pointLightTest',useLight:1,pid:8,
		attribute:['vec3_aVer','vec3_aVerN'],
		v_uniform:['vec3_uDLightD','float_uSpecular','vec3_uPLightPos'],
		f_uniform:['samplerCube_uSamC','float_uAIntensity','vec4_uDLightColor', 'float_uDIntensity','vec4_uALightColor','vec4_uSpecularColor'],
		varying : ['vec3_vCubeCoord','float_vAlpha','float_lambertDirection','float_vSpecular','float_vSpecularPoint','float_lambertPoint','float_uPointLightDistance'],
		vFunc:''+
			' gl_PointSize = uPointSize;\n'+
			' vec4 cubeNormal =  mv *vec4(-aVerN, 0.0);\n'+
			' vCubeCoord = cubeNormal.xyz;\n'+
			' vAlpha = uAlpha;\n'+
			' gl_Position = uPerspectMTX * uCameraMTX * vertex;\n'+

			' vec4 PL = uPerspectMTX * vec4(-uPLightPos,1.0);\n'+
			' vec4 position = uPerspectMTX * vertex;\n'+
			' vec3 PLD = normalize(PL.xyz-vertex.xyz);\n'+
//			' PLD = reflect(PLD,vec3(0.0,0.0,0.0));\n'+
			' N = normalize(vec3(mv *  vec4(aVer, 0.0)));\n'+
			' lambertPoint =clamp(dot(N,PLD),0.0,1.0);\n'+
			' vSpecularPoint=pow( max(lambertPoint,0.0), uSpecular);\n'+

			' float d = length(PL);\n'+
			' uPointLightDistance = 1.0/(.01+.01*d+0.2*d*d);\n',
		fFunc:''+
			'vec4 src = textureCube(uSamC, vCubeCoord);\n'+
			'float alpha = src.a;\n'+

			' vec4 ia = vec4(0.0, 0.0, 0.0, 1.0);\n'+
			' vec4 id = vec4(0.0, 0.0, 0.0, 1.0);\n'+
			' vec4 is = vec4(0.0, 0.0, 0.0, 1.0);\n'+
			' ia =src*uALightColor*uAIntensity;\n'+
			' id =src*uDLightColor*lambertDirection*uDIntensity;\n'+
			' is =uSpecularColor*vSpecular*lambertDirection*uDIntensity;\n'+
			' src = ia+id+is;\n'+

			' id =vec4(0.0, 3.0, 0.0, 0.0);\n'+

			' ia =uALightColor*(1.0-lambertPoint);\n'+
			' id =src*id*lambertPoint;\n'+
			' is =uSpecularColor*vSpecularPoint*lambertPoint;\n'+
			' src = src+ia+id+is;\n'
	}
	addShader(pointLightTest)

	var cube={
		UUId:'cube',useLight:0,pid:8,
		attribute:['vec3_aVer','vec3_aVerN'],
		v_uniform:[],
		f_uniform:['samplerCube_uSamC'],
		varying : ['vec3_vCubeCoord','float_vAlpha'],
		vFunc:''+
			' gl_PointSize = uPointSize;\n'+
			' vec4 cubeNormal =  normalize(vec4(-aVer, 0.0));\n'+
			' vCubeCoord = cubeNormal.xyz;\n'+
			' vAlpha = uAlpha;\n'+
			' gl_Position = uPerspectMTX * uCameraMTX * vertex;\n',
		fFunc:''+
			'vec4 src = textureCube(uSamC, vCubeCoord);\n'+
			'float alpha = src.a;\n'
	}
	addShader(cube)

	var cubeLight={
		UUId:'cubeLight',useLight:1,pid:81,
		attribute:['vec3_aVer','vec3_aVerN'],
		v_uniform:['vec3_uDLightD','float_uSpecular'],
		f_uniform:['samplerCube_uSamC','samplerCube_uSamN','float_uAIntensity','vec4_uDLightColor','bool_uUseNormal', 'float_uDIntensity','vec4_uALightColor','vec4_uSpecularColor'],
		varying : ['vec3_vCubeCoord','float_vAlpha','float_lambertDirection','float_vSpecular'],
		vFunc:''+
			' gl_PointSize = uPointSize;\n'+
			' vec4 cubeNormal =  normalize(vec4(-aVer, 0.0));\n'+
			' vCubeCoord = cubeNormal.xyz;\n'+
			' vAlpha = uAlpha;\n'+
			' gl_Position = uPerspectMTX * uCameraMTX * vertex;\n',
		fFunc:''+
			'vec4 src = textureCube(uSamC, vCubeCoord);\n'+
			'float alpha = src.a;\n'+
			' vec4 ia = vec4(0.0, 0.0, 0.0, 0.0);\n'+
			' vec4 id = vec4(0.0, 0.0, 0.0, 0.0);\n'+
			' vec4 is = vec4(0.0, 0.0, 0.0, 0.0);\n'+
			' ia =src*uALightColor*uAIntensity;\n'+
			' id =src*uDLightColor*lambertDirection*uDIntensity;\n'+
			' is =uSpecularColor*vSpecular*lambertDirection*uDIntensity;\n'+
			'if(uUseNormal){\n'+
			'  vec4 normal = textureCube(uSamN, vCubeCoord);\n'+
			'  src = (ia+id)*0.5+is+(ia*normal.r+id*normal.g+is*normal.b);\n'+
			'}else{\n'+
			'  src = ia+id+is;\n'+
			'}\n'
	}
	addShader(cubeLight)

	var environment={
		UUId:'environment',useLight:1,pid:81,
		attribute:['vec3_aVer','vec3_aVerN'],
		v_uniform:['vec3_uDLightD','float_uSpecular'],
		f_uniform:['samplerCube_uSamC','samplerCube_uSamN','float_uAIntensity','vec4_uDLightColor', 'bool_uUseNormal','float_uDIntensity','vec4_uALightColor','vec4_uSpecularColor'],
		varying : ['vec3_vCubeCoord','vec3_vCubeCoord2','float_vAlpha','float_lambertDirection','float_vSpecular'],
		vFunc:''+
			' gl_PointSize = uPointSize;\n'+
			' vec4 cubeNormal =  mv *vec4(-aVerN, 0.0);\n'+
			' vCubeCoord = cubeNormal.xyz;\n'+
			' vec4 cubeNormal2 =  normalize(vec4(-aVer, 1.0));\n'+
			' vCubeCoord2 = cubeNormal2.xyz;\n'+
			' vAlpha = uAlpha;\n'+
			' gl_Position = uPerspectMTX * uCameraMTX * vertex;\n',
		fFunc:''+
			'vec4 src = textureCube(uSamC, vCubeCoord);\n'+
			'float alpha = src.a;\n'+

			' vec4 ia = vec4(0.0, 0.0, 0.0, 1.0);\n'+
			' vec4 id = vec4(0.0, 0.0, 0.0, 1.0);\n'+
			' vec4 is = vec4(0.0, 0.0, 0.0, 1.0);\n'+
			' ia =src*uALightColor*uAIntensity;\n'+
			' id =src*uDLightColor*lambertDirection*uDIntensity;\n'+
			' is =uSpecularColor*vSpecular*lambertDirection*uDIntensity;\n'+
			'if(uUseNormal){\n'+
			'  vec4 normal = textureCube(uSamN, vCubeCoord2);\n'+
			'  src = (ia+id)*0.5+is+(ia*normal.r+id*normal.g+is*normal.b);\n'+
			'}else{\n'+
			'  src = ia+id+is;\n'+
			'}\n'
	}
	addShader(environment)

	var text={
		UUId:'text',useLight:0,pid:10,
		attribute:['vec3_aVer','vec2_aTexC'],
		v_uniform:[],
		f_uniform:['sampler2D_uSam'],
		varying : ['vec2_vTexC','float_vAlpha'],
		vFunc:''+
			' gl_PointSize = uPointSize;\n'+
			' vTexC = aTexC;\n'+
			' vAlpha = uAlpha;\n'+
			' gl_Position = uPerspectMTX * uCameraMTX * vertex;',
		fFunc:''+
			'vec4 src = texture2D(uSam, vec2(vTexC.s, vTexC.t));\n'+
			' float alpha = src.a;\n'+
			' if(alpha<0.1) discard;'
	}
	addShader(text)

	var sky={
		UUId:'sky',useLight:0,pid:100,
		attribute:['vec3_aVer'],
		v_uniform:['vec3_uDLightD','float_uSpecular'],
		f_uniform:['samplerCube_uSamC'],
		varying : ['vec3_vCubeCoord','float_vAlpha','float_lambertDirection'],
		vFunc:''+
			' gl_PointSize = uPointSize;\n'+
			'vec4 cubeNormal =  mv *vec4(-aVer, 0.0);\n'+
			' vCubeCoord = cubeNormal.xyz;\n'+
			' vAlpha = uAlpha;\n'+
			' gl_Position = uPerspectMTX * uCameraMTX * vertex;\n',
		fFunc:''+
			'vec4 src = textureCube(uSamC, vCubeCoord);\n'+
			'float alpha = src.a;\n'

	}
	addShader(sky)

	var particle={
		UUId:'particle',useLight:0,pid:200,
		attribute:['vec3_aVer','float_aPage','float_aPalpha','float_aPscale'],
		v_uniform:[],
		f_uniform:['sampler2D_uSam'],
		varying : ['float_vAlpha'],
		vFunc:''+
			' gl_PointSize = aPscale*uPointSize/( length( vertex.xyz )/500.0 );\n'+
			' float age = aPage;\n'+
			' vAlpha = uAlpha*aPalpha;\n'+
			' gl_Position = uPerspectMTX * uCameraMTX * vertex;\n',
		fFunc:''+
			' vec4 src = texture2D(uSam, gl_PointCoord);\n'+
			' float alpha = src.a;\n'
	}
	addShader(particle)

	var last={
		UUId:'last',useLight:0,pid:1000,
		attribute:['vec3_aVer','vec2_aTexC'],
		v_uniform:[],
		f_uniform:['sampler2D_uSam','vec2_uResolution','int_uFXAA','int_uMono','int_uSepia','int_uInvert','int_uBloom','int_uAnaglyph'],
		varying : ['vec2_vTexC','float_vAlpha'],
		vFunc:''+
			' gl_PointSize = uPointSize;\n'+

			' vTexC = aTexC;\n'+
			' vAlpha = uAlpha;\n'+
			' gl_Position = uPerspectMTX * uCameraMTX * vertex;',
		fFunc:''+
			' if(uFXAA ==1) gl_FragColor =applyFXAA(gl_FragCoord.xy,uSam,uResolution);\n'+
			' else  gl_FragColor = texture2D(uSam, vec2(vTexC.s, vTexC.t));\n'+
			' gl_FragColor.a *= vAlpha;\n'+

			// 블룸
			' if(uBloom==1){\n'+
			'float blurSizeX = 1.0/(uResolution[0]/2.0);\n'+
			'float blurSizeY = 1.0/(uResolution[1]/2.0);\n'+
			'float intensity = 0.5;\n'+
			'vec4 sum = vec4(0);;\n'+
			' vec2 tCoord = gl_FragCoord.xy/uResolution.xy;;\n'+
			' int j;;\n'+
			' int i;;\n'+
			' sum += texture2D(uSam, vec2(tCoord.x - 4.0*blurSizeX, tCoord.y)) * 0.05;;\n'+
			' sum += texture2D(uSam, vec2(tCoord.x - 3.0*blurSizeX, tCoord.y)) * 0.09;;\n'+
			' sum += texture2D(uSam, vec2(tCoord.x - 2.0*blurSizeX, tCoord.y)) * 0.12;;\n'+
			' sum += texture2D(uSam, vec2(tCoord.x - blurSizeX, tCoord.y)) * 0.15;;\n'+
			' sum += texture2D(uSam, vec2(tCoord.x, tCoord.y)) * 0.16;;\n'+
			' sum += texture2D(uSam, vec2(tCoord.x + blurSizeX, tCoord.y)) * 0.15;;\n'+
			' sum += texture2D(uSam, vec2(tCoord.x + 2.0*blurSizeX, tCoord.y)) * 0.12;;\n'+
			' sum += texture2D(uSam, vec2(tCoord.x + 3.0*blurSizeX, tCoord.y)) * 0.09;;\n'+
			' sum += texture2D(uSam, vec2(tCoord.x + 4.0*blurSizeX, tCoord.y)) * 0.05;;\n'+

			' sum += texture2D(uSam, vec2(tCoord.x, tCoord.y - 4.0*blurSizeY)) * 0.05;;\n'+
			' sum += texture2D(uSam, vec2(tCoord.x, tCoord.y - 3.0*blurSizeY)) * 0.09;;\n'+
			' sum += texture2D(uSam, vec2(tCoord.x, tCoord.y - 2.0*blurSizeY)) * 0.12;;\n'+
			' sum += texture2D(uSam, vec2(tCoord.x, tCoord.y - blurSizeY)) * 0.15;;\n'+
			' sum += texture2D(uSam, vec2(tCoord.x, tCoord.y)) * 0.16;;\n'+
			' sum += texture2D(uSam, vec2(tCoord.x, tCoord.y + blurSizeY)) * 0.15;;\n'+
			' sum += texture2D(uSam, vec2(tCoord.x, tCoord.y + 2.0*blurSizeY)) * 0.12;;\n'+
			' sum += texture2D(uSam, vec2(tCoord.x, tCoord.y + 3.0*blurSizeY)) * 0.09;;\n'+
			' sum += texture2D(uSam, vec2(tCoord.x, tCoord.y + 4.0*blurSizeY)) * 0.05;;\n'+

			' gl_FragColor = sum*intensity + gl_FragColor;\n'+
			'};\n'+


			' //후처리 테스트;\n'+
			' if(uMono==1) gl_FragColor.rgb = mix(gl_FragColor.rgb, vec3(0.2126*gl_FragColor.r + 0.7152*gl_FragColor.g + 0.0722*gl_FragColor.b), 1.0);\n'+
			' if(uSepia==1) gl_FragColor.rgb = mix( gl_FragColor.rgb, gl_FragColor.rgb * sepiaMatrix, 1.0);\n'+
			' if(uInvert==1) gl_FragColor.rgb = mix( (vec3(1)-gl_FragColor.rgb) * gl_FragColor.a, gl_FragColor.rgb, 1.0 - 1.0);\n'+

			//TODO 적청 / 적블 / 또 뭐있지 -_-;;
			' if(uAnaglyph==1) {\n'+
			' vec4 test1 = texture2D(uSam, vec2(vTexC.s+0.0080, vTexC.t));\n'+
			' vec4 test2 = texture2D(uSam, vec2(vTexC.s-0.0080, vTexC.t));\n'+
			' gl_FragColor = vec4( test1.g * 0.7 + test1.b * 0.3, test2.g, test2.b, test1.a + test2.a ) * 1.1;\n'+
			' }\n'

	}
	addShader(last)

})();