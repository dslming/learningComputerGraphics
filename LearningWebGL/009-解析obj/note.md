作者: DSLMing
时间: 2019.10.18

> 参考
> FunWithWebGL2 011-Parsing.OBJ

### 解析.OBJ文件
今天，我们将学习如何使用Blender生成OBJ文件，以及如何使用javascript将数据解析为WebGL可以呈现的内容。 我们将首先解析一个多维数据集，然后再尝试一个动漫风格的海盗女孩模型。

#### ObjLoader源码
```js
class ObjLoader{
	static domToMesh(meshName,elmID,flipYUV){
		var d = ObjLoader.parseFromDom(elmID,flipYUV);
		return gl.fCreateMeshVAO(meshName,d[0],d[1],d[2],d[3],3);
	}

	static parseFromDom(elmID,flipYUV){ return ObjLoader.parseObjText(document.getElementById(elmID).innerHTML,flipYUV); }

	static parseObjText(txt,flipYUV){
		txt = txt.trim() + "\n"; //add newline to be able to access last line in the for loop

    // Line text from obj file,文本的每一行
    let line
    //Line split into an array,一行被分割的若干元素由数组表示
    let item
    // Itm split into an array, used for faced decoding,将其拆分为数组，用于面对式解码
		let	ary
		let i
    // 用于计算缓存数组的索引
    let ind
    // 确定人脸是否为四边形
		let	isQuad = false
    // Cache Dictionary key = itm array element, val = final index of the vertice
    // 高速缓存字典键= itm数组元素，val =顶点的最终索引
    let aCache = []
    // 从obj读取的缓存顶点数组
		let	cVert = []
    // 从obj读取的缓存法线数组
		let	cNorm = []
    // Cache UV array
		let cUV = []
    // 最终索引排序顶点数组
		let fVert = []
    // 最终的法线数组
		let	fNorm = []
    // Final Index Sorted UV array
		let fUV = []
    // Final Sorted index array
		let fIndex = []
    // Final count of unique vertices
		let	fIndexCnt = 0
		let posA = 0
		let posB = txt.indexOf("\n",0);

		while(posB > posA){
			line = txt.substring(posA,posB).trim();
			switch(line.charAt(0)){
				//......................................................
				// Cache Vertex Data for Index processing when going through face data
				// Sample Data (x,y,z)
				// v -1.000000 1.000000 1.000000
				// vt 0.000000 0.666667
				// vn 0.000000 0.000000 -1.000000
				case "v":
					itm = line.split(" "); itm.shift();
					switch(line.charAt(1)){
						case " ": cVert.push(parseFloat(itm[0]) , parseFloat(itm[1]) , parseFloat(itm[2]) ); break;		//VERTEX
						case "t": cUV.push( parseFloat(itm[0]) , parseFloat(itm[1]) );	break;							//UV
						case "n": cNorm.push( parseFloat(itm[0]) , parseFloat(itm[1]) , parseFloat(itm[2]) ); break;	//NORMAL
					}
				break;

				//......................................................
				// Process face data
				// 所有索引值都从1开始，但是javascript数组索引从0开始。因此需要始终从索引中减去1来进行匹配
				// Sample Data [Vertex Index, UV Index, Normal Index], Each line is a triangle or quad.
				// 样品数据[顶点索引, 纹理索引, 法线信息],每条线是三角形或四边形。
				// f 1/1/1 2/2/1 3/3/1 4/4/1
				// f 34/41/36 34/41/35 34/41/36
				// f 34//36 34//35 34//36
				case "f":
					itm = line.split(" ");
					itm.shift();
					isQuad = false;

					for(i=0; i < itm.length; i++){
						//--------------------------------
						//In the event the face is a quad
						if(i == 3 && !isQuad){
							i = 2; //Last vertex in the first triangle is the start of the 2nd triangle in a quad.
							isQuad = true;
						}

						//--------------------------------
						//Has this vertex data been processed?
						if(itm[i] in aCache){
							fIndex.push( aCache[itm[i]] ); //it has, add its index to the list.
						}else{
							//New Unique vertex data, Process it.
							ary = itm[i].split("/");

							//Parse Vertex Data and save final version ordred correctly by index
							ind = (parseInt(ary[0])-1) * 3;
							fVert.push( cVert[ind] , cVert[ind+1] , cVert[ind+2] );

							//Parse Normal Data and save final version ordered correctly by index
							ind = (parseInt(ary[2])-1) * 3;
							fNorm.push( cNorm[ind] , cNorm[ind+1] , cNorm[ind+2] );

							//Parse Texture Data if available and save final version ordered correctly by index
							if(ary[1] != ""){
								ind = (parseInt(ary[1])-1) * 2;
								fUV.push( cUV[ind] ,
									(!flipYUV)? cUV[ind+1] : 1-cUV[ind+1]
								);
							}

							//Cache the vertex item value and its new index.
							//The idea is to create an index for each unique set of vertex data base on the face data
							//So when the same item is found, just add the index value without duplicating vertex,normal and texture.
							aCache[ itm[i] ] = fIndexCnt;
							fIndex.push(fIndexCnt);
							fIndexCnt++;
						}

						//--------------------------------
						//In a quad, the last vertex of the second triangle is the first vertex in the first triangle.
						if(i == 3 && isQuad) fIndex.push( aCache[itm[0]] );
					}
				break;
			}

			//Get Ready to parse the next line of the obj data.
			posA = posB+1;
			posB = txt.indexOf("\n",posA);
		}
		return [fIndex,fVert,fNorm,fUV];
	}
}//cls
```


