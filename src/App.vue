<template>
  <div id="app">
    <leftMenu class="left-div" :changeMenu="changeMenu"></leftMenu>
    <component :is="newWinType" class="right-div" :mapKey="mapKey"/>
  </div>
</template>

<script>
import leftMenu from "@/components/leftMenu";
import dbAnalysis from "@/components/demos/ol/dbAnalysis";
import exportMap from "@/components/demos/ol/exportMap";
import mapFilter from "@/components/demos/ol/mapFilter";

export default {
  name: 'App',
  components: {
    leftMenu,
    dbAnalysis,
    exportMap,
    mapFilter
  },
  data(){
    return{
      newWinType:"mapFilter",
      mapKey:''
    }
  },
  methods:{
    changeMenu(name){
      this.newWinType = name
    }
  }

}
</script>

<style>
  body{
    margin: 0;
    padding: 0;
  }
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
  .right-div{
    width: calc(100vw - 240px);
    height: 100vh;
    margin-left: 210px;
  }
  .left-div{
    height: 100vh;
  }
</style>
