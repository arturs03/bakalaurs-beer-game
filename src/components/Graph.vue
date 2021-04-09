<template>
    <div>
        <h2 class="text-center mb-4">Spēlētāja stāvokļu grafiks</h2>
        <canvas id="order-chart"></canvas>
    </div>
</template>

<script>
import Chart from "chart.js/auto";

export default {
    name: "Graph",
    props: {
        chartData: {
            type: Object,
            required: true,
        },
    },
    data: () => ({
        graph: null,
    }),
    watch: {
        chartData: {
            deep: true,
            handler(newData) {
                this.drawGraph(newData);
            },
        },
    },
    mounted() {
        this.drawGraph();
    },
    methods: {
        async drawGraph(data = []) {
            const ctx = document.getElementById("order-chart");

            if (this.graph) {
                this.graph.destroy();
            }

            if (!data?.incomingOrders?.length) {
                return;
            }

            const labels = data?.incomingOrders?.map((d, i) => ++i);

            this.graph = await new Chart(ctx, {
                type: "line",
                data: {
                    labels: labels,
                    datasets: [
                        {
                            label: "Ienākošie pasūtijumi",
                            data: data.incomingOrders,
                            borderColor: "rgba(54,73,93,.5)",
                            borderWidth: 3,
                        },
                        {
                            label: "Pasūtīts",
                            data: data.ordered,
                            borderColor: "rgba(71, 183,132,.5",
                            borderWidth: 3,
                        },
                        {
                            label: "Krājumi",
                            data: data.stock,
                            borderColor: "rgba(255, 165, 0,.5)",
                            borderWidth: 3,
                        },
                        {
                            label: "Atpakaļsūtijumi",
                            data: data.backlog,
                            borderColor: "rgba(255, 99, 71,.5)",
                            borderWidth: 3,
                        },
                    ],
                },
                options: {
                    responsive: true,
                    fill: false,
                    scales: {
                        y: {
                            suggestedMin: -20,
                        }
                    }
                },
            });
        },
    },
};
</script>
