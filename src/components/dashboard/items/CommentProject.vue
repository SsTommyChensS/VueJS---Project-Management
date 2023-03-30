<template>
    <div class="col-sm-7">
        <div class="comment-project">
            <h3>Comment at {{ project.title }}</h3>
            <form id="invite-user" @submit.prevent="commentProject">
                <div class="mb-3">
                    <label for="comment" class="form-label label_title">Comment:</label>
                    <input type="text" class="form-control" id="comment" placeholder="Type your comment here" aria-describedby="emailHelp" v-model="content">
                </div>
                <div class="mb-3 show_message_dialog">
                    <ErrorDialog v-if="!isSuccess" :errors= errors></ErrorDialog>
                    <SuccessDialog v-else>
                        Comment at {{ project.title }} successfully!
                    </SuccessDialog>
                </div>
                <div class="mb-3 mt-4">
                    <button type="submit" class="btn btn-info button-item"><i class="bi bi-pencil-fill"></i> Comment</button>
                </div>
            </form>
        </div>
    </div>
    
</template>

<script>
    import ValidationRule from '../../../rules/index.js'
    //Success Dialog
    import SuccessDialog from '../items/SuccessDialog.vue'
    import ErrorDialog from '../items/ErrorDialog.vue'

    import axios from 'axios'
    const api_baseUrl= import.meta.env.VITE_BE_API;

    export default {
        components: {
            SuccessDialog,
            ErrorDialog
        },
        props: {
            project_item: Object
        },
        data() {
            return {
                token: this.$store.state.token,
                project: {},
                content: '',
                isSuccess: false,
                errors: [],     
            }
        },
        methods: {
            //Comment project (Done)
            commentProject: function() {
                this.errors = [];
                if(ValidationRule.isEmpty(this.content)) {
                    this.errors.push('Comment required!');
                    return;
                }
                 //If no error -> Success
                if(!this.errors.length) {
                    const body = {
                        project_id: this.project.id,
                        content: this.content
                    };
                    axios.post(`${api_baseUrl}api/comments`, body, {
                        headers: {
                            'Authorization': `Bearer ${this.token}`
                        }
                    }).then(response => {
                        this.isSuccess = true;
                    }).catch(e => {
                        const error_body = e.response.data;
                        const error_message = `Error ${error_body.status}: ${error_body.message}`;
                        this.errors.push(error_message);
                    })
                }  
            }
        },
        created() {
            // Destructuring assignment: Using this to clone a object with different memory address (reference type)
            this.project = {...this.project_item};
        },
        watch: {
            project_item() {
                this.project = {...this.project_item};
            }
        }
    }
</script>

<style>
    .button-item {
        margin: 10px 10px 10px 0;     
    }
</style>