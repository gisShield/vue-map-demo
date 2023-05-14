<template>
    <div class="app-container">
        <el-row class="row-class">
            <el-col :span="12">
                左侧图层：<el-select v-model="checkedOne" placeholder="请选择" @change="selectChangeForOne">
                    <el-option
                            v-for="item in layers"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                    </el-option>
                </el-select>
            </el-col>
            <el-col :span="12">
                右侧图层：<el-select v-model="checkedTwo" placeholder="请选择" @change="selectChangeForTwo">
                    <el-option
                            v-for="item in layers"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                    </el-option>
                </el-select>

            </el-col>
        </el-row>
        <div id="switch-map" ref="mapEl" class="map">
            <div id="swipeContainer" ref="sliderEl" :style="{left:left+'px'}" class="slider" @mousedown="onMouseDown">
                <div id="swipeDiv" @mousedown="onMouseDown">
                    <div class="handle" />
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import 'ol/ol.css'
    import Map from 'ol/Map'
    import View from 'ol/View'
    import TileLayer from 'ol/layer/Tile.js';
    import OSM from "ol/source/OSM";
    import XYZ from "ol/source/XYZ";
    export default {
        data() {
            return {
                layers:[{
                    value: 'osm',
                    label: 'OSM'
                }, {
                    value: 'tdt',
                    label: '天地图矢量'
                }, {
                    value: 'tdt_img',
                    label: '天地图影像'
                }, {
                    value: 'tdt_ter',
                    label: '天地图地形'
                }],
                map: null,
                leftLayer: null,
                rightLayer: null,
                mapWidth: 0,
                minClientLeft: 0,
                maxClientLeft: 0,
                left: 0,
                clientleft: 0,
                checkedOne: 'tdt',
                checkedTwo: 'tdt_img',
                isMove: false,
            }
        },

        created() {
        },
        mounted() {
            // 初始化地图
            this.mapInit()
            let vue =this
            // 初始化设置左右两边的图层
            vue.leftLayer = this.createLayer(this.checkedOne)
            vue.rightLayer =  this.createLayer(this.checkedTwo)
            vue.map.setLayers([this.leftLayer, this.rightLayer])
            this.$nextTick(() => {
                // 拖动事件注册在 doucment 上面，防止拖拽过程中鼠标丢失情况
                document.addEventListener('mousemove', this.onMouseMove)
                document.addEventListener('mouseup', this.onMouseUp)
                // 注册图层
                vue.setSwitch()
            })
        },
        beforeDestroy() {
            // 销毁dom绑定的事件
            document.removeEventListener('mousemove', this.onMouseMove)
            document.removeEventListener('mouseup', this.onMouseUp)
        },
        methods: {
            selectChangeForOne(data) {
                //设置当前地图展示的图层
                if (!this.leftLayer) {
                    this.leftLayer = this.createLayer(data)
                } else {
                    this.leftLayer = this.createLayer(data)
                    this.map.setLayers([this.leftLayer, this.rightLayer])
                    this.setSwitch()
                }
            },
            selectChangeForTwo(data) {
                //设置当前地图展示的图层
                if (!this.rightLayer) {
                    this.rightLayer = this.createLayer(data)
                } else {
                    this.rightLayer = this.createLayer(data)
                    this.map.setLayers([this.leftLayer, this.rightLayer])
                    this.setSwitch()
                }
            },
            /**
             * 切换或者刚初始化图层，对图层进行事件绑定
             */
            setSwitch() {
                //给图层绑定事件用于实现卷帘的效果
                if (this.rightLayer) {
                    this.rightLayer.on('prerender', (e) => {
                        const ctx = e.context
                        // 获取要裁切的宽度
                        const width = ctx.canvas.width * (this.left / this.mapWidth)
                        ctx.save()
                        ctx.beginPath()
                        ctx.rect(width, 0, ctx.canvas.width - width, ctx.canvas.height)
                        ctx.clip()// 裁剪
                    })
                    // 请求完成，渲染
                    this.rightLayer.on('postrender', function(e) {
                        const ctx = e.context
                        ctx.restore()
                    })
                }
            },
            mapInit() {
                // 初始化时，卷帘处在地图中间位置，根据地图宽高计算
                this.mapWidth = this.$refs.mapEl.offsetWidth
                this.left = this.mapWidth / 2
                // 保证卷帘始终在地图内，并两边留一部分 这里22和45根据自己的样式来设置 不是定值
                this.minClientLeft = this.$refs.mapEl.offsetLeft + 22
                this.maxClientLeft = this.minClientLeft + this.mapWidth - 45

                this.map = new Map({
                    target: 'switch-map',
                    view: new View({
                        projection: 'EPSG:4326',
                        center: [103.23, 35.33],
                        zoom: 12,
                        maxZoom: 18
                    })
                })
            },
            onMouseDown(e) {
                this.isMove = true
                this.clientleft = e.clientX
                this.$refs.sliderEl.style.cursor = 'move'
            },
            onMouseMove(e) {
                if (!this.isMove) return
                if (e.clientX < this.minClientLeft || e.clientX > this.maxClientLeft) return

                const mx = e.clientX - this.clientleft
                this.clientleft = e.clientX

                this.left = this.left + mx
                this.map.render()
            },
            onMouseUp() {
                this.isMove = false
                this.$refs.sliderEl.style.cursor = 'default'
            },
            /**
             * 根据传入参数不同，初始化不同类型的数据源图层
             * @param data
             * @returns {null}
             */
            createLayer(data){
                let layer = null
                if(data === 'osm'){
                    layer = new TileLayer({
                        source: new OSM()
                    });
                }else if(data === 'tdt'){
                    layer = new TileLayer({
                        source: new XYZ({
                            url:'https://t1.tianditu.com/DataServer?T=vec_w&x={x}&y={y}&l={z}&tk=key'//天地图矢量
                        })
                    })
                }else if(data === 'tdt_img'){
                    layer = new TileLayer({
                        source: new XYZ({
                            url:'https://t1.tianditu.com/DataServer?T=img_w&x={x}&y={y}&l={z}&tk=key'//天地图影像
                        })
                    })
                }else if(data === 'tdt_ter'){
                    layer = new TileLayer({
                        source: new XYZ({
                            url:'https://t1.tianditu.com/DataServer?T=ter_w&x={x}&y={y}&l={z}&tk=key'//天地图影像
                        })
                    })
                }
                return layer
            }
        }
    }

</script>

<style scoped>

    .row-class {
        height: 50px;
    }
    .map {
        height: calc(100vh - 20px);
        width: 100%;
        position: relative;
    }

    #swipeContainer {
        position: absolute;
        opacity: 0.8;
        width: 0.625rem;
        height: calc(100vh - 20px);
        top: 0;
        left: 50%;
        background-color: #BBDEFB;
        cursor: col-resize;
        z-index: 2;
    }

    #swipeContainer:hover {
        opacity: 0.5;
    }

    #swipeDiv {
        border: solid 0.5px #ffffff;
        height: calc(100vh - 20px);
        width: 0px;
        margin: 0 auto;
    }

    #swipeDiv .handle {
        width: 51px;
        height: 24px;
        margin-top: -12px;
        margin-left: -20px;
        top: 50%;
        left: 0;
        position: absolute;
        z-index: 30;
        font-family: 'SimHei';
        speak: none;
        font-size: 12px;
        font-style: normal;
        font-weight: normal;
        font-variant: normal;
        text-transform: none;
        text-indent: 0;
        line-height: 1;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        background-color: #3a8ee68f;
        color: white;
    }

    *,
    *:before,
    *:after {
        -moz-box-sizing: border-box;
        -webkit-box-sizing: border-box;
        box-sizing: border-box;
    }

    .handle:before {
        content: "";
        width: 12px;
        height: 12px;
        border: solid #fff;
        border-width: 2px 0 0 2px;
        transform: translate(-50%, -50%) rotate(-45deg);
        float: left;
        margin-top: 13px;
        margin-left: 10px;
    }
    .handle:after {
        content: "";
        width: 12px;
        height: 12px;
        border: solid #fff;
        border-width: 0 2px 2px 0;
        transform: translate(-50%, -50%) rotate(-45deg);
        float: right;
        margin-top: 13px;
     }
    .app-container{
        height: calc(100vh - 20px);
        margin-top: 10px;
    }
</style>
