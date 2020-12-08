import Vue from "vue";
import $ from "jquery";
import App from "./components/App.vue";

$(document).ready(() => {
    try
    {
        main();
    }
    catch(error)
    {
        console.log(error.massage);
    }
});

function main()
{
    new Vue({
        el: '#app',
        render:h => h(App)
    });
}


