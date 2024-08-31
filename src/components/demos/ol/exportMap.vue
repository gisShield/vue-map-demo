<template>
    <div class="app-container">
        <el-row class="row-class">
            <el-button @click="exportImage">导出</el-button>
        </el-row>
        <div id="map" ref="mapEl" class="map">
        </div>
        <a id="image-download" download="map.png"></a>
    </div>
</template>

<script>
    import 'ol/ol.css'
    import Map from 'ol/Map'
    import View from 'ol/View'
    import TileLayer from "ol/layer/Tile";
    import VectorLayer from "ol/layer/Vector";
    import VectorSource from "ol/source/Vector";
    import Feature from "ol/Feature";
    import Point from "ol/geom/Point";
    import Style from "ol/style/Style";
    import Icon from "ol/style/Icon";
    import XYZ from "ol/source/XYZ";

    export default {
        name: "exportMap",
        props: ['mapKey'],
        data() {
            return {
                map: null
            }
        },
        mounted() {
            //底图服务
            let tdt_vec = new TileLayer({
                className: 'filter-class',
                source: new XYZ({
                    crossOrigin: 'anonymous',
                    url: "http://t{0-7}.tianditu.com/DataServer?T=vec_w&x={x}&y={y}&l={z}&tk=" + this.mapKey,
                })
            })
            // 注记服务
            let tdt_cva = new TileLayer({
                className: 'filter-class',
                source: new XYZ({
                    crossOrigin: 'anonymous',
                    url: "http://t{0-7}.tianditu.com/DataServer?T=cva_w&x={x}&y={y}&l={z}&tk=" + this.mapKey,
                })
            })
            this.map = new Map({
                target: 'map',
                view: new View({
                    projection: 'EPSG:4326',
                    center: [103.23, 35.33],
                    zoom: 12,
                    maxZoom: 18
                }),
                layers: [tdt_vec, tdt_cva]
            })
            //添加一个矢量地图，用于标注中心点
            let vlayer = new VectorLayer({
                source: new VectorSource({
                    features: [new Feature({
                        geometry: new Point([103.23, 35.33]),
                    })]
                }),
                style: [new Style({
                    image: new Icon({
                        src: 'https://openlayers.org/en/latest/examples/data/icon.png',
                        crossOrigin: 'anonymous',
                    })
                })]
            })
            this.map.addLayer(vlayer)
        },
        methods: {
            exportImage() {
                let that = this
                that.map.once('rendercomplete', function () {
                    //绘制非filter滤镜的图层（最终画布）
                    const mapCanvas = document.createElement('canvas');
                    //绘制滤镜图层（滤镜画布）
                    const mapCanvas2 = document.createElement('canvas');
                    const size = that.map.getSize();
                    mapCanvas.width = size[0];
                    mapCanvas.height = size[1];
                    mapCanvas2.width = size[0];
                    mapCanvas2.height = size[1];
                    const mapContext = mapCanvas.getContext('2d');
                    const mapContext2 = mapCanvas2.getContext('2d');
                    //遍历需要导出的图层  .filter-class canvas 是加了滤镜的图层
                    //.wms canvas 是WMS的图层（如果添加了WMS服务的图层就要加上）
                    Array.prototype.forEach.call(
                        that.map.getViewport().querySelectorAll('.ol-layer canvas,.filter-class canvas, .wms canvas, canvas.ol-layer'),
                        function (canvas) {
                            if (canvas.width > 0) {
                                //透明度
                                const opacity =
                                    canvas.parentNode.style.opacity || canvas.style.opacity;
                                mapContext.globalAlpha = opacity === '' ? 1 : Number(opacity);
                                //背景色
                                const backgroundColor = canvas.parentNode.style.backgroundColor;
                                if (backgroundColor) {
                                    mapContext.fillStyle = backgroundColor;
                                    mapContext.fillRect(0, 0, canvas.width, canvas.height);
                                }
                                // 矩阵变换
                                let matrix;
                                const transform = canvas.style.transform;
                                if (transform) {
                                    // Get the transform parameters from the style's transform matrix
                                    matrix = transform
                                        .match(/^matrix\(([^\\(]*)\)$/)[1]
                                        .split(',')
                                        .map(Number);
                                } else {
                                    matrix = [
                                        parseFloat(canvas.style.width) / canvas.width,
                                        0,
                                        0,
                                        parseFloat(canvas.style.height) / canvas.height,
                                        0,
                                        0,
                                    ];
                                }
                                // Apply the transform to the export map context
                                CanvasRenderingContext2D.prototype.setTransform.apply(
                                    mapContext,
                                    matrix
                                );
                                // 判断当前遍历到的canvas是否是加滤镜的图层
                                if (canvas.parentNode.className && canvas.parentNode.className.indexOf('filter-class') >= 0) {
                                    // 获取 filter-class 中设置的 filter 样式
                                    mapContext2.filter = window.getComputedStyle(canvas.parentNode).filter;
                                    // 先把当前画布绘制到临时的滤镜画布内
                                    mapContext2.drawImage(canvas, 0, 0);
                                    // 再把滤镜画布绘制到总画布上
                                    mapContext.drawImage(mapCanvas2, 0, 0);
                                } else {
                                    mapContext.drawImage(canvas, 0, 0);
                                }
                            }
                        }
                    );
                    mapContext.globalAlpha = 1;
                    // 执行导出
                    if (navigator.msSaveBlob) {
                        // link download attribute does not work on MS browsers
                        navigator.msSaveBlob(mapCanvas.msToBlob(), 'map.png');
                    } else {
                        const link = document.getElementById('image-download');
                        link.href = mapCanvas.toDataURL();
                        link.click();
                    }
                });
                that.map.renderSync();
            }
        }
    }
</script>

<style scoped>
    .row-class {
        height: 50px;
        position: absolute;
        z-index: 100;
        margin: 20px;
        right: 10px;
    }

    .map {
        height: calc(100vh - 20px);
        width: 100%;
        position: relative;
    }

    .app-container {
        height: calc(100vh - 20px);
        margin-top: 10px;
    }

    ::v-deep .filter-class {
        filter: grayscale(98%) invert(100%) sepia(20%) hue-rotate(180deg) saturate(1600%) brightness(80%) contrast(90%);
    }
</style>
