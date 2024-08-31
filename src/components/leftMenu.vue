<template>
    <div class="left-menu-div">
        <h3 style="color: #FFF">示例</h3>
        <el-menu
                :default-active=defaultActive
                class="el-menu-vertical-demo"
                background-color="#545c64"
                text-color="#fff"
                active-text-color="#ffd04b"
                @select="handleSelect"
                @open="handleOpen"
                @close="handleClose">
            <el-submenu index="1">
                <template slot="title">
                    <span>OpenLayers</span>
                </template>
                <el-menu-item index="mapFilter">地图滤镜</el-menu-item>
                <el-menu-item index="exportMap">地图导出</el-menu-item>
            </el-submenu>
        </el-menu>
    </div>
</template>

<script>
    export default {
        props:['changeMenu'],
        data(){
            return{
                defaultActive:'mapFilter'
            }
        },
        methods: {
            handleOpen(key, keyPath) {
                console.log(key, keyPath);
            },
            handleClose(key, keyPath) {
                console.log(key, keyPath);
            },
            handleSelect(key, keyPath){
                console.log(key, keyPath);
                this.changeMenu(key)
            }
        }
    }
</script>

<style scoped>
.left-menu-div{
    width: 200px;
    float: left;
    padding: 0;
    margin: 0;
    background-color: #545c64;
}
    ::v-deep .el-menu{
        border-right: 1px solid #545c64;
    }
</style>
