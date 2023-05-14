<template>
  <div id="app">
    <leftMenu class="left-div"></leftMenu>
    <comment :is="newWinType" class="right-div"/>
  </div>
</template>

<script>
import leftMenu from "@/components/leftMenu";
import dbAnalysis from "@/components/demos/ol/dbAnalysis";

export default {
  name: 'App',
  components: {
    leftMenu,
    dbAnalysis
  },
  data(){
    return{
      newWinType:'dbAnalysis'
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
