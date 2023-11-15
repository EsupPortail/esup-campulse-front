import type {Content, Logo} from '#/index'

export const _contents: Content[] = [
    {
        id: 1,
        code: 'HOME_INFO',
        label: 'Paragraphe de la page d\'accueil lié aux informations générales / bandeau d\'informations.',
        header: 'INFORMATIONS: Commission de CAPE le 23 novembre 2023',
        body: '<p>Association, porteur ou porteuse de projet, venez présenter votre projet.</p>',
        footer: '',
        aside: ''
    },
    {
        id: 2,
        code: 'HOME_ASSOCIATION',
        label: 'Paragraphe de la page d\'accueil lié aux associations.',
        header: 'Annuaire des associations',
        body: '<p>Besoin d\'informations sur une association étudiante ? Tu as envie de t\'engager dans ton association de filière ? L\'annuaire des associations étudiantes est là pour ça !</p>',
        footer: 'Consulter l\'annuaire',
        aside: ''
    },
    {
        id: 3,
        code: 'HOME_CHARTER',
        label: 'Paragraphe de la page d\'accueil lié aux chartes du Site Alsace.',
        header: 'Charte des associations du Site Alsace',
        body: '<p>Une demande de locaux ? Un projet à soumettre pour obtenir une subvention pour son association ? La signature de la charte des associations étudiantes du site Alsace et des chartes de subventionnement sont obligatoires, et ça se passe par ici !</p>',
        footer: 'Espace charte',
        aside: ''
    },
    {
        id: 4,
        code: 'HOME_PROJECT',
        label: 'Paragraphe de la page d\'accueil lié aux demandes de subventions.',
        header: 'CAPE Commission d\'aide aux projets étudiants',
        body: '<p>Déposez dès à présent vos dossiers de demandes de subventions aux commissions FSDIE, Cultures-ActionS et IdEx pour vos projets par ce module !</p>',
        footer: 'Espace CAPE',
        aside: ''
    }
]

export const _logos: Logo[] = [
    {
        id: 1,
        acronym: 'crous',
        title: 'Le Centre régional des œuvres universitaires et scolaires',
        url: 'https://www.crous-strasbourg.fr/',
        visible: true,
        row: 1,
        column: 2,
        pathLogo: ''
    },
    {
        id: 2,
        acronym: 'unistra',
        title: 'L\'Université de Strasbourg',
        url: 'https://www.unistra.fr/',
        visible: true,
        row: 1,
        column: 1,
        pathLogo: ''
    },
    {
        id: 3,
        acronym: 'uha',
        title: 'L\'Université de Haute-Alsace',
        url: 'https://www.uha.fr/',
        visible: false,
        row: 1,
        column: 3,
        pathLogo: ''
    }
]
