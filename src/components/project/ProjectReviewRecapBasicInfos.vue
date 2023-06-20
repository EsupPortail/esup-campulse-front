<template>
    <section class="flex-section">
        <div class="display-row">
            <p class="row-title">{{ t('project.name') }}</p>
            <p>{{ projectStore.project?.name }}</p>
        </div>

        <div class="display-row">
            <p class="row-title">{{ t('project.planned-start-date') }}</p>
            <p>
                {{
                    formatDate(projectReview.realStartDate).split('-').reverse().join('/')
                }}
            </p>
        </div>

        <div class="display-row">
            <p class="row-title">{{ t('project.planned-end-date') }}</p>
            <p>
                {{
                    formatDate(projectReview.realEndDate).split('-').reverse().join('/')
                }}
            </p>
        </div>

        <div class="display-row">
            <p class="row-title">{{ t('project.planned-location') }}</p>
            <p>{{ projectReview.realLocation }}</p>
        </div>

        <h5 class="title-4">{{ t('project.contact-infos') }}</h5>

        <section
            v-if="projectReview.association"
            class="flex-section"
        >
            <div class="display-row">
                <p class="row-title">{{ t('project.other-first-name') }}</p>
                <p>{{ projectReview.otherFirstName }}</p>
            </div>
            <div class="display-row">
                <p class="row-title">{{ t('project.other-last-name') }}</p>
                <p>{{ projectReview.otherLastName }}</p>
            </div>
            <div class="display-row">
                <p class="row-title">{{ t('project.other-email') }}</p>
                <p>{{ projectReview.otherEmail }}</p>
            </div>
        </section>
        <section
            v-else
            class="flex-section"
        >
            <div class="display-row">
                <p class="row-title">{{ t('user.first-name') }}</p>
                <p>{{ userToUpdate.firstName }}</p>
            </div>
            <div class="display-row">
                <p class="row-title">{{ t('user.last-name') }}</p>
                <p>{{ userToUpdate.lastName }}</p>
            </div>
            <div class="display-row">
                <p class="row-title">{{ t('user.email') }}</p>
                <p>{{ userToUpdate.email }}</p>
            </div>
            <div class="display-row">
                <p class="row-title">{{ t('user.phone') }}</p>
                <p>{{ userToUpdate.phone }}</p>
            </div>
            <div class="display-row">
                <p class="row-title">{{ t('address.address') }}</p>
                <p>
                    {{ userToUpdate.address }}<br/>
                    {{ userToUpdate.zipcode + ' ' + userToUpdate.city }}<br/>
                    {{ userToUpdate.country }}
                </p>
            </div>
        </section>

        <h5 class="title-4">{{ t('commission.dates') }}</h5>

        <ProjectRecapCommissions/>

        <h5 class="title-4">
            {{
                t('project.outcome') + ' / ' + t('project.income')
            }}
        </h5>

        <div class="display-row">
            <p class="row-title">{{ t('project.outcome') }}</p>
            <p>{{ projectReview.outcome + CURRENCY }}</p>
        </div>

        <div class="display-row">
            <p class="row-title">{{ t('project.income') }}</p>
            <p>{{ projectReview.income + CURRENCY }}</p>
        </div>
    </section>
</template>