Vue.directive('tg-funckey', {
    inserted: function(el,binding) {
        let authkeys = [];
        let authkeys_str = window.sessionStorage.getItem("tg-authkeys");
        if (authkeys_str !== undefined && authkeys_str !== null) {
            authkeys = authkeys_str.split(",")
        }
        let funckeys = binding.value.split(",");
        if (authkeys.some(item => funckeys.indexOf(item) > -1) ) {
            el.parentNode.removeChild(el);
        }
    }
})