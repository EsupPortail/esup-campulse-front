<script lang="ts" setup>
import * as noLogoSquare from '@/assets/img/no_logo_square.png'
import type {Association} from '#/association'
import {useI18n} from 'vue-i18n'

const {t} = useI18n()

const baseUrl = import.meta.env.VITE_APP_BASE_URL

defineProps<{
    association: Association
}>()
</script>

<template>
    <QCard>
        <div class="card-background"></div>
        <i
            aria-hidden="true"
            class="card-chevron bi bi-chevron-compact-right"
        ></i>
        <QCardSection>
            <div class="list-logo">
                <QImg
                    :src="association.pathLogo ?
                        (Object.keys(association.pathLogo).length !== 0 ?
                            (!association.pathLogo.list?.startsWith('http') ?
                                baseUrl + association.pathLogo.list : association.pathLogo.list) :
                            noLogoSquare.default) : noLogoSquare.default"
                    aria-hidden="true"
                />
            </div>
            <div class="list-details">
                <h3>
                    <RouterLink :to="{ name: 'AssociationDetail', params: { id: association.id } }">
                        {{ association.name }}
                    </RouterLink>
                </h3>
                <ul>
                    <li v-if="association.acronym">
                        <span class="label">
                            <i
                                aria-hidden="true"
                                class="bi bi-tag"
                            ></i>
                            {{ t('directory.labels.association-acronym') + ' : ' }}
                        </span>
                        <span class="value">{{ association.acronym }}</span>
                    </li>
                    <li v-if="association.institution">
                        <span class="label">
                            <i
                                aria-hidden="true"
                                class="bi bi-bank2"
                            ></i>
                            {{ t('directory.labels.association-institution') + ' : ' }}
                        </span>
                        <span class="value">{{ association.institution.name }}</span>
                    </li>
                    <li v-if="association.activityField">
                        <span class="label">
                            <i
                                aria-hidden="true"
                                class="bi bi-globe"
                            ></i>
                            {{ t('directory.labels.association-activity-field') + ' : ' }}
                        </span>
                        <span class="value">{{ association.activityField.name }}</span>
                    </li>
                    <li v-if="association.institutionComponent">
                        <span class="label">
                            <i
                                aria-hidden="true"
                                class="bi bi-mortarboard"
                            ></i>
                            {{ t('directory.labels.association-institution-component') + ' : ' }}
                        </span>
                        <span class="value">{{ association.institutionComponent.name }}</span>
                    </li>
                </ul>
            </div>
        </QCardSection>
    </QCard>
</template>

<style lang="scss" scoped>
@import '@/assets/_variables.scss';

.q-card {
    background: $backgroundColor1;
    border: none;
    border-radius: 0;
    box-shadow: $fieldsBoxShadow;
    margin-bottom: 2rem;
    overflow: hidden;

    .q-card__section {
        display: flex;
        flex-direction: row;
        align-items: center;
        gap: 6rem;
        box-shadow: 0.5rem 0 0 0 $associationColor inset;
        transition: box-shadow 0.1s linear;
        padding: 1.25rem 3rem 1.563rem 1.875rem;

        .list-logo {
            flex: 0 0 8rem;
            border-radius: $radiusCircle;
            overflow: hidden;

            .q-img {
                width: $fullSize;
                height: auto;
            }
        }

        .list-details {
            width: $fullSize;
        }
    }

    .card-background {
        width: 11rem;
        height: 25rem;
        position: absolute;
        top: calc(50% - 12.5rem);
        left: -1.875rem;
        background-color: $associationColorBackground;
        z-index: 0;
        transition: left 0.1s linear;

        &:after {
            content: '';
            width: 0;
            height: 0;
            border-style: solid;
            border-width: 12.5rem 0 12.5rem 4.375rem;
            border-color: transparent transparent transparent $associationColorBackground;
            position: absolute;
            top: 0;
            right: -4.313rem;
        }
    }

    .card-chevron {
        font-size: 3rem;
        color: $associationColor;
        position: absolute;
        top: calc(50% - 2rem);
        right: 1.875rem;
        z-index: 10;
        opacity: 0;
        transition: opacity 0.1s linear, right 0.1s linear;
    }

    h3 {
        margin-bottom: 0.5rem;
        line-height: 2.4rem;

        a {
            font-size: 2.5rem;
            line-height: 2.4rem;
            font-weight: $semibold-weight;
            color: $associationColorText;
            text-transform: uppercase;
            text-decoration: none;
        }
    }

    ul {
        list-style: none;
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        width: $fullSize;

        li {
            display: flex;
            flex: 0 0 $fullSize;
            margin-bottom: 0.25rem;

            & > span.value {
                text-transform: none;
                font-size: 1.6rem;
                font-weight: $medium-weight;
                color: $associationColorText;
                padding-right: 1.25rem;
            }

            & > span.label {
                display: inline-block;
                font-size: 1.6rem;
                font-weight: $medium-weight;
                color: $textColor2;
                text-transform: uppercase;
                padding-right: 0.313rem;
                white-space: nowrap;

                i {
                    margin-right: 0.313rem;
                }
            }

            &:last-child {
                margin-bottom: 0;
            }
        }
    }

    &:hover, &:focus {
        .q-card__section {
            box-shadow: 1rem 0 0 0 $associationColor inset;
        }

        .card-background {
            left: -0.938rem;
        }

        .card-chevron {
            opacity: 1;
            right: 0.938rem;
        }
    }
}

@media screen and (max-width: $breakpoint-lg) {
    .q-card {
        .card-background {
            display: none;
        }

        .card-chevron {
            opacity: 1;
            right: 1.25rem;
        }

        .q-card__section {
            display: block;

            .list-logo {
                width: 3.125rem;
                float: left;

                .q-img {
                    width: $fullSize;
                    height: auto;
                }
            }

            h3 {
                vertical-align: top;
                font-size: 1.5rem;
                line-height: 1.813rem;
                padding-left: 4.375rem;
                margin-bottom: 0.188rem;
            }
        }

        ul {
            li {
                display: flex;
                width: $fullSize;
                flex-wrap: wrap;
            }
        }

        &:hover, &:focus {
            .card-chevron {
                right: 0.625rem;
            }
        }
    }
}
</style>