<template>
  <div>
    <canvas :id="graphId"></canvas>
  </div>
</template>

<script>
import Chart from "chart.js/auto";
import _ from "lodash";

export default {
  name: "NormalDistribution",
  data: () => ({
    spareRandom: null,
    weeks: [],
    normalDRandVal: [],
    graph: null,
    classicDist: [],
  }),
  computed: {
    graphId() {
      return `order-chart-${_.uniqueId()}`;
    }
  },
  mounted() {
      this.drawGraph();
  },
  methods: {
    normalRandom() {
      var val, u, v, s, mul;

      if (this.spareRandom !== null) {
        val = this.spareRandom;
        this.spareRandom = null;
      } else {
        do {
          u = Math.random() * 2 - 1;
          v = Math.random() * 2 - 1;

          s = u * u + v * v;
        } while (s === 0 || s >= 1);

        mul = Math.sqrt((-2 * Math.log(s)) / s);

        val = u * mul;
        this.spareRandom = v * mul;
      }

      return val;
    },
    normalRandomScaled(mean, stddev) {
      var r = this.normalRandom();

      r = r * stddev + mean;

      return Math.round(r);
    },
    generateNumbers() {
      const maxWeeks = 10;

      for (let i = 0; i < maxWeeks; i++) {
        this.weeks.push(i + 1);
        this.normalDRandVal.push(this.normalRandomScaled(6, 2));
        if (i > 3) {
          this.classicDist.push(8);
        } else {
           this.classicDist.push(4);
        }
      }
    },
    async drawGraph() {
      this.generateNumbers();

      const ctx = document.getElementById(this.graphId);

      if (this.graph) {
        this.graph.destroy();
      }

      this.graph = await new Chart(ctx, {
        type: "line",
        data: {
          labels: this.weeks,
          datasets: [
            {
              label: "Normála sadalíjuma gadijuma skaitli",
              data: this.normalDRandVal,
              borderColor: "#add8e6",
              borderWidth: 3
            }
          ]
        },
        options: {
          responsive: true,
          fill: false,
          scales: {
            y: {
              suggestedMin: 0
            }
          }
        }
      });
    }
  }
};
</script>

<style></style>
