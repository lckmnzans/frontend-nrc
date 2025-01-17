<template>
    <!-- Button trigger modal -->
    <!-- <button type="button" class="btn btn-primary" data-bs-toggle="modal" :data-bs-target="`#${modalTarget}`">
    Launch demo modal
    </button> -->

    <!-- Modal -->
    <div class="modal fade" :id="modalTarget" tabindex="-1" :aria-labelledby="modalLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" :id="modalLabel">{{ modalTitle }}</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    {{ modalContent }}
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                    <button type="button" class="btn btn-primary" @click.prevent="primaryAction" data-bs-dismiss="modal">Save changes</button>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    props: {
        modalTarget: {
            type: String,
            required: true
        },
        modalLabel: {
            type: String,
            required: true
        },
        modalTitle: {
            type: String,
            required: true
        },
        modalContent: {
            type: String,
            required: true
        },
        primaryAction: {
            type: Function,
            required: true
        },
        primaryLabel: {
            type: String,
            required: true
        }
    }
}
</script>