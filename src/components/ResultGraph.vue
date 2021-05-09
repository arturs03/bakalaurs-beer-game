<template>
    <div>
        <canvas :id="graphId"></canvas>
    </div>
</template>

<script>
import Chart from "chart.js/auto";
import _ from "lodash";

export default {
    name: "ResultGraph",
    props: {
        chartData: {
            type: Object,
            required: true,
        },
        statType: {
            type: String,
            default: 'incomingOrders'
        }
    },
    data: () => ({
        graph: null,
    }),
    computed: {
        graphId() {
            return `order-chart-${_.uniqueId()}`;
        }
    },
    mounted() {
        this.drawGraph(this.chartData);
    },
    methods: {
        async drawGraph(copyData = []) {
            const data = JSON.parse(JSON.stringify(copyData));
            const ctx = document.getElementById(this.graphId);

            const labels = data.retailer.stats[this.statType]?.map((d, i) => ++i);

            this.graph = await new Chart(ctx, {
                type: "line",
                data: {
                    labels: labels,
                    datasets: [
                        {
                            label: data.retailer.title,
                            data: data.retailer.stats[this.statType],
                            borderColor: "rgba(54,73,93,.5)",
                            borderWidth: 3,
                        },
                        {
                            label: data.wholesaler.title,
                            data: data.wholesaler.stats[this.statType],
                            borderColor: "rgba(71, 183,132,.5",
                            borderWidth: 3,
                        },
                        {
                            label: data.distributor.title,
                            data: data.distributor.stats[this.statType],
                            borderColor: "rgba(255, 165, 0,.5)",
                            borderWidth: 3,
                        },
                        {
                            label: data.manufacturer.title,
                            data: data.manufacturer.stats[this.statType],
                            borderColor: "rgba(255, 99, 71,.5)",
                            borderWidth: 3,
                        },
                    ],
                },
                options: {
                    responsive: true,
                    fill: false,
                },
            });
        },
    },
};
</script>
