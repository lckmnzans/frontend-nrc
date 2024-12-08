<template>
    <h4>Page Category</h4>
    <p style="background-color: blue; color: antiquewhite;">Ini adalah PageCategory {{ page }}</p>
</template>
<script>
export default {
    props: {
        page: String
    }
}
</script>