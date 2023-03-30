<template>
    <h1 class="mb-4">Add Project</h1>
    <form id="add_project_form" @submit.prevent="addProject">
            <div class="mb-3">
                <label for="title" class="form-label label_title">Title</label>
                <input type="text" class="form-control" id="title" placeholder="Your title here" v-model="project.title"/>
            </div>
            <div class="mb-3">
                <label for="description" class="form-label label_title">Description</label>
                <input type="text" class="form-control" id="description" placeholder="Your description here" v-model="project.description"/>
            </div>
            <div class="mb-3">
                <label for="content" class="form-label label_title">Content</label>
                <QuillEditor class="content_quill" v-model:content="project.content" contentType="html" theme="snow" style="height: 200px"/>
            </div>
            <div class="mb-3">
                <label class="form-label label_title">Set public?</label>
                <select class="form-select" aria-label="Default select example" style="max-width: 50%" v-model="project.public_flag">
                    <option selected disabled>Set project public?</option>
                    <option value="0">Public</option>
                    <option value="1">Private</option>
                </select>
            </div>
            <div class="mb-3">
                <label for="start_date" class="form-label label_title">Start Date</label>
                <input type="date" class="form-control" id="start_date" style="max-width: 50%" v-model="project.start_date"/>       
            </div>
            <div class="mb-3">
                <label for="end_date" class="form-label label_title">End Date</label>
                <input type="date" class="form-control" id="end_date" style="max-width: 50%" v-model="project.closed_date"/> 
            </div>
            <div class="mb-3">
                <label class="form-label label_title" for="image">Image</label>
                <input type="file" class="form-control" style="max-width: 50%" id="image" accept="image/*" @change="getImage"/>
            </div>
            <div class="mb-3">
                <label class="form-label label_title" for="attachment">Attachments</label>
                <input type="file" class="form-control" style="max-width: 50%" id="attachment" multiple @change="getAttachments"/>
            </div>
            <div class="mb-3 show_message_dialog">
                <ErrorDialog :errors= errors v-if="!isSuccess"></ErrorDialog>
                <SuccessDialog v-else>
                    Create project successfully
                </SuccessDialog>
            </div>
            <div class="mb-3 mt-4">
                <button type="submit" class="btn btn-lg btn-primary" ref="profile_save"><i class="bi bi-plus-square-dotted"></i> Add</button>
                <button type="reset" class="btn btn-lg btn-secondary ms-4">Reset</button>
            </div>
    </form>
</template>

<script>
    import ValidationRule from '../../../rules/index.js'

    import { QuillEditor } from '@vueup/vue-quill'
    import '@vueup/vue-quill/dist/vue-quill.snow.css'
    //Success Dialog
    import SuccessDialog from '../items/SuccessDialog.vue'
    import ErrorDialog from '../items/ErrorDialog.vue'

    import axios from 'axios'

    const api_baseUrl= import.meta.env.VITE_BE_API;

    export default {
        components: {
            QuillEditor,
            SuccessDialog,
            ErrorDialog
        },
        data() {
            return {
                token: this.$store.state.token,
                project: {
                    title: '',
                    description: '',
                    content: '',
                    public_flag: '',
                    start_date: '', 
                    closed_date: '',
                    image: null,
                    attachments: []
                },
                isDisabled: true,
                isSuccess: false,
                errors: [],      
            }
        },
        methods: {
            //Get avatar name
            getImage: function(e) {
                const fileList = event.target.files;
                this.project.image = fileList[0];
            },
            //Get attachment name 
            getAttachments: function(e) {
                const fileList = event.target.files;
                for(const item of fileList) {
                    this.project.attachments.push(item);
                }
            },
            //Add a project
            addProject: function() {
                //Empty errors
                this.errors = [];
                //Check title
                if(ValidationRule.isEmpty(this.project.title)) {
                    this.errors.push('Project title required!');
                    return;
                }
                //Check description
                if(ValidationRule.isEmpty(this.project.description)) {
                    this.errors.push('Project description required!');
                    return;
                } 
                //Check content
                if(ValidationRule.isEmpty(this.project.content)) {
                    this.errors.push('Project content required!');
                    return;
                }
                //Check public flag
                if(ValidationRule.isEmpty(this.project.public_flag)) {
                    this.errors.push('Set public? required!');
                    return;
                } 
                //Check start date
                if(ValidationRule.isEmpty(this.project.start_date)) {
                    this.errors.push('Start date required!');
                    return;
                }
                //Check end date
                if(ValidationRule.isEmpty(this.project.end_date)) {
                    this.errors.push('End date required!');
                    return;
                } else if (this.project.end_date <= this.project.start_date) {
                    this.errors.push('Invalid end date!');
                    return;
                }
                //Check Image
                if(this.project.image === null) {
                    this.errors.push('Image required!');
                    return;
                }
                 //If no error -> Success
                if(!this.errors.length) {
                    const body = {
                        title: this.project.title,
                        description: this.project.description,
                        content: this.project.content,
                        public_flag: parseInt(this.project.public_flag),
                        image: this.project.image,
                        attachments: this.project.attachments,
                        start_date: this.project.start_date,
                        closed_date: this.project.closed_date
                    };

                    axios.post(`${api_baseUrl}api/projects`, body, {
                        headers: {
                            'Authorization': `Bearer ${this.token}`,
                            'Content-type': 'multipart/form-data'
                        }
                    }).then(response => {
                        const response_body = response.data;
                        this.isSuccess = true;

                        setTimeout(() => {
                            this.isSuccess = false;
                        }, 3000);

                        console.table(response_body);
                    }).catch(e => {
                        const error_respone = e.response.data;
                        const error_message = `Error ${error_respone.status} - ${error_respone.message}`;
                        this.errors.push(error_message);
                    })
                }  
            }
        }
    }
</script>

<style>
    .descripton_quill {
        min-height: 300px;
    }

</style>