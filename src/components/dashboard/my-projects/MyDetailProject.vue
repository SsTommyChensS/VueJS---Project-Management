<template>
    <div class="col-sm-7">
        <div class="show-detail">
            <h3>{{ project_item.title }} Detail Information</h3>
            <form id="invite-user" @submit.prevent="updateProject">
                <div class="mb-3">
                    <label class="form-label label_title" style="display:block">Image:</label>
                    <img :src="project.image" class="img-fluid image_image" alt="Responsive image">
                </div>
                <div class="mb-3">
                    <label for="title" class="form-label label_title">Title:</label>
                    <input type="text" class="form-control" id="title" placeholder="Type your title here" aria-describedby="emailHelp" v-model="project.title" :disabled="isDisabled">
                </div>
                <div class="mb-3">
                    <label for="description" class="form-label label_title">Description:</label>
                    <input type="text" class="form-control" id="description" placeholder="Type your description here" aria-describedby="emailHelp" v-model="project.description" :disabled="isDisabled">
                </div>
                <div class="mb-3">
                    <label for="project_code" class="form-label label_title">Project's code:</label>
                    <input type="text" class="form-control" id="project_code" placeholder="Type your project's code here" aria-describedby="emailHelp" v-model="project.project_code" disabled readonly>
                </div>
                <div class="mb-3">
                    <label for="description" class="form-label label_title">Content:</label>
                    <QuillEditor class="descripton_quill" v-model:content="project.content" contentType="html"/>
                </div>
                <div class="mb-3">
                    <label class="form-label label_title">Status:</label>
                    <select class="form-select" aria-label="Default select example" v-model="project.status" :disabled="isDisabled">
                        <option selected disabled>Set project's status</option>
                        <option value="1">New</option>
                        <option value="2">In Process</option>
                        <option value="3">Done</option>
                        <option value="4">Out Of Date</option>
                    </select>
                </div>
                <div class="mb-3">
                    <label class="form-label label_title">Set public?</label>
                    <select class="form-select" aria-label="Default select example" v-model="project.public_flag" :disabled="isDisabled">
                        <option selected disabled>Set public? for project</option>
                        <option value="0">Public</option>
                        <option value="1">Private</option>
                    </select>
                </div>
                <div class="mb-3">
                    <label for="start_date" class="form-label label_title">Start Date</label>
                    <input type="date" class="form-control" id="start_date" style="max-width: 50%" v-model="project.start_date" :disabled="isDisabled"/>       
                </div>
                <div class="mb-3">
                    <label for="end_date" class="form-label label_title">End Date</label>
                    <input type="date" class="form-control" id="end_date" style="max-width: 50%" v-model="project.closed_date" :disabled="isDisabled"/> 
                </div>
                <div class="mb-3 show_message_dialog">
                    <ErrorDialog v-if="!isSuccess" :errors= errors></ErrorDialog>
                    <SuccessDialog v-else>
                        Edit Project Successfully
                    </SuccessDialog>
                </div>
                <div class="mb-3 mt-4">
                    <button type="button" class="btn btn-primary button-item" @click="toggleDisabledInput"><i class="bi bi-pen"></i> Edit</button>
                    <button type="submit" class="btn btn-info button-item" :disabled="isDisabled"><i class="bi bi-save2-fill"></i> Save</button>
                </div>
            </form>
        </div>
    </div>
    
</template>

<script>
    import { QuillEditor } from '@vueup/vue-quill'
    import '@vueup/vue-quill/dist/vue-quill.snow.css'

    import ValidationRule from '../../../rules/index.js'

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
        props: {
            project_item: Object
        },
        data() {
            return {
                quill_options: {
                    readonly: true,
                    theme: 'snow'
                },
                token: this.$store.state.token,
                project: {},
                user_code: '',
                permission_type: '',
                isDisabled: true,
                isReadOnly: true,
                isSuccess: false,
                errors: [],   
            }
        },
        methods: {
            //Allow edit project information
            toggleDisabledInput: function() {
                this.isDisabled = !this.isDisabled;
                this.isReadOnly = !this.isReadOnly
                //console.table(this.project_item);
            },
            //Update project (Done)
            updateProject: function() {
                this.errors = [];
                if(ValidationRule.isEmpty(this.project.title)) {
                    this.errors.push('Title required!');
                    return;
                }

                if(ValidationRule.isEmpty(this.project.description)) {
                    this.errors.push('Description required!');
                    return;
                }

                if(ValidationRule.isEmpty(this.project.startDate)) {
                    this.errors.push('Start date required!');
                    return;
                }

                if(ValidationRule.isEmpty(this.project.endDate)) {
                    this.errors.push('End date required!');
                    return;
                } else if (this.project.endDate <= this.project.startDate) {
                    this.errors.push('Invalid end date!');
                }
                 //If no error -> Success
                if(!this.errors.length) { 
                    const body = {
                        id: this.project.id,
                        title: this.project.title,
                        description: this.project.description,
                        content: this.project.content,
                        start_date: this.project.start_date,
                        closed_date: this.project.closed_date,
                        public_flag: parseInt(this.project.public_flag),
                        status: parseInt(this.project.status)
                    }
                    axios.post(`${api_baseUrl}api/projects/update-project-info/${this.project.id}`, body, {
                        headers: { 
                            'Authorization': `Bearer ${this.token}`
                        }
                    }).then(response => {
                        const project_response = response.data.data.project;
                        this.isSuccess = true;
                        this.isDisabled = !this.isDisabled;
                        console.log(body);
                        console.log(response.data);
                    }).catch(e => {
                        const error_body = e.response.data;
                        const error_message = `Error ${error_body.status}: ${error_body.message}`;
                        this.errors.push(error_message);
                    })
                    // console.table({
                    //     public_flag: body.public_flag,
                    //     status: body.status
                    // });
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
    .image_image {
        width: 20%;
    }

    .button-item {
        margin: 10px 10px 10px 0;     
    }
</style>