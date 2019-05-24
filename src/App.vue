<template>
    <div id="app">

        <div id="nav">

            <router-link :to="{ name: 'home' }">Optimus Trash</router-link>

            <span v-if="isLoggedIn && !isConfirmed">
                {{ $t('notConfirmedMessage') }}
            </span>

            <div class="float-right">
                <span v-if="!isLoggedIn">
                    <router-link :to="{ name: 'login' }">{{ $t('login') }}</router-link>
                    <router-link :to="{ name: 'register' }">{{ $t('register') }}</router-link>
                </span>

                <span v-if="isLoggedIn && isConfirmed">
                    <router-link :to="{ name: 'buildPath' }">{{ $t('buildPath') }}</router-link>
                    <router-link :to="{ name: 'binList' }">{{ $t('bins') }}</router-link>
                </span>

                <span v-if="isLoggedIn && isSuperuser">
                    <router-link :to="{ name: 'userList' }">{{ $t('administration') }}</router-link>
                </span>

                <span v-if="isLoggedIn">
                    <router-link :to="userPageRoute">{{ $t('myAccount') }}</router-link>
                    <a @click="logout">{{ $t('logout') }}</a>
                </span>

                <a @click="switchLocale">{{ availableLocale.toUpperCase() }}</a>
            </div>

        </div>


        <div id="content">
            <router-view/>
        </div>

    </div>
</template>

<script>
    import i18n from './i18n'

    export default {

        computed: {
            isLoggedIn() {
                return this.$store.getters.isLoggedIn;
            },
            isConfirmed() {
                return this.$store.state.isConfirmed;
            },
            isSuperuser() {
                return this.$store.state.isSuperuser;
            },
            userPageRoute() {
                return {
                    name: 'userDetail',
                    params: {
                        'id': this.$store.state.userId
                    }
                };
            },
            currentLocale() {
                return this.$store.state.locale;
            },
            availableLocale() {
                return this.currentLocale === 'en' ? 'uk' : 'en';
            }
        },

        methods: {
            logout() {
                this.$store.dispatch('logout')
                    .then(() => {
                        this.$router.push({name: 'home'});
                    });
            },
            switchLocale() {
                i18n.locale = this.availableLocale;
                this.$store.commit('SET_LOCALE', this.availableLocale);
            }
        },

        mounted() {
            if (this.isLoggedIn) {
                this.$axios.defaults.headers.common['Authorization'] =
                    'Bearer ' + this.$store.state.accessToken;
            }
        }
    }
</script>

<i18n>
{
    "en": {
        "login": "Login",
        "logout": "Logout",
        "register": "Register",
        "myAccount": "My Account",
        "bins": "Bins",
        "buildPath": "Build a Path",
        "notConfirmedMessage": "Your account is not confirmed",
        "administration": "Administration"
    },
    "uk": {
        "login": "Увійти",
        "logout": "Вийти",
        "register": "Зареєструватися",
        "myAccount": "Мій Аккаунт",
        "bins": "Контейнери",
        "buildPath": "Побудувати Шлях",
        "notConfirmedMessage": "Ваш аккаунт не є підтвердженим",
        "administration": "Адміністрування"
    }
}
</i18n>

<style>
    html {
        background-color: cadetblue;
    }

    body {
        margin: 0;
    }

    .float-right {
        float: right;
    }

    #content {
        max-width: 900px;
        padding: 10px;
        background-color: white;
        margin: 0 auto;
        min-height: 800px;
    }

    #app {
        font-family: 'Avenir', Helvetica, Arial, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        color: #2c3e50;
    }

    #nav {
        color: white;
        margin: 0;
        background-color: #333;
    }

    #nav a {
        color: white;
        font-weight: bold;
        text-decoration: none;
        display: inline-block;
        padding: 14px 16px;
    }

    #nav a:hover {
        background-color: #111;
    }

    #nav a.router-link-exact-active {
        background-color: #42b983;
    }
</style>
