<template>
    <h4>Tab {{ tabName }}</h4>
    <p>Ini adalah main content untuk tab {{ tabName }}</p>
</template>
<script>
export default {
    props: {
        tabName: String
    }
}
</script>