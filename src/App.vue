<template>
    <div class="p-4">
        <div class="container">
            <div class="row border-bottom align-items-center pb-4 mb-5">
                <div class="col-12 col-md-6">
                    <h1 class="h3">
                        <router-link to="/">
                            Beer distribution game
                        </router-link>
                    </h1>
                </div>
            </div>
            <transition name="fade">
                <router-view />
            </transition>
        </div>
    </div>
</template>

<script>
export default {
    name: "App",
};
</script>
<style scoped>
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}
</style>
