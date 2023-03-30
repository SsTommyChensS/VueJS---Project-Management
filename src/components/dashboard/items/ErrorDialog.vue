<template>
    <div class="show_error_dialog" v-for="(error, index) in errors">
        <div class="alert alert-danger" :key="index">
            {{ error }}
        </div>
    </div>
</template>

<script>
    export default {
        props: {
            errors: Array
        }
    }
</script>