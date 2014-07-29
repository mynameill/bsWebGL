var meshInfoWindow;
(function(){

    var meshInfo=bs.Dom(bs.Dom('.meshInfo')[0])
    var fps=bs.Dom('.fps')
    var filter=bs.Dom('.filter')
    var ambient=bs.Dom('.ambient')
    var directional=bs.Dom('.directional')
    var skyboxs=bs.Dom('.skybox')
    var materials=bs.Dom('.material')
    var controllers=bs.Dom('.controller')
    var geometrys=bs.Dom('.geometry')
    var renderScales=bs.Dom('.renderScale')
    meshInfoWindow=function($target){
        bs.Dom('#info_renderMode').S(null), bs.Dom('#info_material').S(null)
        var str='<div style="background:#888888;color:#000;padding:5px;margin-bottom:5px;border-radius:10px">UUId : '+$target.S('UUId')+'</div>'
        for(var k in $target){
            if(typeof($target[k]) == 'function'){
            }
            else if(k == 'renderMode') str+="<li ><b style='color:#fff'>"+k+"</b> : "+'<select id="info_renderMode"></select>'+"</li>"
            else if(k == 'material') str+="<li ><b style='color:#fff'>"+k+"</b> : "+'<select id="info_material"></select>'+"</li>"
            else if(k.charAt(0) != '_'){
                str+="<li><b style='color:#fff'>"+k+"</b> : "+$target.S(k)+"</li>"
            }
        }
        meshInfo.S('html',str)
        var t=$target;
        // selected
        (function(){
            var modes=['TRIANGLES','LINES','POINTS']
            var cMode=t.S('renderMode'), idx
            if(cMode == 'TRIANGLES') idx=0
            else if(cMode == 'LINES') idx=1
            else if(cMode == 'POINTS') idx=2
            var str='<option '+(idx == 0 ? 'selected' : '')+'>TRIANGLES</option>'+'<option '+(idx == 1 ? 'selected' : '')+'>LINES</option>'+'<option '+(idx == 2 ? 'selected' : '')+'>POINTES</option>'
            bs.Dom('#info_renderMode').S('html',str,'change',function(){
                    t.S('renderMode',modes[this.selectedIndex])
                })
        })();
        (function(){
            var m1, m2, m3, m4
            m1=bs.GL.Material('bitmap').S('src','assets/t1.jpg')
            m2=bs.GL.Material('bitmapLight').S('src','assets/t3.jpg')
            m3=bs.GL.Material('bitmapLight').S('src','assets/t3.jpg','normal','assets/normal/normal3.png')
            m4=bs.GL.Material('environment').S('src',[
                "assets/environ/right.jpg","assets/environ/left.jpg","assets/environ/bottom.jpg","assets/environ/top.jpg","assets/environ/front.jpg","assets/environ/back.jpg"
            ])
            var modes=[bs.GL.Material('color'),bs.GL.Material('colorLight'),bs.GL.Material('toon'),bs.GL.Material('toonLight'),m1,m2,m4]
            var check={colorPGM:0,colorLPGM:1,toonPGM:2,toonLPGM:3,bitmapPGM:4,bitmapLPGM:5,envPGM:6}
            var idx=check[t.S('material').S('program').UUId.toString()]
            var str='<option '+(idx == 0 ? 'selected' : '')+'>color</option>'+'<option '+(idx == 1 ? 'selected' : '')+'>colorLight</option>'+'<option '+(idx == 2 ? 'selected' : '')+'>toon</option>'+'<option '+(idx == 3 ? 'selected' : '')+'>toonLight</option>'+'<option '+(idx == 4 ? 'selected' : '')+'>bitmap</option>'+'<option '+(idx == 5 ? 'selected' : '')+'>bitmapLight</option>'+'<option '+(idx == 6 ? 'selected' : '')+'>environment</option>'
            bs.Dom('#info_material').S('html',str,'change',function(){
                    t.S('material',modes[this.selectedIndex])
                })
        })();
    }
    function addCommas(nStr){
        nStr+='';
        var x=nStr.split('.');
        var x1=x[0];
        var x2=x.length > 1 ? '.'+x[1] : '';
        var rgx=/(\d+)(\d{3})/;
        while(rgx.test(x1)){
            x1=x1.replace(rgx,'$1'+','+'$2');
        }
        return x1+x2;
    }

    fps.S('width','100%')
    bs.ANI.ani({
        ANI:function(){
            fps.S('html','aFps : '+bs.GL.debug.aFps.toFixed(0)+' / frame : '+bs.GL.debug.frame+' / fps : '+bs.GL.debug.fps.toFixed(2)+'<br>drawCall : '+addCommas(bs.GL.children.length+(bs.GL.skyBox ? 1 : 0))+'<br> triangles : '+addCommas(bs.GL.debug.triangles)+'<br>particles : '+addCommas(bs.GL.debug.particles)+' / particlesType : '+addCommas(bs.GL.debug.particlesType)+'<br>mouseDrawCall : '+addCommas(bs.GL.debug.mouseCalls))
        }
    })
    bs.Dom(filter[0]).S('down',function(){
        if(this.checked){
            bs.GL.PostEffect.use=0
        }
        else{
            bs.GL.PostEffect.use=1
        }
        var adaptList='adapted List'
        for(var i=0; i < bs.GL.PostEffect.list.length; i++) adaptList+=('<ol>'+bs.GL.PostEffect.list[i].UUId+'</ol>')
        bs.Dom(filter[7]).S('html',adaptList)
    },'this')
    bs.Dom(filter[1]).S('down',function(){
        if(this.checked){
            var list=bs.GL.PostEffect.list
            var nList=[], check
            for(var i=0; i < list.length; i++){
                check=list[i]
                if(check.UUId != 'mono') nList.push(check)
            }
            bs.GL.PostEffect.list=nList
        }
        else bs.GL.PostEffect.list.push(bs.GL.PostEffect('mono'))
        var adaptList='adapted List'
        for(var i=0; i < bs.GL.PostEffect.list.length; i++) adaptList+=('<ol>'+bs.GL.PostEffect.list[i].UUId+'</ol>')
        bs.Dom(filter[7]).S('html',adaptList)
    },'this')
    bs.Dom(filter[2]).S('down',function(){
        if(this.checked){
            var list=bs.GL.PostEffect.list
            var nList=[], check
            for(var i=0; i < list.length; i++){
                check=list[i]
                if(check.UUId != 'sepia') nList.push(check)
            }
            bs.GL.PostEffect.list=nList
        }
        else bs.GL.PostEffect.list.push(bs.GL.PostEffect('sepia'))
        var adaptList='adapted List'
        for(var i=0; i < bs.GL.PostEffect.list.length; i++) adaptList+=('<ol>'+bs.GL.PostEffect.list[i].UUId+'</ol>')
        bs.Dom(filter[7]).S('html',adaptList)
    },'this')
    bs.Dom(filter[3]).S('down',function(){
        if(this.checked){
            var list=bs.GL.PostEffect.list
            var nList=[], check
            for(var i=0; i < list.length; i++){
                check=list[i]
                if(check.UUId != 'invert') nList.push(check)
            }
            bs.GL.PostEffect.list=nList
        }
        else bs.GL.PostEffect.list.push(bs.GL.PostEffect('invert'))
        var adaptList='adapted List'
        for(var i=0; i < bs.GL.PostEffect.list.length; i++) adaptList+=('<ol>'+bs.GL.PostEffect.list[i].UUId+'</ol>')
        bs.Dom(filter[7]).S('html',adaptList)
    },'this')
    bs.Dom(filter[4]).S('down',function(){
        if(this.checked){
            var list=bs.GL.PostEffect.list
            var nList=[], check
            for(var i=0; i < list.length; i++){
                check=list[i]
                if(check.UUId != 'bloom') nList.push(check)
            }
            bs.GL.PostEffect.list=nList
        }
        else bs.GL.PostEffect.list.push(bs.GL.PostEffect('bloom'))
        var adaptList='adapted List'
        for(var i=0; i < bs.GL.PostEffect.list.length; i++) adaptList+=('<ol>'+bs.GL.PostEffect.list[i].UUId+'</ol>')
        bs.Dom(filter[7]).S('html',adaptList)
    },'this')
    bs.Dom(filter[5]).S('down',function(){
        if(this.checked){
            bs.GL.PostEffect.fxaa=0
        }
        else{
            bs.GL.PostEffect.fxaa=1
        }
    },'this')
    bs.Dom(filter[6]).S('down',function(){
        if(this.checked){
            bs.GL.PostEffect.anagraphy=0
        }
        else{
            bs.GL.PostEffect.anagraphy=1
        }
    },'this')

	bs.Dom(ambient[3]).S('@step',0.01)
    for(var i=0, len=ambient.length; i < len; i++){
        bs.Dom(ambient[i]).S('@value',bs.GL.ambientLight[ambient[i].UUId],'input',function(){
                bs.GL.ambientLight[this.UUId]=this.value
                bs.GL.controller.enable=0
            },'change',function(){
                bs.GL.controller.enable=1
            })
    }
	bs.Dom(directional[3]).S('@step',0.01)
	for(var i=0, len=directional.length; i < len; i++){
		bs.Dom(directional[i]).S('@value',bs.GL.directionalLight[directional[i].UUId],'input',function(){
			bs.GL.directionalLight[this.UUId]=this.value
			bs.GL.controller.enable=0
		},'change',function(){
			bs.GL.controller.enable=1
		})
	}


    var map0=bs.GL.Material('sky').S('src',[
        "assets/cubeMap2/grimnight_posX.png","assets/cubeMap2/grimnight_negX.png","assets/cubeMap2/grimnight_negY.png","assets/cubeMap2/grimnight_posY.png","assets/cubeMap2/grimnight_posZ.png","assets/cubeMap2/grimnight_negZ.png"
    ])
    var map1=bs.GL.Material('sky').S('src',[
        "assets/environ/right.jpg","assets/environ/left.jpg","assets/environ/bottom.jpg","assets/environ/top.jpg","assets/environ/front.jpg","assets/environ/back.jpg"
    ])
    var map2=bs.GL.Material('sky').S('src',[
        "assets/cubeMap/snow_positive_x.jpg","assets/cubeMap/snow_negative_x.jpg","assets/cubeMap/snow_negative_y.jpg","assets/cubeMap/snow_positive_y.jpg","assets/cubeMap/snow_positive_z.jpg","assets/cubeMap/snow_negative_z.jpg"
    ])
    var maps=[map0,map1,map2]
    var skybox=bs.GL.SkyBox().S('material',map0)
    var skySelectIDX=0
    bs.GL.S('skybox',skybox)
    var skyCheck=bs.Dom(skyboxs[0]).S('down',function(){
        if(this.checked){
            bs.GL.S('skybox',null)
            skyboxs[1].disabled=skyboxs[2].disabled=1
        }
        else{
            bs.GL.S('skybox',skybox)
            skyboxs[1].disabled=skyboxs[2].disabled=0
        }
    },'this')
    bs.Dom(skyboxs[1]).S('change',function(){
            skySelectIDX=this.selectedIndex
            if(skyCheck.S('@checked')) skybox.S('material',maps[skySelectIDX])
        })
    bs.Dom(skyboxs[2]).S('@value',skybox.S('scaleX')*2,'input',function(){
            skybox.S('scaleX',this.value/2,'scaleY',this.value/2,'scaleZ',this.value/2)
            bs.GL.controller.enable=0
        },'change',function(){
            bs.GL.controller.enable=1
        });
    (function(){
        var m1, m2, m3, m4,m5, BGL=bs.GL
        m1=BGL.Material('bitmap').S('src','assets/t1.jpg')
        m2=BGL.Material('bitmapLight').S('src','assets/t3.jpg')
        m3=BGL.Material('bitmapLight').S('src','assets/t3.jpg','normal','assets/normal/normal3.png')
        m4=BGL.Material('environment').S('src',[
            "assets/environ/right.jpg","assets/environ/left.jpg","assets/environ/bottom.jpg","assets/environ/top.jpg","assets/environ/front.jpg","assets/environ/back.jpg"
        ])
	    m5=BGL.Material('cube').S('src',[
		    "assets/environ/right.jpg","assets/environ/left.jpg","assets/environ/bottom.jpg","assets/environ/top.jpg","assets/environ/front.jpg","assets/environ/back.jpg"
	    ])
        var maps=[BGL.Material('color'),BGL.Material('colorLight'),BGL.Material('toon'),BGL.Material('toonLight'),m1,m2,m3,m4,m5]
        bs.Dom(materials[0]).S('change',function(){
                console.log(this.selectedIndex)
                var list=BGL.children
                var m=maps[this.selectedIndex-1]
                if(this.selectedIndex == 0){
                    for(var i=0, len=list.length; i < len; i++){
                        if(list[i].geoType != 'particle') list[i].S('material',maps[bs.rand(0,maps.length-1)])
                    }
                }
                else{
                    for(var i=0, len=list.length; i < len; i++){
                        if(list[i].geoType != 'particle')  list[i].S('material',m)
                    }
                }
            })
    })();


    (function(){
        var geos=['rect','tri','sphere','cube','teapot'], BGL=bs.GL
        bs.Dom(geometrys[0]).S('change',function(){
                console.log(this.selectedIndex)
                var list=BGL.children
                var geo=geos[this.selectedIndex-1], s=1
                if(geo != 'teapot') s=10
                if(this.selectedIndex == 0){
                    for(var i=0, len=list.length; i < len; i++){
                        geo=geos[bs.rand(0,geos.length-1)]
                        if(geo != 'teapot') s=10
                        else s=1
                        if(list[i].geoType != 'particle') list[i].S('geoType',geo,'scaleX',s,'scaleY',s,'scaleZ',s)
                    }
                }
                else{
                    for(var i=0, len=list.length; i < len; i++){
                        if(list[i].geoType != 'particle')  list[i].S('geoType',geo,'scaleX',s,'scaleY',s,'scaleZ',s)
                    }
                }
            })
    })();
    for(var i=0, len=controllers.length; i < len; i++){
        bs.Dom(controllers[i]).S('@value',bs.GL.controller[controllers[i].UUId],'input',function(){
                console.log(this.value)
                bs.GL.controller[this.UUId]= +this.value
                bs.GL.controller.enable=0
            },'change',function(){
                bs.GL.controller.enable=1
            })
    }
})();

