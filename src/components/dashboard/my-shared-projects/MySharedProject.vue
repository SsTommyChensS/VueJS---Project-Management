<template>
    <h1 class="mb-4">My Shared Projects</h1>
    <!-- All public projects avaiable -->
    <div class="all_projects_list">
        <div class="search-bar mb-3">
            <div class="search-bar__item m-2">
                <label>Title:</label>
                <div class="input-group">
                    <div class="input-group-prepend">
                        <button class="btn btn-info" type="button" @click="showProjectsByTitle">Search <i class="bi bi-search-heart-fill"></i></button>
                    </div>
                    <input type="text" class="form-control" placeholder="Search Title" aria-label="" aria-describedby="basic-addon1" v-model="search_title">
                </div>
            </div>
            <div class="search-bar__item m-2">
                <label>Status:</label>
                <select class="form-select" aria-label="Default select example" @change="showProjectsByStatus">
                    <option selected disabled>Select project's status</option>
                    <option value="1">New</option>
                    <option value="2">In Process</option>
                    <option value="3">Done</option>
                    <option value="4">Out of date</option>
                    <option value="5">All</option>
                </select>
            </div>
        </div>
        <table class="table table-hover">
            <thead>
                <tr>
                    <th scope="col">N.o</th>
                    <th scope="col">Project Title</th>
                    <th scope="col">Description</th>
                    <th scope="col">Owner</th>
                    <th scope="col">Status</th>
                    <th scope="col">Action</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(project, index) in projects_filter" :key="project.id">
                    <td >{{ ++index }}</td>
                    <td>{{ project.title }}</td>
                    <td>{{ project.description }}</td>
                    <td>{{ project.owner_name }}</td>
                    <td v-html="displayProjectStatus(project.status)"></td>
                    <td>
                        <button type="button" class="btn btn-secondary button-item" @click="showDetailsByProject(project)"><i class="bi bi-activity"></i> Detail</button>
                        <button type="button" class="btn btn-info button-item" @click="showCommentsByProject(project.id)"><i class="bi bi-bar-chart-steps"></i> See comments</button>
                        <button type="button" class="btn btn-secondary button-item" @click="commentProject(project)"><i class="bi bi-app-indicator"></i> Comment</button>
                        <button type="button" class="btn btn-warning button-item" @click="addAttachments(project)" v-if="project.permission_type == 2 || project.permission_type == 3"><i class="bi bi-file-earmark-arrow-up-fill"></i> Add attachments</button>
                        <button type="button" class="btn btn-dark button-item" @click="inviteUserByUserCode(project)" v-if="project.permission_type == 3"><i class="bi bi-arrow-return-right"></i> Invite</button>
                    </td>
                </tr>
            </tbody>     
        </table>
        <LoadingSpinner v-if="isLoading"/>
        <MySharedDetailProject :project_item="project" v-if="option == 1"/>
        <ShowComments :comments="comments_filter" v-if="option == 2"/>
        <InviteUser :project_item="project" v-if="option == 3"/>
        <CommentProject :project_item="project" v-if="option == 4"/>
        <AddAttachments :project_item="project" v-if="option == 5"/>
    </div>
    
</template>

<script>
    import LoadingSpinner from '../items/LoadingSpinner.vue'
    import MySharedDetailProject from './MySharedDetailProject.vue'
    import InviteUser from '../items/InviteUser.vue'
    import CommentProject from '../items/CommentProject.vue'
    import AddAttachments from '../items/AddAttachments.vue'
    import ShowComments from '../items/ShowComments.vue'

    import axios from 'axios'
    const api_baseUrl= import.meta.env.VITE_BE_API;

    export default {
        components: {
            LoadingSpinner,
            MySharedDetailProject,
            InviteUser,
            CommentProject,
            AddAttachments,
            ShowComments
        },

        data() {
            return {
                token: this.$store.state.token,
                sample_data: [
                    {
                        id: 1,
                        title: 'My Home Project',
                        image: 'puppy.jpg',
                        description: 'This is my first project using HTML, CSS, Javascript<',
                        content: 'JavaScript is the world\'s most popular programming language. JavaScript is the programming language of the Web.JavaScript is easy to learn.',
                        owner_name: 'Nguyen Van A',
                        attachment: '',
                        status: '1',
                        startDate: '2023-02-17',
                        endDate: '2023-03-20',
                        public_flag: '2',
                        permission_type: '2'
                    },
                    {
                        id: 2,
                        title: 'My Second Project',
                        image: 'kitten.jpg',
                        description: 'This is my second project using NodeJS and ReactJS',
                        content: 'JavaScript is the world\'s most popular programming language. JavaScript is the programming language of the Web.JavaScript is easy to learn.',
                        owner_name: 'Tommy Teo',
                        attachment: '',
                        status: '2',
                        startDate: '2023-02-17',
                        endDate: '2023-03-20',
                        public_flag: '2',
                        permission_type: '1'
                    },
                    {
                        id: 3,
                        title: 'My Third Project',
                        image: 'puppy.jpg',
                        description: 'This is my third project using Laravel and VueJS',
                        content: 'JavaScript is the world\'s most popular programming language. JavaScript is the programming language of the Web.JavaScript is easy to learn.',           
                        owner_name: 'Tommy Teo',
                        attachment: '',
                        status: '3',
                        startDate: '2023-02-17',
                        endDate: '2023-03-20',
                        public_flag: '1',
                        permission_type: '1'
                    },
                    {
                        id: 4,
                        title: 'My Final Project',
                        image: 'kitten.jpg',
                        description: 'This is my final project',
                        content: 'JavaScript is the world\'s most popular programming language. JavaScript is the programming language of the Web.JavaScript is easy to learn.',
                        owner_name: 'Tommy Teo',
                        attachment: '',
                        status: '4',
                        startDate: '2023-02-17',
                        endDate: '2023-03-20',
                        public_flag: '1',
                        permission_type: '3'
                    }
                ],
                comments_data: [
                    {
                        id: 1,
                        userId: 1,
                        username: 'Quoc Tung',
                        project_id: 1,
                        content: 'Great!',
                        createdAt: ''
                    },
                    {
                        id: 2,
                        userId: 1,
                        username: 'Quoc Tung',
                        project_id: 2,
                        content: 'Well done',
                        createdAt: ''
                    },
                    {
                        id: 3,
                        userId: 2,
                        username: 'Tommy Tran',
                        project_id: 3,
                        content: 'Not bad',
                        createdAt: ''
                    },
                    {
                        id: 4,
                        userId: 2,
                        username: 'Tommy Tran',
                        project_id: 4,
                        content: 'No hope',
                        createdAt: ''
                    },
                    {
                        id: 5,
                        userId: 1,
                        username: 'Quoc Tung',
                        project_id: 1,
                        content: 'Good bye'
                    }
                ],
                projects: [],
                projects_filter: [],
                project: {},
                comments_filter: [],
                search_title: '',
                option: 0,
                isLoading: true,
            }
        },
        methods: {
            //Get my shared projects
            getMySharedProjects: function() {
                axios.get(`${api_baseUrl}api/projects/get-share-project`, {
                    headers: {
                        'Authorization': `Bearer ${this.token}`
                    }
                }).then(response => {
                    this.isLoading = false;
                    const respone_body = response.data;
                    this.projects = respone_body.data.projects;
                    this.projects_filter = this.projects;
                    console.table(this.projects_filter);
                }).catch(e => {
                    console.log(e.response);
                })
            },
            displayProjectStatus: function(status) {
                switch (status) {
                    case 1: return '<span class="project__status project__status--new">'+ 'New' +'</span>';
                    case 2: return '<span class="project__status project__status--inprocess">In Process</span>';
                    case 3: return '<span class="project__status project__status--done">Done</span>';
                    case 4: return '<span class="project__status project__status--outofdate">Out of date</span>';
                }
            },
            //Show details by project (Done)
            showDetailsByProject(project) {
                this.option = 1;
                this.project = project;
            },
            //Show comments by project (Done)
            showCommentsByProject: function(projectId) {
                axios.get(`${api_baseUrl}api/projects/${projectId}/list-comments`, {
                    headers: {
                        'Authorization': `Bearer ${this.token}`
                    }
                }).then(response => {
                        const response_body = response.data;
                        this.comments_filter = response_body.data.comments;
                        this.option = 2;
                }).catch(e => {
                    console.log(e.response);
                })
            },
            //Invite user by code
            inviteUserByUserCode(project) {
                this.option = 3;
                this.project = project;
            },
            //Show projects by status
            showProjectsByStatus: function(e) {
                const status = e.target.value;
                if(status == 5) {
                    this.getMySharedProjects();
                } else {
                    axios.get(`${api_baseUrl}api/projects/get-share-project`, {
                        headers: {
                            'Authorization': `Bearer ${this.token}`
                        },
                        params: {
                            status: status
                        }
                    }).then(response => {
                        this.projects = response.data.data.projects;
                        this.projects_filter = this.projects;
                    }).catch(e => {
                        console.log(e);
                    })
                }                        
            },
            //Show projects by title
            showProjectsByTitle: function() {
                const search_title = this.search_title.toLowerCase();
                if(search_title  == '') {
                    this.getAllProjects();
                } else {
                    axios.get(`${api_baseUrl}api/projects/get-share-project`, {
                        headers: {
                            'Authorization': `Bearer ${this.token}`
                        },
                        params: {
                            title: search_title
                        }
                    }).then(response => {
                        this.projects = response.data.data.projects;
                        this.projects_filter = this.projects;
                    }).catch(e => {
                        console.log(e);
                    })
                }
            },
            //Join project by project's code
            joinProjectByCode(projectId) {
                const project_code = prompt("Type the project's code?");
                if(project_code == '') {
                    alert('No code in your input!');
                } else {
                    alert(`Your code is: ${project_code}`);
                    console.table({
                        project_id: projectId,
                        code: project_code,
                    })
                }
            },
            //Comment at a project
            commentProject(project) {
                this.option = 4;
                this.project = project;
            },
            addAttachments(project) {
                this.option = 5;
                this.project = project;
            }
        },
        //Original data API calling
        created() {
           this.getMySharedProjects();
        }
    }
</script>

<style>
    .button-item {
        margin: 10px 10px 10px 0;     
    }

    .search-bar {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        align-items: center;
        padding: 10px;
    }
    .search-bar{
        display: flex;
    }

    .project__status {
        font-weight: bolder;
    }

    .project__status--new {
        color: green;
    }

    .project__status--inprocess {
        color: #999900;
    }

    .project__status--done {
        color: blue;
    }

    .project__status--outofdate {
        color: red;
    }
</style>