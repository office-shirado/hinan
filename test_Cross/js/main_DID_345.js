moj_map = "2024";

//ジャンプ（現在地）
function getLocation(getLatLng) {

    map.flyTo({
	center: [getLatLng.coords.longitude, getLatLng.coords.latitude], 
	zoom: 17,
	speed: 1.8,
	curve: 1
    });
};




//ベース地図選択
function SelectMap(){

	var BaseMapName = document.getElementById('basemaps').value;
	var zoomlv = map.getZoom()

	if (map.getLayer('GSI_pale')) { map.removeLayer('GSI_pale') };
	if (map.getLayer('GSI_seamlessphoto')) { map.removeLayer('GSI_seamlessphoto') };
	if (map.getLayer('GSI_gazo1')) { map.removeLayer('GSI_gazo1') };

	if (map.getLayer('MOJ_fude-fill')) { map.removeLayer('MOJ_fude-fill') };
	if (map.getLayer('MOJ_fude-line')) { map.removeLayer('MOJ_fude-line') };



 	// 空中写真切替え 
	if( BaseMapName =="GSI_pale-seamlessphoto") 
	{
		map.addLayer({
	          'id': 'GSI_seamlessphoto',
	          'type': 'raster',
	          'source': 'GSI_seamlessphoto',
	          'minzoom': 16,
	          'maxzoom': 24,
        	    }),
		map.addLayer({
	          'id': 'GSI_pale',
	          'type': 'raster',
	          'source': 'GSI_pale',
	          'minzoom': 0,
	          'maxzoom': 18,
        	    });
		if( zoomlv > 16) {
				map.setPaintProperty('GSI_pale', 'raster-opacity', 0.4);
				}
			else
				{
				map.setPaintProperty('GSI_pale', 'raster-opacity' , 1.0);
				};
	}
	else
	{
		map.addLayer({
	          'id': BaseMapName,
	          'type': 'raster',
	          'source': BaseMapName,
	          'minzoom': 10,
	          'maxzoom': 24,
        	    });
	};

	//オーバーレイヤセット
	set_OverLayers();
};


//法務省地図レイヤ設定
function set_OverLayers() {

	set_Layers_Moj();
	set_Layers_DID();
};


//法務省地図レイヤ設定
function set_Layers_Moj() {

	var zoomlv = map.getZoom();

		//法務省地図【ポリゴン】
	        map.addLayer({
        	          'id': 'MOJ_fude-fill',
                	  'type': 'fill',
	                  'source': 'MOJ_Map',
        	          'source-layer': 'fude',
                	  'paint': {
	                    "fill-color": "#ffff00",
        	            "fill-opacity": 0.2
	                  }
		});
		if( zoomlv > 17) {
				map.setPaintProperty('MOJ_fude-fill', 'fill-opacity', 0);
				}
				else
				{
				map.setPaintProperty('MOJ_fude-fill', 'fill-opacity', 0.2);
				};

		//法務省地図【ライン】
	        map.addLayer({
        	          'id': 'MOJ_fude-line',
                	  'type': 'line',
	                  'source': 'MOJ_Map',
        	          'source-layer': 'fude',
                	  'paint': {
	                    "line-color": "#ff0000",
        	          },
		});
		if( zoomlv > 16) {
				map.setPaintProperty('MOJ_fude-line', 'line-opacity', 1.0);
				}
				else
				{
				map.setPaintProperty('MOJ_fude-line', 'line-opacity', 0.1);
				};
};


// ＤＩＤ（人口集中地区）レイヤ設定
function set_Layers_DID() {

	var zoomlv = map.getZoom();

		// ＤＩＤ【ポリゴン】
	        map.addLayer({
        	          'id': 'DID-fill',
                	  'type': 'fill',
	                  'source': 'DID',
        	          'source-layer': 'did',
                	  'paint': {
	                    "fill-color": "#0000ff",
        	            "fill-opacity": 0.2
	                  }
		});
		if( zoomlv > 14) {
				map.setPaintProperty('DID-fill', 'fill-opacity', 0);
				}
				else
				{
				map.setPaintProperty('DID-fill', 'fill-opacity', 0.2);
				};

		// ＤＩＤ【ライン】
	        map.addLayer({
        	          'id': 'DID-line',
                	  'type': 'line',
	                  'source': 'DID',
        	          'source-layer': 'did',
                	  'paint': {
	                    "line-color": "#0000ff",
        	          },
		});
		if( zoomlv > 14) {
				map.setPaintProperty('DID-line', 'line-width', 3.0);
				}
				else
				{
				map.setPaintProperty('DID-line', 'line-width', 1.0);
				};
};



// マップ設定
    const map = new maplibregl.Map({
	    container: 'map',
	    hash: true,
//	    style: 'https://office-shirado.com/maps/style/style.json',
	style:{
		"version":8,
		"name":"Optimal_GSI_Shirado",
		"glyphs": "https://glyphs.geolonia.com/{fontstack}/{range}.pbf",
		"sprite":"https://gsi-cyberjapan.github.io/optimal_bvmap/sprite/std",
		"sources":{
		},
		"layers":[
		]
	  },
	    center: [139.75417,36.50], // 日本全体
	    zoom: 4, // ズームレベル
	    minZoom: 4,
	    maxZoom: 20,
    });






//#################ロード時アクション#################

// ロードアクション
map.on('load', function () {

	//PMTiles初期設定
	//PMTilesプラグインをMapLibre GL JSに入れる。
	let protocol = new pmtiles.Protocol();
        maplibregl.addProtocol("pmtiles",protocol.tile);

	//office-shirado.com
	let PMTILES_URL01 = "https://office-shirado.com/maps/Moj_Map/MojMap_" + moj_map + ".pmtiles";
	let PMTILES_URL02 = "https://office-shirado.com/open/test/pmtiles/DID.pmtiles";


        const PMTiles01 = new pmtiles.PMTiles(PMTILES_URL01)
        const PMTiles02 = new pmtiles.PMTiles(PMTILES_URL02)


        // this is so we share one instance across the JS code and the map renderer
        protocol.add(PMTiles01);
        protocol.add(PMTiles02);


        // シームレス空中写真
	map.addSource('GSI_seamlessphoto',{
		type: 'raster',
                tiles: [
                    'https://cyberjapandata.gsi.go.jp/xyz/seamlessphoto/{z}/{x}/{y}.jpg',
                ],
                tileSize: 256,
                attribution:"<a href='https://maps.gsi.go.jp/development/ichiran.html' target='_blank'>地理院タイル</a>"
	});

        // 淡色地図
	map.addSource('GSI_pale',{
		type: 'raster',
                tiles: [
                    'https://cyberjapandata.gsi.go.jp/xyz/pale/{z}/{x}/{y}.png',
                ],
                tileSize: 256,
                attribution:"<a href='https://maps.gsi.go.jp/development/ichiran.html' target='_blank'>地理院タイル</a>"
	});

        // 空中写真（1974年～1978年）
	map.addSource('GSI_gazo1',{
		type: 'raster',
                tiles: [
                    'https://cyberjapandata.gsi.go.jp/xyz/gazo1/{z}/{x}/{y}.jpg',
                ],
                tileSize: 256,
                attribution:"<a href='https://maps.gsi.go.jp/development/ichiran.html' target='_blank'>地理院タイル</a>"
	});




        // 法務省地図
	map.addSource('MOJ_Map',{
		type: "vector",
		//office-shirado.comのMaps参照
                url: "pmtiles://" + PMTILES_URL01,
                attribution: '<a href="https://www.moj.go.jp/MINJI/minji05_00494.html" target="_blank">法務省地図</a>'
	});

        // ＤＩＤ（人口集中地区）
	map.addSource('DID',{
		type: "vector",
		//office-shirado.comのMaps参照
                url: "pmtiles://" + PMTILES_URL02,
                attribution: '<a href="https://www.e-stat.go.jp/gis/statmap-search?page=1&type=2&aggregateUnitForBoundary=A&toukeiCode=00200521" target="_blank">e-Stat</a>'
	});




	//ベースマップ、法務省地図読込み（レイヤ設定）
	SelectMap();


	// 現在地取得
	var ZoomLv = map.getZoom();
	//初期ズームレベルの時は、現在地ジャンプ
	if (ZoomLv == 4){
	navigator.geolocation.getCurrentPosition(getLocation);
	}



});

//#################ロード時アクション#################



//#################マップコントロール（画面制御）#################

//ダブルクリックズーム制御（しない）
map.doubleClickZoom.disable();

//ドラッグ回転制御（しない）
map.dragRotate.disable();

//ピッチ回転制御（しない）
//map.pitchWithRotate.disable();

//タッチズーム回転制御（しない）
map.touchZoomRotate.disableRotation();


// マップコントロール（拡大・縮小・方位）
//map.addControl(new maplibregl.NavigationControl(), 'top-left');


//ジオコーダー（国土地理院）
var geocoder_api = {
	forwardGeocode: async (config) => {
		const features = [];

		const Text_Prefix = config.query.substr(0, 3);

		try {
		  let request ='https://msearch.gsi.go.jp/address-search/AddressSearch?q=' +config.query;
			const response = await fetch(request);
			const geojson = await response.json();

		  for (var i = 0; i < geojson.length; i++) {
			if (geojson[i].properties.title.indexOf(Text_Prefix) !== -1){
			  let point = {
				  type: 'Feature',
				  geometry: {
				  type: 'Point',
				  coordinates: geojson[i].geometry.coordinates
			  	  },
			  place_name: geojson[i].properties.title,
			  properties: geojson[i].properties,
			  text: geojson[i].properties.title,
			  place_type: ['place'],
			  center: geojson[i].geometry.coordinates
			  };
			  features.push(point);
			}
		 }
		} catch (e) {
			console.error(`Failed to forwardGeocode with error: ${e}`);
		}

		return {
			features: features
		};
	}
};
map.addControl(new MaplibreGeocoder(geocoder_api, {maplibregl: maplibregl}));



// 現在位置表示
map.addControl(new maplibregl.GeolocateControl({
    positionOptions: {
        enableHighAccuracy: true
    },
    fitBoundsOptions: { maxZoom: 20 },
    trackUserLocation: true,
    showUserLocation: true
    }), 
    'top-right'
);




//#################マップコントロール（画面制御）#################



//#################クリックイベント（法務省地図）#################
//クリック属性表示
map.on('click', 'MOJ_fude-fill', (e) => {
    var chizumei = e.features[0].properties['地図名'];
    var chibankuikiCD = e.features[0].properties['地番区域CD'];
    var chibankuiki = e.features[0].properties['地番区域'];
        chibankuiki = chibankuiki.replace(/_/g, '');
    var chiban = e.features[0].properties['地番'];
    var zahyokei = e.features[0].properties['座標系'];
    var zahyochisyubetu = e.features[0].properties['座標値種別'];
    var sokuchikeihanbetu = e.features[0].properties['測地系判別'];
    var shukusyakubunbo = e.features[0].properties['縮尺分母'];
    var seidokubun = e.features[0].properties['精度区分'];
    var Lng = e.features[0].properties['代表点経度'];
    var Lat = e.features[0].properties['代表点緯度'];


   if( zahyochisyubetu === undefined ) { zahyochisyubetu = "-" };
   if( sokuchikeihanbetu === undefined ) { sokuchikeihanbetu = "-" };
   if( shukusyakubunbo === undefined ) { shukusyakubunbo = "-" };
   if( seidokubun === undefined ) { seidokubun = "-" };

   var Google_LngLat = e.lngLat;
       Google_LngLat.toArray;

  var ZoomLv02 = map.getZoom();

    // ポップアップ
    new maplibregl.Popup()
        .setLngLat(e.lngLat)
        .setHTML(
			'<b>' + '<big>' +chibankuiki + " " + chiban + '</big>' + '</b>' + '<br>' +
			"地番区域：" +  chibankuiki + '<br>' +
			"地　番：" + chiban + '<br>' +
			"地図名：" +  '<small>' + chizumei +  '</small>' + '<br>' +
			"座標系：" + zahyokei + "<small>（" + zahyochisyubetu + "）" + "【" + sokuchikeihanbetu + "】</small>" + '<br>' +
			"縮尺（精度）：1/" + shukusyakubunbo + "（" + seidokubun + "）" + '<br>' +
			"【<a href='https://www.google.co.jp/search?q=" + chibankuiki +  chiban + "' target='_blank'>Google検索</a>】" +
			"【<a href='https://www.google.co.jp/maps?q=" + e.lngLat.lat + "," + e.lngLat.lng + "&hl=ja' target='_blank'>GoogleMap</a>】"
	).addTo(map);

});

//#################クリックイベント（法務省地図）#################






//#################マウスイベント（カーソル制御）#################

//マウスイベント【fude-fill上で動いている場合】
map.on('mousemove', 'MOJ_fude-fill', (e) => {
	if (e.features.length > 0) {map.getCanvas().style.cursor = 'pointer'}	//ポインター
				   else
				   {map.getCanvas().style.cursor = ''};
});



//マウスイベント【ドラッグ】
map.on('drag', function () {
	//グラッビングに変更（つかむ）
	map.getCanvas().style.cursor = 'grabbing';
});


//マウスイベント【ムーブエンド】
map.on('moveend', function () {
	//元に戻す
	map.getCanvas().style.cursor = '';
});


// 右クリックイベント
map.on('contextmenu', function () {
//    alert('無料版ではこの機能は使えません。');
});


//マウスオーバーイベント（法務省地図）＜未実装＞
map.on('mouseover','MOJ_fude-fill', function() {
});


//マウスアウトイベント（法務省地図）
map.on('mouseleave','MOJ_fude-fill', function() {
	//元に戻す
	map.getCanvas().style.cursor = '';

});

//#################マウスイベント（カーソル制御）#################



//#################ズームイベント（透過度）#################

//ズームペイント透過度
map.on('zoom', function() {
	var zoomlv = map.getZoom();
	if( zoomlv > 14) {
			map.setPaintProperty('DID-fill', 'fill-opacity', 0);
			map.setPaintProperty('DID-line', 'line-width', 3.0);
			}
			else
			{
			map.setPaintProperty('DID-fill', 'fill-opacity', 0.2);
			map.setPaintProperty('DID-line', 'line-width', 1.0);
			};

	if( zoomlv > 16) {
			map.setPaintProperty('MOJ_fude-line', 'line-opacity', 1.0);
			map.setPaintProperty('GSI_pale', 'raster-opacity', 0.4);
			}
			else
			{
			map.setPaintProperty('MOJ_fude-line', 'line-opacity', 0.1);
			map.setPaintProperty('GSI_pale', 'raster-opacity' , 1.0);
			};

	if( zoomlv > 17) {
			map.setPaintProperty('MOJ_fude-fill', 'fill-opacity', 0);
			}
			else
			{
			map.setPaintProperty('MOJ_fude-fill', 'fill-opacity', 0.2);
			};
});

//#################ズームイベント（透過度）#################


