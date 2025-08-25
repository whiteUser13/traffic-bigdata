<template>
  <div class="all-legend" ref="allUI">
    <div
      class="each-legend"
      :style="'background-color:' + item + ';'"
      v-for="(item, index) in rgbaColors"
      :key="index">
      <span class="val">
        {{ range[index] }}
      </span>
    </div>
  </div>
</template>
<script>
export default {
  components: {},
  props: {
    rgbaColors: {
      type: Array, //类型
      required: true, //是否必填
      default: null,
    },
    colorValues: {
      type: Array, //类型
      required: true, //是否必填
      default: null,
    },
  },
  data() {
    return {
      range: [],
    }
  },
  computed: {},
  watch: {
    rgbaColors(n, o) {
      this.setEachHeight()
    },
    colorValues(n, o) {
      this.setEachHeight()
    },
  },
  created() {},
  mounted() {
    this.setEachHeight()
  },
  methods: {
    /**
     * 图例数据分割
     */
    setEachHeight() {
      if (!this.rgbaColors || !this.colorValues) return
      // this.interval = Math.floor(
      //   (this.endValue - this.startValue + 1) / this.rgbaColors.length
      // )
      // console.log(this.interval)
      let startVal = 1
      for (let i = 0; i < this.rgbaColors.length; i++) {
        // let val = this.startValue + this.interval * i
        this.range.push(startVal + "-" + this.colorValues[i])
        startVal = this.colorValues[i] + 1
      }
      //   if (!this.rgbacolors || !this.values) return
      //   this.interval = Math.ceil(this.values.length / 10)
      this.$refs.allUI.style.setProperty(
        "--eachHeight",
        100 / this.rgbaColors.length + "%"
      )
    },
  },
}
</script>
<style scoped lang="less">
.all-legend {
  z-index: 99;
  width: 10rem;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.5);
  margin: 0 auto;
  .each-legend {
    margin-bottom: 5px;
    height: var(--eachHeight);
    width: 3rem;
    .val {
      display: block;
      margin-left: 3rem;
      text-align: center;
      width: 3rem;
      z-index: 100;
    }
  }
}
</style>
