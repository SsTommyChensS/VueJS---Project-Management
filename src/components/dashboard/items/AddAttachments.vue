<template>
    <div class="col-sm-7">
        <div class="show-detail">
            <h3>Add Attachments for {{ project.title }}</h3>
            <form id="invite-user" @submit.prevent="addAttachments">
                <div class="mb-3">
                    <label for="title" class="form-label label_title">Project:</label>
                    <input type="text" class="form-control" id="title" placeholder="Type your title here" aria-describedby="emailHelp" v-model="project.title" :disabled="isDisabled">
                </div>
                <div class="mb-3">
                    <label class="form-label label_title" for="attachment">Attachments</label>
                    <input type="file" class="form-control" id="attachment"  multiple @change="getAttachments"/>
                </div>
                <div class="mb-3 show_message_dialog">
                    <ErrorDialog v-if="!isSuccess" :errors= errors></ErrorDialog>
                    <SuccessDialog v-else>
                        Add attachments for {{ project.title }} successfully!
                    </SuccessDialog>
                </div>
                <div class="mb-3 mt-4">
                    <button type="submit" class="btn btn-info button-item"><i class="bi bi-plus"></i> Add</button>
                </div>
            </form>
        </div>
        <div class="mb-3">
            <button type="button" class="btn btn-outline-success" @click="showAttachments(project.id)"><i class="bi bi-file-earmark-bar-graph"></i>List Attachments at {{ project.title }}</button>
        </div>  
        <ShowAttachments :project_id="project_item.id" v-if="option == 1"/>
    </div>
    
</template>

<script>
    import { QuillEditor } from '@vueup/vue-quill'
    import '@vueup/vue-quill/dist/vue-quill.snow.css'

    import ValidationRule from '../../../rules/index.js'
    import SuccessDialog from '../items/SuccessDialog.vue'
    import ErrorDialog from '../items/ErrorDialog.vue'
    import ShowAttachments from './ShowAttachments.vue'

    import axios from 'axios'
    const api_baseUrl= import.meta.env.VITE_BE_API;

    export default {
        components: {
            QuillEditor,
            SuccessDialog,
            ErrorDialog,
            ShowAttachments
        },
        props: {
            project_item: Object
        },
        data() {
            return {
                token: this.$store.state.token,
                project: {},
                attachments: [],
                isDisabled: true,
                isSuccess: false,
                errors: [],
                option: 0,     
            }
        },
        methods: {
            //Allow edit project information
            toggleDisabledInput: function() {
                this.isDisabled = !this.isDisabled;
                //console.table(this.project_item);
            },
            //Get attachment name 
            getAttachments: function(e) {
                const fileList = event.target.files;
                for(const item of fileList) {
                    this.attachments.push(item);
                }
            },
            //Update project
            addAttachments: function() {
                this.errors = [];
                if(this.attachments.length == 0) {
                    this.errors.push('Attachment required!');
                    return;
                }
                 //If no error -> Success
                if(!this.errors.length) {
                    //console.table(this.attachments);
                    const body = {
                        project_id: this.project.id,
                        attachments: this.attachments
                    };
                    axios.post(`${api_baseUrl}api/attachments`, body, {
                        headers: {
                            'Authorization': `Bearer ${this.token}`,
                            'Content-type': 'multipart/form-data'
                        }
                    }).then(response => {
                        const response_body = response.data;             
                        this.isSuccess = true;
                        setTimeout(() => {
                            this.isSuccess = false
                        }, 3000);
                        console.table(response_body);
                    }).catch(e => {
                        const error_body = e.response.data;
                        const error_message = `Error ${error_body.status} - ${error_body.message}`
                        this.errors.push(error_message);
                    })
                }  
            },
            showAttachments: function(projectId) {
                this.option = 1;
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