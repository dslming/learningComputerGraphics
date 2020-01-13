<template>
  <div id="app-box">
    <div id="viewMain" tabindex="1"></div>
  </div>
</template>

<script>
import App from "./App";
export default {
  components: {},
  data() {
    return {};
  },
  methods: {},
  created() {},
  mounted() {
    App.init("#viewMain");
  }
};
</script>
<style>
html,
body,
#app-box,
#viewMain {
  padding: 0;
  margin: 0;
  width: 100%;
  height: 100%;
  position: relative;
}
</style>
