<template>
    <div class="left-menu-div">
        <h3 style="color: #FFF">示例</h3>
        <el-menu
                default-active="2"
                class="el-menu-vertical-demo"
                background-color="#545c64"
                text-color="#fff"
                active-text-color="#ffd04b"
                @open="handleOpen"
                @close="handleClose">
            <el-submenu index="1">
                <template slot="title">
                    <span>OpenLayers</span>
                </template>
                <el-menu-item index="1-1">卷帘分析</el-menu-item>
<!--                <el-submenu index="1-4">-->
<!--                    <template slot="title">选项4</template>-->
<!--                    -->
<!--                </el-submenu>-->
            </el-submenu>
        </el-menu>
    </div>
</template>

<script>
    export default {
        methods: {
            handleOpen(key, keyPath) {
                console.log(key, keyPath);
            },
            handleClose(key, keyPath) {
                console.log(key, keyPath);
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
