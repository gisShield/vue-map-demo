<template>
    <div class="app-container">
        <div id="map" ref="mapEl" class="map">
        </div>
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
        name: "mapFilter",
        props: ['mapKey'],
        data() {
            return {
                map: null,
            }
        },
        mounted() {
            //底图服务
            let tdt_vec = new TileLayer({
                // className:'filter-class',
                source: new XYZ({
                    crossOrigin:'anonymous',
                    url: "http://t{0-7}.tianditu.com/DataServer?T=vec_w&x={x}&y={y}&l={z}&tk=" + this.mapKey,
                    // tileLoadFunction:this.tileLoadFunction
                })
            })
            // 注记服务
            let tdt_cva = new TileLayer({
                // className:'filter-class',
                source: new XYZ({
                    crossOrigin:'anonymous',
                    url: "http://t{0-7}.tianditu.com/DataServer?T=cva_w&x={x}&y={y}&l={z}&tk=" + this.mapKey,
                    // tileLoadFunction:this.tileLoadFunction
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
                layers: [tdt_vec,tdt_cva]
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
            tileLoadFunction: function (imageTile, src) {
                //第2种方式
                // 获取原始瓦片图片信息
                let img = new Image()
                img.setAttribute('crossOrigin','anonymous')
                img.onload = function () {
                    // 设置canvas画布将图片信息绘制上去
                    let canvas = document.createElement('canvas')
                    let ctx = canvas.getContext('2d')
                    let w = img.width
                    let h = img.height
                    canvas.width = w
                    canvas.height = h
                    // 设置canvas滤镜
                    ctx.filter = "grayscale(98%) invert(100%) sepia(20%) hue-rotate(180deg) saturate(1600%) brightness(80%) contrast(90%)"
                    ctx.drawImage(img, 0, 0)
                    // canvas绘制的图像替换原有图片信息
                    imageTile.getImage().src = canvas.toDataURL('image/png');

                }
                img.src = src

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
