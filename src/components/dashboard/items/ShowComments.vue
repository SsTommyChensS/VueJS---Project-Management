<template>
    <div class="show-comments">
            <h3>Comments</h3>
            <table class="table table-hover">
                <thead>
                    <tr>
                        <th scope="col">N.o</th>
                        <th scope="col">User Name</th>
                        <th scope="col">Content</th>
                        <th scope="col">Commented At</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(comment, index) in comments" :key="comment.id">
                        <td >{{ ++index }}</td>
                        <td>{{ comment.name }}</td>
                        <td>{{ comment.content }}</td>
                        <td>{{ comment.created_at }}</td>
                    </tr>
                </tbody>     
            </table>
        </div>
</template>

<script>
    export default {
        props: {
            comments: Array
        }
    }
</script>