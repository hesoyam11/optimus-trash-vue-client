<template>
    <div class="home">
        <h1>Optimus Trash</h1>
        <p>{{ $t('description') }}</p>
    </div>
</template>

<script>
    export default {
        name: 'home'
    }
</script>

<i18n>
{
    "en": {
        "description": "A waste collection optimization system."
    },
    "uk": {
        "description": "Система оптимізації збору сміття."
    }
}
</i18n>

<style>
    .home {
        text-align: center;
    }
</style>