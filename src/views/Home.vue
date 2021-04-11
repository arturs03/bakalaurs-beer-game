<template>
    <div>
        Home
        <div class="d-flex align-items-baseline w-100">
            <img src="@/assets/warehouse.png" height="100" />
            <img
                src="@/assets/truck.png"
                class="manufacturer-truck pb-2"
                height="50"
            />
            <img src="@/assets/warehouse.png" class="ml-auto" height="100" />
        </div>
    </div>
</template>

<script>
export default {
    name: "Home",
};
</script>
<style scoped>
.manufacturer-truck {
    animation: drive 3s;
    position: relative;
}

@keyframes drive {
    0% {
        left: 0;
    }

    80% {
        opacity: 1;
    }

    100% {
        left: 77%;
        opacity: 0;
    }
}
</style>
